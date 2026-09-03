# RupeeFlow Color System

**Based on Figma Design System**
**Last Updated:** 2025-10-10

---

## 🎨 Color Palette (Frame 893)

### Base Colors
```css
#FFFFFF  /* white */
#0C0C0C  /* black */
```

### Primary Brand Colors
```css
#30F3BC  /* primary-mint   - Bright mint/turquoise (main accent) */
#40A17F  /* primary-green  - Medium green (brand color) */
#83BFA7  /* primary-sage   - Light sage (secondary) */
#01261D  /* primary-dark-green - Very dark green (backgrounds) */
```

### Semantic Colors
```css
#0DD25F  /* success - Bright success green */
#D51C44  /* error   - Bright error red */
```

### Surface/Background Colors
```css
#262B2A  /* surface-dark      - Dark gray-green surface */
#01261D  /* surface-dark-deep - Deeper dark surface */
```

### Text/Border Colors
```css
#95A19D  /* muted         - Medium gray for muted text/borders */
#9CADA6  /* muted-sidebar - Sidebar text color */
```

---

## 🌈 Gradients (Frames 879-882)

### Frame 879: Bright Gradient (Primary)
```css
/* Use for: Buttons, CTAs, highlights */
background: linear-gradient(to right, #53BEC2, #00EF64);
```

**Tailwind:**
```tsx
className="bg-gradient-to-r from-gradient-bright-from to-gradient-bright-to"
```

---

### Frame 880: Success Gradient
```css
/* Use for: Success states, positive actions */
background: linear-gradient(to right, #1E6347, #25BD58);
```

**Tailwind:**
```tsx
className="bg-gradient-to-r from-gradient-success-from to-gradient-success-to"
```

---

### Frame 881: Deep Gradient
```css
/* Use for: Cards, elevated surfaces */
background: linear-gradient(to right, #103C28, #1F834C);
```

**Tailwind:**
```tsx
className="bg-gradient-to-r from-gradient-deep-from to-gradient-deep-to"
```

---

### Frame 882: Main Background Gradient ⭐
```css
/* Use for: Main app background (body) */
background: linear-gradient(to bottom, #0F0F0F, #0C1F18);
```

**Tailwind:**
```tsx
className="bg-gradient-to-b from-gradient-bg-dark-from to-gradient-bg-dark-to"
```

---

## 📝 Usage Examples

### Body Background (Frame 882)
```tsx
// globals.scss
body {
  @apply bg-gradient-to-b from-gradient-bg-dark-from to-gradient-bg-dark-to min-h-screen;
}
```

### Primary Button (Frame 879)
```tsx
<Button className="bg-gradient-to-r from-gradient-bright-from to-gradient-bright-to text-white">
  Click Me
</Button>
```

### Card Surface
```tsx
<Card className="bg-surface-dark border border-sage">
  Content
</Card>
```

### Success Button (Frame 880)
```tsx
<Button className="bg-gradient-to-r from-gradient-success-from to-gradient-success-to text-white">
  Save
</Button>
```

### Error State
```tsx
<div className="text-error border border-error">
  Error message
</div>
```

### Muted Text
```tsx
<p className="text-muted">
  Secondary information
</p>
```

### Bordered Card with Gradient
```tsx
<Card className="bg-surface-dark border-2 border-primary-sage">
  <div className="p-4">
    Content
  </div>
</Card>
```

---

## 🎯 Color Usage Guidelines

### ✅ DO

**Backgrounds:**
- Use `from-gradient-bg-dark-from to-gradient-bg-dark-to` for main background
- Use `bg-surface-dark` for cards and elevated surfaces
- Use `bg-surface-dark-deep` for deeply nested elements

**Buttons:**
- Use `from-gradient-bright-from to-gradient-bright-to` for primary actions
- Use `from-gradient-success-from to-gradient-success-to` for success actions
- Use `from-gradient-deep-from to-gradient-deep-to` for secondary actions

**Text:**
- Use `text-white` for primary text on dark backgrounds
- Use `text-muted` for secondary text
- Use `text-primary-mint` for accents

**Borders:**
- Use `border-sage` for soft borders
- Use `border-light` for subtle borders
- Use gradient borders for special cards

---

### ❌ DON'T

- Don't use random hex codes - use the design system colors
- Don't use blue, purple, or old brand colors for new features
- Don't mix gradients from different frames randomly
- Don't use more than 2 gradients on the same screen

