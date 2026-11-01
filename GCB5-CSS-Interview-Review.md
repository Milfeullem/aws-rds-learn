# GCB5 Frontend Engineer: CSS Interview Review

This guide covers frequently tested CSS concepts, common layout or styling bugs, and additional browser-layout topics that may come up in a frontend coding interview. The key is not only to remember CSS properties, but also to explain **why a layout behaves a certain way and how you would verify a fix**.

## 1. Frequently Tested CSS Concepts

### 1.1 The box model and `box-sizing`

Every element consists of content, padding, border, and margin.

With the default `content-box` model, the declared `width` applies to the content area only. Padding and borders are added outside that width, so the element’s total rendered width can be larger than expected.

```css
* {
  box-sizing: border-box;
}
```

With `border-box`, the declared width includes content, padding, and border, which makes layout calculations easier to predict.

**Common issue:** An element has `width: 100%` but still overflows its parent. Check its padding, border, `min-width`, and `box-sizing`.

### 1.2 Selectors, the cascade, and specificity

When multiple CSS declarations target the same property, the browser considers whether each rule applies, its origin and `!important` status, selector specificity, and source order.

A simplified specificity order is:

1. Inline styles
2. ID selectors
3. Class, attribute, and pseudo-class selectors
4. Element and pseudo-element selectors

When two rules have the same specificity, the later applicable declaration usually wins.

**Common interview question:** Why did my new CSS rule not take effect?

**Answer approach:** Check that the selector matches the element, look for a more specific or later rule overriding it, and inspect the final value in the DevTools **Computed** or **Styles** panel. Avoid adding increasingly complex selectors or many `!important` declarations to hide the underlying issue.

### 1.3 Flexbox

Flexbox is designed for one-dimensional layouts, where items are arranged primarily in a row or a column.

Common container properties:

- `display: flex`
- `flex-direction`
- `justify-content`
- `align-items`
- `flex-wrap`
- `gap`

Common item properties:

- `flex`
- `flex-grow`
- `flex-shrink`
- `flex-basis`
- `align-self`

Understand the difference between:

- `justify-content`: alignment along the main axis.
- `align-items`: alignment along the cross axis.
- The main axis is determined by `flex-direction`.

```css
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
```

**Common issue:** Long text inside a flex item pushes the layout wider than expected. Check the item’s `min-width`; setting `min-width: 0` may allow it to shrink. You may also need text wrapping or truncation rules.

### 1.4 CSS Grid

Grid is designed for two-dimensional layouts, where both rows and columns matter. It is commonly used for card grids, dashboards, and page layouts.

Know how to read and use:

- `grid-template-columns`
- `grid-template-rows`
- `fr`
- `repeat()`
- `minmax()`
- `auto-fit` and `auto-fill`

A responsive card layout can use:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
```

**Common issue:** Long content forces a grid column to become wider than expected. `minmax(0, 1fr)` is often more robust than using `1fr` alone.

### 1.5 Positioning and stacking contexts

Understand these positioning modes:

- `static`: the default document flow positioning.
- `relative`: remains in the normal flow and can provide a reference point for absolutely positioned descendants.
- `absolute`: removed from normal flow and generally positioned relative to the nearest positioned ancestor.
- `fixed`: usually positioned relative to the viewport.
- `sticky`: behaves like normal flow until it reaches a specified scroll threshold.

```css
.card {
  position: relative;
}

.card__badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
```

`z-index` is not simply “the larger the number, the closer to the front.” Stacking contexts affect how elements are layered, and some CSS properties create new stacking contexts.

**Common issue:** A modal has a very large `z-index` but is still behind another element. Check whether an ancestor creates a stacking context or clips the modal with `overflow: hidden`. A React Portal may be appropriate for modals, popovers, and other overlays.

### 1.6 Responsive layouts and media queries

Responsive design aims to keep a page usable across screen sizes; it is not simply shrinking a desktop layout.

Know how to use:

- Flexible units such as `%`, `rem`, and `vw`.
- `max-width` and other sizing constraints.
- Media queries.
- Mobile-first CSS organization.
- Image sizing and container constraints.
- Layout changes for narrow screens.

```css
.page {
  width: min(100% - 2rem, 70rem);
  margin-inline: auto;
}

@media (max-width: 700px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
}
```

**Common checks:** Does the page scroll horizontally on a narrow screen? Do text, inputs, buttons, or images overflow? Do fixed widths or heights clip content?

### 1.7 Text overflow, wrapping, and long content

Useful properties include:

- `white-space`
- `overflow`
- `text-overflow`
- `overflow-wrap`
- `word-break`

Single-line truncation usually requires all three of these properties and a constrained width:

```css
.title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

