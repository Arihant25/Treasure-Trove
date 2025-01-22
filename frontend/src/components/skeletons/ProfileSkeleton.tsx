import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => {
    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Header Skeleton */}
                <div className="col-span-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                    <div className="flex flex-row items-center gap-6">
                        <Skeleton className="h-24 w-24 rounded-full bg-gray-300" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48 bg-gray-200" />
                            <Skeleton className="h-4 w-24 bg-gray-200" />
                        </div>
                    </div>
                </div>

                {/* Left Column - Personal Info Skeleton */}
                <div className="space-y-6">
                    <div className="border rounded-lg p-6 space-y-6">
                        <Skeleton className="h-6 w-40 bg-gray-200" />
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full bg-gray-200" />
                            <Skeleton className="h-4 w-full bg-gray-200" />
                            <Skeleton className="h-4 w-full bg-gray-200" />
                        </div>
                    </div>
                    <div className="border rounded-lg p-6">
                        <Skeleton className="h-6 w-40 mb-4 bg-gray-200" />
                        <Skeleton className="h-10 w-full bg-gray-200" />
                    </div>
                </div>

                {/* Right Column - Reviews Skeleton */}
                <div className="md:col-span-2 border rounded-lg p-6">
                    <Skeleton className="h-6 w-32 mb-2 bg-gray-200" />
                    <Skeleton className="h-4 w-48 mb-6 bg-gray-200" />
                    <div className="space-y-6">
                        {[1, 2, 3].map((_, index) => (
                            <div key={index} className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32 bg-gray-200" />
                                        <Skeleton className="h-3 w-24 bg-gray-200" />
                                    </div>
                                </div>
                                <Skeleton className="h-16 w-full bg-gray-200" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSkeleton;