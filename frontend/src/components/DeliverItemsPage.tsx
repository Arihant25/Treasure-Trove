import { useState, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Fish, PackageCheck, User, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeliveryPageSkeleton from './skeletons/DeliveryPageSkeleton';

const DeliverItemsPage = () => {
    const { toast } = useToast();
    const [pendingDeliveries, setPendingDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [otp, setOtp] = useState('');
    const [verifying, setVerifying] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchPendingDeliveries();
    }, []);

    const fetchPendingDeliveries = async () => {
        try {
            // Add artificial delay
            await new Promise(resolve => setTimeout(resolve, import.meta.env.VITE_FAKE_LOADING_TIME));

            const token = localStorage.getItem('token');
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/orders/pending-deliveries`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPendingDeliveries(data);
            } else {
                throw new Error('Failed to fetch pending deliveries');
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load pending deliveries"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp || !selectedOrder) return;

        setVerifying(true);
        try {
            const token = localStorage.getItem('token');
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            const response = await fetch(`${backendUrl}/api/orders/verify-otp`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderId: selectedOrder._id,
                    otp: otp
                })
            });

            if (response.ok) {
                const data = await response.json();
                toast({
                    title: "Success",
                    description: "Order completed successfully"
                });
                setSelectedOrder(null);
                setOtp('');
                fetchPendingDeliveries();
            } else {
                const data = await response.json();
                throw new Error(data.message || 'Failed to verify OTP');
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message
            });
        } finally {
            setVerifying(false);
        }
    };

    if (loading) {
        return <DeliveryPageSkeleton />;
    }

    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Pending Deliveries</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your pending orders and deliveries
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Fish className="h-5 w-5" />
                    <span className="font-medium">{pendingDeliveries.length} pending</span>
                </div>
            </div>

            <div className="space-y-6">
                {pendingDeliveries.map((order) => (
                    <Card key={order._id} className="overflow-hidden">
                        <CardHeader className="bg-gray-50/50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">
                                    Order #{order._id.slice(-6).toUpperCase()}
                                </CardTitle>
                                <div className="text-sm text-muted-foreground">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">{order.buyerId.fullName}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {order.buyerId.email}
                                        </div>
                                    </div>
                                    <div className="ml-auto flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{order.buyerId.contactNumber}</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    {order.items
                                        .filter(item => item.sellerId.toString() === localStorage.getItem('userId'))
                                        .map((item) => (
                                            <div
                                                key={item.itemId}
                                                className="flex items-center justify-between"
                                            >
                                                <div>
                                                    <div className="font-medium">{item.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Item ID: {item.itemId}
                                                    </div>
                                                </div>
                                                <div className="font-medium">
                                                    ₹{item.price.toLocaleString('en-IN')}
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        variant="default"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <PackageCheck className="mr-2 h-4 w-4" />
                                        Complete Delivery
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {pendingDeliveries.length === 0 && (
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Fish className="h-12 w-12 mx-auto text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-medium">No Pending Deliveries</h3>
                            <p className="text-muted-foreground">
                                You don't have any pending orders to deliver at the moment.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Verify OTP</DialogTitle>
                        <DialogDescription>
                            Enter the OTP provided by the buyer to complete this delivery.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <Input
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSelectedOrder(null);
                                setOtp('');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleVerifyOTP}
                            disabled={verifying || otp.length !== 6}
                        >
                            {verifying ? 'Verifying...' : 'Complete Delivery'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Toaster />
        </div>
    );
};

export default DeliverItemsPage;