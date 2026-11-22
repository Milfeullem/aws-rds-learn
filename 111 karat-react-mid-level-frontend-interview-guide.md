# KARAT Mid-Level Frontend Engineer Interview Guide — React

> This guide is designed for an English-language KARAT interview for a mid-level frontend engineer, GCB5, using React.
>
> The questions below are not leaked KARAT questions. They are a practical preparation guide based on the stated assessment structure and common expectations for this role.

## 1. Interview Structure

### Frontend Frameworks — approximately 10 minutes, 40%

The interviewer may ask about:

- React fundamentals
- Hooks
- State and data flow
- Async requests
- Component design
- Performance optimization
- Accessibility
- Debugging decisions from your past projects

Because this section is short, answer using this structure:

1. State the main idea first.
2. Explain the relevant mechanism.
3. Give a concise project example.
4. Mention an important trade-off or limitation.

### Frontend Coding — approximately 40 minutes, 60%

The coding assessment may require you to:

- Improve an existing page layout
- Debug an existing codebase
- Add functionality with JavaScript or React
- Work with HTML and CSS
- Handle loading, error, and empty states
- Consider accessibility and responsive design

A useful workflow is:

1. Read the existing code and understand the current behavior.
2. Restate the requirements and identify the highest-priority path.
3. Fix the most obvious functional issue first.
4. Implement the layout and feature changes.
5. Check edge cases, accessibility, and responsive behavior.
6. Test the main user flows and explain your decisions.

## 2. React Interview Questions and Sample Answers

### 2.1 What is React's core rendering model?

**Sample answer:**

React is a declarative library for building user interfaces. Instead of manually updating the DOM, I describe what the UI should look like for a particular state. When props or state change, React re-runs the relevant components, creates a new element tree, compares it with the previous tree, and commits the necessary changes to the real DOM.

A component re-render does not mean that the entire real DOM is rebuilt. React's reconciliation process determines which DOM updates are actually needed.

### 2.2 What is the difference between props and state?

**Sample answer:**

Props are values passed into a component by its parent. They are read-only from the child's perspective and are commonly used to configure a component or pass data and callbacks.

State is data managed by the component itself. It changes over time and should be updated through a state setter rather than by direct mutation.

For example, a `user` object passed into a component is a prop, while an `expanded` value controlled by that component is state. React encourages one-way data flow. A child usually notifies its parent through a callback instead of directly modifying the parent's data.

### 2.3 Why should state not be mutated directly?

**Sample answer:**

Direct mutation can make it difficult for React and optimization tools to detect that data changed. It can also produce inconsistent rendering behavior and break assumptions made by state management libraries.

Instead of mutating an object, I create a new object:

```jsx
setUser((currentUser) => ({
  ...currentUser,
  name: 'Alice',
}));
```

For arrays, I use methods such as `map`, `filter`, or the spread operator to produce a new array:

```jsx
setItems((items) =>
  items.map((item) =>
    item.id === targetId ? { ...item, completed: true } : item
  )
);
```

### 2.4 What is `useEffect` used for?

**Sample answer:**

`useEffect` is used for side effects that happen outside React's rendering process, such as fetching data, subscribing to events, setting timers, updating the document title, or integrating with a third-party library.

The dependency array determines when the effect runs. I make sure dependencies are complete and clean up subscriptions, timers, or requests when the component is unmounted or the dependencies change.

For an async request, I also handle cancellation or stale responses so that an old request cannot overwrite newer data.

I do not use `useEffect` for ordinary calculations that can be performed during rendering. Unnecessary effects can make state flow more complicated.

### 2.5 What is the difference between `useEffect` and `useLayoutEffect`?

**Sample answer:**

`useEffect` normally runs after the browser has painted the updated UI. It is the right choice for most side effects.

`useLayoutEffect` runs synchronously after the DOM has been updated but before the browser paints. It is useful when I need to measure an element or make a layout adjustment before the user sees the result.

Because it can block painting, I use `useLayoutEffect` only when the timing is important. Otherwise, I prefer `useEffect`.

### 2.6 What are `useMemo`, `useCallback`, and `React.memo` used for?

**Sample answer:**

- `useMemo` caches the result of a calculation.
- `useCallback` caches a function reference.
- `React.memo` can skip rendering a component when its props have not changed according to the comparison function.

For example, `useMemo` can be useful for an expensive filtering operation, and `useCallback` can be useful when passing a callback to a memoized child component.

I do not use these APIs everywhere by default. They add complexity and also have a maintenance cost. I first use React DevTools Profiler to confirm that unnecessary work is causing a real performance problem.

