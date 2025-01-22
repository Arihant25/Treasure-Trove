import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ItemCardSkeleton = () => {
  return (
    <Card className="group relative overflow-hidden">
      {/* Image Section Skeleton */}
      <div className="relative overflow-hidden">
        <div className="aspect-square">
          <Skeleton className="h-full w-full" />
        </div>
        {/* Category Badge Skeleton */}
        <div className="absolute bottom-2 left-2">
          <Skeleton className="h-5 w-20" />
        </div>
      </div>

      {/* Content Section Skeleton */}
      <CardContent className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          {/* Title Skeleton */}
          <Skeleton className="h-6 w-[60%]" />
          {/* Price Skeleton */}
          <Skeleton className="h-6 w-[25%]" />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>

        {/* Seller Info Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>

      {/* Footer Skeleton */}
      <CardFooter className="border-t bg-gray-50/50 p-4">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
};

const ItemCardSkeletonGrid = ({ count = 4 }) => {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array(count)
          .fill(null)
          .map((_, index) => (
            <ItemCardSkeleton key={index} />
          ))}
      </div>
    );
  };

export default ItemCardSkeletonGrid;