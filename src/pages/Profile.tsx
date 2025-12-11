import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    User, Mail, Calendar, MapPin, Briefcase, Link as LinkIcon,
    Edit, Save, X, Camera, Lightbulb, ShoppingBag, TrendingUp,
    DollarSign, Settings, Bell, Shield, Eye, Heart, MessageSquare,
    Award, Crown, Clock, CheckCircle2, AlertCircle, FileText, Upload,
    ChevronRight, ExternalLink, X as XIcon, Plus, Image as ImageIcon,
    LayoutGrid, List as ListIcon, Camera as CameraIcon, Save as SaveIcon,
    Edit as EditIcon, Eye as EyeIcon, BadgeCheck, FileCheck, XCircle,
    Cookie, RefreshCw, EyeOff, Loader2
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getProxiedAvatarUrl } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getGitHubToken } from "@/services/ideaService";
import PuterLogin from "@/components/auth/PuterLogin";
import IdeaCard from "@/components/marketplace/IdeaCard";
interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    username: string;
    bio: string;
    avatar_url: string;
    location: string;
    website: string;
    occupation: string;
    created_at: string;
    qualifications: string;
    certificates: Certificate[];
    kyc_status: "none" | "pending" | "approved" | "rejected";
    kyc_documents: string[];
    rejection_reason?: string;
}

interface Certificate {
    id: string;
    name: string;
    url: string;
    date: string;
}

interface Activity {
    id: string;
    type: "submitted" | "purchased" | "liked" | "viewed";
    title: string;
    timestamp: string;
    icon: any;
    color: string;
}

interface UserStats {
    ideasSubmitted: number;
    ideasPurchased: number;
    totalEarnings: number;
    totalViews: number;
    totalLikes: number;
}

interface Idea {
    id: string;
    title: string;
    category: string;
    price: string;
    status: "pending" | "approved" | "rejected";
    views: number;
    likes: number;
    created_at: string;
    image_url: string;
    mvp_file_urls?: string;
    description: string;
    uniqueness: number;
    rating: number;
    badge?: string;
}

const StatsCard = ({ icon: Icon, label, value, subIcon: SubIcon }: any) => (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-zinc-900 transition-colors group">
        <Icon className="w-6 h-6 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{label}</div>
    </div>
);

