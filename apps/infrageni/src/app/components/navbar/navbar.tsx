import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";
import { ProviderSelector } from './provider-selector';
import { ThemeToggle } from '../ui/theme-toggle';
import { Zap, Menu } from 'lucide-react';
import { useState } from 'react';

export function Navbar({ className }: { className?: string }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className={cn("fixed top-0 left-0 right-0 z-[100] glass-navbar", className)}>
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo and Brand */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Zap className="h-6 w-6 text-primary" />
                            <div className="absolute inset-0 h-6 w-6 text-primary animate-pulse opacity-50" />
                        </div>
                        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            InfraGeni
                        </span>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-1">
                    <Link
                        to="/"
                        className="glass-button glass-button-hover px-3 py-2 text-sm font-medium transition-all duration-200 hover:text-primary"
                    >
                        Home
                    </Link>
                    <Link
                        to="/page-2"
                        className="glass-button glass-button-hover px-3 py-2 text-sm font-medium transition-all duration-200 hover:text-primary"
                    >
                        Page 2
                    </Link>
                    <Link
                        to="/infra-builder"
                        className="glass-button glass-button-hover px-3 py-2 text-sm font-medium transition-all duration-200 hover:text-primary"
                    >
                        Infra Builder
                    </Link>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                    <ProviderSelector />
                    <ThemeToggle />
                    <button
                        className="md:hidden glass-button p-2 rounded-md"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Open navigation menu"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>
            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 glass-navbar shadow-lg p-4 flex flex-col gap-2">
                    <Link
                        to="/"
                        className="glass-button px-4 py-2 rounded-md text-sm font-medium block w-full text-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        to="/page-2"
                        className="glass-button px-4 py-2 rounded-md text-sm font-medium block w-full text-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Page 2
                    </Link>
                    <Link
                        to="/infra-builder"
                        className="glass-button px-4 py-2 rounded-md text-sm font-medium block w-full text-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Infra Builder
                    </Link>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
