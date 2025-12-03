import { motion } from "framer-motion";
import { TrendingUp, Users, Zap, Shield } from "lucide-react";

const Stats = () => {
    const stats = [
        {
            icon: TrendingUp,
            value: "10K+",
            label: "Ideas Listed",
            color: "primary",
        },
        {
            icon: Users,
            value: "50K+",
            label: "Active Users",
            color: "secondary",
        },
        {
            icon: Zap,
            value: "$2M+",
            label: "Creator Earnings",
            color: "accent",
        },
        {
            icon: Shield,
            value: "95%",
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
