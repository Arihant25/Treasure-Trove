import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/toaster"
import { Search, PackageSearch } from 'lucide-react';
import { cn } from "@/lib/utils";
import ItemCard from '@/components/ItemCard';

const categories = [
    'Electronics',
    'Books',
    'Clothing',
    'Sports',
    "Entertainment",
    'Other'
];

const SearchPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [maxPrice, setMaxPrice] = useState(50000);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const queryParams = new URLSearchParams();

            if (searchQuery) {
                queryParams.append('search', searchQuery);
            }

            if (selectedCategories.length > 0) {
                queryParams.append('categories', selectedCategories.join(','));
            }

            queryParams.append('minPrice', 0);
            queryParams.append('maxPrice', maxPrice);

            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            const response = await fetch(`${backendUrl}/api/items?${queryParams}`);
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [searchQuery, selectedCategories, maxPrice]);

    const handleCategoryToggle = (category) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            }
            return [...prev, category];
        });
    };

    const handleItemClick = (itemId) => {
        navigate(`/items/${itemId}`);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Enhanced Filters Sidebar */}
                <div className="w-full md:w-72 space-y-6">
                    <Card className="sticky top-8">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">Filters</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Categories */}
                            <div>
                                <h3 className="text-sm font-medium mb-3">Categories</h3>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(category => (
                                        <Badge
                                            key={category}
                                            variant={selectedCategories.includes(category) ? "default" : "outline"}
                                            className={cn(
                                                "cursor-pointer transition-all",
                                                selectedCategories.includes(category)
                                                    ? "bg-primary hover:bg-primary/80"
                                                    : "hover:border-primary"
                                            )}
                                            onClick={() => handleCategoryToggle(category)}
                                        >
                                            {category}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Maximum Price Slider */}
                            <div>
                                <h3 className="text-sm font-medium mb-3">Maximum Price</h3>
                                <Slider
                                    defaultValue={[50000]}
                                    max={50000}
                                    step={100}
                                    value={[maxPrice]}
                                    onValueChange={(value) => setMaxPrice(value[0])}
                                    className="mt-6"
                                />
                                <div className="flex justify-between mt-2 text-sm text-gray-600">
                                    <span>{formatPrice(0)}</span>
                                    <span>{formatPrice(maxPrice)}</span>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 text-lg"
                        />
                    </div>

                    {/* Items Grid with Modern Empty State */}
                    {loading ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="animate-pulse space-y-3">
                                <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto" />
                                <div className="h-4 w-24 bg-gray-200 rounded mx-auto" />
                            </div>
                        </div>
                    ) : items.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map(item => (
                                <ItemCard
                                    key={item._id}
                                    item={item}
                                    onClick={() => handleItemClick(item._id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                            <PackageSearch className="h-16 w-16 text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No items found
                            </h3>
                            <p className="text-gray-500 max-w-md">
                                Try adjusting your filters or search terms.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Toaster classname="text-xl" />
        </div>
    );
};

export default SearchPage;