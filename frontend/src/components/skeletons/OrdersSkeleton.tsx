import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OrderCardSkeleton = () => (
    <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50/50">
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <div className="flex items-center space-x-3">
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-6">
            <div className="space-y-6">
                {/* Seller Card Skeleton */}
                <Card className="p-4 bg-gray-50">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>
                </Card>

                {/* Items Skeleton */}
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>

                <div className="h-px bg-gray-200" /> {/* Separator */}

                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-28" />
                </div>
            </div>
        </CardContent>
    </Card>
);

const OrdersSkeleton = () => {
    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="mb-8">
                <Skeleton className="h-9 w-48 mb-2" />
                <Skeleton className="h-5 w-64" />
            </div>

            <Tabs defaultValue="pending" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending" disabled className="space-x-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                    </TabsTrigger>
                    <TabsTrigger value="purchases" disabled className="space-x-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                    </TabsTrigger>
                    <TabsTrigger value="sales" disabled className="space-x-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-6">
                    {[1, 2].map((i) => (
                        <OrderCardSkeleton key={i} />
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default OrdersSkeleton;