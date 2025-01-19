import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";
import { useState } from "react";

interface FormErrors {
    email?: string;
    password?: string;
}

const LoginPage = () => {
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Form validation function
    const validateForm = (e: React.FormEvent<HTMLFormElement>): boolean => {
        e.preventDefault();
        const errors: FormErrors = {};

        // Get form values
        const target = e.target as typeof e.target & {
            email: { value: string };
        };
        const email = target.email.value;
        // Email validation (optional)
        if (!email.endsWith('iiit.ac.in')) {
            errors.email = 'Only IIIT email addresses are allowed';
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        if (!validateForm(e)) return;

        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const loginData = Object.fromEntries(formData);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const { token } = await response.json();
                localStorage.setItem('token', token);  // Save token to localStorage
                setIsSubmitted(true);
                setTimeout(() => {
                    // Redirect after successful login
                    window.location.href = "/profile";
                }, 500);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (err) {
            console.error('Login failed:', err);
            alert('Login failed. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/10 p-4">
            <div className="w-full max-w-md">
                <Card className="border-none shadow-lg">
                    <CardContent className="p-6 sm:p-8">
                        <div className="mb-8 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                <LogIn className="h-8 w-8 text-primary" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome Back</h1>
                            <p className="text-sm text-muted-foreground mt-2">
                                Sign in to continue your journey
                            </p>
                        </div>

                        <form className="space-y-5" onSubmit={handleLogin}>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@iiit.ac.in"
                                        className="pl-10"
                                        required
                                    />
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    {formErrors.email && (
                                        <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10"
                                        required
                                    />
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    {formErrors.password && (
                                        <p className="text-sm text-red-500 mt-1">{formErrors.password}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className={`w-full ${isSubmitted ? 'bg-green-600 text-white' : ''}`}
                                disabled={isSubmitted}
                            >
                                {isSubmitted ? (
                                    <span className="animate-pulse">✔</span>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">Don't have an account?</span>{" "}
                            <Link
                                to="/register"
                                className="text-primary font-medium hover:underline transition-colors"
                            >
                                Create one now!
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;
