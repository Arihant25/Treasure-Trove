import { Button } from "@/components/ui/button";
import { ShoppingBag, Map, Compass } from "lucide-react";

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* 404 Content */}
            <div className="flex-1 container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 animate-spin-slow">
                        <Compass className="h-32 w-32 text-primary opacity-20" />
                    </div>
                    <Map className="h-32 w-32 text-primary relative z-10" />
                </div>

                <h1 className="text-6xl font-bold mb-4">
                    Arrr! Lost at Sea?
                </h1>

                <p className="text-2xl text-muted-foreground mb-8 max-w-2xl">
                    Looks like this treasure map led to a dead end! The page you're looking for has been buried somewhere else or never existed in the first place.
                </p>

                <div className="space-y-4 mb-12">
                    <p className="text-lg text-muted-foreground">
                        Don't worry, even the best treasure hunters get lost sometimes.
                    </p>
                    <p className="text-lg font-semibold">
                        Error Code: <span className="font-mono text-primary">404</span>
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" onClick={() => window.history.back()}>
                        ← Return to Previous Port
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => window.location.href = '/'}>
                        Navigate Home
                    </Button>
                </div>
            </div>

            <style>{`
                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default NotFoundPage;