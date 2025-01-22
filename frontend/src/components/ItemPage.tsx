import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/toaster";
import { ShoppingCart, Store, Clock, Share2, ImageOff, Star } from "lucide-react";
import ItemPageSkeleton from "./skeletons/ItemPageSkeleton";

const ItemPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [reviews, setReviews] = useState([]);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setImagePosition({ x, y });
    };

    const fetchReviews = async (sellerId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            const response = await fetch(`${backendUrl}/api/reviews/user?sellerId=${sellerId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch seller reviews.");
            }

            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to fetch seller reviews.",
            });
        }
    };


    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const delay = parseInt(import.meta.env.VITE_FAKE_LOADING_TIME);
                await new Promise((resolve) => setTimeout(resolve, delay));

                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await fetch(`${backendUrl}/api/items/${id}`);
                if (response.status === 404) {
                    navigate('/404');
                    return;
                }
                const data = await response.json();
                setItem(data);
            } catch (error) {
                console.error("Error fetching item details:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load item details",
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchItemDetails();
        } else {
            navigate('/404');
        }
    }, [id, navigate]);

    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/cart/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id }),
            });
            const message = await response.text();
            if (response.ok) {
                toast({
                    title: "Success",
                    description: message.slice(12, -2).split('":"').join(" "),
                });
            } else {
                throw new Error(message);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message.slice(12, -2).split('":"').join(" "),
            });
        }
    };

    if (loading) {
        return <ItemPageSkeleton />;
    }

    if (!item) return null;

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <Star
                key={index}
                className={`h-4 w-4 transition-all duration-200 hover:scale-110 hover:rotate-12 ${index < Math.floor(rating)
                    ? 'text-yellow-400 fill-yellow-400 hover:text-yellow-300 hover:fill-yellow-300'
                    : 'text-gray-300 hover:text-gray-400'
                    }`}
            />
        ));
    };

    return (
        <div className="container max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Section */}
                <div className="space-y-6">
                    <div
                        className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setImagePosition({ x: 0, y: 0 })}
                        style={{ cursor: item.image ? "zoom-in" : "default" }}
                    >
                        {item.image ? (
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-200 hover:scale-150"
                                style={{
                                    transformOrigin: `${imagePosition.x}% ${imagePosition.y}%`,
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <ImageOff className="h-16 w-16 text-gray-400" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Section */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            {item?.category ? (
                                <Badge variant="secondary" className="text-sm">
                                    {item?.category}
                                </Badge>
                            ) : (
                                <p />
                            )}
                            {/* Share Button */}
                            <div className="flex justify-end">
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2"
                                    onClick={() => navigator.share?.({
                                        title: item.name,
                                        text: `Check out this item on Treasure Trove: ${item.name}`,
                                        url: window.location.href
                                    })}
                                >
                                    <Share2 className="h-5 w-5" />
                                    Share
                                </Button>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">{item.name}</h1>
                        <div className="space-y-1">
                            <p className="text-3xl font-bold text-primary">
                                ₹{item.price.toLocaleString("en-IN")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Inclusive of all taxes
                            </p>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Store className="h-5 w-5 text-muted-foreground" />
                            Merchant:
                            <button
                                onClick={() => {
                                    setIsSheetOpen(true);
                                    fetchReviews(item.sellerId._id);
                                }}
                                className="text-primary underline hover:no-underline"
                            >
                                {item.sellerId.fullName}
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <span>Delivery as soon as possible!</span>
                        </div>
                    </div>

                    <Card className="bg-gray-50/50">
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-3">Description</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {item.description}
                            </p>
                        </CardContent>
                    </Card>

                    <Button
                        size="lg"
                        className="w-full h-14 text-lg"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                    </Button>
                </div>

            </div>

            {/* Sheet for Reviews */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Seller Reviews</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 space-y-4">
                        {!localStorage.getItem("token") ? (
                            <p>You need to be logged in to view reviews.</p>
                        ) : reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <div key={index} className="p-4 border rounded-lg">
                                    <p className="font-medium">{review.user.fullName}</p>
                                    <div className="flex items-center gap-1">
                                        {renderStars(review.rating)}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p>No reviews available.</p>
                        )}
                    </div>

                </SheetContent>
            </Sheet>

            <Toaster />
        </div>
    );
};

export default ItemPage;
