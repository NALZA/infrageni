import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import LZString from 'lz-string';
import { useUrlStateWithTldraw } from './useUrlStateWithTldraw';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useSearchParams: vi.fn(),
}));

vi.mock('lz-string', () => ({
  default: {
    compressToEncodedURIComponent: vi.fn(),
    decompressFromEncodedURIComponent: vi.fn(),
  },
}));

vi.mock('tldraw', () => ({
  useEditor: vi.fn(),
  StoreSnapshot: {},
  TLRecord: {},
}));

const mockEditor = {
  store: {
    loadSnapshot: vi.fn(),
    listen: vi.fn(),
    getSnapshot: vi.fn(),
  },
};

const mockSearchParams = new URLSearchParams();
const mockSetSearchParams = vi.fn();

describe('useUrlStateWithTldraw', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    (useSearchParams as any).mockReturnValue([mockSearchParams, mockSetSearchParams]);
    
    // Mock tldraw editor
    vi.doMock('tldraw', () => ({
      useEditor: () => mockEditor,
    }));
  });

  it('should load state from URL on mount', async () => {
    const testSnapshot = { records: [{ id: 'test', type: 'shape' }] };
    const compressed = 'compressed-state';
    
    mockSearchParams.set('canvas', compressed);
    (LZString.compressToEncodedURIComponent as any).mockReturnValue(compressed);
    (LZString.decompressFromEncodedURIComponent as any).mockReturnValue(JSON.stringify(testSnapshot));

    const { rerender } = renderHook(() => useUrlStateWithTldraw());

    expect(LZString.decompressFromEncodedURIComponent).toHaveBeenCalledWith(compressed);
    expect(mockEditor.store.loadSnapshot).toHaveBeenCalledWith(testSnapshot);
  });

  it('should handle malformed state in URL', async () => {
    const malformedState = 'malformed-state';
    
    mockSearchParams.set('canvas', malformedState);
    (LZString.decompressFromEncodedURIComponent as any).mockReturnValue(null);

    const { rerender } = renderHook(() => useUrlStateWithTldraw());

    expect(mockEditor.store.loadSnapshot).not.toHaveBeenCalled();
    expect(mockSetSearchParams).toHaveBeenCalledWith(
      expect.any(URLSearchParams),
      { replace: true }
    );
  });

  it('should handle JSON parse errors', async () => {
    const invalidJson = 'invalid-json';
    
    mockSearchParams.set('canvas', invalidJson);
    (LZString.decompressFromEncodedURIComponent as any).mockReturnValue('invalid json');

    const { rerender } = renderHook(() => useUrlStateWithTldraw());

    expect(mockEditor.store.loadSnapshot).not.toHaveBeenCalled();
  });

  it('should set up store listener', () => {
    const mockCleanup = vi.fn();
    mockEditor.store.listen.mockReturnValue(mockCleanup);

    const { unmount } = renderHook(() => useUrlStateWithTldraw());

    expect(mockEditor.store.listen).toHaveBeenCalledWith(expect.any(Function));

    unmount();
    expect(mockCleanup).toHaveBeenCalled();
  });

  it('should debounce state updates', () => {
    vi.useFakeTimers();
    
    const testSnapshot = { records: [{ id: 'test', type: 'shape' }] };
    const compressed = 'compressed-state';
    
    mockEditor.store.getSnapshot.mockReturnValue(testSnapshot);
    (LZString.compressToEncodedURIComponent as any).mockReturnValue(compressed);

    const mockCleanup = vi.fn();
    let storeListener: Function;
    
    mockEditor.store.listen.mockImplementation((listener) => {
      storeListener = listener;
      return mockCleanup;
    });

    renderHook(() => useUrlStateWithTldraw());

    // Trigger store change
    act(() => {
      storeListener();
    });

    // Should not update immediately
    expect(mockSetSearchParams).not.toHaveBeenCalled();

    // Fast forward past debounce time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockEditor.store.getSnapshot).toHaveBeenCalled();
    expect(LZString.compressToEncodedURIComponent).toHaveBeenCalledWith(JSON.stringify(testSnapshot));
    expect(mockSetSearchParams).toHaveBeenCalledWith(
      expect.any(URLSearchParams),
      { replace: true }
    );

    vi.useRealTimers();
  });

  it('should not update URL if compressed state is same', () => {
    vi.useFakeTimers();
    
    const testSnapshot = { records: [{ id: 'test', type: 'shape' }] };
    const compressed = 'same-compressed-state';
    
    mockEditor.store.getSnapshot.mockReturnValue(testSnapshot);
    (LZString.compressToEncodedURIComponent as any).mockReturnValue(compressed);

    const mockCleanup = vi.fn();
    let storeListener: Function;
    
    mockEditor.store.listen.mockImplementation((listener) => {
      storeListener = listener;
      return mockCleanup;
    });

    const { rerender } = renderHook(() => useUrlStateWithTldraw());

    // First update
    act(() => {
      storeListener();
      vi.advanceTimersByTime(500);
    });

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
    mockSetSearchParams.mockClear();

    // Second update with same state
    act(() => {
      storeListener();
      vi.advanceTimersByTime(500);
    });

    expect(mockSetSearchParams).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('should handle compression errors', () => {
    vi.useFakeTimers();
    
    const testSnapshot = { records: [{ id: 'test', type: 'shape' }] };
    
    mockEditor.store.getSnapshot.mockReturnValue(testSnapshot);
    (LZString.compressToEncodedURIComponent as any).mockImplementation(() => {
      throw new Error('Compression failed');
    });

    const mockCleanup = vi.fn();
    let storeListener: Function;
    
    mockEditor.store.listen.mockImplementation((listener) => {
      storeListener = listener;
      return mockCleanup;
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderHook(() => useUrlStateWithTldraw());

    act(() => {
      storeListener();
      vi.advanceTimersByTime(500);
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to compress state:', expect.any(Error));
    expect(mockSetSearchParams).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
    vi.useRealTimers();
  });

  it('should prevent re-applying same state from URL', () => {
    const testSnapshot = { records: [{ id: 'test', type: 'shape' }] };
    const compressed = 'compressed-state';
    
    mockSearchParams.set('canvas', compressed);
    (LZString.decompressFromEncodedURIComponent as any).mockReturnValue(JSON.stringify(testSnapshot));

    const { rerender } = renderHook(() => useUrlStateWithTldraw());

    expect(mockEditor.store.loadSnapshot).toHaveBeenCalledTimes(1);
    mockEditor.store.loadSnapshot.mockClear();

    // Re-render with same URL param
    rerender();

    expect(mockEditor.store.loadSnapshot).not.toHaveBeenCalled();
  });
});