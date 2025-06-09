import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";
import { ProviderSelector } from './provider-selector';

export function Navbar({ className }: { className?: string }) {
    return (
        <nav className={cn("w-full bg-card border-b px-6 py-3 flex items-center justify-between", className)}>
            <div className="flex items-center gap-4">
                <span className="font-bold text-lg tracking-tight">InfraGeni</span>
                <Link to="/" className="hover:underline text-muted-foreground">Home</Link>
                <Link to="/page-2" className="hover:underline text-muted-foreground">Page 2</Link>
                <Link to="/infra-builder" className="hover:underline text-muted-foreground">Infra Builder</Link>
            </div>
            <div className="flex items-center gap-2">
                <ProviderSelector />
                {/* Add user/account/actions here if needed */}
            </div>
        </nav>
    );
}

export default Navbar;
