import { supabase } from '@/lib/supabase';

// Generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
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
            price: ideaData.price,
            category: ideaData.category,
            seller: user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'Anonymous',
            user_id: user.id,

            // Scores
            uniqueness: ideaData.uniqueness,
            execution_readiness: ideaData.executionReadiness,
            clarity_score: ideaData.clarityScore,
            rating: 0,

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
            evidence_files: [], // Will be updated after upload

            // Metadata
            views: 0,
            status: "New",
            color: "primary",
            variant: "normal",
            badge: "new",
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

        // Upload evidence files if any
        if (ideaData.evidenceFiles && ideaData.evidenceFiles.length > 0) {
            const fileUrls = await uploadEvidenceFiles(ideaData.evidenceFiles, data.id);

            const { error: updateError } = await supabase
                .from('ideas')
                .update({ evidence_files: fileUrls })
                .eq('id', data.id);

            if (updateError) {
                console.error('Error updating evidence files:', updateError);
            }
        }

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
