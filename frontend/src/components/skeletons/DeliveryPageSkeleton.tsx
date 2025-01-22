import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Fish } from 'lucide-react';

const DeliveryPageSkeleton = () => {

    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex items-center space-x-2">
                    <Fish className="h-5 w-5 text-muted-foreground" />
                    <Skeleton className="h-5 w-20" />
                </div>
            </div>

            <div className="space-y-6">
                {[1, 2].map((i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardHeader className="bg-gray-50/50">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-48" />
                                    </div>
                                    <div className="ml-auto flex items-center space-x-2">
                                        <Skeleton className="h-4 w-4 rounded-full" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    {[1, 2].map((item) => (
                                        <div key={item} className="flex items-center justify-between">
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-40" />
                                                <Skeleton className="h-3 w-24" />
                                            </div>
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end">
                                    <Skeleton className="h-9 w-36" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default DeliveryPageSkeleton;