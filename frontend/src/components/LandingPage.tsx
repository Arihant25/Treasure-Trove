import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ship, Users, Shield, Search } from "lucide-react";
import CountUp from "react-countup";
import { Link } from "react-router-dom";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative">
                <div className="container mx-auto px-4 py-24 relative">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <div className="flex justify-center">
                            <Ship className="w-[12vw] h-auto" />
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                            Treasure Trove
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground">
                            Your exclusive marketplace for the IIIT community. Buy, sell, and trade with confidence.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register"><Button>Dive In</Button></Link>
                        </div>
                        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-primary">
                                    <CountUp end={50} duration={2} suffix="+" />
                                </span>
                                <span className="text-sm text-muted-foreground">Happy Users</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-primary">
                                    <CountUp end={100} duration={2} suffix="+" />
                                </span>
                                <span className="text-sm text-muted-foreground">Treasures Found</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-primary">
                                    <CountUp end={10} duration={2} suffix="+" />
                                </span>
                                <span className="text-sm text-muted-foreground">Daily Loots</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-primary">
                                    <CountUp end={4.9} duration={2} decimals={1} suffix="★" />
                                </span>
                                <span className="text-sm text-muted-foreground">Pirate Approved</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-24 bg-muted/50">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Why Choose Treasure Trove?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <Users className="h-12 w-12 text-primary" />
                                <h3 className="text-xl font-semibold">Exclusive Community</h3>
                                <p className="text-muted-foreground">
                                    Connect with verified IIIT members in a trusted environment for seamless transactions.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <Shield className="h-12 w-12 text-primary" />
                                <h3 className="text-xl font-semibold">Secure Transactions</h3>
                                <p className="text-muted-foreground">
                                    Experience worry-free trading with our OTP-based verification system.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <Search className="h-12 w-12 text-primary" />
                                <h3 className="text-xl font-semibold">Smart Search</h3>
                                <p className="text-muted-foreground">
                                    Find exactly what you need with our advanced search and filtering system.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-24 text-center bg-gradient-to-br">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">
                        Ready to Start Sailing?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Join your fellow IIIT community members and start exploring great deals today.
                    </p>
                    <Link to="/register">
                        <Button size="lg" className="px-8">
                           Join the Crew
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
