import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Zap, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Helper to ensure Puter is loaded
const ensurePuterLoaded = async () => {
    if ((window as any).puter) return (window as any).puter;

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://js.puter.com/v2/';
        script.onload = () => resolve((window as any).puter);
        script.onerror = () => reject(new Error("Failed to load Puter.js"));
        document.head.appendChild(script);
    });
};

const PuterLogin = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [puterUser, setPuterUser] = useState<any>(null);
    const [authInitialized, setAuthInitialized] = useState(false);

    useEffect(() => {
        const initPuter = async () => {
            try {
                const puter = await ensurePuterLoaded();

                // Check initial state
                if (puter.auth && puter.auth.isSignedIn()) {
                    setPuterUser(puter.auth.getUser());
                }

                setAuthInitialized(true);
            } catch (error) {
                console.error("Failed to initialize Puter:", error);
            }
        };

        initPuter();
    }, []);

    const handleConnect = async () => {
        setLoading(true);
        try {
            const puter = await ensurePuterLoaded();

            // This opens the official Puter.com popup
            const user = await puter.auth.signIn();

            if (user) {
                setPuterUser(user);
                toast({
                    title: "Connected Successfully",
                    description: `Connected to Puter as ${user.username || "User"}`,
                });
            }
        } catch (error: any) {
            console.error("Puter login error:", error);
            toast({
                title: "Connection Failed",
                description: error.message || "Could not connect to Puter",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        setLoading(true);
        try {
            const puter = await ensurePuterLoaded();
            await puter.auth.signOut();
            setPuterUser(null);
            toast({
                title: "Disconnected",
                description: "Disconnected from Puter session.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    if (!authInitialized) {
        return (
            <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (puterUser) {
        return (
            <Card className="border-green-500/20 bg-green-500/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        AI Services Connected
                    </CardTitle>
                    <CardDescription>
                        You are connected to the Puter.js cloud
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
                            {puterUser.username?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                            <p className="font-medium">{puterUser.username}</p>
                            <p className="text-xs text-muted-foreground">ID: {puterUser.id}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="ghost" size="sm" onClick={handleSignOut} disabled={loading} className="w-full text-red-500 hover:text-red-600 hover:bg-red-50">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                        Disconnect
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-500" />
                    Unlock AI Analysis
                </CardTitle>
                <CardDescription>
                    Connect your free Puter.js account to validate your ideas with advanced AI.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                    <p>By connecting, you enable:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Market potential analysis</li>
                        <li>Feasibility scoring</li>
                        <li>Competitor saturation checks</li>
                    </ul>
                </div>
                <Button onClick={handleConnect} className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                    Connect to Puter
                </Button>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-xs text-muted-foreground text-center">
                    Secure authentication powered by Puter.js
                </p>
            </CardFooter>
        </Card>
    );
};

export default PuterLogin;

