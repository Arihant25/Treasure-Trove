import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ship, Users, Shield, Search } from "lucide-react";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] animate-grid-flow" />
                <div className="absolute inset-0 opacity-30 animate-pulse" />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto text-center space-y-8"
                    >
                        <motion.div
                            className="flex justify-center"
                            animate={{ 
                                rotate: [0, 3, -3, 0],
                                y: [-5, 5, -5]
                            }}
                            transition={{ 
                                duration: 6, 
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Ship className="w-[15vw] h-auto text-primary drop-shadow-glow" />
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary animate-gradient-x">
                                Treasure Trove
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground/90 leading-relaxed">
                            Your exclusive marketplace for the IIIT community.
                            <br />
                            Navigate through waves of amazing deals.
                        </p>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex justify-center"
                        >
                            <Link to="/register">
                                <Button size="lg" className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/50 transition-all duration-300">
                                    Dive In
                                </Button>
                            </Link>
                        </motion.div>

                        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { end: 50, suffix: "+", label: "Happy Users" },
                                { end: 100, suffix: "+", label: "Treasures Found" },
                                { end: 10, suffix: "+", label: "Daily Loots" },
                                { end: 4.9, decimals: 1, suffix: "★", label: "Pirate Approved" }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 * index }}
                                    className="flex flex-col items-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300"
                                >
                                    <span className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                                        <CountUp {...stat} />
                                    </span>
                                    <span className="text-sm text-muted-foreground mt-2">{stat.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-32 bg-black">
                <div className="absolute inset-0 5 to-transparent" />
                <div className="container mx-auto px-4 relative">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-white text-center mb-16 bg-clip-text text-transparent"
                    >
                        Why Set Sail With Us?
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: "Trusted Harbor",
                                description: "Join a verified community of IIIT seafarers in protected waters."
                            },
                            {
                                icon: Shield,
                                title: "Safe Voyage",
                                description: "Navigate worry-free with our secure trading lighthouse."
                            },
                            {
                                icon: Search,
                                title: "Treasure Map",
                                description: "Chart your course with precision using our smart navigation tools."
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 * index }}
                            >
                                <Card className="border-none bg-white/5 bg-white backdrop-blur-sm hover:bg-zinc-200 transition-all duration-300">
                                    <CardContent className="p-8">
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <feature.icon className="h-16 w-16 text-primary" />
                                            <h3 className="text-2xl font-semibold text-primary">{feature.title}</h3>
                                            <p className="text-primary">{feature.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-32">
                <div className="absolute inset-0 to-transparent" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="container mx-auto px-4 relative"
                >
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8">
                            Ready to Set Sail?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-12">
                            Anchor yourself in IIIT's premier trading waters and discover endless treasures.
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Link to="/register">
                                <Button size="lg" className="px-12 py-6 text-lg rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/50 transition-all duration-300">
                                    Join the Crew
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default LandingPage;