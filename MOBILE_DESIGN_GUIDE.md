# Mobile Design Guide - Marquee 2.0

## 📱 Mobile Responsive Design Philosophy

The Marquee website now follows a **mobile-first responsive design** that maintains the luxurious, premium feel across all devices while ensuring perfect usability on smartphones and tablets.

---

## 🎨 Design Principles

### 1. **Adaptive Typography**
- **Desktop**: Large, cinematic headings (9rem, 7xl, 6xl)
- **Tablet**: Medium headings (5xl, 4xl, 3xl)
- **Mobile**: Readable headings (4xl, 3xl, 2xl)
- **Body Text**: Never smaller than 12px on any device

### 2. **Touch-Friendly Interactions**
- Minimum button size: **44px height** on mobile
- Adequate spacing between clickable elements
- No overlapping buttons or links
- Clear visual feedback on tap

### 3. **Flexible Layouts**
```
Desktop (1024px+):  Multiple columns, horizontal navigation
Tablet (768px):     2-3 columns, condensed navigation
Mobile (<640px):    Single column, stacked elements
```

### 4. **Responsive Spacing**
```css
/* Padding/Margin Scales */
Mobile:  px-4, py-2, gap-2, space-y-4
Tablet:  px-6, py-3, gap-4, space-y-6
Desktop: px-12, py-4, gap-8, space-y-8
```

---

## 🔧 Component Breakdown

### **Navigation Bar**
```
Desktop (lg+):
┌─────────────────────────────────────────────────────┐
│ [Logo] Modes  Domains  Method  Business ▼  [Login] │
│                                    [Register] [Practice] │
└─────────────────────────────────────────────────────┘

Mobile (<1024px):
┌──────────────────────────────────┐
│ [Logo]    [Register] [Practice]  │
└──────────────────────────────────┘
```

**Mobile Changes:**
- Smaller logo (28px → 32px)
- Hidden navigation links (revealed on lg+)
- Condensed buttons
- "Start Practice" → "Practice"

---

### **Hero Section**
```
Desktop:
┌─────────────────────────────────────┐
│        The Interview,               │
│          Reimagined.                │
│                                     │
│  [Start Practice] [See Method]     │
└─────────────────────────────────────┘

Mobile:
┌─────────────────────────┐
│   The Interview,        │
│     Reimagined.         │
│                         │
│  [Start Your Practice]  │
│  [See the Method]       │
└─────────────────────────┘
```

**Mobile Changes:**
- Smaller heading (13vw vs 9rem)
- Stacked buttons (full width)
- Reduced spacing
- More padding on sides

---

### **Three Modes Cards**
```
Desktop (lg+):
┌─────────┬─────────┐
│         │         │
│ Campus  │ Company │
│   70%   │   30%   │
├─────────┴─────────┤
│    Self-Taught    │
└───────────────────┘

Mobile:
┌───────────────┐
│    Campus     │
├───────────────┤
│   Company     │
├───────────────┤
│ Self-Taught   │
└───────────────┘
```

**Mobile Changes:**
- Single column layout
- Smaller min-height (380px)
- Condensed text
- Smaller badges

---

### **Live Demo/Method**
```
Desktop:
┌─────────────┬──────────────────┐
│ Heading     │                  │
│ Features:   │  Code Window     │
│ • Real-time │  Mockup          │
│ • Adaptive  │                  │
│ • Code      │                  │
└─────────────┴──────────────────┘

Mobile:
┌──────────────────┐
│    Heading       │
│    Features:     │
│    • Real-time   │
│    • Adaptive    │
│    • Code        │
├──────────────────┤
│  Code Window     │
│  Mockup          │
└──────────────────┘
```

**Mobile Changes:**
- Stacked layout
- Smaller code font (10px)
- Condensed window chrome
- Hidden Python version label

---

### **CTA & Footer**
```
Desktop:
┌─────────────────────────────────────┐
│     Ready to face Marquee?          │
│                                     │
│ [email input           ] [Submit]   │
│                                     │
│ Logo  |  Product  |  Company  | Legal │
└─────────────────────────────────────┘

Mobile:
┌─────────────────────────┐
│ Ready to face Marquee?  │
│                         │
│ [email input        ]   │
│ [Submit Button      ]   │
│                         │
│ Logo                    │
│ Product    Company      │
│ (2 columns)             │
└─────────────────────────┘
```

**Mobile Changes:**
- Stacked form inputs
- Full-width buttons
- 2-column footer grid
- Vertical copyright info

---

### **Practice Session Interface**
```
Desktop:
┌─────────┬────────────────────────┐
│ [Logo]  │ Session Info | [Timer] │
├─────────┼────────────────────────┤
│Portrait │                        │
│Status   │   Main Interview       │
│         │   Content Area         │
│Transcript│                       │
└─────────┴────────────────────────┘

Mobile:
┌──────────────────────────────────┐
│ [Logo]       [Timer] [End]       │
├──────────────────────────────────┤
│ Status Bar         ▼             │
│ Transcript (40vh)                │
├──────────────────────────────────┤
│                                  │
│   Main Interview Content         │
│                                  │
└──────────────────────────────────┘
```

