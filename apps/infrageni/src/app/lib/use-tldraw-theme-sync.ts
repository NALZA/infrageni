import { useEditor } from 'tldraw';
import { useTheme } from './theme-context';
import { useEffect } from 'react';

/**
 * A hook that synchronizes tldraw's theme with your application's theme.
 * Use this hook in components that have access to the tldraw editor.
 */
export function useTldrawThemeSync() {
  const editor = useEditor();
  const { isDark } = useTheme();

  useEffect(() => {
    if (editor) {
      // Update tldraw's user preferences to match our theme
      editor.user.updateUserPreferences({
        colorScheme: isDark ? 'dark' : 'light',
      });
    }
  }, [editor, isDark]);
}
