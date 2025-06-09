import { atom } from 'jotai';

export type Provider = 'aws' | 'azure' | 'gcp' | 'generic';

export const providerAtom = atom<Provider>('generic');
