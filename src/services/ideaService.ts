import { supabase } from '@/lib/supabase';

// Generate unique slug from title
function generateSlug(title: string): string {
    const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    // Add timestamp to ensure uniqueness
    const timestamp = Date.now();
    return `${baseSlug}-${timestamp}`;
}

// Fetch GitHub token from platform settings
export async function getGitHubToken(): Promise<string | null> {
    try {
        const { data, error } = await supabase
            .from('platform_settings')
            .select('value')
            .eq('key', 'github_token')
            .single();

        if (error) {
            console.error('Error fetching GitHub token:', error);
            return null;
        }

        return data?.value || null;
    } catch (error) {
        console.error('Error in getGitHubToken:', error);
        return null;
    }
}

// Upload evidence files to Supabase Storage
export async function uploadEvidenceFiles(files: File[], ideaId: string): Promise<string[]> {
    const uploadPromises = files.map(async (file, index) => {
        const fileName = `${ideaId}/${index}-${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
            .from('idea-evidence')
            .upload(fileName, file);

        if (error) {
            console.error('Error uploading file:', error);
            throw error;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('idea-evidence')
            .getPublicUrl(fileName);

        return urlData.publicUrl;
    });

    return Promise.all(uploadPromises);
}

// Create a new idea
export async function createIdea(ideaData: any): Promise<string> {
    try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User must be logged in to submit ideas');
        }

        // Generate slug
        const slug = generateSlug(ideaData.title);

        // Prepare idea document with snake_case keys for Supabase
        const idea = {
            slug,
            title: ideaData.title,
            description: ideaData.description,
            price: ideaData.price.toString().startsWith('$') ? ideaData.price : `$${ideaData.price}`,
            category: ideaData.category,
            seller: user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'Anonymous',
            user_id: user.id,

            // Scores
            uniqueness: ideaData.uniqueness,
            execution_readiness: ideaData.executionReadiness,
            clarity_score: ideaData.clarityScore,
            rating: Number(((ideaData.uniqueness + ideaData.clarityScore) / 2 / 20).toFixed(1)),

            // Flags
            has_mvp: ideaData.hasMVP,
            is_raw_idea: ideaData.isRawIdea,
            has_detailed_roadmap: ideaData.hasDetailedRoadmap,
            investment_ready: ideaData.investmentReady,
            looking_for_partner: ideaData.lookingForPartner,

            // Details
            target_audience: ideaData.targetAudience,
            region_feasibility: ideaData.regionFeasibility,
            market_potential: ideaData.marketPotential,
            type_of_topic: ideaData.typeOfTopic,

            // Evidence
            evidence_note: ideaData.evidenceNote,
            github_repo_url: ideaData.githubRepoUrl || "",
            mvp_file_urls: ideaData.mvpFileUrls || "",

            // AI Scores
            ai_scores: ideaData.aiScores ? JSON.stringify(ideaData.aiScores) : null,

            // Metadata
            views: 0,
            status: "New",
            color: "primary",
            variant: "normal",
            badge: ideaData.typeOfTopic || "New",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // Insert into Supabase
        const { data, error } = await supabase
            .from('ideas')
            .insert([idea])
            .select()
            .single();

        if (error) {
            console.error('Error creating idea:', error);
            throw error;
        }

        // Evidence files are already uploaded in frontend and passed as comma-separated string in ideaData.evidenceFiles
        // No need to re-upload here.

        return data.id;
    } catch (error) {
        console.error('Error in createIdea:', error);
        throw error;
    }
}

// Fetch all ideas
export async function fetchIdeas(): Promise<any[]> {
    try {
        const { data, error } = await supabase
            .from('ideas')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching ideas:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Error in fetchIdeas:', error);
        throw error;
    }
}

// Fetch idea by slug
export async function fetchIdeaBySlug(slug: string): Promise<any | null> {
    try {
        const { data, error } = await supabase
            .from('ideas')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // Not found
                return null;
            }
            console.error('Error fetching idea by slug:', error);
            throw error;
        }

        // Increment view count
        if (data) {
            await supabase
                .from('ideas')
                .update({ views: (data.views || 0) + 1 })
                .eq('id', data.id);
        }

        return data;
    } catch (error) {
        console.error('Error in fetchIdeaBySlug:', error);
        throw error;
    }
}

// Fetch idea by ID
export async function fetchIdeaById(id: string): Promise<any | null> {
    try {
        const { data, error } = await supabase
            .from('ideas')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            console.error('Error fetching idea by ID:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error in fetchIdeaById:', error);
        throw error;
    }
}

// Fetch featured ideas (top viewed or trending)
export async function fetchFeaturedIdeas(limitCount: number = 6): Promise<any[]> {
    try {
        const { data, error } = await supabase
            .from('ideas')
            .select('*')
            .order('views', { ascending: false })
            .limit(limitCount);

        if (error) {
            console.error('Error fetching featured ideas:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Error in fetchFeaturedIdeas:', error);
        throw error;
    }
}
// Fetch platform stats
export async function fetchPlatformStats(): Promise<{
    ideasCount: number;
    creatorsCount: number;
    totalValue: number;
    avgSatisfaction: number;
}> {
    try {
        const { data, error } = await supabase
            .from('ideas')
            .select('price, rating, user_id');

        if (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }

        const ideasCount = data.length;
        const uniqueCreators = new Set(data.map(idea => idea.user_id)).size;

        const totalValue = data.reduce((sum, idea) => {
            const price = Number(idea.price.replace(/[^0-9.-]+/g, ""));
            return sum + (isNaN(price) ? 0 : price);
        }, 0);

        const avgRating = data.reduce((sum, idea) => sum + (idea.rating || 0), 0) / (ideasCount || 1);
        const avgSatisfaction = Math.round((avgRating / 5) * 100);

        return {
            ideasCount,
            creatorsCount: uniqueCreators,
            totalValue,
            avgSatisfaction: avgSatisfaction || 0
        };
    } catch (error) {
        console.error('Error in fetchPlatformStats:', error);
        return {
            ideasCount: 0,
            creatorsCount: 0,
            totalValue: 0,
            avgSatisfaction: 0
        };
    }
}

// Update an existing idea
export async function updateIdea(id: string, ideaData: any): Promise<void> {
    try {
        const updatePayload: any = {
            title: ideaData.title,
            description: ideaData.description,
            price: ideaData.price.toString().startsWith('$') ? ideaData.price : `$${ideaData.price}`,
            category: ideaData.category,
            // Scores
            uniqueness: ideaData.uniqueness,
            execution_readiness: ideaData.executionReadiness,
            clarity_score: ideaData.clarityScore,
            rating: Number(((ideaData.uniqueness + ideaData.clarityScore) / 2 / 20).toFixed(1)),
            // Flags
            has_mvp: ideaData.hasMVP,
            is_raw_idea: ideaData.isRawIdea,
            has_detailed_roadmap: ideaData.hasDetailedRoadmap,
            investment_ready: ideaData.investmentReady,
            looking_for_partner: ideaData.lookingForPartner,
            // Details
            target_audience: ideaData.targetAudience,
            region_feasibility: ideaData.regionFeasibility,
            market_potential: ideaData.marketPotential,
            type_of_topic: ideaData.typeOfTopic,
            // Evidence
            evidence_note: ideaData.evidenceNote,

            // AI Scores
            ai_scores: ideaData.aiScores ? JSON.stringify(ideaData.aiScores) : undefined,

            updated_at: new Date().toISOString(),
        };

        // Only update file URLs if they are provided/changed
        if (ideaData.mvpFileUrls !== undefined) {
            updatePayload.mvp_file_urls = ideaData.mvpFileUrls || "";
        }

        // Only update repo URL if provided (usually shouldn't change, but good to have option)
        if (ideaData.githubRepoUrl) {
            updatePayload.github_repo_url = ideaData.githubRepoUrl;
        }

        const { error } = await supabase
            .from('ideas')
            .update(updatePayload)
            .eq('id', id);

        if (error) {
            console.error('Error updating idea:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error in updateIdea:', error);
        throw error;
    }
}

// Record a purchase (create pending transaction)
export async function recordPurchase(ideaId: string, ideaTitle: string, price: number, sellerId?: string): Promise<void> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Create pending transaction
        const { error } = await supabase
            .from('transactions')
            .insert({
                buyer_id: user.id,
                seller_id: sellerId || null, // Best effort if passed, else null
                idea_id: ideaId,
                amount: price,
                status: 'pending'
            });

        if (error) {
            console.error('Error recording transaction:', error);
            throw error;
        }

    } catch (error) {
        console.error('Error in recordPurchase:', error);
        throw error;
    }
}

// --- Admin Functions ---

export async function fetchAllIdeasAdmin() {
    try {
        const { data, error } = await supabase
            .from('ideas')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching all ideas (admin):", error);
        return [];
    }
}

export async function deleteIdeaAdmin(id: string) {
    try {
        // Fetch idea first to get file URLs and user ID (repo name)
        const { data: idea, error: fetchError } = await supabase
            .from('ideas')
            .select('user_id, mvp_file_urls')
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error("Error fetching idea for deletion details:", fetchError);
            // Proceed to DB delete anyway to ensure cleanup
        }

        // 1. Delete associated files from Storage (Supabase)
        try {
            const { data: files, error: listError } = await supabase
                .storage
                .from('idea-evidence')
                .list(`${id}/`);

            if (!listError && files && files.length > 0) {
                const filesToRemove = files.map(file => `${id}/${file.name}`);
                await supabase.storage.from('idea-evidence').remove(filesToRemove);
            }
        } catch (storageError) {
            console.error("Warning: Supra Storage cleanup failed, continuing...", storageError);
        }

        // 2. Delete from GitHub (Best Effort - Non-blocking)
        if (idea && idea.mvp_file_urls && idea.user_id) {
            try {
                const { data: settings } = await supabase
                    .from('platform_settings')
                    .select('value')
                    .eq('key', 'github_token')
                    .single();

                const token = settings?.value;

                if (token) {
                    // Lazy load service to avoid circular dependency
                    const { deleteFileFromGitHub, getAuthenticatedUser } = await import('./githubService');

                    try {
                        const owner = await getAuthenticatedUser(token);
                        const repoName = idea.user_id; // Repo name is user ID
                        const fileUrls = idea.mvp_file_urls.split(',').filter((u: string) => u);

                        for (const url of fileUrls) {
                            try {
                                // Extract filename from URL (GitHub raw/blob URL structure assumed)
                                const parts = url.split('/');
                                const filename = decodeURIComponent(parts[parts.length - 1]);
                                const path = `mvp-files/${filename}`;

                                await deleteFileFromGitHub(owner, repoName, path, 'Deleted via Admin Panel', token);
                            } catch (singleFileError) {
                                console.warn(`Failed to delete specific file from GitHub: ${url}`, singleFileError);
                                // Continue to next file
                            }
                        }
                    } catch (userError) {
                        console.warn("Could not authenticate for GitHub deletion or repo not found.", userError);
                    }
                }
            } catch (ghError) {
                console.error("Warning: GitHub cleanup failed completely, continuing...", ghError);
            }
        }

        // 3. Delete from Database
        const { error, count } = await supabase
            .from('ideas')
            .delete({ count: 'exact' })
            .eq('id', id);

        if (error) throw error;
        if (count === 0) throw new Error("Idea not found or permission denied (RLS)");

    } catch (error) {
        console.error("Error deleting idea (admin):", error);
        throw error;
    }
}

export async function toggleIdeaFeatured(id: string, isFeatured: boolean) {
    try {
        const { error } = await supabase
            .from('ideas')
            .update({ status: isFeatured ? 'featured' : 'approved' })
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error("Error toggling feature status:", error);
        throw error;
    }
}

// Admin: Fetch all transactions
export async function fetchTransactionsAdmin() {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select(`
                *,
                profiles:buyer_id (email),
                ideas:idea_id (title)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }
}

// Admin: Update transaction status
export async function updateTransactionStatus(transactionId: string, status: 'approved' | 'rejected') {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .update({ status })
            .eq('id', transactionId)
            .select() // Returning * so we can get details for side effects
            .single();

        if (error) throw error;

        // If approved, strictly now we consider it "Purchased".
        // We might want to create the 'user_activity' record here for the buyer so it shows up in their feed/stats?
        if (status === 'approved' && data) {
            // Fetch idea title if not present (though we can join, but here we just need title for activity desc)
            const { data: idea } = await supabase.from('ideas').select('title').eq('id', data.idea_id).single();
            const title = idea?.title || 'Idea';

            await supabase.from('user_activities').insert({
                user_id: data.buyer_id,
                activity_type: 'purchased',
                description: `Purchased idea: ${title}`,
                idea_title: title,
                created_at: new Date().toISOString()
            });
        }

        return data;
    } catch (error) {
        console.error("Error updating transaction status:", error);
        throw error;
    }
}
