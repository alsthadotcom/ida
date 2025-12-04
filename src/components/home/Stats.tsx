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
            icon: Zap,
            value: loading ? "..." : formatCurrency(statsData.totalValue),
            label: "Total Listing Value",
            color: "accent",
        },
        {
            icon: Shield,
            value: loading ? "..." : statsData.avgSatisfaction + "%",
            label: "Satisfaction Rate",
            color: "primary",
        },
    ];

    return (
        <section className="py-12 md:py-16 bg-muted/30 border-y border-border/50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div
                                className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${stat.color === "primary"
                                    ? "bg-primary/10 glow-purple"
                                    : stat.color === "secondary"
                                        ? "bg-secondary/10 glow-teal"
                                        : "bg-accent/10 glow-orange"
                                    }`}
                            >
                                <stat.icon
                                    className={`w-6 h-6 ${stat.color === "primary"
                                        ? "text-primary"
                                        : stat.color === "secondary"
                                            ? "text-secondary"
                                            : "text-accent"
                                        }`}
                                />
                            </div>
                            <div className="text-3xl md:text-4xl font-black mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