---

## 🔄 Migration from Old Colors

### Replace Old Colors With:

| Old Color | New Color | Usage |
|-----------|-----------|-------|
| `bg-purple-600` | `bg-gradient-to-r from-gradient-bright-from to-gradient-bright-to` | Buttons |
| `text-purple-600` | `text-primary-mint` | Accent text |
| `border-purple-600` | `border-sage` | Borders |
| Random backgrounds | `bg-surface-dark` | Cards |
| Random text colors | `text-white` or `text-muted` | Text |

---

## 🛠️ Implementation Checklist

When implementing new features:

- [ ] Use `bg-gradient-to-b from-gradient-bg-dark-from to-gradient-bg-dark-to` for page background
- [ ] Use `bg-surface-dark` for card backgrounds
- [ ] Use `from-gradient-bright-from to-gradient-bright-to` for primary buttons
- [ ] Use `text-white` for primary text, `text-muted` for secondary
- [ ] Use `border-sage` or `border-light` for borders
- [ ] Use `text-primary-mint` for highlighted/accent text
- [ ] Use `text-error` for error messages
- [ ] Use `text-success` for success messages

---

## 📦 Tailwind Class Reference

### Backgrounds
```tsx
// Main background (Frame 882)
bg-gradient-to-b from-gradient-bg-dark-from to-gradient-bg-dark-to

// Surfaces
bg-surface-dark
bg-surface-dark-deep

// Gradient buttons
bg-gradient-to-r from-gradient-bright-from to-gradient-bright-to
bg-gradient-to-r from-gradient-success-from to-gradient-success-to
bg-gradient-to-r from-gradient-deep-from to-gradient-deep-to
```

### Text Colors
```tsx
text-white
text-black
text-primary-mint
text-primary-green
text-primary-sage
text-muted           // General muted text
text-muted-sidebar   // Sidebar text (#9CADA6)
text-success
text-error
```

### Border Colors
```tsx
border-sage
border-light
border-white
```

### Brand Colors
```tsx
bg-primary-mint
bg-primary-green
bg-primary-sage
bg-primary-dark-green
```

---

## 🎨 Design Tokens

```typescript
// Use in JavaScript/TypeScript
const colors = {
  // From Frame 893
  mint: '#30F3BC',
  green: '#40A17F',
  sage: '#83BFA7',
  darkGreen: '#01261D',
  surfaceDark: '#262B2A',
  muted: '#95A19D',
  mutedSidebar: '#9CADA6',  // Sidebar text
  success: '#0DD25F',
  error: '#D51C44',
  white: '#FFFFFF',
  black: '#0C0C0C',

  // Gradients from Frames 879-882
  gradients: {
    bright: 'linear-gradient(to right, #53BEC2, #00EF64)',
    success: 'linear-gradient(to right, #1E6347, #25BD58)',
    deep: 'linear-gradient(to right, #103C28, #1F834C)',
    background: 'linear-gradient(to bottom, #0F0F0F, #0C1F18)',
  }
};
```

---

## ✨ Examples

### Dashboard Card
```tsx
<Card className="bg-surface-dark border border-sage">
  <CardHeader>
    <h2 className="text-primary-mint">Dashboard</h2>
  </CardHeader>
  <CardBody>
    <p className="text-white">Main content</p>
    <p className="text-muted">Secondary info</p>
  </CardBody>
</Card>
```

### Primary CTA Button
```tsx
<Button
  className="bg-gradient-to-r from-gradient-bright-from to-gradient-bright-to text-white font-semibold"
>
  Get Started
</Button>
```

### Success Notification
```tsx
<div className="bg-gradient-to-r from-gradient-success-from to-gradient-success-to text-white p-4 rounded-lg">
  <p>Action completed successfully!</p>
</div>
```

### Page Layout
```tsx
<div className="min-h-screen bg-gradient-to-b from-gradient-bg-dark-from to-gradient-bg-dark-to">
  <div className="container mx-auto p-6">
    <Card className="bg-surface-dark">
      <CardBody>
        <h1 className="text-white text-2xl mb-4">Page Title</h1>
        <p className="text-muted">Content goes here</p>
      </CardBody>
    </Card>
  </div>
</div>
```

---

**Remember:** Always use the design system colors. Consistency is key! 🎨
