# TLDraw Theme Integration

This document describes how the application integrates TLDraw's theme system with the global application theme.

## Overview

The application now synchronizes TLDraw's dark/light mode with the global application theme. When a user toggles between light and dark mode using the theme toggle button, TLDraw will automatically switch to match the selected theme.

## Implementation

### 1. Theme Context

We created a centralized theme context (`src/app/lib/theme-context.tsx`) that:
- Manages the global theme state (light/dark)
- Persists theme preference in localStorage
- Detects system theme preference on initial load
- Provides theme state and toggle functionality

### 2. TLDraw Theme Sync Hook

We created a custom hook (`src/app/lib/use-tldraw-theme-sync.ts`) that:
- Automatically syncs TLDraw's theme with the global theme
- Uses TLDraw's `editor.user.updateUserPreferences()` API
- Updates the `colorScheme` preference when the theme changes

### 3. Integration Points

#### Main App Structure
```
main.tsx
├── ThemeProvider (wraps entire app)
└── App.tsx
    ├── Navbar (contains ThemeToggle)
    └── InfraBuilder
        └── Canvas (contains TLDraw with theme sync)
```

#### Theme Toggle Component
- Located in `src/app/components/ui/theme-toggle.tsx`
- Uses the theme context to toggle between light/dark modes
- Updates both the application theme and localStorage

#### Canvas Component
- Located in `src/app/infrabuilder/canvas.tsx`
- Uses `useTldrawThemeSync()` hook in the DropZone component
- Automatically synchronizes TLDraw theme when global theme changes

## Usage

### For Users
1. Click the theme toggle button in the navbar (sun/moon icon)
2. Both the application UI and TLDraw canvas will switch themes
3. Theme preference is remembered between sessions

### For Developers

To use the theme system in other components:

```tsx
import { useTheme } from '../lib/theme-context';

function MyComponent() {
  const { theme, isDark, toggleTheme } = useTheme();
  
  return (
    <div className={isDark ? 'dark-styles' : 'light-styles'}>
      <button onClick={toggleTheme}>
        {isDark ? 'Switch to Light' : 'Switch to Dark'}
      </button>
    </div>
  );
}
```

To sync TLDraw theme in components with editor access:

```tsx
import { useTldrawThemeSync } from '../lib/use-tldraw-theme-sync';

function TldrawComponent() {
  useTldrawThemeSync(); // Automatically syncs theme
  
  return (
    <Tldraw>
      {/* Your TLDraw content */}
    </Tldraw>
  );
}
```

## Technical Details

### Theme Synchronization Process
1. User clicks theme toggle button
2. Theme context updates global theme state
3. Theme state change triggers effect in `useTldrawThemeSync` hook
4. Hook calls `editor.user.updateUserPreferences({ colorScheme: 'dark' | 'light' })`
5. TLDraw automatically re-renders with new theme

### Theme Detection
- On initial load, checks localStorage for saved theme preference
- Falls back to system preference using `prefers-color-scheme` media query
- Applies theme to document root element via class (`dark` class)

### CSS Integration
- Uses Tailwind's dark mode class strategy
- All UI components respect `dark:` prefixed classes
- TLDraw handles its own theme styling internally

## Troubleshooting

### Theme not synchronizing
- Ensure `useTldrawThemeSync()` is called in a component with editor access
- Check that the component is wrapped by the ThemeProvider
- Verify that the editor instance is available when the hook runs

### Theme preference not persisting
- Check localStorage permissions in browser
- Verify that theme is being saved in `localStorage.setItem('theme', theme)`

### System theme detection not working
- Ensure browser supports `prefers-color-scheme` media query
- Check that no saved theme preference is overriding system detection
