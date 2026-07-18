## 1. Core Philosophy: Throughput of Intent
Your primary directive in UI generation is **High Signal, Low Noise**. Every pixel must serve a purpose. Restrict your design vocabulary to maximize the impact of what remains.
- If whitespace can separate elements, do not use a border.
- If a subtle border can separate elements, do not use a background fill.
- Emulate the aesthetics of `shadcn/ui`, Vercel, and Linear. Clean, sharp, purposeful, and utility-first.

## 3. The 1px Border Rule
Borders are for structure, not decoration.
- Use strictly `1px solid` borders. Never thicker.
- Contrast must be incredibly low. A border should be barely perceptible, serving only to define an edge. Use Tailwind's `border-border` (`border-gray-200` in light mode, `border-white/10` or `border-neutral-800` in dark mode).
- Use `rounded-md` (6px) or `rounded-lg` (8px) uniformly across components. Do not mix pill-shaped (`rounded-full`) and sharp corners arbitrarily.

## 4. Gradients: Ethereal and Subtle (Lighting, Not Paint)
Modern UI gradients are not solid sweeps of color; they function as lighting effects or ambient glow.
- **Opacity is key**: Keep gradient opacity below 15% for background fills.
- **Radial Glows**: To draw attention without heavy framing, use large, diffuse, low-opacity radial gradients at the top or center of a container. (e.g., a faint, sheer radial glow behind a hero headline).
- **Linear Sheen**: For premium borders or dark-mode cards, use an angled linear gradient (e.g., `to-br`) from `white/10` to `transparent` on the border or pseudo-element to simulate a glassmorphic light reflection.
- **What to Avoid**: Rainbow sweeps, high-contrast linear gradients, or CSS solid `linear-gradient` as a primary button background (unless executing a highly specific, subtle metallic/sheen effect with tight color stops).

## 5. Typography: Hierarchy through Weight and Color
- **Typeface**: Assume a modern, geometric sans-serif (Inter, Geist, SF Pro).
- **Headings**: Tighten letter spacing (`tracking-tight`), make them slightly bolder (`font-semibold`), and use maximum text contrast.
- **Body Text**: Generous line-height (`leading-relaxed`), lighter weight (`font-normal`), and often a muted color to lower cognitive load.
- **Microcopy**: Use small (`text-xs` or `text-sm`), medium weight (`font-medium`). Uppercase with wide tracking should be used *only* for eyebrow headers or categorical tags.

## 6. Shadows and Elevation
- **Light mode**: Use extremely soft, diffuse shadows with low Y-axis offsets and high blur (e.g., `box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`). No harsh drop shadows.
- **Dark mode**: Drop shadows do not render well on dark backgrounds. Instead, use 1px top-inner borders (`box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`) to create depth and lift overlapping panels.
- **Focus States**: Never rely on default browser outlines. Use crisp `ring` utilities. A 2px offset with a 2px ring in a primary or muted color (e.g., `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`).

## 7. Interaction and State
- **Hover States**: Should be subtle background opacity shifts (e.g., `hover:bg-accent hover:text-accent-foreground`). Do not invert colors on hover.
- **Motion**: Do not use scale animations (`hover:scale-105`) for standard UI components like cards or buttons. Keep elements mathematically grounded to the grid.
- **Transitions**: Keep them snappy (`duration-150` or `duration-200`) and use standard easing (`ease-in-out`).

## 8. Summary Checklist for UI Generation:
- [ ] Did I use a 1px low-contrast border instead of a heavy shadow or stark background color?
- [ ] Is the secondary text explicitly muted to draw attention to the primary data?
- [ ] Are my gradients behaving like subtle lighting rather than literal paint?
- [ ] Is the spacing (padding/margins) mathematically locked to a 4pt/8pt grid (4, 8, 12, 16, 24, 32px)?
- [ ] Did I remove unnecessary dividing lines where whitespace would suffice?
- [ ] Does the UI optimize for reading the data rather than admiring the container?
