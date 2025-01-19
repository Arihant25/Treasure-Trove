import { Card, CardContent } from "@/components/ui/card";
import { Brain, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ForgotPasswordPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/10 p-4">
            <div className="w-full max-w-md">
                <Card className="border-none shadow-lg overflow-hidden">
                    <CardContent className="p-6 sm:p-8">
                        {/* Brain Icon */}
                        <div className="mb-8 text-center">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
                                <Brain className="h-12 w-12 text-primary" />
                            </div>
                        </div>

                        {/* Main Message */}
                        <div className="text-center space-y-6">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Forgot Your Password?
                            </h1>

                            <p className="text-l sm:text-xl text-muted-foreground font-medium">
                                Well, should have eaten your almonds
                            </p>

                            <div className="text-4xl inline-block">
                                ¯\_(ツ)_/¯
                            </div>
                        </div>

                        {/* Back to Login Button */}
                        <div className="mt-8">
                            <Link to="/login">
                                <Button
                                    variant="outline"
                                    className="w-full group hover:bg-primary hover:text-primary-foreground"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4 " />
                                    Back to Login (if you remember it ;))
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;