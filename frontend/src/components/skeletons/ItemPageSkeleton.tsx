import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ItemPageSkeleton = () => {
    return (
        <div className="container max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Section Skeleton */}
                <div className="space-y-6">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
                        <Skeleton className="w-full h-full" />
                    </div>
                </div>

                {/* Details Section Skeleton */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-24" /> {/* Category badge */}
                            <Skeleton className="h-10 w-28" /> {/* Share button */}
                        </div>
                        <Skeleton className="h-12 w-3/4" /> {/* Title */}
                        <div className="space-y-1">
                            <Skeleton className="h-10 w-1/3" /> {/* Price */}
                            <Skeleton className="h-4 w-40" /> {/* Tax info */}
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-5 w-5" /> {/* Store icon */}
                            <Skeleton className="h-5 w-48" /> {/* Seller name */}
                        </div>
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-5 w-5" /> {/* Clock icon */}
                            <Skeleton className="h-5 w-56" /> {/* Delivery info */}
                        </div>
                    </div>

                    <Card className="bg-gray-50/50">
                        <CardContent className="p-6">
                            <Skeleton className="h-6 w-24 mb-3" /> {/* Description title */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </CardContent>
                    </Card>

                    <Skeleton className="h-14 w-full" /> {/* Add to Cart button */}
                </div>
            </div>
        </div>
    );
};

export default ItemPageSkeleton;