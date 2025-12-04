import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Calendar,
    MapPin,
    Briefcase,
    Link as LinkIcon,
    Edit,
    Save,
    X,
    Camera,
    Lightbulb,
    ShoppingBag,
    TrendingUp,
    DollarSign,
    Settings,
    Bell,
    Shield,
    Eye,
    Heart,
    MessageSquare,
    Award,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

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
    price: number;
    status: string;
    views: number;
    likes: number;
    created_at: string;
    image_url: string;
}

interface Activity {
    id: string;
    type: "submitted" | "purchased" | "liked" | "viewed";
    title: string;
    timestamp: string;
    icon: any;
    color: string;
}

const Profile = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

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

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        loadProfileData();
    }, [user]);

    const loadProfileData = async () => {
        try {
            setLoading(true);

            // Load profile from Supabase
            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user?.id)
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
                };
                setProfile(loadedProfile);
                setEditedProfile(loadedProfile);
            }

            // Load user's submitted ideas
            const { data: ideasData, error: ideasError } = await supabase
                .from("ideas")
                .select("*")
                .eq("user_id", user?.id)
                .order("created_at", { ascending: false });

            if (ideasError) {
                console.error("Error loading ideas:", ideasError);
            } else if (ideasData) {
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
                }));
                setMyIdeas(ideas);

                // Calculate stats
                const totalViews = ideas.reduce((sum, idea) => sum + idea.views, 0);
                const totalLikes = ideas.reduce((sum, idea) => sum + idea.likes, 0);

                setStats((prev) => ({
                    ...prev,
                    ideasSubmitted: ideas.length,
                    totalViews,
                    totalLikes,
                }));
            }

            // Load real activities from database
            await loadRealActivities();

        } catch (error) {
            console.error("Error loading profile data:", error);
            toast({
                title: "Error",
                description: "Failed to load profile data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
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
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Avatar Section */}
                                <div className="flex flex-col items-center md:items-start">
                                    <div className="relative group">
                                        <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                                            <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                                            <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                                                {getInitials(profile.full_name, profile.email)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <Camera className="w-8 h-8 text-white" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarUpload}
                                            />
                                        </label>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        Joined {formatDate(profile.created_at)}
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            {isEditing ? (
                                                <div className="space-y-3">
                                                    <Input
                                                        value={editedProfile.full_name}
                                                        onChange={(e) =>
                                                            setEditedProfile({ ...editedProfile, full_name: e.target.value })
                                                        }
                                                        placeholder="Full Name"
                                                        className="text-2xl font-bold h-auto py-2"
                                                    />
                                                    <Input
                                                        value={editedProfile.username}
                                                        onChange={(e) =>
                                                            setEditedProfile({ ...editedProfile, username: e.target.value })
                                                        }
                                                        placeholder="@username"
                                                        className="text-sm"
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <h1 className="text-3xl font-bold mb-1">
                                                        {profile.full_name || profile.email.split('@')[0]}
                                                    </h1>
                                                    {profile.username && (
                                                        <p className="text-muted-foreground">@{profile.username}</p>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            {isEditing ? (
                                                <>
                                                    <Button size="sm" onClick={handleSaveProfile} className="gap-2">
                                                        <Save className="w-4 h-4" />
                                                        Save
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={handleEditToggle} className="gap-2">
                                                        <X className="w-4 h-4" />
                                                        Cancel
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button size="sm" variant="outline" onClick={handleEditToggle} className="gap-2">
                                                    <Edit className="w-4 h-4" />
                                                    Edit Profile
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div className="mb-4">
                                        {isEditing ? (
                                            <Textarea
                                                value={editedProfile.bio}
                                                onChange={(e) =>
                                                    setEditedProfile({ ...editedProfile, bio: e.target.value })
                                                }
                                                placeholder="Tell us about yourself..."
                                                className="min-h-[100px]"
                                            />
                                        ) : (
                                            <p className="text-muted-foreground">
                                                {profile.bio || "No bio yet. Click edit to add one!"}
                                            </p>
                                        )}
                                    </div>

                                    {/* Profile Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {isEditing ? (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        value={profile.email}
                                                        disabled
                                                        className="flex-1"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        value={editedProfile.location}
                                                        onChange={(e) =>
                                                            setEditedProfile({ ...editedProfile, location: e.target.value })
                                                        }
                                                        placeholder="Location"
                                                        className="flex-1"
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
                                                        className="flex-1"
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
                                                        className="flex-1"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                                    <span>{profile.email}</span>
                                                </div>
                                                {profile.location && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                                        <span>{profile.location}</span>
                                                    </div>
                                                )}
                                                {profile.occupation && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                                                        <span>{profile.occupation}</span>
                                                    </div>
                                                )}
                                                {profile.website && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <LinkIcon className="w-4 h-4 text-muted-foreground" />
                                                        <a
                                                            href={profile.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:underline"
                                                        >
                                                            {profile.website}
                                                        </a>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <Separator className="my-6" />
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10">
                                    <div className="flex items-center justify-center mb-2">
                                        <Lightbulb className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="text-2xl font-bold">{stats.ideasSubmitted}</div>
                                    <div className="text-xs text-muted-foreground">Ideas Submitted</div>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                                    <div className="flex items-center justify-center mb-2">
                                        <ShoppingBag className="w-5 h-5 text-secondary" />
                                    </div>
                                    <div className="text-2xl font-bold">{stats.ideasPurchased}</div>
                                    <div className="text-xs text-muted-foreground">Ideas Purchased</div>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-accent/5 border border-accent/10">
                                    <div className="flex items-center justify-center mb-2">
                                        <DollarSign className="w-5 h-5 text-accent" />
                                    </div>
                                    <div className="text-2xl font-bold">${stats.totalEarnings}</div>
                                    <div className="text-xs text-muted-foreground">Total Earnings</div>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10">
                                    <div className="flex items-center justify-center mb-2">
                                        <Eye className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="text-2xl font-bold">{stats.totalViews}</div>
                                    <div className="text-xs text-muted-foreground">Total Views</div>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                                    <div className="flex items-center justify-center mb-2">
                                        <Heart className="w-5 h-5 text-secondary" />
                                    </div>
                                    <div className="text-2xl font-bold">{stats.totalLikes}</div>
                                    <div className="text-xs text-muted-foreground">Total Likes</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Tabs Section */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                        <TabsTrigger value="overview" className="gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="ideas" className="gap-2">
                            <Lightbulb className="w-4 h-4" />
                            My Ideas
                        </TabsTrigger>
                        <TabsTrigger value="purchased" className="gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            Purchased
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="gap-2">
                            <Settings className="w-4 h-4" />
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Recent Activity */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        Recent Activity
                                    </CardTitle>
                                    <CardDescription>Your latest actions on the platform</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {activities.length > 0 ? (
                                            activities.map((activity) => {
                                                const Icon = activity.icon;
                                                return (
                                                    <div
                                                        key={activity.id}
                                                        className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                                                    >
                                                        <div className={`p-2 rounded-lg bg-${activity.color}/10`}>
                                                            <Icon className={`w-5 h-5 ${activity.color}`} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium">{activity.title}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {getRelativeTime(activity.timestamp)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-12 text-muted-foreground">
                                                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                <p>No recent activity</p>
                                                <p className="text-sm mt-2">Start by submitting an idea!</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Stats */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Award className="w-5 h-5" />
                                        Achievements
                                    </CardTitle>
                                    <CardDescription>Your milestones</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {stats.ideasSubmitted > 0 && (
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                                                <div className="p-2 rounded-lg bg-primary/10">
                                                    <Lightbulb className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">First Idea</p>
                                                    <p className="text-xs text-muted-foreground">Submitted your first idea</p>
                                                </div>
                                            </div>
                                        )}
                                        {stats.ideasSubmitted >= 5 && (
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/5 border border-secondary/10">
                                                <div className="p-2 rounded-lg bg-secondary/10">
                                                    <TrendingUp className="w-5 h-5 text-secondary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">Prolific Creator</p>
                                                    <p className="text-xs text-muted-foreground">5+ ideas submitted</p>
                                                </div>
                                            </div>
                                        )}
                                        {stats.totalViews >= 100 && (
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 border border-accent/10">
                                                <div className="p-2 rounded-lg bg-accent/10">
                                                    <Eye className="w-5 h-5 text-accent" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">Popular</p>
                                                    <p className="text-xs text-muted-foreground">100+ total views</p>
                                                </div>
                                            </div>
                                        )}
                                        {stats.ideasSubmitted === 0 && (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                <p className="text-sm">No achievements yet</p>
                                                <p className="text-xs mt-2">Submit ideas to earn achievements!</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* My Ideas Tab */}
                    <TabsContent value="ideas" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>My Submitted Ideas</CardTitle>
                                <CardDescription>
                                    Manage and track your submitted ideas
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {myIdeas.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {myIdeas.map((idea) => (
                                            <motion.div
                                                key={idea.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bento-card p-6 hover:shadow-lg transition-all"
                                            >
                                                {idea.image_url && (
                                                    <div className="w-full h-32 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 mb-4 overflow-hidden">
                                                        <img
                                                            src={idea.image_url}
                                                            alt={idea.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-semibold line-clamp-2">{idea.title}</h3>
                                                    {getStatusBadge(idea.status)}
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-3">{idea.category}</p>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="font-bold text-primary">${idea.price}</span>
                                                    <div className="flex items-center gap-3 text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-4 h-4" />
                                                            {idea.views}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Heart className="w-4 h-4" />
                                                            {idea.likes}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-xs text-muted-foreground">
                                                    {formatDate(idea.created_at)}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Lightbulb className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                                        <h3 className="text-lg font-semibold mb-2">No ideas yet</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Start sharing your brilliant ideas with the world!
                                        </p>
                                        <Button onClick={() => navigate("/submit-idea")}>
                                            Submit Your First Idea
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Purchased Ideas Tab */}
                    <TabsContent value="purchased" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Purchased Ideas</CardTitle>
                                <CardDescription>
                                    Ideas you've purchased from the marketplace
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12">
                                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                                    <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Browse the marketplace to find amazing ideas!
                                    </p>
                                    <Button onClick={() => navigate("/marketplace")}>
                                        Explore Marketplace
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Notification Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="w-5 h-5" />
                                        Notifications
                                    </CardTitle>
                                    <CardDescription>
                                        Manage your notification preferences
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="email-notifications">Email Notifications</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Receive email updates about your ideas
                                            </p>
                                        </div>
                                        <Switch
                                            id="email-notifications"
                                            checked={notifications.email}
                                            onCheckedChange={(checked) =>
                                                setNotifications({ ...notifications, email: checked })
                                            }
                                        />
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="push-notifications">Push Notifications</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Get push notifications on your device
                                            </p>
                                        </div>
                                        <Switch
                                            id="push-notifications"
                                            checked={notifications.push}
                                            onCheckedChange={(checked) =>
                                                setNotifications({ ...notifications, push: checked })
                                            }
                                        />
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="marketing">Marketing Emails</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Receive updates about new features
                                            </p>
                                        </div>
                                        <Switch
                                            id="marketing"
                                            checked={notifications.marketing}
                                            onCheckedChange={(checked) =>
                                                setNotifications({ ...notifications, marketing: checked })
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Account Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        Account Security
                                    </CardTitle>
                                    <CardDescription>
                                        Manage your account security settings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="current-password">Current Password</Label>
                                        <Input
                                            id="current-password"
                                            type="password"
                                            placeholder="Enter current password"
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="new-password">New Password</Label>
                                        <Input
                                            id="new-password"
                                            type="password"
                                            placeholder="Enter new password"
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            placeholder="Confirm new password"
                                            className="mt-2"
                                        />
                                    </div>
                                    <Button className="w-full">Update Password</Button>
                                    <Separator />
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={async () => {
                                            await signOut();
                                            navigate("/login");
                                        }}
                                    >
                                        Sign Out
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <Footer />
        </div>
    );
};

export default Profile;