**Mobile Changes:**
- Horizontal sidebar (40vh max)
- Hidden portrait
- Condensed header
- "End Session" → "End"
- Better scrolling behavior

---

## 📐 Spacing Scale

```css
/* Tailwind Spacing Classes Used */

Mobile (default):
- Text: text-xs, text-sm, text-base
- Padding: p-2, p-3, p-4
- Margin: mt-4, mb-6, my-8
- Gap: gap-2, gap-3, gap-4

Tablet (sm:):
- Text: sm:text-sm, sm:text-base, sm:text-lg
- Padding: sm:p-4, sm:p-6, sm:p-8
- Margin: sm:mt-6, sm:mb-8, sm:my-12
- Gap: sm:gap-4, sm:gap-6, sm:gap-8

Desktop (md:, lg:):
- Text: md:text-lg, lg:text-xl, lg:text-2xl
- Padding: md:p-6, lg:p-12, lg:p-16
- Margin: md:mt-12, lg:mt-20, lg:my-32
- Gap: md:gap-8, lg:gap-12, lg:gap-16
```

---

## 🎯 Key Breakpoints

| Breakpoint | Width | Target Devices |
|------------|-------|----------------|
| **xs** (base) | 0px - 639px | Mobile phones (portrait) |
| **sm:** | 640px+ | Mobile phones (landscape), small tablets |
| **md:** | 768px+ | Tablets (portrait) |
| **lg:** | 1024px+ | Tablets (landscape), small laptops |
| **xl:** | 1280px+ | Laptops, desktops |

---

## ✨ Animation & Interaction

### Mobile Optimizations:
1. **Reduced Animation Duration**: Faster animations for perceived performance
2. **Touch Gestures**: All interactive elements are touch-optimized
3. **Hover States**: Converted to active/focus states on touch devices
4. **Scroll Performance**: Optimized parallax and scroll-based animations

### CSS Features Used:
```css
/* Touch-friendly hover */
@media (hover: hover) {
  .button:hover { /* desktop hover styles */ }
}

/* Mobile viewport fix */
@supports (-webkit-touch-callout: none) {
  .h-screen { height: -webkit-fill-available; }
}

/* Prevent overscroll */
body { overflow-x: hidden; }
```

---

## 🧪 Testing Checklist

### ✅ Visual Tests
- [ ] No horizontal scrolling on any page
- [ ] All text is readable (min 12px)
- [ ] Buttons are tappable (min 44px)
- [ ] Images load and scale properly
- [ ] No overlapping elements
- [ ] Proper spacing between sections

### ✅ Interaction Tests
- [ ] All buttons work on touch
- [ ] Forms are usable with mobile keyboard
- [ ] Dropdowns open correctly
- [ ] Modal/popups fit viewport
- [ ] Navigation is accessible
- [ ] Scrolling is smooth

### ✅ Device Tests
- [ ] iPhone SE (375px) - smallest modern phone
- [ ] iPhone 14 (390px) - standard iPhone
- [ ] Samsung Galaxy (360px) - standard Android
- [ ] iPad Mini (768px) - small tablet
- [ ] iPad Pro (1024px) - large tablet

---

## 🚀 Performance Tips

1. **Lazy Load Images**: Use `loading="lazy"` for below-fold images
2. **Optimize Fonts**: Subset fonts to reduce load time
3. **Minimize CSS**: Tailwind purges unused classes in production
4. **Reduce Animations**: Use `prefers-reduced-motion` for accessibility

---

## 📋 Quick Reference

### Common Responsive Patterns:
```jsx
// Stack on mobile, horizontal on desktop
className="flex flex-col sm:flex-row"

// Full width on mobile, auto on desktop
className="w-full sm:w-auto"

// Hide on mobile, show on desktop
className="hidden lg:block"

// Show on mobile, hide on desktop
className="block lg:hidden"

// Responsive text sizes
className="text-2xl sm:text-4xl md:text-6xl"

// Responsive padding
className="px-4 sm:px-6 md:px-12"

// Responsive gaps
className="gap-2 sm:gap-4 md:gap-8"
```

---

## 💡 Best Practices

1. **Always test on real devices**, not just browser dev tools
2. **Use relative units** (rem, em, %) instead of fixed pixels when possible
3. **Touch targets should be at least 44×44 pixels**
4. **Maintain consistent spacing** across breakpoints
5. **Keep navigation simple** on mobile - hamburger menu if needed
6. **Optimize images** for different screen densities (@1x, @2x, @3x)

---

**Version**: 2.0.1  
**Last Updated**: June 27, 2026  
**Maintained by**: Marquee Development Team
