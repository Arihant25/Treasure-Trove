import { useState, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Banknote,
    Clock,
    Check,
    Anchor,
    KeyRound,
    RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReviewDialog from './ReviewDialog';
import OrdersSkeleton from './skeletons/OrdersSkeleton';

function generateOTP() {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}

async function hashOTP(otp: string): Promise<string> {
    // Convert the OTP string to a Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(otp);

    // Hash the OTP using SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert the hash to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

const OrdersPage = () => {
    const { toast } = useToast();
    const [orders, setOrders] = useState([]);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [salesHistory, setSalesHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [regenerating, setRegenerating] = useState({});
    const [otps, setOtps] = useState({}); // Store plain OTPs for display
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }

        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            // Add artificial delay
            await new Promise(resolve => setTimeout(resolve, import.meta.env.VITE_FAKE_LOADING_TIME));


            // Fetch pending orders
            const pendingResponse = await fetch(`${backendUrl}/api/orders/my-orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Fetch history
            const historyResponse = await fetch(`${backendUrl}/api/orders/user-history`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (pendingResponse.ok && historyResponse.ok) {
                const pendingData = await pendingResponse.json();
                const historyData = await historyResponse.json();

                setOrders(pendingData.filter(order => order.status === 'pending'));
                setPurchaseHistory(historyData.purchases);
                setSalesHistory(historyData.sales);
            } else {
                throw new Error('Failed to fetch orders');
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load orders"
            });
        } finally {
            setLoading(false);
        }
    };


    const handleRegenerateOTP = async (orderId: string, sellerId: string) => {
        try {
            setRegenerating(prev => ({ ...prev, [sellerId]: true }));
            const newOTP = generateOTP();
            const hashedOTP = await hashOTP(newOTP);

            // Store plain OTP for display
            setOtps(prev => ({ ...prev, [sellerId]: newOTP }));

            const token = localStorage.getItem('token');
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/orders/generate-otp`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderId,
                    sellerId,
                    otp: hashedOTP
                })
            });

            if (!response.ok) {
                throw new Error('Failed to regenerate OTP');
            }

            await fetchOrders();

            toast({
                title: "Success",
                description: "OTP regenerated successfully"
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to regenerate OTP"
            });
        } finally {
            setRegenerating(prev => ({ ...prev, [sellerId]: false }));
        }
    };

    const OrderOTPSection = ({ order }) => {
        // Modified seller groups reduction
        const sellerGroups = order.items.reduce((acc, item) => {
            const sellerId = item.sellerId._id; // Get the actual ID string
            if (!acc[sellerId]) {
                acc[sellerId] = {
                    sellerName: item.sellerId.fullName,
                    sellerId: sellerId, // Store the ID explicitly
                    items: []
                };
            }
            acc[sellerId].items.push(item);
            return acc;
        }, {});

        return (
            <div className="space-y-4">
                {Object.entries(sellerGroups).map(([sellerId, group]) => {
                    const sellerOTP = otps[sellerId];

                    return (
                        <Card key={sellerId} className="p-4 bg-gray-50">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium">
                                        Seller: {group.sellerName}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleRegenerateOTP(order._id, sellerId);
                                        }}
                                        disabled={regenerating[sellerId]}
                                    >
                                        <RefreshCw />
                                    </Button>
                                </div>

                                {sellerOTP && (
                                    <div className="flex items-center space-x-2 bg-white p-3 rounded-lg">
                                        <KeyRound className="h-5 w-5 text-muted-foreground" />
                                        <div className="text-2xl font-mono font-bold tracking-wider">
                                            {sellerOTP}
                                        </div>
                                    </div>
                                )}

                                <div className="text-sm">
                                    Items from seller:
                                    <ul className="list-inside list-disc">
                                        {group.items.map(item => (
                                            <li key={item.itemId._id}>{item.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        );
    };

    const pendingOrders = orders.filter(order => order.status === 'pending');
    const completedPurchases = purchaseHistory;
    const completedSales = salesHistory;

    if (loading) {
        return <OrdersSkeleton />;
    }

    const OrderCard = ({ order, isSale }) => (
        <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50/50">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                        Order #{order._id.slice(-6).toUpperCase()}
                    </CardTitle>
                    <div className="flex items-center space-x-3">
                        <span className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        {order.status === 'completed' && (
                            <span className="flex items-center text-sm text-green-600">
                                <Check className="h-4 w-4 mr-1" />
                                Completed
                            </span>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-6">
                    {order.status === 'pending' && (
                        <OrderOTPSection order={order} />
                    )}

                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div
                                key={item.itemId}
                                className="flex items-center justify-between"
                            >
                                <div>
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {isSale
                                            ? `Buyer: ${order.buyerId?.fullName || 'Unknown Buyer'}`
                                            : (
                                                <div className="flex items-center space-x-2">
                                                    <span>Merchant: {item.sellerId?.fullName || 'Unknown Seller'}</span>
                                                    {!isSale && order.status === 'completed' && (
                                                        <ReviewDialog
                                                            sellerId={item.sellerId?._id}
                                                            sellerName={item.sellerId?.fullName}
                                                            orderId={order._id}
                                                            onReviewSubmitted={fetchOrders}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                </div>
                                <div className="font-medium">
                                    ₹{item.price.toLocaleString('en-IN')}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <span className="font-medium">Total Amount</span>
                        <span className="text-lg font-bold">
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );


    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Orders History</h1>
                <p className="text-muted-foreground mt-1">
                    Track your orders, purchases, and sales
                </p>
            </div>

            <Tabs defaultValue="pending" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending" className="space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Drifting Orders</span>
                    </TabsTrigger>
                    <TabsTrigger value="purchases" className="space-x-2">
                        <Anchor className="h-4 w-4" />
                        <span>Cargo History</span>
                    </TabsTrigger>
                    <TabsTrigger value="sales" className="space-x-2">
                        <Banknote className="h-4 w-4" />
                        <span>Trade History</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-6">
                    {pendingOrders.length > 0 ? (
                        pendingOrders.map(order => (
                            <OrderCard key={order._id} order={order} isSale={true} />
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground">
                            No drifting orders in these waters.
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="purchases" className="space-y-6">
                    {completedPurchases.length > 0 ? (
                        <div className="mb-4">
                            <div className="text-sm text-muted-foreground">
                                Total Haul: {completedPurchases.length}
                                <span className="mx-2">•</span>
                                Treasure Spent: ₹{completedPurchases.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString('en-IN')}
                            </div>
                        </div>
                    ) : null}
                    {completedPurchases.length > 0 ? (
                        completedPurchases.map(order => (
                            <OrderCard key={order._id} order={order} isSale={false} />
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground">
                            No treasures in your chest yet.
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="sales" className="space-y-6">
                    {completedSales.length > 0 ? (<div className="mb-4">
                        <div className="text-sm text-muted-foreground">
                            Total Voyages: {completedSales.length}
                            <span className="mx-2">•</span>
                            Doubloons Earned: ₹{completedSales.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString('en-IN')}
                        </div>
                    </div>) : null}
                    {completedSales.length > 0 ? (
                        completedSales.map(order => (
                            <OrderCard key={order._id} order={order} isSale={true} />
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground">
                            No trades made in these waters yet.
                        </div>
                    )}
                </TabsContent>
            </Tabs>
            <Toaster />
        </div>
    );
};

export default OrdersPage;
