import { useState, useEffect } from "react";
import { Search, TrendingUp, Clock, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface SearchModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const SearchModal = ({ open, onOpenChange }: SearchModalProps) => {
    const [query, setQuery] = useState("");

    const recentSearches = ["AI SaaS", "E-commerce", "Marketing"];
    const trendingSearches = ["Micro-SaaS", "Community Growth", "Creator Economy"];

    // Keyboard shortcut
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onOpenChange(!open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [open, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
                <DialogHeader className="sr-only">
                    <DialogTitle>Search Ideas</DialogTitle>
                </DialogHeader>

                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search ideas, categories, or sellers..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                        autoFocus
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="p-1 hover:bg-muted rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    )}
                </div>

                {/* Search Results / Suggestions */}
                <div className="p-4 max-h-96 overflow-y-auto">
                    {!query ? (
                        <div className="space-y-6">
                            {/* Recent Searches */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Recent
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {recentSearches.map((search) => (
                                        <button
                                            key={search}
                                            onClick={() => setQuery(search)}
                                            className="px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                                        >
                                            {search}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Trending Searches */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Trending
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {trendingSearches.map((search) => (
                                        <button
                                            key={search}
                                            onClick={() => setQuery(search)}
                                            className="px-3 py-1.5 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-sm text-secondary transition-colors"
                                        >
                                            {search}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <p className="text-sm">
                                Search results for "{query}" would appear here
                            </p>
                            <p className="text-xs mt-2">
                                (Connect to your backend API to show real results)
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-border bg-muted/30">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                            <span>↑↓ Navigate</span>
                            <span>↵ Select</span>
                            <span>ESC Close</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <kbd className="px-2 py-0.5 rounded bg-background border border-border">
                                ⌘K
                            </kbd>
                            <span>to open</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SearchModal;