Long URLs, email addresses, or strings without spaces can overflow a card. Consider `overflow-wrap: anywhere`, and check that the parent and child have appropriate width constraints.

### 1.8 `display`, visibility, and document flow

Understand the difference between:

- `display: none`: the element is removed from layout and is not presented as ordinary accessible content.
- `visibility: hidden`: the element is invisible but still takes up layout space.
- `opacity: 0`: the element is transparent but may still take up space and remain interactive.

Also understand the general behavior of `block`, `inline`, and `inline-block`, including whether elements start a new line, accept width and height, and remain in normal flow.

### 1.9 Pseudo-classes, pseudo-elements, and focus states

Common pseudo-classes include:

- `:hover`
- `:focus`
- `:focus-visible`
- `:disabled`
- `:checked`
- `:first-child`

Common pseudo-elements include:

- `::before`
- `::after`
- `::placeholder`

Interactive elements need a clear keyboard focus indicator. Do not remove the default `outline` unless you provide a visible replacement.

```css
button:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
```

`:focus-visible` can provide a prominent focus indicator when it is appropriate, particularly for keyboard navigation. Important controls should not rely on hover alone because touch and keyboard users do not interact with hover in the same way.

### 1.10 CSS units and sizing constraints

Common units include:

- `px`: a fixed pixel-based size.
- `%`: usually relative to a containing block.
- `rem`: relative to the root element’s font size.
- `em`: relative to the relevant font size, depending on the property.
- `vw` and `vh`: relative to viewport dimensions.

Common sizing constraints include `width`, `max-width`, `min-width`, `height`, `max-height`, and `min-height`.

For dynamic content, it is often better to constrain a maximum width and let the content determine its height than to set an unnecessary fixed height.

#### Percentage sizing

A percentage width is generally resolved relative to the containing block. A percentage height often needs an ancestor with a definite height; if ancestor heights are `auto`, `height: 100%` may not produce the expected result.

Percentage sizing rules differ by property, so do not assume every percentage is relative to the element’s own dimensions. Also be aware that `100vw` can include the scrollbar width in some environments and cause horizontal overflow. For ordinary page-width layouts, `width: 100%` or a constrained container may be more appropriate.

**Common interview question:** Why does `height: 100%` sometimes have no effect?

**Answer:** It depends on the height of its containing block. If the ancestor chain does not provide a definite height, the percentage may not resolve as expected. Inspect the ancestors or use a layout approach such as Flexbox or Grid that better expresses the desired sizing.

### 1.11 CSS custom properties

CSS custom properties let you reuse design tokens such as colors, spacing, and border radii:

```css
:root {
  --color-primary: #2563eb;
  --space-md: 1rem;
}

.button {
  background: var(--color-primary);
  padding: var(--space-md);
}
```

Custom properties follow inheritance and scoping rules. They are useful for themes, design systems, and shared styles.

### 1.12 CSS and accessibility

Common accessibility considerations include:

- Do not use color as the only way to communicate an error or success state.
- Keep keyboard focus clearly visible.
- Ensure sufficient contrast between text and background.
- Make sure the layout remains usable when text is zoomed or enlarged.
- Consider reduced-motion preferences.
- Make touch targets large enough, especially on mobile devices.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 1.13 Margin collapsing

Adjacent vertical margins can sometimes collapse instead of adding together. This can make spacing between blocks look different from the arithmetic sum of their margins. A child’s top margin may also appear to extend outside its parent.

When debugging, first check whether margin collapsing is involved. Depending on the layout, padding, borders, Flexbox/Grid `gap`, or a new formatting context may express the desired spacing more clearly. You do not need to memorize every edge case, but you should recognize that two margins do not always simply add together.

### 1.14 Overflow and scroll containers

Common `overflow` values include:

- `visible`: content can extend outside the box.
- `hidden`: clips overflowing content.
- `auto`: provides scrolling when needed.
- `scroll`: provides scrolling even when content fits.
- `clip`: clips content without providing normal scrolling.

Overflow can create or affect a scroll container, which can change how `position: sticky` behaves. An ancestor’s overflow may also clip shadows, focus outlines, dropdowns, or tooltips.

If a dropdown is clipped by a card, do not only increase `z-index`; inspect ancestor overflow and consider rendering the overlay elsewhere, such as through a portal.

### 1.15 Viewport units and fixed positioning on mobile

