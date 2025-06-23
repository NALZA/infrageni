// UrlStateManager.ts
import LZString from 'lz-string';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

type CanvasState = any; // Replace with tldraw snapshot type if available

const CANVAS_PARAM = 'canvas';
const DEBOUNCE_MS = 500;

function compressState(state: object): string {
  const json = JSON.stringify(state);
  return LZString.compressToEncodedURIComponent(json);
}

function decompressState(param: string): object | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(param);
    if (!json) return null;
    return JSON.parse(json);
  } catch (e) {
    console.error('Failed to decompress/decode canvas state:', e);
    return null;
  }
}

export function useUrlCanvasState(
  getCanvasState: () => CanvasState,
  setCanvasState: (state: CanvasState) => void
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastSerializedRef = useRef<string | null>(null);

  // Always load canvas state from URL when param changes and setCanvasState is stable
  useEffect(() => {
    const param = searchParams.get(CANVAS_PARAM);
    if (param) {
      const state = decompressState(param);
      if (state) {
        setCanvasState(state);
      } else {
        // Malformed state: clear param and load default
        searchParams.delete(CANVAS_PARAM);
        setSearchParams(searchParams, { replace: true });
        setCanvasState(null);
      }
    }
    // eslint-disable-next-line
  }, [searchParams, setCanvasState]);

  // On canvas state change: update URL (debounced)
  useEffect(() => {
    const updateUrl = () => {
      const state = getCanvasState();
      if (!state) return;
      const compressed = compressState(state);
      if (compressed === lastSerializedRef.current) return;
      lastSerializedRef.current = compressed;
      searchParams.set(CANVAS_PARAM, compressed);
      setSearchParams(searchParams, { replace: true });
    };

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(updateUrl, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line
  }, [getCanvasState()]);

  // On URL change: update canvas state if param changes
  useEffect(() => {
    const param = searchParams.get(CANVAS_PARAM);
    if (param && param !== lastSerializedRef.current) {
      const state = decompressState(param);
      if (state) {
        setCanvasState(state);
        lastSerializedRef.current = param;
      }
    }
    // eslint-disable-next-line
  }, [location.search]);
}
