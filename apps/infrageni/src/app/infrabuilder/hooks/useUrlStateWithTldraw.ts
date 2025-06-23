import { StoreSnapshot, TLRecord, useEditor } from 'tldraw';
import LZString from 'lz-string';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const CANVAS_PARAM = 'canvas';
const DEBOUNCE_MS = 500;

// Compresses a state object into a URL-safe string
function compressState(state: unknown): string {
  try {
    const json = JSON.stringify(state);
    return LZString.compressToEncodedURIComponent(json);
  } catch (error) {
    console.error('Failed to compress state:', error);
    return '';
  }
}

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
 * A hook to synchronize the tldraw canvas state with a URL parameter.
 * It handles serialization, compression, and debouncing.
 */
export function useUrlStateWithTldraw() {
  const editor = useEditor();
  const [searchParams, setSearchParams] = useSearchParams();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastCompressedState = useRef<string | null>(null);

  // Effect to load state from URL when the component mounts or URL changes
  useEffect(() => {
    const canvasParam = searchParams.get(CANVAS_PARAM);

    // Prevent re-applying the same state
    if (!canvasParam || canvasParam === lastCompressedState.current) {
      return;
    }

    const snapshot = decompressState<StoreSnapshot<TLRecord>>(canvasParam);

    if (snapshot) {
      try {
        // Load the snapshot into the editor
        editor.store.loadSnapshot(snapshot);
        lastCompressedState.current = canvasParam;
      } catch (error) {
        console.error('Error loading snapshot from URL:', error);
        // If loading fails, remove the invalid parameter from the URL
        const newParams = new URLSearchParams(searchParams);
        newParams.delete(CANVAS_PARAM);
        setSearchParams(newParams, { replace: true });
      }
    }
  }, [editor, searchParams, setSearchParams]);

  // Effect to listen for changes in the editor and update the URL
  useEffect(() => {
    // This effect runs once and sets up the listener
    const handleChange = () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        const snapshot = editor.store.getSnapshot();
        const compressed = compressState(snapshot);

        // Only update the URL if the state has actually changed
        if (compressed && compressed !== lastCompressedState.current) {
          lastCompressedState.current = compressed;
          const newParams = new URLSearchParams(searchParams);
          newParams.set(CANVAS_PARAM, compressed);
          setSearchParams(newParams, { replace: true });
        }
      }, DEBOUNCE_MS);
    };

    // Subscribe to changes in the tldraw store
    const cleanupListener = editor.store.listen(handleChange);

    return () => {
      // Clean up the listener and any pending timeout
      cleanupListener();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [editor, searchParams, setSearchParams]);
}
