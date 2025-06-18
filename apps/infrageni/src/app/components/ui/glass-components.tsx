import { cn } from "../../lib/utils";
import { forwardRef } from "react";

// Glass Card Component
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'hover' | 'modal';
    blur?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, variant = 'default', blur = 'md', children, ...props }, ref) => {
        const variants = {
            default: 'glass-card',
            hover: 'glass-card glass-card-hover',
            modal: 'glass-modal',
        };

        const blurClasses = {
            sm: 'backdrop-blur-[6px]',
            md: 'backdrop-blur-[8px]',
            lg: 'backdrop-blur-[12px]',
            xl: 'backdrop-blur-[16px]',
        };

        return (
            <div
                ref={ref}
                className={cn(variants[variant], blurClasses[blur], className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);

GlassCard.displayName = "GlassCard";

// Glass Button Component
interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'primary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
    ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
        const variants = {
            default: 'glass-button glass-button-hover',
            primary: 'bg-primary/20 hover:bg-primary/30 border-primary/30 text-primary font-medium',
            outline: 'glass-button glass-button-hover border-2',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-sm',
            lg: 'px-6 py-3 text-base',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

GlassButton.displayName = "GlassButton";

// Glass Input Component
interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
    ({ className, label, id, ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-sm font-medium text-glass-light-text dark:text-glass-dark-text"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={cn(
                        'glass-input w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200',
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);

GlassInput.displayName = "GlassInput";

// Glass Modal Component
interface GlassModalProps extends React.HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

export const GlassModal = forwardRef<HTMLDivElement, GlassModalProps>(
    ({ className, isOpen, onClose, title, children, ...props }, ref) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <div
                    ref={ref}
                    className={cn(
                        'glass-modal relative max-w-lg w-full max-h-[90vh] overflow-auto',
                        className
                    )}
                    {...props}
                >
                    {title && (
                        <div className="px-6 py-4 border-b border-white/10">
                            <h2 className="text-lg font-semibold text-glass-light-text dark:text-glass-dark-text">
                                {title}
                            </h2>
                        </div>
                    )}
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        );
    }
);

GlassModal.displayName = "GlassModal";

// Glass Navigation Item
interface GlassNavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    isActive?: boolean;
}

export const GlassNavItem = forwardRef<HTMLAnchorElement, GlassNavItemProps>(
    ({ className, isActive, children, ...props }, ref) => {
        return (
            <a
                ref={ref}
                className={cn(
                    'glass-button glass-button-hover px-3 py-2 text-sm font-medium transition-all duration-200',
                    isActive && 'bg-primary/20 text-primary border-primary/30',
                    className
                )}
                {...props}
            >
                {children}
            </a>
        );
    }
);

GlassNavItem.displayName = "GlassNavItem";
