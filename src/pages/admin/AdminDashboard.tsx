import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Users, FileText, ShoppingBag, TrendingUp, Trash2, CheckCircle2,
    XCircle, Eye, Edit, Ban, Download, Shield, Activity, Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Services
import { fetchPlatformStats, fetchAllUsers, fetchAllTransactions, deleteUserFromDB, banUser, updateIdeaStatus } from "@/services/adminService";
import { deleteIdeaAdmin, toggleIdeaFeatured, fetchAllIdeasAdmin } from "@/services/ideaService";

const AdminDashboard = () => {
    const [stats, setStats] = useState({ usersCount: 0, ideasCount: 0, purchasesCount: 0, revenue: 0 });
    const { toast } = useToast();

    useEffect(() => {
        fetchPlatformStats().then(setStats);
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
            <Navbar />

            <main className="pt-28 pb-16 container mx-auto px-4 max-w-7xl animate-on-scroll">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black font-outfit tracking-tight mb-2"
                        >
                            Admin <span className="gradient-text">Dashboard</span>
                        </motion.h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <Shield className="w-4 h-4 text-primary" />
                            God Mode Active: Manage users, content, and platform health.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="glass items-center gap-2" onClick={() => window.location.reload()}>
                            <Activity className="w-4 h-4" /> Refresh Data
                        </Button>
                    </div>
                </div>

                {/* Bento Grid Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        title="Total Users"
                        value={stats.usersCount}
                        icon={Users}
                        color="text-blue-500"
                        bg="bg-blue-500/10"
                        delay={0.1}
                    />
                    <StatCard
                        title="Total Ideas"
                        value={stats.ideasCount}
                        icon={FileText}
                        color="text-purple-500"
                        bg="bg-purple-500/10"
                        delay={0.2}
                    />
                    <StatCard
                        title="Total Sales"
                        value={stats.purchasesCount}
                        icon={ShoppingBag}
                        color="text-emerald-500"
                        bg="bg-emerald-500/10"
                        delay={0.3}
                    />
                    <StatCard
                        title="Revenue"
                        value={`$${stats.revenue}`}
                        icon={TrendingUp}
                        color="text-orange-500"
                        bg="bg-orange-500/10"
                        delay={0.4}
                    />
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="ideas" className="w-full space-y-8">
                    <div className="flex justify-center md:justify-start">
                        <TabsList className="grid w-full max-w-md grid-cols-3 p-1 glass rounded-full">
                            <TabsTrigger value="ideas" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Ideas</TabsTrigger>
                            <TabsTrigger value="users" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Users</TabsTrigger>
                            <TabsTrigger value="transactions" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Sales</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="ideas" className="glass-card p-6 min-h-[500px] outline-none ring-0">
                        <IdeasManager />
                    </TabsContent>

                    <TabsContent value="users" className="glass-card p-6 min-h-[500px] outline-none ring-0">
                        <UsersManager />
                    </TabsContent>

                    <TabsContent value="transactions" className="glass-card p-6 min-h-[500px] outline-none ring-0">
                        <TransactionsManager />
                    </TabsContent>
                </Tabs>

            </main>
            <Footer />
        </div>
    );
};

// --- Sub-Components ---

const StatCard = ({ title, value, icon: Icon, color, bg, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
    >
        <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className={`p-2 rounded-full ${bg}`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold font-outfit">{value}</div>
            </CardContent>
        </Card>
    </motion.div>
);

const IdeasManager = () => {
    const [ideas, setIdeas] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();
    const navigate = useNavigate();

    const loadIdeas = async () => {
        const data = await fetchAllIdeasAdmin();
        setIdeas(data);
    };

    useEffect(() => { loadIdeas(); }, []);

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`PERMANENTLY DELETE "${title}"? This cannot be undone.`)) {
            try {
                // Optimistic update: Remove immediately from view
                setIdeas(prev => prev.filter(idea => idea.id !== id));

                await deleteIdeaAdmin(id);
                toast({ title: "Idea deleted successfully", className: "bg-red-500 text-white" });
                // Reload in background to confirm
                loadIdeas();
            } catch (e) {
                toast({ title: "Failed to delete idea", variant: "destructive" });
                // Revert if failed
                loadIdeas();
            }
        }
    };

    const handleFeature = async (id: string, currentStatus: string) => {
        const isFeatured = currentStatus === 'featured';
        try {
            await toggleIdeaFeatured(id, !isFeatured);
            toast({ title: isFeatured ? "Removed from featured" : "Idea Featured!", className: isFeatured ? "" : "bg-yellow-500 text-white" });
            loadIdeas();
        } catch (e) {
            toast({ title: "Error updating status", variant: "destructive" });
        }
    };

    const handleStatus = async (id: string, status: string) => {
        try {
            await updateIdeaStatus(id, status);
            toast({
                title: `Idea ${status === 'approved' ? 'Approved' : 'Rejected'}`,
                className: status === 'approved' ? "bg-green-600 text-white" : "bg-orange-600 text-white"
            });
            // Force small delay to allow DB propagation if needed, then reload
            setTimeout(loadIdeas, 100);
        } catch (e) {
            toast({ title: "Error updating status", variant: "destructive" });
        }
    };

    const filteredIdeas = ideas.filter(idea =>
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Manage Ideas</h3>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search ideas..."
                        className="pl-8 bg-background/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Idea Info</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Assets</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence>
                            {filteredIdeas.map((idea) => (
                                <motion.tr
                                    key={idea.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                >
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-base">{idea.title}</span>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                <Badge variant="outline" className="text-[10px]">{idea.category}</Badge>
                                                <span>• {new Date(idea.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-emerald-500 font-medium">${idea.price}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            idea.status === 'approved' ? 'default' :
                                                idea.status === 'featured' ? 'secondary' :
                                                    idea.status === 'rejected' ? 'destructive' : 'outline'
                                        }
                                            className={idea.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : ''}
                                        >
                                            {idea.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {idea.mvp_file_urls ? (
                                            <div className="flex flex-col gap-1">
                                                {idea.mvp_file_urls.split(',').map((url: string, i: number) => (
                                                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                                        <Download className="w-3 h-3" /> MVP {i + 1}
                                                    </a>
                                                ))}
                                            </div>
                                        ) : <span className="text-muted-foreground text-xs italic">No assets</span>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
                                                onClick={() => window.open(`/buy/${idea.slug}`, '_blank')} title="View Live">
                                                <Eye className="w-4 h-4" />
                                            </Button>

                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:text-primary/80 hover:bg-primary/10"
                                                onClick={() => navigate(`/submit-idea?id=${idea.id}`)} title="Edit Idea">
                                                <Edit className="w-4 h-4" />
                                            </Button>

                                            <div className="w-px h-4 bg-border mx-1"></div>

                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                                                onClick={() => handleStatus(idea.id, 'approved')} title="Approve">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </Button>

                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-orange-500 hover:text-orange-400 hover:bg-orange-500/10"
                                                onClick={() => handleStatus(idea.id, 'rejected')} title="Reject">
                                                <XCircle className="w-4 h-4" />
                                            </Button>

                                            <Button size="icon" variant="ghost" className={`h-8 w-8 ${idea.status === 'featured' ? 'text-yellow-400' : 'text-muted-foreground'} hover:text-yellow-400 hover:bg-yellow-500/10`}
                                                onClick={() => handleFeature(idea.id, idea.status)} title="Toggle Feature">
                                                <TrendingUp className={`w-4 h-4 ${idea.status === 'featured' && 'fill-yellow-400'}`} />
                                            </Button>

                                            <div className="w-px h-4 bg-border mx-1"></div>

                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                onClick={() => handleDelete(idea.id, idea.title)} title="Delete Forever">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>
                {filteredIdeas.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">No ideas found matching your search.</div>
                )}
            </div>
        </div>
    );
};

const UsersManager = () => {
    const [users, setUsers] = useState<any[]>([]);
    const { toast } = useToast();

    const loadUsers = async () => {
        const data = await fetchAllUsers();
        setUsers(data);
    };

    useEffect(() => { loadUsers(); }, []);

    const handleBan = async (user: any) => {
        const action = user.banned ? 'Unban' : 'Ban';
        if (!confirm(`Are you sure you want to ${action.toUpperCase()} ${user.email}?`)) return;

        try {
            await banUser(user.id, !user.banned);
            toast({ title: `User ${action}ned successfully` });
            loadUsers();
        } catch (e) {
            toast({ title: "Action failed", variant: "destructive" });
        }
    };

    const handleDeleteUser = async (user: any) => {
        if (!confirm(`DANGER: PERMANENTLY DELETE ${user.email}?\n\nThis will remove:\n- Their account\n- Their profile\n- All their submitted ideas\n- All their files`)) return;

        const confirmEmail = prompt(`Please type "${user.email}" to confirm deletion:`);
        if (confirmEmail !== user.email) {
            toast({ title: "Email mismatch. Deletion cancelled.", variant: "destructive" });
            return;
        }

        try {
            await deleteUserFromDB(user.id);
            toast({ title: "User deleted successfully", className: "bg-red-600 text-white" });
            loadUsers();
        } catch (e) {
            toast({ title: "Failed to delete user", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Manage Users</h3>
            <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>User Profile</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} className={user.banned ? "bg-red-500/5 hover:bg-red-500/10" : ""}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                            {user.email?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                        <div>
                                            <div className="font-medium">{user.username || user.full_name || "Unknown User"}</div>
                                            <div className="text-xs text-muted-foreground">{user.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="capitalize">{user.role || 'user'}</Badge>
                                </TableCell>
                                <TableCell>
                                    {user.banned ? (
                                        <Badge variant="destructive" className="flex w-fit items-center gap-1"><Ban className="w-3 h-3" /> Banned</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-green-500 border-green-500/50">Active</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button size="sm" variant={user.banned ? "default" : "outline"}
                                        className={user.banned ? "bg-green-600 hover:bg-green-700" : "text-orange-500 border-orange-500/30 hover:bg-orange-500/10"}
                                        onClick={() => handleBan(user)}
                                    >
                                        {user.banned ? "Unban User" : "Ban User"}
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

const TransactionsManager = () => {
    const [transactions, setTransactions] = useState<any[]>([]);

    useEffect(() => {
        fetchAllTransactions().then(setTransactions);
    }, []);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Transaction History</h3>
            <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Buyer</TableHead>
                            <TableHead>Idea / Item</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((t) => (
                            <TableRow key={t.id}>
                                <TableCell>
                                    <div className="font-medium">{t.profiles?.email || 'Unknown Buyer'}</div>
                                </TableCell>
                                <TableCell>{t.idea_title || t.description}</TableCell>
                                <TableCell>{new Date(t.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right font-mono">$0.00</TableCell>
                            </TableRow>
                        ))}
                        {transactions.length === 0 && (
                            <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No transactions recorded yet.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminDashboard;
