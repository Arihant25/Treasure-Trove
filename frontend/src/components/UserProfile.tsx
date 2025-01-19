import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Mail, Phone, Calendar, Lock, Pencil, Star, BadgeCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState({
        age: false,
        contactNumber: false,
        password: false
    });

    const [newValues, setNewValues] = useState({
        age: '',
        contactNumber: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    // Fetch user data and reviews
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const [userResponse, reviewsResponse] = await Promise.all([
                fetch(`${backendURL}/api/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${backendURL}/api/reviews/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
            ]);

            if (!userResponse.ok || !reviewsResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const userData = await userResponse.json();
            const reviewsData = await reviewsResponse.json();

            setUser(userData);
            setReviews(reviewsData);
            setNewValues(prev => ({
                ...prev,
                age: userData.age,
                contactNumber: userData.contactNumber
            }));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [navigate]);

    const handleUpdate = async (field) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendURL}/api/auth/update/${field}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ [field]: newValues[field] }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Update failed');
            }

            setUser(prev => ({ ...prev, [field]: newValues[field] }));
            setIsEditing(prev => ({ ...prev, [field]: false }));
            setSuccess(`${field === 'age' ? 'Age' : 'Contact Number'} updated successfully!`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handlePasswordUpdate = async () => {
        if (newValues.newPassword !== newValues.confirmPassword) {
            setError("Passwords don't match!");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendURL}/api/auth/update/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: newValues.currentPassword,
                    newPassword: newValues.newPassword
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Password update failed');
            }

            setIsEditing(prev => ({ ...prev, password: false }));
            setNewValues(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
            setSuccess('Password updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user) {
        return <div className="flex justify-center items-center h-screen">User not found</div>;
    }

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <Star
                key={index}
                className={`h-4 w-4 ${index < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Header Card */}
                <Card className="col-span-3 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardHeader className="flex flex-row items-center gap-6">
                        <Avatar className="h-24 w-24 border-2 border-white shadow-lg">
                            <AvatarImage src="/avatar-placeholder.jpg" />
                            <AvatarFallback className="text-lg">{user.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-2">
                            <CardTitle className="text-3xl font-bold">{user.fullName}</CardTitle>
                            <div className="flex items-center gap-2">
                                <div className="flex">{renderStars(user.rating)}</div>
                                <span className="text-sm text-gray-600">({user.rating.toFixed(1)})</span>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Left Column - Personal Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">{user.email}</span>
                                        {user.isCAS || (
                                            <div className="relative group">
                                                <BadgeCheck className="h-4 w-4 text-gray-500 " />
                                                <span className="absolute bottom-full w-16 left-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">Verified with IIIT</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">
                                            {isEditing.age ? (
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="number"
                                                        value={newValues.age}
                                                        onChange={(e) => setNewValues(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                                                        className="w-20"
                                                    />
                                                    <Button size="sm" onClick={() => handleUpdate('age')}>Save</Button>
                                                    <Button size="sm" variant="outline"
                                                        onClick={() => {
                                                            setIsEditing(prev => ({ ...prev, age: false }));
                                                            setNewValues(prev => ({ ...prev, age: user.age }));
                                                        }}>
                                                        Cancel
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span>{user.age} {user.age === 1 ? 'year' : 'years'} old</span>
                                                    <div
                                                        className="cursor-pointer inline-flex items-center justify-center relative group"
                                                        onClick={() => setIsEditing(prev => ({ ...prev, age: true }))}
                                                    >
                                                        <Pencil className="h-4 w-4 text-gray-500" />
                                                        <span className="absolute bottom-full left-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 transform -translate-x-1/2">Edit</span>
                                                    </div>

                                                </div>
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        {isEditing.contactNumber ? (
                                            <div className="flex gap-2">
                                                <Input
                                                    type="text"
                                                    value={newValues.contactNumber}
                                                    onChange={(e) => setNewValues(prev => ({ ...prev, contactNumber: e.target.value }))}
                                                    className="w-32"
                                                />
                                                <Button size="sm" onClick={() => handleUpdate('contactNumber')}>Save</Button>
                                                <Button size="sm" variant="outline"
                                                    onClick={() => {
                                                        setIsEditing(prev => ({ ...prev, contactNumber: false }));
                                                        setNewValues(prev => ({ ...prev, contactNumber: user.contactNumber }));
                                                    }}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">{user.contactNumber}</span>
                                                <div
                                                    className="cursor-pointer inline-flex items-center justify-center relative group"
                                                    onClick={() => setIsEditing(prev => ({ ...prev, contactNumber: true }))}
                                                >
                                                    <Pencil className="h-4 w-4 text-gray-500" />
                                                    <span className="absolute bottom-full left-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 transform -translate-x-1/2">Edit</span>
                                                </div>

                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Security</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Dialog open={isEditing.password} onOpenChange={(open) => setIsEditing(prev => ({ ...prev, password: open }))}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full">
                                        <Lock className="h-4 w-4 mr-2" />
                                        Change Password
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Change Password</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Current Password</Label>
                                            <Input
                                                type="password"
                                                value={newValues.currentPassword}
                                                onChange={(e) => setNewValues(prev => ({ ...prev, currentPassword: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>New Password</Label>
                                            <Input
                                                type="password"
                                                value={newValues.newPassword}
                                                onChange={(e) => setNewValues(prev => ({ ...prev, newPassword: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Confirm New Password</Label>
                                            <Input
                                                type="password"
                                                value={newValues.confirmPassword}
                                                onChange={(e) => setNewValues(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            />
                                        </div>
                                        <Button className="w-full" onClick={handlePasswordUpdate}>
                                            Update Password
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Reviews */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl">Reviews</CardTitle>
                        <CardDescription>What others are saying</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[600px] pr-4">
                            <div className="space-y-6">
                                {reviews.map((review, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>
                                                        {review.userId.fullName.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">{review.userId.fullName}</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex">
                                                            {renderStars(review.rating)}
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                                month: 'long',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant="secondary">
                                                {review.serviceType}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 pl-10">
                                            {review.comment}
                                        </p>
                                        {index < reviews.length - 1 && (
                                            <Separator className="mt-4" />
                                        )}
                                    </div>
                                ))}
                                {reviews.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No reviews yet</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserProfile;