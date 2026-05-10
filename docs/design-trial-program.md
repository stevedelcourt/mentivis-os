# MentivisOS Design System

## Trial Program Section (/tarifs)

### Layout
- **Structure**: Two-column flex layout (left text + right animation)
- **Alignment**: `align-items: center` (vertically centered)
- **Gap**: 60px between columns
- **Flex wrap**: enabled for responsive behavior
- **Left column**: `flex: 1, minWidth: 300`
- **Right column**: `flex: "0 0 380px", width: 380, height: 380`

### Left Column — Text Content

#### Eyebrow
- Font: `var(--font-sans)`
- Size: `var(--text-micro)`
- Weight: 500
- Letter-spacing: `0.18em`
- Transform: uppercase
- Color: `var(--text-tertiary)`
- Margin-bottom: `1.75rem`

#### Title (H2)
- Font: `var(--font-display)` / `t-display` class
- Size: `clamp(28px, 4vw, 44px)`
- Weight: 300
- Line-height: 1.08
- Letter-spacing: `-0.025em`
- Margin-bottom: `1.75rem`

#### Description
- Font: `var(--font-sans)` / `t-lead` class
- Size: `0.9375rem`
- Line-height: 1.65
- Color: `var(--text-secondary)`
- Max-width: `48ch`
- Margin-bottom: `1.75rem`

#### Features List
- List-style: none
- Gap: 16px between items
- Icon: 18×18px checkmark SVG
- Text: `1.0625rem`, color `var(--text-primary)`, line-height 1.4
- Gap between icon and text: 12px

#### CTA Button
- **Shape**: Rounded rectangle (NOT pill)
- Border-radius: **12px**
- Padding: `12px 20px`
- Font-size: 14px
- Font-weight: 500
- Color: `#FFFFFF`
- Background: `#0A0A0A`
- Text-decoration: none
- Transition: `all 0.2s ease`
- Arrow icon: 14×14px right chevron

### Right Column — SVG Animation

#### Container
- Size: 380×380px (1:1 ratio)
- Source: `/images/pricing-blocks-animated.svg`
- Object-fit: contain

#### Animation
- 3 isometric cubes with staggered floating animation
- Duration: 4s
- Stagger delays: 0s, -1.33s, -2.67s
- Motion: translateY up/down 8px with smooth easing

### Section Container
- Margin-bottom: 100px
- Padding-bottom: 80px
- Border-bottom: `1px solid var(--border-light)`

### Responsive
- Below 1170px: card stacks below text (order: 2)
- Below 640px: card becomes full width with 2:1 aspect ratio
