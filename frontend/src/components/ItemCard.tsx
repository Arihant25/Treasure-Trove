import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ImageOff, Share2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';


const ItemCard = ({ item, onClick }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const { toast } = useToast();

    return (
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl">
            {/* Floating share button */}
            <div className="absolute right-2 top-2 z-10 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const url = `${window.location.origin}/items/${item._id}`;
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
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Share Item</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {/* Image Section with Hover Effect */}
            <div className="relative overflow-hidden" onClick={onClick}>
                <div className="aspect-square">
                    {item.image ? (
                        <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                            <ImageOff className="h-16 w-16 text-gray-400" />
                        </div>
                    )}
                </div>

                {/* Category Badge */}
                <Badge
                    variant="secondary"
                    className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm"
                >
                    {item.category}
                </Badge>
            </div>

            {/* Content Section */}
            <CardContent className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 font-semibold tracking-tight">
                        {item.name}
                    </h3>
                    <p className="text-lg font-bold text-primary">
                        {formatPrice(item.price)}
                    </p>
                </div>

                <p className="line-clamp-2 text-sm text-gray-600">
                    {item.description}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.sellerId?.fullName || 'Unknown'}`}
                        alt="Seller"
                        className="h-5 w-5 rounded-full"
                    />
                    <span>{item.sellerId?.fullName || "Unknown Seller"}</span>
                </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="border-t bg-gray-50/50 p-4">
                <Button
                    className="w-full gap-2"
                    variant="default"
                    onClick={onClick}
                >
                    View Details
                    <ExternalLink className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ItemCard;