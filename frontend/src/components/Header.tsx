import { Button } from '@/components/ui/button';
import {
    Ship,
    Compass,
    Scroll,
    Package,
    Bird,
    UserCircle,
    LogOut,
    LogIn,
    UserPlus,
    HandCoins,
    Sailboat,
    Menu
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        window.location.href = "/"
    };

    const NavItems = ({ className = "", onClick = () => { } }) => (
        <div className={`flex ${className}`}>
            {isLoggedIn ? (
                <>
                    <Link to="/search" onClick={onClick}>
                        <Button variant="link">
                            <Compass className="mr-2 h-4 w-4" />
                            Explore
                        </Button>
                    </Link>
                    <Link to="/orders" onClick={onClick}>
                        <Button variant="link">
                            <Scroll className="mr-2 h-4 w-4" />
                            My Orders
                        </Button>
                    </Link>
                    <Link to="/deliver" onClick={onClick}>
                        <Button variant="link">
                            <Sailboat className="mr-2 h-4 w-4" />
                            Deliver
                        </Button>
                    </Link>
                    <Link to="/sell" onClick={onClick}>
                        <Button variant="link">
                            <HandCoins className="mr-2 h-4 w-4" />
                            Sell
                        </Button>
                    </Link>
                    <Link to="/cart" onClick={onClick}>
                        <Button variant="link">
                            <Package className="mr-2 h-4 w-4" />
                            Cart
                        </Button>
                    </Link>
                    <Link to="/support" onClick={onClick}>
                        <Button variant="link">
                            <Bird className="mr-2 h-4 w-4" />
                            Support
                        </Button>
                    </Link>
                    <Link to="/profile" onClick={onClick}>
                        <Button>
                            <UserCircle className="mr-2 h-4 w-4" />
                            Profile
                        </Button>
                    </Link>
                    <Button variant="outline" onClick={() => { handleLogout(); onClick(); }}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </>
            ) : (
                <>
                    <Link to="/login" onClick={onClick}>
                        <Button variant="default">
                            <LogIn className="mr-2 h-4 w-4" />
                            Login
                        </Button>
                    </Link>
                    <Link to="/register" onClick={onClick}>
                        <Button variant="outline">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Sign Up
                        </Button>
                    </Link>
                </>
            )}
        </div>
    );

    return (
        <>
            <nav className="border-b">
                <div className="container mx-auto py-4 flex items-center justify-between">
                    <Link to="/" className="hover:text-blue-500">
                        <div className="flex items-center space-x-2 mx-2">
                            <Ship />
                            <span className="text-xl font-bold">Treasure Trove</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-3">
                        <NavItems className="items-center space-x-3" />
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden mx-6">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <div className="mt-6">
                                    <NavItems
                                        className="flex-col space-y-3"
                                        onClick={() => {
                                            const closeButton = document.querySelector('[data-radix-collection-item]');
                                            if (closeButton) closeButton.click();
                                        }}
                                    />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;