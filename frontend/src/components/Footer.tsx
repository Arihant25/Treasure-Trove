import { Ship } from 'lucide-react';

const Footer = () =>
    <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Ship />
                    <span className="font-semibold">Treasure Trove</span>
                </div>
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Treasure Trove. All rights reserved.
                </p>
            </div>
        </div>
    </footer>


export default Footer;