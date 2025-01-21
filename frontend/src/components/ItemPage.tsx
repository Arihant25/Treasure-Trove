import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

import {
    ShoppingCart,
    Store,
    Clock,
    Share2,
    ImageOff
} from 'lucide-react';

const ItemPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

    // Image zoom handling
    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = (e.clientX - left) / width * 100;
        const y = (e.clientY - top) / height * 100;
        setImagePosition({ x, y });
    };

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await fetch(`${backendUrl}/api/items/${id}`);
                const data = await response.json();
                setItem(data);
            } catch (error) {
                console.error('Error fetching item details:', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load item details"
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchItemDetails();
        }
        else {
            return <div>Invalid item ID</div>;
        }
    }, [id]);

    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id })
            });
            const message = await response.text();
            if (response.ok) {
                toast({
                    title: "Success",
                    description: message.slice(12, -2).split('":"').join(' '),
                });
            } else if (response.status === 418) {
                throw new Error(message);
            } else {
                throw new Error(message);
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message.slice(12, -2).split('":"').join(' ')
            });
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse space-y-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto" />
                    <div className="h-4 w-24 bg-gray-200 rounded mx-auto" />
                </div>
            </div>
        );
    }

    if (!item) return null;

    return (
        <div className="container max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Section */}
                <div className="space-y-6">
                    <div
                        className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setImagePosition({ x: 0, y: 0 })}
                        style={{ cursor: item.image ? 'zoom-in' : 'default' }}
                    >
                        {item.image ? (
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-200 hover:scale-150"
                                style={{
                                    transformOrigin: `${imagePosition.x}% ${imagePosition.y}%`
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
                            <Badge variant="secondary" className="text-sm">
                                {item.category}
                            </Badge>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="default"
                                            className="px-4"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const url = `${window.location.origin}/items/${id}`;
                                                navigator.clipboard.writeText(url)
                                                    .then(() => {
                                                        toast({
                                                            title: "Link copied!",
                                                            description: "Item link has been copied to clipboard.",
                                                            duration: 4000,
                                                        });
                                                    })
                                                    .catch(err => {
                                                        toast({
                                                            title: "Failed to copy",
                                                            description: "Could not copy link to clipboard.",
                                                            variant: "destructive",
                                                        });
                                                    });
                                            }}
                                        >
                                            <Share2 className="h-5 w-5 mr-2" />
                                            Share
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Share Item</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">
                            {item.name}
                        </h1>
                        <div className="space-y-1">
                            <p className="text-3xl font-bold text-primary">
                                ₹{item.price.toLocaleString('en-IN')}
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
                            <span>Sold by: {item.sellerId.fullName}</span>
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
            <Toaster />
        </div>
    );
};

export default ItemPage;