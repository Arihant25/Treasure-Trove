import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    ShoppingCart,
    Trash2,
    PackageOpen,
    ImageOff,
    ArrowRight,
    ShoppingBag
} from 'lucide-react';
import CartPageSkeleton from './skeletons/CartPageSkeleton';

const CartPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(false);

    // Calculate total cost
    const totalCost = cartItems.reduce((sum, item) => sum + item.price, 0);

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Artificial delay to show skeleton loader
            await new Promise((resolve) => setTimeout(resolve, import.meta.env.VITE_FAKE_LOADING_TIME));

            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/cart`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCartItems(data);
            } else {
                throw new Error('Failed to fetch cart items');
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load cart items"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            const token = localStorage.getItem('token');
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/cart/remove/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setCartItems(prev => prev.filter(item => item._id !== itemId));
                toast({
                    title: "Success",
                    description: "Item removed from cart",
                    duration: 1000
                });
            } else {
                throw new Error('Failed to remove item');
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to remove item from cart"
            });
        }
    };

    const handleOrder = async () => {
        setOrderLoading(true);
        try {
            const token = localStorage.getItem('token');
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/orders`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: cartItems.map(item => item._id)
                })
            });

            if (response.ok) {
                const data = await response.json();
                setCartItems([]);
                toast({
                    title: "Order Placed Successfully!",
                    description: "Check your orders history for the delivery OTP",
                    duration: 5000
                });
                navigate('/orders');
            } else {
                throw new Error('Failed to place order');
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to place order. Please try again."
            });
        } finally {
            setOrderLoading(false);
        }
    };

    if (loading) {
        return <CartPageSkeleton />;
    }

    if (cartItems.length === 0) {
        return (
            <div className="container max-w-4xl mx-auto px-4 py-16">
                <Card className="bg-gray-50/50">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                        <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
                        <p className="text-muted-foreground">
                            Looks like you haven't added any items to your cart yet.
                        </p>
                        <Button
                            onClick={() => navigate('/search')}
                            className="mt-4"
                        >
                            Continue Shopping
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Shopping Cart</h1>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="hidden md:flex">
                            <PackageOpen className="mr-2 h-4 w-4" />
                            Order Summary
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Order Summary</SheetTitle>
                            <SheetDescription>
                                Review your order details before checkout
                            </SheetDescription>
                        </SheetHeader>
                        <div className="mt-8">
                            <ScrollArea className="h-[60vh]">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex items-center justify-between py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <ImageOff className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    ₹{item.price.toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </ScrollArea>
                            <Separator className="my-4" />
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Total Amount</span>
                                    <span className="font-bold">
                                        ₹{totalCost.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <Card>
                <CardContent className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cartItems.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <ImageOff className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Merchant: {item.sellerId.fullName}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>₹{item.price.toLocaleString('en-IN')}</TableCell>
                                    <TableCell className="text-right">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" size="icon">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Remove Item</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to remove this item from your cart?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleRemoveItem(item._id)}
                                                    >
                                                        Remove
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
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
                        <div className="flex items-center justify-between text-lg">
                            <span className="font-medium">Total ({cartItems.length} items)</span>
                            <span className="font-bold">₹{totalCost.toLocaleString('en-IN')}</span>
                        </div>
                    </CardContent>
                </Card>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            className="w-full h-14 text-lg"
                            disabled={orderLoading}
                        >
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            {orderLoading ? 'Processing...' : 'Place Order'}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Order</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to place this order? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleOrder}>
                                Confirm Order
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <Toaster />
        </div>
    );
};

export default CartPage;