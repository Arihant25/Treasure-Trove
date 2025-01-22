import { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Fish, IndianRupee, Tag, Link, ListCollapse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SellPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const categories = [
        'Electronics',
        'Books',
        'Clothing',
        'Sports',
        "Entertainment",
        'Other'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryChange = (value) => {
        setFormData(prev => ({
            ...prev,
            category: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowSuccess(true);
                setFormData({
                    name: '',
                    price: '',
                    description: '',
                    image: '',
                    category: ''
                });
            } else {
                throw new Error('Failed to create listing');
            }
        } catch (error) {
            console.error('Error creating listing:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <Card className="shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-3xl font-bold text-center text-gray-900">
                            Create New Listing
                        </CardTitle>
                        <CardDescription className="text-center text-gray-600">
                            Share your treasure with the world
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <Fish className="w-4 h-4" />
                                    Item Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="What are you selling?"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price" className="flex items-center gap-2">
                                    <IndianRupee className="w-4 h-4" />
                                    Price
                                </Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category" className="flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    Category
                                </Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={handleCategoryChange}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image" className="flex items-center gap-2">
                                    <Link className="w-4 h-4" />
                                    Image URL
                                </Label>
                                <Input
                                    id="image"
                                    name="image"
                                    placeholder="Enter image URL..."
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="flex items-center gap-2">
                                    <ListCollapse className="w-4 h-4" />
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Describe your item in detail..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="min-h-32"
                                    required
                                />
                            </div>


                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating Listing..." : "Create Listing"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Listing Created Successfully!</AlertDialogTitle>
                            <AlertDialogDescription>
                                Your item has been listed on Treasure Trove. Buyers can now view and purchase your item.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default SellPage;