### 2.7 What is the purpose of `key` in a React list?

**Sample answer:**

A key gives each list item a stable identity so React can correctly identify elements when items are inserted, removed, or reordered.

I prefer a stable business ID:

```jsx
{todos.map((todo) => (
  <TodoItem key={todo.id} todo={todo} />
))}
```

I avoid using the array index as a key when a list can be reordered, inserted into, or deleted from. An unstable key can cause component state, input values, or focus to appear on the wrong item.

An index may be acceptable for a static list that never changes order and has no stable ID, but that is not my default choice.

### 2.8 What is the difference between controlled and uncontrolled components?

**Sample answer:**

A controlled component has its value managed by React state:

```jsx
function SearchInput() {
  const [value, setValue] = useState('');

  return (
    <input
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}
```

An uncontrolled component lets the DOM manage the value, and I read it through a ref when needed.

Controlled components are useful for live validation, conditional UI, and complex forms. Uncontrolled components can be simpler for basic forms, file inputs, or integrations with non-React code.

### 2.9 How do you handle asynchronous requests in React?

**Sample answer:**

I normally model the request with explicit states such as idle, loading, success, error, and empty. I check `response.ok`, show useful feedback, and avoid updating state after the component is no longer interested in the request.

For example, I can use an `AbortController`:

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function loadUsers() {
    setStatus('loading');

    try {
      const response = await fetch('/api/users', {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
      setStatus('success');
    } catch (error) {
      if (error.name !== 'AbortError') {
        setStatus('error');
      }
    }
  }

  loadUsers();
  return () => controller.abort();
}, []);
```

For larger applications, I may use React Query or SWR for caching, retries, request deduplication, and server-state management.

### 2.10 How do you prevent stale search results from overwriting newer results?

**Sample answer:**

Suppose a user types two search terms quickly. Request A may start first but finish after request B. If I update the UI whenever any request finishes, A could overwrite the correct results from B.

I can solve this by cancelling the previous request with `AbortController`, tracking a request ID, or using a data-fetching library that handles query keys and cancellation.

The important point is that only the latest relevant request should be allowed to update the visible result.

### 2.11 What problem does Context solve, and what are its limitations?

**Sample answer:**

Context avoids passing a value through many intermediate components. It works well for relatively global values such as the current user, theme, locale, permissions, or application configuration.

Its limitations are that changes to a provider value can re-render many consumers, and dependencies become less explicit. I avoid using one large Context for all application state. For complex or frequently changing state, a dedicated state-management or server-state library may be easier to maintain.

### 2.12 How do you decide between Context and Redux or another state library?

**Sample answer:**

Context is a built-in mechanism for making a value available to descendants. It does not by itself provide a complete state-management model.

Redux or another state library may provide reducers, actions, middleware, DevTools, predictable updates, and more granular subscriptions. I would use Context for concerns such as theme or authenticated user information, and consider a state library when the application has complex shared state, frequent updates, or substantial debugging requirements.

### 2.13 How do you design reusable React components?

**Sample answer:**

I start with a clear responsibility and a small, stable props API. I avoid putting data fetching, business rules, and presentation into a single generic component unless that coupling is intentional.

A reusable component should handle the states that are part of its responsibility, such as loading, disabled, error, or empty states. It should use semantic HTML, expose meaningful callbacks, and avoid hard-coding business-specific concepts into a generic UI component.

For example, a generic button can know about `loading` and `disabled`, but it should not know that it is saving a customer or submitting an order.

### 2.14 How do you handle errors in React?

**Sample answer:**

I use an Error Boundary or the framework's error-boundary mechanism for errors during rendering and component lifecycle execution. It can show a fallback UI instead of breaking the entire page.

Error boundaries do not automatically handle every event-handler or asynchronous error, so I handle those explicitly with `try/catch` and component-level error state.

For user-facing errors, I provide a clear message and, when appropriate, a retry action. I also log enough diagnostic information for developers without exposing sensitive implementation details to users.

### 2.15 Why might a React component render more than once?

**Sample answer:**

Possible causes include a parent re-render, a state update, changed prop references, a changed Context value, or a reducer returning a new state. In development, Strict Mode may also invoke certain functions more than once to expose unsafe side effects.

I would use React DevTools Profiler to understand whether the extra rendering is actually expensive. Then I would inspect object and function references, Context provider values, list keys, and state updates. I would only add memoization when profiling shows that it provides a meaningful benefit.

## 3. JavaScript Interview Questions

### 3.1 What is the difference between `var`, `let`, and `const`?

**Sample answer:**

`var` is function-scoped and has historical hoisting behavior that can cause confusing bugs. `let` and `const` are block-scoped and have a temporal dead zone before initialization.

`const` prevents reassignment of the variable, but it does not make an object immutable:

```js
const user = { name: 'Alice' };
user.name = 'Bob';
```

In modern code, I prefer `const`, use `let` when reassignment is required, and avoid `var`.

### 3.2 What is a closure?

**Sample answer:**

A closure occurs when a function keeps access to variables from the scope where it was created, even after the outer function has finished executing.

Closures are useful for data encapsulation, factory functions, event handlers, debouncing, and many JavaScript abstractions. They can also keep large objects alive longer than expected, so long-lived event listeners, timers, and subscriptions need proper cleanup.

### 3.3 What is the difference between debouncing and throttling?

**Sample answer:**

Debouncing waits until calls stop for a specified period before executing. It is useful for search input, resize handling, and validation.

Throttling guarantees that a function executes at most once within a time interval. It is useful for scroll, mouse movement, dragging, and high-frequency reporting.

Debouncing emphasizes the final call. Throttling limits the execution frequency throughout the interaction.

### 3.4 How do Promises and `async/await` work?

**Sample answer:**

`async/await` is syntax built on top of Promises. It makes asynchronous control flow easier to read, while errors can be handled using `try/catch`.

If requests are independent, I run them concurrently with `Promise.all`:

```js
const [users, products] = await Promise.all([
  loadUsers(),
  loadProducts(),
]);
```

If I need the result of every operation even when some fail, I use `Promise.allSettled`.

### 3.5 Explain event bubbling, capturing, and delegation.

**Sample answer:**

An event travels through a capture phase from ancestors toward the target, reaches the target, and then normally travels back through ancestors during the bubbling phase.

Event delegation attaches one listener to a common ancestor and uses `event.target` or `closest` to identify the relevant child. This is useful for dynamic lists and can reduce the number of listeners. I also verify that the matched element belongs to the expected container and account for events that do not bubble.

## 4. HTML, CSS, and Accessibility Questions

### 4.1 How do you build a responsive layout?

**Sample answer:**

I use semantic HTML and modern CSS layout tools. Flexbox is usually suitable for one-dimensional alignment, while Grid is useful for two-dimensional layouts. I use flexible units, `minmax`, `clamp`, and media queries instead of relying on fixed widths.

I generally design mobile-first and add larger-screen behavior through media queries. I also test long text, narrow viewports, zoomed content, and different input methods.

### 4.2 When do you use Flexbox versus Grid?

**Sample answer:**

I use Flexbox for one-dimensional layouts such as toolbars, navigation rows, button groups, and aligning content inside a card.

I use Grid when I need to control rows and columns together, such as dashboards, page layouts, or card grids. They can also be combined: Grid for the page structure and Flexbox inside individual components.

### 4.3 How do you make a custom button accessible?

**Sample answer:**

I first use a native `<button>` because it already provides the correct semantics, keyboard interaction, focus behavior, and browser support.

For an icon-only button, I provide an accessible name, for example with `aria-label`, and mark the decorative icon as hidden from assistive technology. I preserve a visible focus indicator and correctly represent disabled and loading states.

I avoid using a clickable `div`. If a non-native control is unavoidable, I must implement its role, keyboard behavior, focusability, and state semantics correctly.

### 4.4 What are `aria-label`, `aria-labelledby`, and `aria-describedby`?

**Sample answer:**

- `aria-label` provides an accessible name directly.
- `aria-labelledby` points to visible text that names the control.
- `aria-describedby` points to additional descriptive text, such as help or error information.

If visible text already exists, I usually prefer `aria-labelledby` to avoid duplicating a label in two places. ARIA supplements semantic HTML; it should not replace an appropriate native element.

### 4.5 How would you implement an accessible modal?

**Sample answer:**

An accessible modal should have a dialog role, an accessible title, and `aria-modal="true"`. When it opens, focus should move inside it. When it closes, focus should return to the element that opened it.

It should support Escape, keep keyboard focus within the modal, provide a usable close button, and prevent background content from being incorrectly accessed while the modal is open.

If the application already uses a mature dialog or headless UI library, I prefer to reuse its tested focus-management behavior rather than implementing all of those details from scratch.

### 4.6 Why should semantic HTML be preferred over using `div` for everything?

**Sample answer:**

Semantic elements communicate structure and behavior to browsers, assistive technologies, search engines, and other developers. A native button provides keyboard and focus behavior automatically, while a clickable `div` requires me to recreate those behaviors and is easy to get wrong.

I use elements such as `<button>`, `<a>`, `<nav>`, `<main>`, `<form>`, `<label>`, and headings according to their meaning.

## 5. Likely Frontend Coding Tasks

### 5.1 Searchable user list

A typical task may include an existing search page and ask you to:

- Fix the search behavior
- Add loading and error states
- Handle empty results
- Prevent duplicate submissions
- Improve the layout
- Support clearing the search
- Use accessible form controls

A strong implementation should:

- Trim user input
- Use `encodeURIComponent`
- Check `response.ok`
- Handle loading, error, success, and empty states
- Use a stable list key
- Disable or otherwise manage repeated submissions
- Use a real `<form>` and `<label>`
- Consider request cancellation and stale results

### 5.2 Todo list

Common bugs include:

- Toggling every item instead of one item
- Mutating the array directly
- Using an index as a key
- Adding empty todos
- Failing to clear the input
- Incorrect filtering
- Deleting the wrong item

The expected solution should use immutable updates, stable IDs, controlled input state, and clear event handlers. It should also handle empty input and provide accessible labels for checkboxes and buttons.

### 5.3 Tabs

A tabs task may require:

- Switching content when a tab is clicked
- Highlighting the active tab
- Supporting left and right arrow keys
- Using `role="tablist"`, `role="tab"`, and `role="tabpanel"`
- Connecting tabs and panels with `aria-controls` and `aria-labelledby`

If time is limited, implement the correct core behavior first, then add roving `tabIndex`, focus movement, and additional keyboard behavior.

### 5.4 Debounced search

For a search box that automatically searches after the user stops typing, create and clear a timer in an effect. Be careful about effect dependencies and request races. If the callback is recreated by the parent on every render, use a stable callback or move the debouncing logic to an appropriate custom hook.

## 6. Common Debugging Questions

### 6.1 Why does this counter increase only by one?

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

Both updates read the same `count` value from the current closure, so both request the same next value. Use functional updates:

```jsx
function handleClick() {
  setCount((current) => current + 1);
  setCount((current) => current + 1);
}
```

### 6.2 Why does React warn about a controlled input?

If an input starts with `undefined` and later receives a string, it changes from uncontrolled to controlled. Use a consistent initial value:

```jsx
const [value, setValue] = useState('');
```

Or normalize the value:

```jsx
<input value={value ?? ''} onChange={handleChange} />
```

### 6.3 Why can an effect run repeatedly?

An object or function created inside a component has a new reference on every render. If it is included as an effect dependency, React sees it as changed even when its contents are equal.

Possible solutions include moving constant values outside the component, depending on primitive values, or using `useMemo` or `useCallback` when that is justified by the design and performance needs.

### 6.4 Why do inputs appear to move to the wrong list item?

Using an array index as a key can cause React to reuse a component instance for a different data item after insertion, deletion, or sorting. Use a stable item ID instead.

### 6.5 Why does clicking a reset button submit the form?

A button inside a form defaults to `type="submit"`. If it is not a submit button, declare its type explicitly:

```jsx
<button type="button" onClick={handleReset}>
  Reset
