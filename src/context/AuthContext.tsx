import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type AuthContextType = {
    session: Session | null;
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    isAdmin: false,
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {


        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                checkUserRole(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {


            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                checkUserRole(session.user.id);
            } else {
                setIsAdmin(false);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkUserRole = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role, banned')
                .eq('id', userId)
                .single();

            if (data) {
                if (data.banned) {
                    await supabase.auth.signOut();
                    setSession(null);
                    setUser(null);
                    setIsAdmin(false);
                    return;
                }

                if (data.role === 'admin') {
                    setIsAdmin(true);
                } else {
                    // Fallback for hardcoded admin email if DB role isn't set yet (Bootstrap)
                    const currentUser = (await supabase.auth.getUser()).data.user;
                    if (currentUser?.email === 'idamarketplace@gmail.com') {
                        setIsAdmin(true);
                        // Persist admin status across reloads
                        localStorage.setItem('site_admin_override', 'true');
                    } else {
                        setIsAdmin(false);
                        localStorage.removeItem('site_admin_override');
                    }
                }
            } else {
                // Fallback if no profile found
                const currentUser = (await supabase.auth.getUser()).data.user;
                if (currentUser?.email === 'idamarketplace@gmail.com') {
                    setIsAdmin(true);
                    localStorage.setItem('site_admin_override', 'true');
                } else {
                    setIsAdmin(false);
                    localStorage.removeItem('site_admin_override');
                }
            }
        } catch (error) {
            console.error('Error checking user role:', error);
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        localStorage.removeItem('site_admin_override');
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, isAdmin, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
