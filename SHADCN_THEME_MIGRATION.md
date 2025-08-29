# ShadCN/UI Theme Migration Guide

This document outlines the migration from the custom theme system to the ShadCN/UI theme system using `next-themes`.

## What Changed

### 1. Theme Provider

- **Old**: `ThemeProvider` from `@/contexts/ThemePreferenceContext`
- **New**: `ThemeProvider` from `@/components/theme-provider` (wrapper around `next-themes`)

### 2. CSS Variables

The project now uses HSL values compatible with ShadCN/UI:

#### New Primary Variables

```css
:root {
  --background: 0 0% 100%; /* White background */
  --foreground: 222.2 84% 4.9%; /* Dark text */
  --card: 0 0% 100%; /* Card background */
  --card-foreground: 222.2 84% 4.9%; /* Card text */
  --primary: 221.2 83.2% 53.3%; /* Primary blue */
  --primary-foreground: 210 40% 98%; /* Primary text */
  --secondary: 210 40% 96%; /* Secondary gray */
  --secondary-foreground: 222.2 84% 4.9%; /* Secondary text */
  --muted: 210 40% 96%; /* Muted background */
  --muted-foreground: 215.4 16.3% 46.9%; /* Muted text */
  --accent: 210 40% 96%; /* Accent color */
  --accent-foreground: 222.2 84% 4.9%; /* Accent text */
  --destructive: 0 84.2% 60.2%; /* Error red */
  --border: 214.3 31.8% 91.4%; /* Border color */
  --input: 214.3 31.8% 91.4%; /* Input border */
  --ring: 221.2 83.2% 53.3%; /* Focus ring */
}
```

### 3. Tailwind Classes

New utility classes are available:

#### Colors

- `bg-background` - Main background
- `bg-card` - Card background
- `bg-primary` - Primary color
- `bg-secondary` - Secondary color
- `bg-muted` - Muted background
- `bg-accent` - Accent color
- `text-foreground` - Main text color
- `text-muted-foreground` - Muted text
- `border-border` - Border color

#### Example Migration

```tsx
// Old
<div className="bg-theme text-theme-primary border-theme">

// New
<div className="bg-background text-foreground border-border">
```

### 4. Theme Hook Usage

```tsx
// Old
import { useTheme } from "@/contexts/ThemePreferenceContext";
const { theme, toggleTheme } = useTheme();

// New
import { useTheme } from "next-themes";
const { theme, setTheme } = useTheme();
const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
```

### 5. Components

All theme toggle components have been updated:

- `ThemeToggle.tsx` - Updated to use next-themes
- `DarkLightThemeSwitcher.tsx` - Updated to use next-themes

### 6. Backward Compatibility

Legacy CSS classes are maintained for smooth migration:

- `.bg-theme` → maps to `hsl(var(--background))`
- `.bg-surface` → maps to `hsl(var(--card))`
- `.text-theme-primary` → maps to `hsl(var(--foreground))`
- `.text-theme-secondary` → maps to `hsl(var(--muted-foreground))`
- `.border-theme` → maps to `hsl(var(--border))`

## Benefits of ShadCN/UI Theme System

1. **Standardization**: Uses industry-standard color system
2. **Component Library Ready**: Compatible with ShadCN/UI components
3. **Better Accessibility**: Proper contrast ratios built-in
4. **HSL Color Space**: More intuitive color adjustments
5. **System Theme Support**: Automatic light/dark mode detection
6. **Hydration Safe**: Prevents flash of incorrect theme

## Component Usage Examples

### Button Component

```tsx
import { Button } from "@/components/ui/button";

<Button variant="default">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="destructive">Delete Button</Button>
```

### Theme Toggle

```tsx
import ThemeToggle from "@/components/ThemeToggle";
// or
import DarkLightThemeSwitcher from "@/components/DarkLightThemeSwitcher";

<ThemeToggle />;
```

## Migration Checklist

- [x] Install `next-themes`
- [x] Create new `ThemeProvider` component
- [x] Update `layout.tsx` to use new provider
- [x] Update CSS variables to HSL format
- [x] Update Tailwind config with new color system
- [x] Update theme toggle components
- [x] Maintain backward compatibility classes
- [x] Create utility function (`cn`)
- [x] Create basic ShadCN/UI components (Button)

## Next Steps

1. Gradually migrate components to use new theme classes
2. Install additional ShadCN/UI components as needed
3. Remove legacy theme context once migration is complete
4. Update TypeScript types if needed

## Resources

- [ShadCN/UI Documentation](https://ui.shadcn.com/)
- [Next Themes Documentation](https://github.com/pacocoursey/next-themes)
- [Tailwind CSS Color Documentation](https://tailwindcss.com/docs/customizing-colors)
