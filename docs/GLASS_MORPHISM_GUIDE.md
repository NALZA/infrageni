# Glass Morphism Design System

Your InfraGeni application now features a comprehensive glass morphism design system with light/dark mode support. Here's how to use it:

## 🎨 Design Philosophy

Glass morphism creates a modern, translucent UI that mimics frosted glass with:

- Blurred backgrounds using `backdrop-filter`
- Translucent colors with alpha transparency
- Subtle shadows for depth
- Clean borders with low opacity
- Smooth animations and interactions

## 🌗 Dark Mode

The theme automatically detects the user's system preference and provides a toggle button. Dark mode preferences are persisted in localStorage.

### Using Dark Mode Classes

```css
/* Light mode styles */
.my-element {
  background: rgba(255, 255, 255, 0.1);
}

/* Dark mode styles */
.dark .my-element {
  background: rgba(16, 16, 16, 0.3);
}
```

## 🧩 Glass Utility Classes

### Basic Glass Effects

```html
<!-- Basic glass card -->
<div class="glass-card">Content here</div>

<!-- Glass card with hover effect -->
<div class="glass-card glass-card-hover">Interactive content</div>

<!-- Glass button -->
<button class="glass-button glass-button-hover">Click me</button>

<!-- Glass input -->
<input class="glass-input" placeholder="Enter text..." />

<!-- Glass navbar -->
<nav class="glass-navbar">Navigation content</nav>

<!-- Glass modal -->
<div class="glass-modal">Modal content</div>
```

### Background Patterns

```html
<!-- Mesh gradient background -->
<div class="bg-mesh-light dark:bg-mesh-dark">
  <!-- Content with animated gradient background -->
</div>

<!-- Glass gradient background -->
<div class="bg-gradient-glass">
  <!-- Content with gradient background that changes with theme -->
</div>
```

### Animations

```html
<!-- Floating animation -->
<div class="animate-float">Floating element</div>

<!-- Glowing animation -->
<div class="animate-glow">Glowing element</div>

<!-- Shimmer effect -->
<div class="animate-shimmer">Shimmer effect</div>
```

## 🧪 React Components

Use the pre-built React components for consistent styling:

### GlassCard

```tsx
import { GlassCard } from './components/ui/glass-components';

<GlassCard variant="hover" blur="lg" className="p-6">
  <h3>Card Title</h3>
  <p>Card content...</p>
</GlassCard>;
```

**Props:**

- `variant`: `'default' | 'hover' | 'modal'`
- `blur`: `'sm' | 'md' | 'lg' | 'xl'`

### GlassButton

```tsx
import { GlassButton } from './components/ui/glass-components';

<GlassButton variant="primary" size="lg" onClick={handleClick}>
  Click Me
</GlassButton>;
```

**Props:**

- `variant`: `'default' | 'primary' | 'outline'`
- `size`: `'sm' | 'md' | 'lg'`

### GlassInput

```tsx
import { GlassInput } from './components/ui/glass-components';

<GlassInput label="Email" type="email" placeholder="Enter your email..." />;
```

### GlassModal

```tsx
import { GlassModal } from './components/ui/glass-components';

<GlassModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Modal Title"
>
  <p>Modal content goes here...</p>
</GlassModal>;
```

### ThemeToggle

```tsx
import { ThemeToggle } from './components/ui/theme-toggle';

<ThemeToggle />;
```

## 🎭 Custom CSS Variables

You can customize the glass effects using CSS variables:

```css
:root {
  /* Glass Colors */
  --color-glass-light: rgba(255, 255, 255, 0.1);
  --color-glass-dark: rgba(16, 16, 16, 0.3);

  /* Backdrop Blur */
  --backdrop-blur-glass: 8px;
  --backdrop-blur-glass-lg: 12px;

  /* Shadows */
  --shadow-glass: 0 4px 16px rgba(0, 0, 0, 0.1);

  /* Border Radius */
  --radius-glass: 1rem;

  /* Animation Duration */
  --duration-glass: 200ms;
}
```

## 📱 Responsive Design

The glass effects are optimized for different screen sizes:

```css
/* Mobile optimization */
@media (max-width: 768px) {
  .glass-card {
    backdrop-filter: blur(6px); /* Reduced blur for performance */
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .glass-card-hover:hover {
    transform: none; /* Disable hover animations */
  }
}
```

## ✨ Best Practices

1. **Performance**: Use glass effects sparingly on mobile devices
2. **Accessibility**: Ensure sufficient contrast for text over glass backgrounds
3. **Consistency**: Stick to the predefined glass utility classes
4. **Layering**: Layer glass elements for depth, but avoid overdoing it
5. **Animation**: Use subtle animations that enhance rather than distract

## 🎯 Example Usage

```tsx
function MyComponent() {
  return (
    <div className="min-h-screen bg-mesh-light dark:bg-mesh-dark">
      <nav className="glass-navbar">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">My App</h1>
          <ThemeToggle />
        </div>
      </nav>

      <main className="pt-20 p-8">
        <GlassCard variant="hover" className="max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome</h2>
          <p className="text-glass-light-text dark:text-glass-dark-text mb-6">
            Experience the beauty of glass morphism design.
          </p>
          <GlassButton variant="primary" size="lg">
            Get Started
          </GlassButton>
        </GlassCard>
      </main>
    </div>
  );
}
```

## 🔧 Browser Support

Glass morphism effects require modern browsers that support:

- `backdrop-filter` property
- CSS Grid and Flexbox
- CSS custom properties (variables)
- Modern color functions

Supported browsers: Chrome 76+, Firefox 103+, Safari 9+, Edge 17+

The design gracefully degrades in older browsers by falling back to solid backgrounds.