</button>
```

## 7. Project and Behavioral Questions

### 7.1 Tell me about a React project you worked on.

**Sample answer:**

I worked on a React-based administration platform for managing customers and orders. My main responsibility was building reusable components for filtering, pagination, forms, and detail views.

One challenge was preventing stale API responses from overwriting newer search results. We solved it by using request cancellation and stable query keys. I also added loading, error, and empty states to improve the user experience.

The result was a more stable search experience and components that could be reused across multiple business pages.

### 7.2 Tell me about a React performance problem you solved.

**Sample answer:**

I encountered a list page where updating one control caused expensive parts of the page to render again. I first used React DevTools Profiler to identify the slow components. I then found that the parent created new object and callback references on every render.

I split the list item into a focused component and used `React.memo`, `useCallback`, and `useMemo` only where they addressed the measured problem. For larger data sets, I would also consider pagination or virtualization.

I avoid adding memoization everywhere because it increases complexity and is not always a performance improvement.

### 7.3 How do you ensure accessibility in a React application?

**Sample answer:**

I start with semantic HTML, use real buttons and links, associate labels with inputs, preserve visible focus styles, and make sure keyboard users can complete the primary flows. I provide meaningful alternative text for images and use appropriate live-region or alert semantics for important errors.

For complex widgets such as dialogs, tabs, or menus, I follow the expected keyboard and ARIA patterns. I also test with automated accessibility tools and, when possible, a keyboard-only workflow or screen reader.

### 7.4 How do you deal with unclear requirements during a coding task?

**Sample answer:**

I first identify the user-visible behavior that is clearly required and state my assumptions aloud. If there is an ambiguity that changes the implementation, I ask a focused question. Otherwise, I choose a reasonable default, implement the core path, and make the assumption easy to change.

I also prioritize working functionality and explain which improvements I would make next if more time were available.

## 8. Recommended 40-Minute Coding Time Plan

### Minutes 0–5: Understand the task

- Read the file structure.
- Find the entry point and relevant components.
- Check how data currently flows.
- Restate the requirements.
- Identify the main user flow.

Suggested English phrase:

> Let me first confirm the requirements. The page already displays the list, and I need to fix the filtering logic, improve the mobile layout, and add loading and empty states. I will keep the existing structure where possible and make the smallest safe changes first.

### Minutes 5–10: Locate the issues

Check:

- Browser console errors
- React warnings
- Network requests
- State update logic
- List keys
- Form default behavior
- Fixed widths and overflow
- Missing labels or keyboard behavior

### Minutes 10–28: Implement the core functionality

Prioritize:

- Correct data display
- Correct state updates
- Correct form submission
- Correct list actions
- The most visible layout fixes

Do not spend most of the interview polishing minor visual details before the main flow works.

### Minutes 28–35: Add edge cases

Check:

- Empty input
- Empty results
- Request failure
- Repeated clicks
- Long text
- Small screens
- Keyboard access
- Duplicate or rapidly changing requests
- Deleting the last item

### Minutes 35–40: Verify and summarize

Suggested English phrase:

> The main functionality is now complete. I am checking the edge cases next: empty input, no results, request failure, duplicate submission, and mobile layout. With the remaining time, I will improve the accessibility and remove any unnecessary duplication.

## 9. High-Priority Topics to Review

### React

1. Props and state
2. `useState`
3. `useEffect`
4. Functional state updates
5. `useMemo`, `useCallback`, and `React.memo`
6. Stable list keys
7. Controlled components
8. Async requests and race conditions
9. Context
10. State lifting and component boundaries

### JavaScript

1. Closures
2. Promises and `async/await`
3. Debouncing and throttling
4. Event bubbling and delegation
5. Immutable array and object updates
6. `this`
7. `var`, `let`, and `const`
8. `Promise.all` and `Promise.allSettled`
9. Null and undefined handling
10. DOM event behavior

### HTML and CSS

1. Flexbox and Grid
2. Responsive layouts
3. The box model
4. Semantic HTML
5. Forms and labels
6. Keyboard accessibility
7. Dialog focus management
8. CSS specificity
9. Positioning
10. Long text and overflow behavior

## 10. Strong Closing Summary

If the interviewer asks you to summarize your implementation, you can say:

> I first made sure that the core user flow worked, then handled loading, error, and empty states. In React, I kept the data flow one-way, updated state immutably, and used stable keys for lists. For asynchronous requests, I checked the HTTP status and considered cancellation and stale responses. For layout, I used Flexbox or Grid with responsive breakpoints. For accessibility, I preferred semantic HTML and made sure that forms, buttons, keyboard interaction, and focus states were usable. Finally, I tested edge cases instead of validating only the happy path.

## 11. Useful English Phrases During the Interview

### Clarifying the task

- “Let me restate the requirements to make sure I understand them correctly.”
- “I will start with the main user flow and then handle the edge cases.”
- “I am assuming that this list can be reordered, so I will use a stable ID rather than the array index.”

### Explaining a decision

- “I am using a functional state update because the new value depends on the previous state.”
- “I am checking `response.ok` because `fetch` does not reject automatically for HTTP error statuses.”
- “I prefer a native button here because it provides keyboard and accessibility behavior by default.”
- “I would verify this optimization with the React Profiler before adding memoization.”

### Discussing trade-offs

- “This is the simplest solution for the current scope. For a larger application, I would consider a dedicated server-state library.”
- “I am keeping this component focused on presentation and keeping the data-fetching logic outside it.”
- “With more time, I would add automated tests for the loading, error, and race-condition cases.”

### If you discover a bug while coding

- “I found that the button is submitting the form because its default type is `submit`.”
- “The issue is caused by using the array index as the key, which makes React reuse the wrong component instance.”
- “The effect is running again because this object has a new reference on every render.”
