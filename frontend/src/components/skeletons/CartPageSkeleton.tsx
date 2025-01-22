import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const CartPageSkeleton = () => {
    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                <Skeleton className="h-10 w-48" /> {/* Cart Title */}
                <Skeleton className="h-10 w-36 hidden md:block" /> {/* Order Summary Button */}
            </div>

            <Card>
                <CardContent className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                                <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                                <TableHead className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[1, 2, 3].map((item) => (
                                <TableRow key={item}>
                                    <TableCell>
                                        <div className="flex items-center space-x-4">
                                            <Skeleton className="h-16 w-16 rounded-lg" /> {/* Item Image */}
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-48" /> {/* Item Name */}
                                                <Skeleton className="h-4 w-32" /> {/* Seller Name */}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" /> {/* Price */}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="h-9 w-9 ml-auto" /> {/* Remove Button */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="mt-8 space-y-6">
                <Card className="bg-gray-50/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-36" /> {/* Total Text */}
                            <Skeleton className="h-6 w-24" /> {/* Total Amount */}
                        </div>
                    </CardContent>
                </Card>

                <Skeleton className="h-14 w-full" /> {/* Place Order Button */}
            </div>
        </div>
    );
};

export default CartPageSkeleton;