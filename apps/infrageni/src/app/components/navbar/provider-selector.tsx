import { useAtom } from 'jotai';
import { providerAtom, Provider } from '../../lib/provider-atom';
import { ChevronDown, Cloud } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const PROVIDER_OPTIONS: { value: Provider; label: string; icon?: string }[] = [
    { value: 'generic', label: 'Generic Infra' },
    { value: 'aws', label: 'AWS' },
    { value: 'azure', label: 'Azure' },
    { value: 'gcp', label: 'GCP' },
];

export function ProviderSelector() {
    const [provider, setProvider] = useAtom(providerAtom);
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

    const selectedProvider = PROVIDER_OPTIONS.find(opt => opt.value === provider);

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right
            });
        }
    }, [isOpen]);

    const DropdownPortal = () => {
        if (!isOpen) return null;

        return createPortal(
            <>
                {/* Backdrop */}
                <div
                    className="fixed inset-0 z-[99999]"
                    onClick={() => setIsOpen(false)}
                />                {/* Dropdown */}
                <div
                    className="fixed w-[140px] bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-lg py-1 border border-white/30 dark:border-white/20 z-[100000] shadow-xl"
                    style={{
                        top: dropdownPosition.top,
                        right: dropdownPosition.right,
                    }}
                >{PROVIDER_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => {
                            setProvider(option.value as Provider);
                            setIsOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm transition-all duration-200 hover:bg-white/10 dark:hover:bg-white/5 first:rounded-t-lg last:rounded-b-lg ${option.value === provider
                            ? 'bg-primary/20 text-primary dark:bg-primary/30'
                            : 'text-black/80 dark:text-white/80'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Cloud className="h-4 w-4" />
                            {option.label}
                        </div>
                    </button>
                ))}
                </div>
            </>,
            document.body
        );
    }; return (
        <>
            <div className="relative z-[50000]">
                <button
                    ref={buttonRef}
                    onClick={() => setIsOpen(!isOpen)}
                    className="glass-button glass-button-hover flex items-center gap-2 px-3 py-2 text-sm font-medium min-w-[140px] justify-between"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                >
                    <div className="flex items-center gap-2">
                        <Cloud className="h-4 w-4" />
                        <span>{selectedProvider?.label}</span>
                    </div>
                    <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                            }`}
                    />
                </button>
            </div>
            <DropdownPortal />
        </>
    );
}