`position: fixed` is usually positioned relative to the viewport, but some ancestor styles can affect the containing block. On mobile, the visible viewport height can also change as browser controls appear or disappear.

Know the general purpose of `vh`, `dvh`, `svh`, and `lvh`:

- `vh`: traditional viewport-height unit.
- `dvh`: dynamic viewport height.
- `svh`: small viewport height.
- `lvh`: large viewport height.

When implementing full-screen dialogs or fixed bottom actions, check that browser controls do not cover content and that fixed controls do not obscure the page.

### 1.16 Formatting contexts and floats

A block formatting context (BFC) is a layout context that affects how floats, margins, and element heights interact. Older code may use `float` for layout; if a parent does not contain its floated children, the parent’s height may collapse.

For new layouts, Flexbox or Grid is usually a better choice. In a coding exercise involving existing code, recognize when floats or formatting-context behavior is the source of the problem.

### 1.17 Form controls and browser defaults

Browsers and operating systems can apply different default styles to `<input>`, `<button>`, and `<select>`. This can lead to inconsistent heights, fonts, borders, appearance, and focus behavior.

When debugging, check default styles, whether `font` is inherited as intended, `box-sizing`, `line-height`, and control appearance. Avoid indiscriminately removing all defaults, especially if doing so removes a useful focus indicator.

### 1.18 Animation, transitions, and performance

Use `transition` for transitions between states and `@keyframes` for more complex or repeated animations.

Animations involving `transform` and `opacity` are often easier for browsers to render smoothly than animations that repeatedly change layout-affecting dimensions or positions. However, verify actual performance rather than relying on assumptions. Respect `prefers-reduced-motion`, and do not apply `will-change` to many elements without evidence; it can consume additional resources.

### 1.19 `transform`, coordinate systems, and stacking contexts

`transform` changes more than an element’s visual appearance. It can create a stacking context, affect the containing block for positioned descendants, and change how fixed-position descendants behave.

When debugging `z-index`, overlays, or fixed elements, check relevant ancestors for `transform` and other properties that create stacking contexts—not only the target element itself.

### 1.20 CSS architecture and style scoping

Existing projects may use global CSS, CSS Modules, CSS-in-JS, design tokens, or naming conventions such as BEM. The goal is not to promote one approach everywhere, but to understand the project’s conventions and use them consistently.

- Global styles can unintentionally affect unrelated components.
- Scoped styles can reduce naming collisions.
- Design tokens help keep colors, spacing, and typography consistent.
- When modifying an existing project, follow its existing patterns unless there is a clear reason not to.

### 1.21 Browser compatibility and progressive enhancement

You do not need to memorize every browser support table, but you should consider whether a CSS feature is supported by the target browsers and whether the page remains usable without it.

Provide a fallback when a newer feature is important to the design. If a feature is only an enhancement, keep the core content and functionality usable without it. Verify behavior in the browsers relevant to the project.

### 1.22 Translating a design into CSS

When implementing a design mockup or reference page, use a structured process:

1. Identify the page container, maximum width, and outer spacing.
2. Divide the page into regions and reusable components.
3. Choose Flexbox or Grid for the primary layout.
4. Establish typography, colors, spacing, and border rules.
5. Implement the structure before polishing shadows, radii, and small details.
6. Check narrow screens and long content rather than relying only on fixed pixel values.
7. Verify interaction states such as focus, hover, disabled, and error.

Interviewers often care more about whether you can build the layout methodically than whether every pixel is perfect immediately.

### 1.23 Dynamic styles in React: CSS vs. JavaScript

In React, map UI state to classes, attributes, or styles instead of directly modifying DOM styles.

- For structural states, toggling a class is often clear and maintainable.
- For values directly driven by data, such as a progress percentage, a CSS custom property or inline style may be appropriate.
- For interaction state, let React state control the rendered class, attribute, or style.

For example, an expandable panel can use React state to control a class and `aria-expanded`, rather than manually changing DOM styles. This keeps the UI consistent with React state.

## 2. CSS Problems You May Need to Debug in a Coding Interview

A coding exercise may provide an existing page or component and ask you to fix layout, responsiveness, interaction states, or styling issues. These are common examples.

### 2.1 The page has horizontal scrolling

**Symptom:** The page is wider than the viewport and can be dragged sideways on mobile.

**Debugging steps:**

1. Identify which element extends beyond the viewport.
2. Check fixed widths, `min-width`, long text, and absolutely positioned elements.
3. Check width calculations involving `width: 100%`, padding, and borders.
4. Check whether images, tables, or code blocks exceed their containers.
5. Check whether Flexbox or Grid children are allowed to shrink.
6. Check whether `100vw` includes scrollbar width in the current environment.

