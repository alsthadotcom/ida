export const CATEGORIES = [
    "SaaS",
    "E-commerce",
    "Marketing",
    "Startup",
    "Finance",
    "Health & Wellness",
    "Education",
    "Entertainment",
    "AI/ML",
    "Mobile App",
    "Content",
    "Creator",
    "Web3",
    "Other"
];

export const TOPIC_TYPES = [
    "Hot",
    "New",
    "Trending",
    "Popular"
] as const;

export const TARGET_AUDIENCES = [
    "B2B",
    "B2C",
    "Enterprise",
    "SMB",
    "Startups",
    "Students",
    "General Public",
    "Niche"
];

export const REGIONS = [
    "Global",
    "North America",
    "Europe",
    "Asia Pacific",
    "Latin America",
    "Middle East & Africa"
];

export interface Idea {
    id: number;
    title: string;
    description: string;
    price: string;
    uniqueness: number;
    views?: number;
    category: string;
    seller: string;
    variant?: 'large' | 'normal' | 'wide' | 'tall';
    color: 'primary' | 'secondary' | 'accent';
    badge?: 'hot' | 'new' | 'trending';
    rating: number;
    status: string;
    executionReadiness?: number;
    hasMVP?: boolean;
    isRawIdea?: boolean;
    hasDetailedRoadmap?: boolean;
    regionFeasibility?: string;
    marketPotential?: string;
    investmentReady?: boolean;
    lookingForPartner?: boolean;
    clarityScore?: number;
    cappedPrice?: string;
    typeOfTopic?: string;
}
