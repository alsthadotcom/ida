import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CATEGORIES } from '@/constants/marketplace';

interface CategoryDropdownProps {
    value: string;
    onChange: (category: string) => void;
    placeholder?: string;
    className?: string;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
    value,
    onChange,
    placeholder = "Select Category",
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (category: string) => {
        onChange(category);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-zinc-950 border ${isOpen ? 'border-green-500' : 'border-zinc-700'} rounded-xl px-4 py-3 text-left transition-all hover:border-zinc-500 focus:outline-none`}
            >
                <span className={`font-medium truncate flex-1 ${value ? 'text-white' : 'text-zinc-400'}`}>
                    {value || placeholder}
                </span>
                <div className="flex-shrink-0 ml-2">
                    {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-zinc-500" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-500" />
                    )}
                </div>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-950 border border-zinc-700 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 hide-scrollbar">
                    <div className="p-2 space-y-1">
                        <button
                            onClick={() => handleSelect('')}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${value === '' ? 'text-green-500 font-bold bg-zinc-900' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'}`}
                        >
                            {placeholder === "All Categories" ? "All Assets" : "Select..."}
                        </button>

                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleSelect(category)}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${value === category ? 'text-green-500 font-bold bg-zinc-900' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