Avoid immediately adding `overflow-x: hidden` to `body`. It may hide the symptom while clipping content.

### 2.2 Flex items do not fit or their content overflows

**Symptom:** A card, input, or long text pushes the layout wider than expected, or a button is pushed off-screen.

**Check:**

- Whether the parent needs `flex-wrap`.
- Whether an item has an excessively large fixed width or `min-width`.
- Whether a flex item needs `min-width: 0`.
- Whether text should wrap or be truncated.
- Whether a button with a fixed size needs to avoid shrinking.

### 2.3 The layout breaks on mobile

**Symptom:** The desktop layout looks correct, but the narrow-screen layout is cramped, overflowing, or in an awkward order.

**Check:**

- Fixed widths and heights.
- Whether a multi-column layout should become a single column.
- Whether navigation or button groups need to wrap or stack vertically.
- Whether the media query covers the target viewport.
- The actual narrow viewport in the browser, not only the desktop layout.
- Whether fixed elements are covered by mobile browser controls.

### 2.4 An element is not centered

**Symptom:** An element does not appear centered even though an alignment property has been added.

**Check:**

- Whether Flexbox or Grid properties are applied to the correct parent.
- The main and cross axes.
- Whether the container has available space. For example, vertical centering may not be visible if the container has no height.
- Default margins, `line-height`, and child dimensions.

### 2.5 A modal or dropdown is behind another element

**Symptom:** A modal, dropdown, or tooltip is covered by other content.

**Check:**

- Whether the element is positioned and can use `z-index` as expected.
- Whether an ancestor creates a stacking context, including through `transform`.
- Whether an ancestor’s `overflow` clips it.
- Whether a React Portal should render the overlay in a higher-level container.

### 2.6 `position: sticky` does not work

**Symptom:** A sidebar or heading does not stay visible while scrolling.

**Check:**

- Whether a threshold such as `top` or `bottom` is set.
- Whether an ancestor’s `overflow` changes the relevant scroll container.
- Whether the expected element is actually the scrolling container.
- Whether there is enough scrollable space.
- Whether the parent’s height or layout constrains the sticky element.

### 2.7 Cards have inconsistent heights or their content is clipped

**Symptom:** Card bottoms do not line up, or text and buttons are cut off.

**Check:**

- Whether the cards have an unnecessary fixed height.
- Whether images need consistent sizing, such as `object-fit`.
- Whether the content should be allowed to determine the height naturally.
- Whether Flexbox or Grid can position actions at the bottom of the card.
- Whether `overflow: hidden` clips content or focus outlines.

### 2.8 An image is distorted or overflows its container

**Symptom:** An image has the wrong proportions, extends outside the card, or causes layout shifts after loading.

A common starting point is:

```css
img {
  max-width: 100%;
  height: auto;
}
```

If an image must fill an area with a fixed aspect ratio, consider `object-fit: cover` and give the container an appropriate size or aspect ratio. Also check the parent dimensions and mobile behavior.

### 2.9 Text truncation does not show an ellipsis

**Symptom:** Text wraps, overflows, or is not truncated as expected.

Single-line truncation usually needs all of the following:

