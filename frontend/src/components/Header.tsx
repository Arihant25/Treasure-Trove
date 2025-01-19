import { Button } from '@/components/ui/button';
import { Ship } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if JWT exists in localStorage or sessionStorage
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true); // User is logged in if token exists
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the JWT on logout
        setIsLoggedIn(false); // Update the state to reflect the user is logged out
        window.location.href = "/"
    };

    return (
        <nav className="border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/">
                    <div className="flex items-center space-x-2">
                        <Ship />
                        <span className="text-xl font-bold">Treasure Trove</span>
                    </div>
                </Link>
                <div className="flex items-center space-x-6">
                    {isLoggedIn ? (
                        <>
                            <Link to="/profile">
                                <Button variant="default">Profile</Button>
                            </Link>
                            <Button variant="outline" onClick={handleLogout}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="default">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="outline">Sign Up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;
