import { useAtom } from 'jotai';
import { providerAtom, Provider } from '../../lib/provider-atom';

const PROVIDER_OPTIONS: { value: Provider; label: string }[] = [
    { value: 'generic', label: 'Generic Infra' },
    { value: 'aws', label: 'AWS' },
    { value: 'azure', label: 'Azure' },
    { value: 'gcp', label: 'GCP' },
];

export function ProviderSelector() {
    const [provider, setProvider] = useAtom(providerAtom);
    return (
        <div className="w-full flex items-center gap-2 px-6 py-2 bg-card border-b">
            <label htmlFor="provider-select" className="font-medium text-sm">
                Provider:
            </label>
            <select
                id="provider-select"
                value={provider}
                onChange={(e) => setProvider(e.target.value as Provider)}
                className="border rounded px-2 py-1 bg-card text-foreground"
            >
                {PROVIDER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
