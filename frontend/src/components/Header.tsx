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
    Sailboat
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

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

    return (
        <>
            <nav className="border-b"></nav>
            <div className="container mx-auto py-4 flex items-center justify-between">
                <Link to="/" className="hover:text-blue-500">
                    <div className="flex items-center space-x-2 ">
                        <Ship />
                        <span className="text-xl font-bold">Treasure Trove</span>
                    </div>
                </Link>
                <div className="flex items-center space-x-3">
                    {isLoggedIn ? (
                        <>
                            <Link to="/search">
                                <Button variant="link">
                                    <Compass className="mr-2 h-4 w-4" />
                                    Explore
                                </Button>
                            </Link>
                            <Link to="/orders">
                                <Button variant="link">
                                    <Scroll className="mr-2 h-4 w-4" />
                                    My Orders
                                </Button>
                            </Link>
                            <Link to="/deliver">
                                <Button variant="link">
                                    <Sailboat className="mr-2 h-4 w-4" />
                                    Deliver
                                </Button>
                            </Link>
                            <Link to="/sell">
                                <Button variant="link">
                                    <HandCoins className="mr-2 h-4 w-4" />
                                    Sell
                                </Button>
                            </Link>
                            <Link to="/cart">
                                <Button variant="link">
                                    <Package className="mr-2 h-4 w-4" />
                                    Cart
                                </Button>
                            </Link>
                            <Link to="/support">
                                <Button variant="link">
                                    <Bird className="mr-2 h-4 w-4" />
                                    Support
                                </Button>
                            </Link>
                            <Link to="/profile">
                                <Button>
                                    <UserCircle className="mr-2 h-4 w-4" />
                                    Profile
                                </Button>
                            </Link>
                            <Button variant="outline" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="default">
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Login
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="outline">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;