```css
.title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

The element also needs a constrained width. In Flexbox or Grid layouts, the child may need `min-width: 0`.

### 2.10 Buttons or inputs have inconsistent styling

**Symptom:** Controls in the same row have different heights, text positions, or baselines.

**Check:**

- Browser default styles.
- Consistent `font`, `line-height`, and `box-sizing` values.
- The parent’s `align-items` setting.
- Borders, padding, and default control appearance.
- Behavior in different browsers.

### 2.11 CSS is written but has no visible effect

**Debugging steps:**

1. Confirm that the class name in the component matches the CSS selector.
2. Confirm that the stylesheet is imported.
3. Check whether the rule matches the element in DevTools.
4. Inspect computed styles to see if another rule overrides it.
5. Check the project’s conventions for CSS Modules, CSS-in-JS, or global styles.
6. Confirm that a pseudo-class is in the expected state, such as the target element actually having focus.

### 2.12 Grid columns do not resize as expected

**Symptom:** Cards are too wide, do not shrink, or their contents stretch the grid.

**Check:**

- Whether `grid-template-columns` matches the intended layout.
- Whether `minmax(0, 1fr)` is needed.
- Whether a child has an excessive `min-width`.
- Whether long text, images, or tables are overflowing.
- Whether the narrow layout needs a media query or automatic column sizing.

### 2.13 Hover styles do not work reliably on touch devices

**Symptom:** A hint or important action is only available on hover.

**Check:**

- Important content and actions should not be available only through `:hover`.
- Provide a `:focus-visible` state for keyboard users.
- Confirm that touch users can discover and operate the control.
- Consider reduced-motion preferences if hover effects animate.

### 2.14 Focus outlines are clipped or invisible

**Symptom:** Tab can move focus, but the user cannot see where focus is.

**Check:**

- Whether `outline: none` was set without a replacement.
- Whether a parent’s `overflow: hidden` clips the outline.
- Whether the focus indicator has enough contrast.
- Whether the focus style only works for mouse interaction, or is otherwise hidden from keyboard users.

### 2.15 `height: 100%` has no effect

**Symptom:** A child does not fill the height of its parent despite `height: 100%`.

**Check:**

- Whether the containing block and relevant ancestors have definite heights.
- Whether the parent’s height is `auto`.
- Whether Flexbox or Grid would express the desired layout more reliably.

### 2.16 A child’s margin appears outside its parent

**Symptom:** A child’s top margin seems to collapse through the parent, or adjacent vertical spacing is not the sum you expected.

**Check:**

- Whether vertical margin collapsing is occurring.
- Whether padding, a border, or a layout gap better expresses the desired spacing.
- Whether creating a formatting context is appropriate for the layout.

### 2.17 A fixed footer or full-screen panel is awkward on mobile

**Symptom:** A fixed button is covered by browser controls, or it obscures page content.

**Check:**

- The viewport height unit in use (`vh`, `dvh`, `svh`, or `lvh`).
- Whether the fixed element covers content that needs to remain accessible.
- Whether the page needs bottom padding to account for the fixed control.
- Whether an ancestor’s `transform` affects fixed positioning.

### 2.18 An animation is janky or causes layout shifts

**Symptom:** An animation stutters, causes surrounding content to move, or performs poorly on lower-powered devices.

**Check:**

- Whether the animation changes layout-affecting properties repeatedly.
- Whether `transform` or `opacity` can achieve the desired effect.
- Whether too many elements are animated at once.
- Whether `will-change` was applied unnecessarily.
- Whether reduced-motion preferences are respected.

## 3. A Practical Process for CSS Debugging Questions

Explain your reasoning while you work:

1. **Reproduce the issue:** Confirm the viewport, steps, and expected result.
2. **Inspect the layout context:** Check the parent and child constraints, not only the element that looks wrong.
3. **Use DevTools:** Inspect computed styles, the box model, and the source of overflow.
4. **Find the smallest cause:** For example, a fixed width, an overriding selector, a stacking context, margin collapsing, or a child that cannot shrink.
5. **Make a focused fix:** Avoid using `!important` or hiding overflow to mask the issue.
6. **Regression-test:** Check desktop, narrow screens, long content, keyboard focus, and relevant browser behavior.

A useful interview phrase is:

> I’ll first reproduce the issue at the target viewport, then inspect the element’s computed styles and its parent layout. I’ll identify the smallest rule causing the problem, make a focused change, and verify it at both desktop and mobile sizes.

## 4. CSS Exercises Worth Practicing

1. Build a navigation bar and button group with Flexbox.
2. Build a responsive card grid with CSS Grid.
3. Fix horizontal scrolling on mobile.
4. Fix long text overflowing inside a flex item.
5. Make a modal or dropdown appear at the correct stacking level.
6. Fix image proportions and inconsistent card layouts.
7. Implement single-line text truncation.
8. Check focus styles and keyboard accessibility.
9. Find and fix an overridden CSS rule.
10. Adjust an existing page to match a target layout without rewriting the entire page.
11. Debug `height: 100%`, margin collapsing, or a broken sticky element.
12. Make a fixed action or full-screen panel work on mobile viewports.
13. Improve an animation while respecting reduced-motion preferences.

## 5. Priority Topics if Preparation Time Is Limited

Prioritize these areas:

1. `min-width: 0`, percentage sizing, and Flexbox/Grid overflow.
2. `overflow`, scroll containers, and `position: sticky`.
3. Stacking contexts, `z-index`, and React Portals.
4. Responsive breakpoints, mobile viewport units, and fixed positioning.
5. Browser defaults for form controls and accessible focus styles.
6. Animation performance and reduced-motion preferences.
7. CSS architecture, browser compatibility, and progressive enhancement.

Do not only memorize properties. Practice explaining **why the layout failed, how you verified your hypothesis, and how your fix addresses the cause instead of hiding the symptom**.
