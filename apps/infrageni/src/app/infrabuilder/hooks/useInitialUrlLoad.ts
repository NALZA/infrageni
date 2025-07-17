import { StoreSnapshot, TLRecord, useEditor } from 'tldraw';
import LZString from 'lz-string';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const CANVAS_PARAM = 'canvas';

// Decompresses a string from a URL parameter into a state object
function decompressState<T>(param: string): T | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(param);
    if (!json) return null;
    return JSON.parse(json) as T;
  } catch (error) {
    console.error('Failed to decompress/decode state:', error);
    return null;
  }
}

/**
 * A hook that only loads canvas state from URL on initial load
 * Used for sharing functionality without continuous URL synchronization
 */
export function useInitialUrlLoad() {
  const editor = useEditor();
  const [searchParams, setSearchParams] = useSearchParams();
  const hasLoadedRef = useRef(false);

  // Effect to load state from URL only once on mount
  useEffect(() => {
    if (hasLoadedRef.current) return;
    
    const canvasParam = searchParams.get(CANVAS_PARAM);
    if (!canvasParam) return;

    const snapshot = decompressState<StoreSnapshot<TLRecord>>(canvasParam);
    if (snapshot) {
      try {
        // Validate snapshot structure before loading
        if (snapshot.store && typeof snapshot.store === 'object') {
          editor.store.loadSnapshot(snapshot);
          hasLoadedRef.current = true;
        } else {
          console.warn('Invalid snapshot structure from URL');
          // Remove invalid parameter
          const newParams = new URLSearchParams(searchParams);
          newParams.delete(CANVAS_PARAM);
          setSearchParams(newParams, { replace: true });
        }
      } catch (error) {
        console.error('Error loading snapshot from URL:', error);
        // If loading fails, remove the invalid parameter from the URL
        const newParams = new URLSearchParams(searchParams);
        newParams.delete(CANVAS_PARAM);
        setSearchParams(newParams, { replace: true });
      }
    }
  }, [editor, searchParams, setSearchParams]);
}