const Profile = () => {
    const { user, signOut, isAdmin } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { userId } = useParams<{ userId?: string }>();
    const isOwnProfile = !userId || userId === user?.id;
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(isOwnProfile ? "details" : "ideas");

    // Profile data
    const [profile, setProfile] = useState<UserProfile>({
        id: user?.id || "",
        email: user?.email || "",
        full_name: "",
        username: "",
        bio: "",
        avatar_url: "",
        location: "",
        website: "",
        occupation: "",
        created_at: new Date().toISOString(),
        qualifications: "",
        certificates: [],
        kyc_status: "none",
        kyc_documents: [],
        rejection_reason: "",
    });

    const [editedProfile, setEditedProfile] = useState(profile);

    // Stats
    const [stats, setStats] = useState<UserStats>({
        ideasSubmitted: 0,
        ideasPurchased: 0,
        totalEarnings: 0,
        totalViews: 0,
        totalLikes: 0,
    });

    // Ideas
    const [myIdeas, setMyIdeas] = useState<Idea[]>([]);
    const [purchasedIdeas, setPurchasedIdeas] = useState<Idea[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);

    // Settings
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        marketing: false,
    });

    // Prevent double-loading
    const isLoadingRef = useRef(false);

    // Parse query params for tab switching
    const location = useLocation();

    useEffect(() => {
        if (loading) return;

        const params = new URLSearchParams(location.search);
        const tabParam = params.get("tab");
        if (tabParam === "my-ideas") {
            setActiveTab("ideas");
            // Scroll 75% of the screen height
            setTimeout(() => {
                window.scrollTo({
                    top: window.innerHeight * 0.75,
                    behavior: "smooth"
                });
            }, 500);
        }
    }, [location.search, loading]);

    useEffect(() => {
        if (!user && !userId) {
            navigate("/login");
            return;
        }

        // Prevent calling loadProfileData if already loading
        if (isLoadingRef.current) {
            // console.log("⏭️ Skipping duplicate loadProfileData call");
            return;
        }

        loadProfileData();
    }, [user?.id, userId]);

    const loadProfileData = async () => {
        if (isLoadingRef.current) {
            // console.log("⏭️ Already loading, skipping...");
            return;
        }

        try {
            isLoadingRef.current = true;
            setLoading(true);

            // Determine which user's profile to load
            const targetUserId = userId || user?.id;
            // console.log("👤 Current user ID:", user?.id, "| Target ID:", targetUserId);
            if (!targetUserId) return;

            // Load profile from Supabase
            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", targetUserId)
                .single();

            if (profileError && profileError.code !== "PGRST116") {
                console.error("Error loading profile:", profileError);
            }

            if (profileData) {
                const loadedProfile = {
                    id: profileData.id,
                    email: user?.email || "",
                    full_name: profileData.full_name || "",
                    username: profileData.username || "",
                    bio: profileData.bio || "",
                    avatar_url: profileData.avatar_url || "",
                    location: profileData.location || "",
                    website: profileData.website || "",
                    occupation: profileData.occupation || "",
                    created_at: profileData.created_at || new Date().toISOString(),
                    qualifications: profileData.qualifications || "",
                    certificates: profileData.certificates || [],
                    kyc_status: profileData.kyc_status || "none",
                    kyc_documents: profileData.kyc_documents || [],
                    rejection_reason: profileData.rejection_reason || "",
                };
                setProfile(loadedProfile);
                setEditedProfile(loadedProfile);
            }

            // Load user's submitted ideas
            // console.log("🔍 Loading ideas for user:", targetUserId);
            const { data: ideasData, error: ideasError } = await supabase
                .from("ideas")
                .select("*")
                .eq("user_id", targetUserId)
                .order("created_at", { ascending: false });

            // console.log("📊 Ideas query result:", { ideasData, ideasError, count: ideasData?.length });

            if (ideasError) {
                console.error("❌ Error loading ideas:", ideasError);
                toast({
                    title: "Error loading ideas",
                    description: ideasError.message,
                    variant: "destructive"
                });
            } else if (ideasData) {
                // console.log("✅ Ideas data received:", ideasData);
                const ideas: Idea[] = ideasData.map((idea) => ({
                    id: idea.id,
                    title: idea.title,
                    category: idea.category,
                    price: idea.price,
                    status: idea.status || "pending",
                    views: idea.views || 0,
                    likes: idea.likes || 0,
                    created_at: idea.created_at,
                    image_url: idea.image_url || "",
                    description: idea.description || "",
                    uniqueness: idea.uniqueness || 0,
                    rating: idea.rating || 0,
                    badge: idea.badge || ""
                }));

                // Deduplicate ideas by ID to prevent React key warnings
                const uniqueIdeas = Array.from(
                    new Map(ideas.map(idea => [idea.id, idea])).values()
                );

                // console.log("🎯 Mapped ideas:", uniqueIdeas);
                setMyIdeas(uniqueIdeas);

                // Calculate stats
                const totalViews = uniqueIdeas.reduce((sum, idea) => sum + idea.views, 0);
                const totalLikes = uniqueIdeas.reduce((sum, idea) => sum + idea.likes, 0);

                setStats((prev) => ({
                    ...prev,
                    ideasSubmitted: uniqueIdeas.length,
                    totalViews,
                    totalLikes,
                }));
            }

            // Load real activities from database
            await loadRealActivities();

            // Load purchased ideas
            await loadPurchasedIdeas();

        } catch (error) {
            console.error("Error loading profile data:", error);
            toast({
                title: "Error",
                description: "Failed to load profile data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
            isLoadingRef.current = false;
        }
    };

    const loadRealActivities = async () => {
        try {
            // Load real activities from database
            const { data: activitiesData, error } = await supabase
                .from("user_activities")
                .select("*")
                .eq("user_id", user?.id)
                .order("created_at", { ascending: false })
                .limit(10);

            if (error) {
                console.error("Error loading activities:", error);
                // Fallback to empty array if table doesn't exist yet
                setActivities([]);
                return;
            }

            if (activitiesData && activitiesData.length > 0) {
                const formattedActivities: Activity[] = activitiesData.map((activity) => {
                    // Determine icon and color based on activity type
                    let icon = Lightbulb;
                    let color = "text-primary";

                    switch (activity.activity_type) {
                        case "submitted":
                            icon = Lightbulb;
                            color = "text-primary";
                            break;
                        case "purchased":
                            icon = ShoppingBag;
                            color = "text-secondary";
                            break;
                        case "liked":
                            icon = Heart;
                            color = "text-accent";
                            break;
                        case "viewed":
                            icon = Eye;
                            color = "text-muted-foreground";
                            break;
                    }

                    return {
                        id: activity.id,
                        type: activity.activity_type as "submitted" | "purchased" | "liked" | "viewed",
                        title: activity.description || activity.idea_title || "Activity",
                        timestamp: activity.created_at,
                        icon,
                        color,
                    };
                });

                setActivities(formattedActivities);
            } else {
                // No activities yet
                setActivities([]);
            }
        } catch (error) {
            console.error("Error loading activities:", error);
            setActivities([]);
        }
    };

    const loadPurchasedIdeas = async () => {
        try {
            // Fetch from transactions table where buyer is current user
            const { data: transactions, error } = await supabase
                .from("transactions")
                .select(`
                    id,
                    status,
                    created_at,
                    ideas (
                        id,
                        title,
                        category,
                        price,
                        views,
                        likes,
                        created_at,
                        mvp_file_urls
                    )
                `)
                .eq("buyer_id", user?.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error loading transactions:", error);
                return;
            }

            if (transactions && transactions.length > 0) {
                const ideas = transactions.map((t: any) => {
                    const idea = t.ideas;
                    if (!idea) return null; // Should not happen if relation exists

                    return {
                        id: idea.id,
                        title: idea.title,
                        category: idea.category,
                        price: idea.price, // This is string "$99" usually? type says number. Let's keep existing logic or cast.
                        status: t.status, // use transaction status ('pending', 'approved', 'rejected')
                        views: idea.views || 0,
                        likes: idea.likes || 0,
                        created_at: idea.created_at,
                        image_url: idea.mvp_file_urls ? idea.mvp_file_urls.split(',')[0] : "",
                        mvp_file_urls: idea.mvp_file_urls || "",
                    };
                }).filter(Boolean) as Idea[];

                setPurchasedIdeas(ideas);
            }
        } catch (error) {
            console.error("Error loading purchased ideas", error);
        }
    };

    const handleEditToggle = () => {
        if (isEditing) {
            setEditedProfile(profile);
        }
        setIsEditing(!isEditing);
    };

    const handleSaveProfile = async () => {
        try {
            const { error } = await supabase
                .from("profiles")
                .upsert({
                    id: user?.id,
                    full_name: editedProfile.full_name,
                    username: editedProfile.username,
                    bio: editedProfile.bio,
                    avatar_url: editedProfile.avatar_url,
                    location: editedProfile.location,
                    website: editedProfile.website,
                    occupation: editedProfile.occupation,
                    qualifications: editedProfile.qualifications,
                    certificates: editedProfile.certificates,
                    // KYC status and documents are handled separately to avoid user manipulation
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;

            setProfile(editedProfile);
            setIsEditing(false);
            toast({
                title: "Success",
                description: "Profile updated successfully",
            });
        } catch (error) {
            console.error("Error saving profile:", error);
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            });
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
        if (!validTypes.includes(file.type)) {
            toast({
                title: "Error",
                description: "Please upload a valid image file (JPEG, PNG, GIF, or WebP)",
                variant: "destructive",
            });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "Error",
                description: "File size must be less than 5MB",
                variant: "destructive",
            });
            return;
        }

        try {
            toast({
                title: "Uploading...",
                description: "Please wait while we upload your avatar",
            });

            const fileExt = file.name.split(".").pop();
            const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
            const filePath = `${user?.id}/${fileName}`;

            // Upload file to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (uploadError) {
                console.error("Upload error:", uploadError);
                throw uploadError;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);

            // Update profile in database immediately
            const { error: updateError } = await supabase
                .from("profiles")
                .upsert({
                    id: user?.id,
                    avatar_url: publicUrl,
                    updated_at: new Date().toISOString(),
                });

            if (updateError) {
                console.error("Update error:", updateError);
                throw updateError;
            }

            // Update local state
            const updatedProfile = { ...editedProfile, avatar_url: publicUrl };
            setEditedProfile(updatedProfile);
            setProfile(updatedProfile);

            toast({
                title: "Success!",
                description: "Avatar uploaded and saved successfully",
            });
        } catch (error: any) {
            console.error("Error uploading avatar:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to upload avatar. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleCertificateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editedProfile.certificates.length >= 3) {
            toast({
                title: "Limit Reached",
                description: "You can only upload up to 3 certificates.",
                variant: "destructive"
            });
            e.target.value = ''; // Reset input
            return;
        }

        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast({ title: "Error", description: "File size must be less than 10MB", variant: "destructive" });
            return;
        }

        // Prompt for certificate Name
        const certName = prompt("What is the name of this certificate? (e.g. AWS Certified, Degree)");
        if (!certName) {
            e.target.value = ''; // Reset input if cancelled
            return;
        }

        try {
            toast({ title: "Uploading...", description: "Uploading certificate..." });
            const fileExt = file.name.split(".").pop();
            const fileName = `cert-${Date.now()}.${fileExt}`;
            const filePath = `${user?.id}/${fileName}`;

            // Assuming 'certificates' bucket exists
            const { error: uploadError } = await supabase.storage.from("certificates").upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from("certificates").getPublicUrl(filePath);

            const newCertificate: Certificate = {
                id: crypto.randomUUID(),
                name: certName,
                url: publicUrl,
                date: new Date().toISOString()
            };

            const updatedCertificates = [...editedProfile.certificates, newCertificate];
            setEditedProfile({ ...editedProfile, certificates: updatedCertificates });

            // Auto-save to DB
            await supabase.from("profiles").upsert({
                id: user?.id,
                certificates: updatedCertificates,
                updated_at: new Date().toISOString()
            });

            toast({ title: "Success", description: "Certificate added" });
        } catch (error: any) {
            console.error("Certificate upload error:", error);
            toast({ title: "Error", description: "Failed to upload certificate", variant: "destructive" });
        } finally {
            e.target.value = ''; // Reset input
        }
    };

    const handleDeleteCertificate = async (certId: string) => {
        try {
            const updatedCertificates = editedProfile.certificates.filter(c => c.id !== certId);
            setEditedProfile({ ...editedProfile, certificates: updatedCertificates });
            await supabase.from("profiles").upsert({
                id: user?.id,
                certificates: updatedCertificates,
                updated_at: new Date().toISOString()
            });
            toast({ title: "Removed", description: "Certificate removed" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to remove certificate", variant: "destructive" });
        }
    };

    const handleKYCUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            toast({ title: "Uploading...", description: "Uploading Identity Document..." });
            const fileExt = file.name.split(".").pop();
            const fileName = `kyc-${Date.now()}.${fileExt}`;
            const filePath = `${user?.id}/${fileName}`;

            // Using 'kyc-documents' bucket (private)
            const { error: uploadError } = await supabase.storage.from("kyc-documents").upload(filePath, file);
            if (uploadError) throw uploadError;

            // We stores the path or signed URL. For simplicity storing path and generating signed URL on view could be better,
            // or public URL if bucket policy handles it. Assuming private bucket, we might need path.
            // But for now, let's store the path relative to bucket.

            const updatedDocs = [...editedProfile.kyc_documents, filePath];
            setEditedProfile({ ...editedProfile, kyc_documents: updatedDocs });

            // Save draft state
            await supabase.from("profiles").upsert({
                id: user?.id,
                kyc_documents: updatedDocs,
                updated_at: new Date().toISOString()
            });

            toast({ title: "Uploaded", description: "Document uploaded. Don't forget to submit verification." });
        } catch (error: any) {
            console.error("KYC upload error:", error);
            toast({ title: "Error", description: "Failed to upload document", variant: "destructive" });
        }
    };

    const submitKYCVerification = async () => {
        try {
            if (editedProfile.kyc_documents.length === 0) {
                toast({ title: "Error", description: "Please upload at least one document", variant: "destructive" });
                return;
            }

            await supabase.from("profiles").update({
                kyc_status: 'pending',
                rejection_reason: null // clear previous rejection
            }).eq('id', user?.id);

            setProfile({ ...profile, kyc_status: 'pending' });
            setEditedProfile({ ...editedProfile, kyc_status: 'pending' });

            toast({ title: "Submitted", description: "Verification request submitted successfully" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to submit verification", variant: "destructive" });
        }
    };

    const getInitials = (name: string, email: string) => {
        if (name) {
            return name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
        }
        return email.substring(0, 2).toUpperCase();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return formatDate(dateString);
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            approved: { label: "Approved", icon: CheckCircle2, color: "bg-green-500/10 text-green-500 border-green-500/20" },
            pending: { label: "Pending", icon: Clock, color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
            rejected: { label: "Rejected", icon: XCircle, color: "bg-red-500/10 text-red-500 border-red-500/20" },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };

    const handleResetPuterSession = async () => {
        try {
            toast({
                title: "Resetting Session...",
                description: "Connecting to Puter to sign out...",
            });

            // Ensure Puter is loaded
            let puterInstance = (window as any).puter;
            if (!puterInstance) {
                await new Promise<void>((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://js.puter.com/v2/';
                    script.onload = () => {
                        resolve();
                    };
                    script.onerror = () => reject(new Error("Failed to load Puter.js"));
                    document.head.appendChild(script);
                });
                puterInstance = (window as any).puter;
            }

            // Sign out to clear the session
            if (puterInstance && puterInstance.auth) {
                await puterInstance.auth.signOut();
                // Immediately create a new anonymous session to avoid "Log In" prompt next time
                await puterInstance.auth.signIn({ attempt_temp_user_creation: true });
            }

            toast({
                title: "Session Reset ✅",
                description: "Puter session has been reset. You will be prompted to sign in again when you next use AI features.",
            });

        } catch (error) {
            console.error("Error resetting Puter session:", error);
            // Fallback: try to clear cookies anyway just in case, though less effective for cross-domain
            const cookies = document.cookie.split(";");
            for (let cookie of cookies) {
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            }

            toast({
                title: "Session Reset (Fallback)",
                description: "Standard sign-out failed, but local cookies were cleared. Please try submitting your idea again.",
            });
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section with Subtle Background */}
            <div className="relative h-64 bg-background overflow-hidden">
                <div className="absolute inset-0 mesh-gradient opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-secondary/5 to-background"></div>
            </div>

            <div className="container mx-auto px-4 -mt-32 relative z-10 pb-20">
                {/* Profile Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="glass-card mb-8">
                        <CardContent className="p-8">
                            {/* Edit Profile Button (Top Right) */}
                            {isOwnProfile && (
                                <div className="absolute top-6 right-6 z-20">
                                    {isEditing ? (
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={handleEditToggle} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                                                Cancel
                                            </Button>
                                            <Button size="sm" onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700 text-white">
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Changes
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleEditToggle}
                                            className="border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Avatar Section */}
                                <div className="flex flex-col items-center md:items-start gap-4 shrink-0">
                                    <div className="relative group">
                                        {/* Animated ring around avatar */}
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-primary/50 to-primary animate-spin" style={{ padding: '3px', animationDuration: '3s' }}>
                                            <div className="w-full h-full rounded-full bg-background"></div>
                                        </div>

                                        <Avatar className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background shadow-2xl">
                                            <AvatarImage src={getProxiedAvatarUrl(isEditing ? editedProfile.avatar_url : profile.avatar_url) || ""} className="object-cover" />
                                            <AvatarFallback className="text-4xl bg-zinc-800 text-zinc-400">
                                                {getInitials(profile.full_name, profile.email)}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* KYC Badge on Avatar */}
                                        {profile.kyc_status === 'approved' && (
                                            <div className="absolute bottom-2 right-2 bg-black rounded-full p-1.5">
                                                <BadgeCheck className="w-7 h-7 text-green-500 fill-green-500" />
                                            </div>
                                        )}
                                        {profile.kyc_status === 'pending' && (
                                            <div className="absolute bottom-2 right-2 bg-black rounded-full p-1.5">
                                                <Clock className="w-7 h-7 text-yellow-500" />
                                            </div>
                                        )}
                                        {profile.kyc_status === 'rejected' && (
                                            <div className="absolute bottom-2 right-2 bg-black rounded-full p-1.5">
                                                <XCircle className="w-7 h-7 text-red-500" />
                                            </div>
                                        )}

                                        {isEditing && (
                                            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
                                                <Camera className="w-8 h-8 text-white/80" />
                                                <Input
                                                    id="avatar-upload"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleAvatarUpload}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-primary text-sm">
                                        <Calendar className="w-4 h-4" />
                                        <span>Joined {new Date(profile.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                {/* Info Section */}
                                <div className="flex-1 space-y-6 text-center md:text-left">
                                    <div>
                                        <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                            <h1 className="text-3xl md:text-4xl font-bold text-white font-outfit">
                                                {profile.full_name || profile.username || "Anonymous User"}
                                            </h1>
                                            {/* Verification Badge next to Name */}
                                            {profile.kyc_status === 'approved' && (
                                                <BadgeCheck className="w-7 h-7 text-green-500" />
                                            )}
                                            {profile.kyc_status === 'pending' && (
                                                <Clock className="w-6 h-6 text-yellow-500" />
                                            )}
                                            {profile.kyc_status === 'rejected' && (
                                                <XCircle className="w-6 h-6 text-red-500" />
                                            )}
                                        </div>
                                        <p className="text-primary font-medium">@{profile.username || "username"}</p>
                                    </div>

                                    {/* Bio */}
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-primary uppercase tracking-wide">Bio</h3>
                                        {isEditing ? (
                                            <Textarea
                                                value={editedProfile.bio}
                                                onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                                                className="bg-zinc-900 border-zinc-800 focus:border-green-500/50 text-zinc-200 min-h-[100px]"
                                                placeholder="Tell us about yourself..."
                                            />
                                        ) : (
                                            <p className="text-zinc-300 leading-relaxed max-w-2xl">
                                                {profile.bio || "No bio yet."}
                                            </p>
                                        )}
                                    </div>



                                    {/* Contact & Extra Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                                        {isEditing ? (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        value={editedProfile.location}
                                                        onChange={(e) =>
                                                            setEditedProfile({ ...editedProfile, location: e.target.value })
                                                        }
                                                        placeholder="Location"
                                                        className="flex-1 bg-zinc-900"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        value={editedProfile.occupation}
                                                        onChange={(e) =>
                                                            setEditedProfile({ ...editedProfile, occupation: e.target.value })
                                                        }
                                                        placeholder="Occupation"
                                                        className="flex-1 bg-zinc-900"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <LinkIcon className="w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        value={editedProfile.website}
                                                        onChange={(e) =>
                                                            setEditedProfile({ ...editedProfile, website: e.target.value })
                                                        }
                                                        placeholder="Website"
                                                        className="flex-1 bg-zinc-900"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {profile.location && (
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{profile.location}</span>
                                                    </div>
                                                )}
                                                {profile.occupation && (
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <Briefcase className="w-4 h-4" />
                                                        <span>{profile.occupation}</span>
                                                    </div>
                                                )}
                                                {profile.website && (
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <LinkIcon className="w-4 h-4" />
                                                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                                            Website
                                                        </a>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                    <StatsCard icon={Lightbulb} label="Ideas Submitted" value={stats.ideasSubmitted} />
                    <StatsCard icon={ShoppingBag} label="Ideas Purchased" value={purchasedIdeas.length} />
                    <StatsCard icon={DollarSign} label="Total Earnings" value={`$${stats.totalEarnings}`} />
                    <StatsCard icon={Eye} label="Total Views" value={stats.totalViews} />
                    <StatsCard icon={Heart} label="Total Likes" value={stats.totalLikes} />
                </div>

                {/* Tabs Section */}
                <Tabs id="profile-tabs" value={activeTab} onValueChange={setActiveTab} className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1 rounded-xl h-auto">
                            {isOwnProfile && (
                                <TabsTrigger value="details" className="rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 px-4 py-2 text-sm">
                                    <User className="w-4 h-4 inline mr-2" />
                                    Details & Verification
                                </TabsTrigger>
                            )}
                            <TabsTrigger value="ideas" className="rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 px-6 py-2">
                                My Ideas
                            </TabsTrigger>
                            <TabsTrigger value="purchased" className="rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 px-6 py-2">
                                Purchased
                            </TabsTrigger>
                            {isOwnProfile && (
                                <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 px-6 py-2">
                                    <Settings className="w-4 h-4 inline mr-2" />
                                    Settings
                                </TabsTrigger>
                            )}
                        </TabsList>
                    </div>

                    <TabsContent value="details" className="space-y-6">
                        <Card className="bg-zinc-900/20 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white">Personal Information</CardTitle>
                                <CardDescription>Your email, qualifications, and verification status</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Email */}
                                <div className="space-y-2">
                                    <Label className="text-zinc-400 text-sm font-bold uppercase tracking-wide">Email Address</Label>
                                    <div className="flex items-center gap-2 text-zinc-300">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <span>{profile.email}</span>
                                    </div>
                                </div>

                                {/* Qualifications */}
                                <div className="space-y-2">
                                    <Label className="text-zinc-400 text-sm font-bold uppercase tracking-wide">Qualifications</Label>
                                    {isEditing ? (
                                        <Input
                                            value={editedProfile.qualifications}
                                            onChange={(e) => setEditedProfile({ ...editedProfile, qualifications: e.target.value })}
                                            className="bg-zinc-900 border-zinc-800 text-zinc-200"
                                            placeholder="e.g. Senior Product Designer"
                                        />
                                    ) : (
                                        <p className="text-zinc-300">
                                            {profile.qualifications || "No qualifications listed."}
                                        </p>
                                    )}
                                </div>

                                <Separator className="bg-zinc-800" />

                                {/* KYC Verification */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-green-500" />
                                            <Label className="text-white text-base font-bold">Identity Verification</Label>
                                        </div>
                                        {getStatusBadge(profile.kyc_status)}
                                    </div>

                                    <p className="text-sm text-zinc-400">
                                        {profile.kyc_status === 'approved'
                                            ? "You are a verified seller with full access to all features."
                                            : profile.kyc_status === 'pending'
                                                ? "Your verification is pending review. We'll notify you once it's processed."
                                                : profile.kyc_status === 'rejected'
                                                    ? `Verification was rejected${profile.rejection_reason ? `: ${profile.rejection_reason}` : '. Please re-submit with valid documents.'}`
                                                    : "Complete verification to gain buyer trust and unlock premium features."}
                                    </p>

                                    {isOwnProfile && profile.kyc_status !== 'approved' && (
                                        <div className="space-y-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                                            <div className="flex gap-3">
                                                <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300" onClick={() => document.getElementById('kyc-upload-tab')?.click()}>
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Upload Document
                                                </Button>
                                                <input id="kyc-upload-tab" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleKYCUpload} />
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={submitKYCVerification}>
                                                    <FileCheck className="w-4 h-4 mr-2" />
                                                    Submit for Review
                                                </Button>
                                            </div>
                                            {editedProfile.kyc_documents.length > 0 && (
                                                <p className="text-xs text-zinc-500">
                                                    {editedProfile.kyc_documents.length} document(s) uploaded
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="ideas" className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">My Ideas</h2>
                            <Button onClick={() => navigate("/submit-idea")} className="bg-green-600 hover:bg-green-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Submit New Idea
                            </Button>
                        </div>

                        {myIdeas.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myIdeas.map((idea) => (
                                    <IdeaCard
                                        key={idea.id}
                                        idea={idea}
                                        variant="profile"
                                        status={idea.status}
                                        onEdit={() => navigate(`/submit-idea?id=${idea.id}`)}
                                        onClick={() => { }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-3xl">
                                <Lightbulb className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">No ideas submitted yet</h3>
                                <p className="text-zinc-500 mb-6">Share your first brilliant idea with the world.</p>
                                <Button onClick={() => navigate("/submit-idea")} className="bg-green-600 hover:bg-green-700">
                                    Start Creating
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="purchased" className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Purchased Ideas</h2>
                        </div>

                        {purchasedIdeas.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {purchasedIdeas.map((idea) => (
                                    <IdeaCard
                                        key={idea.id}
                                        idea={idea}
                                        onClick={() => navigate(`/marketplace/${idea.id}`)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-3xl">
                                <ShoppingBag className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">No ideas purchased yet</h3>
                                <p className="text-zinc-500 mb-6">Explore the marketplace to find your next venture.</p>
                                <Button onClick={() => navigate("/marketplace")} variant="outline" className="border-zinc-700 text-white">
                                    Browse Marketplace
                                </Button>
                            </div>

                        )}
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6">
                        <Card className="bg-zinc-900/20 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white">Notification Preferences</CardTitle>
                                <CardDescription>Manage how you receive notifications</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-medium text-white">Email Notifications</Label>
                                        <p className="text-xs text-zinc-500">Receive email updates about your account activity</p>
                                    </div>
                                    <Switch checked={notifications.email} onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })} />
                                </div>
                                <Separator className="bg-zinc-800" />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-medium text-white">Push Notifications</Label>
                                        <p className="text-xs text-zinc-500">Receive push notifications in your browser</p>
                                    </div>
                                    <Switch checked={notifications.push} onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })} />
                                </div>
                                <Separator className="bg-zinc-800" />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-medium text-white">Marketing Emails</Label>
                                        <p className="text-xs text-zinc-500">Receive news, updates, and special offers</p>
                                    </div>
                                    <Switch checked={notifications.marketing} onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/20 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white">Advanced Settings</CardTitle>
                                <CardDescription>Manage your session and account</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-white">Puter AI Session</Label>
                                    <p className="text-xs text-zinc-500 mb-3">Reset your Puter AI session if you're experiencing quota or authentication issues.</p>
                                    <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800" onClick={handleResetPuterSession}>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Reset Puter Session
                                    </Button>
                                </div>
                                <Separator className="bg-zinc-800" />
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-white">Account Actions</Label>
                                    <p className="text-xs text-zinc-500 mb-3">Sign out of your account on this device.</p>
                                    <Button variant="destructive" size="sm" onClick={() => { signOut(); navigate("/"); }}>
                                        Sign Out
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
            <Footer />
        </div >
    );
};

export default Profile;
