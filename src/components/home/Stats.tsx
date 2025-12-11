import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Zap, Shield } from "lucide-react";
import { fetchPlatformStats } from "@/services/ideaService";

const Stats = () => {
    const [statsData, setStatsData] = useState({
        ideasCount: 0,
        creatorsCount: 0,
        totalValue: 0,
        avgSatisfaction: 0,
        soldCount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            const data = await fetchPlatformStats();
            setStatsData(data);
            setLoading(false);
        };
        loadStats();
    }, []);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + "M+";
        if (num >= 1000) return (num / 1000).toFixed(1) + "K+";
        return num.toString();
    };

    const formatCurrency = (num: number) => {
        if (num >= 1000000) return "$" + (num / 1000000).toFixed(1) + "M+";
        if (num >= 1000) return "$" + (num / 1000).toFixed(1) + "K+";
        return "$" + num.toLocaleString();
    };

    const stats = [
        {
            icon: TrendingUp,
            value: loading ? "..." : formatNumber(statsData.ideasCount),
            label: "Ideas Listed",
            color: "primary",
        },
        {
            icon: Users,
            value: loading ? "..." : formatNumber(statsData.creatorsCount),
            label: "Active Creators",
            color: "secondary",
        },
        {
            icon: Shield,
            value: loading ? "..." : formatNumber(statsData.soldCount),
            label: "Total Ideas Sold",
            color: "primary",
        },
        {
            icon: Zap,
            value: loading ? "..." : formatCurrency(statsData.totalValue),
            label: "Total Listing Value",
            color: "primary-green",
        },
    ];

    return (
        <section className="py-20 border-y border-white/5 bg-black/5 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 mesh-gradient opacity-10 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-card p-8 rounded-3xl text-center hover:-translate-y-1 transition-transform duration-300 border-white/5"
                        >
                            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 mb-4 border border-white/10 group-hover:bg-white/10 transition-colors">
                                <stat.icon
                                    className={`w-6 h-6 ${stat.color === "primary"
                                        ? "text-primary"
                                        : stat.color === "secondary"
                                            ? "text-emerald-400"
                                            : stat.color === "primary-green"
                                                ? "text-primary"
                                                : "text-accent"
                                        }`}
                                />
                            </div>
                            <div className={`text-4xl md:text-5xl font-black mb-2 ${stat.color === 'primary' ? 'text-foreground' :
                                stat.color === 'secondary' ? 'text-foreground' :
                                    stat.color === 'primary-green' ? 'text-primary' :
                                        'text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400'
                                }`}>
                                {stat.value}
                            </div>
                            <div className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
