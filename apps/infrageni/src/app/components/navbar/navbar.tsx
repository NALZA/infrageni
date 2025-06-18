import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";
import { ProviderSelector } from './provider-selector';
import { useState } from 'react';
import { Button } from '../../ui/button';
import { Sun, Moon } from 'lucide-react';

export function Navbar({ className }: { className?: string }) {
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
    const toggleTheme = () => {
        const root = document.documentElement;
        if (root.classList.contains('dark')) {
            root.classList.remove('dark');
            setIsDark(false);
        } else {
            root.classList.add('dark');
            setIsDark(true);
        }
    };
    return (
        <nav className={cn("w-full px-6 py-3 flex items-center justify-between hero-glass", className)}>
            <div className="flex items-center gap-4">
                <span className="font-bold text-lg tracking-tight">InfraGeni</span>
                <Link to="/" className="hover:underline text-muted-foreground">Home</Link>
                <Link to="/page-2" className="hover:underline text-muted-foreground">Page 2</Link>
                <Link to="/infra-builder" className="hover:underline text-muted-foreground">Infra Builder</Link>
            </div>
            <div className="flex items-center gap-2">
                <ProviderSelector />
                <Button variant="outline" size="icon" onClick={toggleTheme} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                {/* Add user/account/actions here if needed */}
            </div>
        </nav>
    );
}

export default Navbar;
