import { supabase } from "@/lib/supabase";
import { deleteIdeaAdmin } from "@/services/ideaService";

export async function fetchPlatformStats() {
    try {
        const { data: users, count: usersCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        // Total ideas
        const { count: ideasCount } = await supabase
            .from('ideas')
            .select('*', { count: 'exact', head: true });

        // Total transactions revenue
        // Optimization: Just count purchases for now.
        const { count: purchasesCount } = await supabase
            .from('user_activities')
            .select('*', { count: 'exact', head: true })
            .eq('activity_type', 'purchased');

        return {
            usersCount: usersCount || 0,
            ideasCount: ideasCount || 0,
            purchasesCount: purchasesCount || 0,
            revenue: 0 // Placeholder until we have a real revenue table
        };
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return { usersCount: 0, ideasCount: 0, purchasesCount: 0, revenue: 0 };
    }
}

export async function fetchAllUsers() {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function fetchAllTransactions() {
    try {
        const { data, error } = await supabase
            .from('user_activities')
            .select(`
                *,
                profiles:user_id (email)
            `)
            .eq('activity_type', 'purchased')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }
}

export async function deleteUserFromDB(userId: string) {
    // Note: Client-side cannot delete from auth.users without Service Role.
    // We will delete public profile data and ideas (including files), effectively clearing the user from platform.
    try {
        // 1. Delete User Activities (purchases, logs)
        await supabase.from('user_activities').delete().eq('user_id', userId);

        // 2. Delete Ideas (and their files via deleteIdeaAdmin logic)
        // First, fetch all idea IDs owned by this user
        const { data: userIdeas } = await supabase
            .from('ideas')
            .select('id')
            .eq('user_id', userId);

        if (userIdeas && userIdeas.length > 0) {
            // Delete each idea individually to trigger file cleanup
            for (const idea of userIdeas) {
                await deleteIdeaAdmin(idea.id);
            }
        }

        // 3. Delete Profile (this might cascade other public data)
        const { error } = await supabase.from('profiles').delete().eq('id', userId);

        if (error) throw error;

    } catch (error) {
        console.error("Error deleting user data:", error);
        throw error;
    }
}

export async function banUser(userId: string, isBanned: boolean) {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ banned: isBanned })
            .eq('id', userId);

        if (error) throw error;
    } catch (error) {
        console.error("Error banning user:", error);
        throw error;
    }
}

export async function updateIdeaStatus(id: string, status: string) {
    try {
        const { data, error } = await supabase
            .from('ideas')
            .update({ status: status })
            .eq('id', id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) {
            console.error("Update returned 0 rows affected. Check RLS policies.");
            throw new Error("Failed to update status: Permission denied or item not found.");
        }
    } catch (error) {
        console.error("Error updating idea status:", error);
        throw error;
    }
}
