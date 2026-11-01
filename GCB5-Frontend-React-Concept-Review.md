# GCB5 Frontend Engineer (React): Concept Review Guide

This guide expands the key concepts for a **GCB5 Frontend Engineer interview with React**. For each topic, try to answer three questions:

1. **What is it?**
2. **Why is it useful?**
3. **How do you use it, and what common mistakes should you avoid?**

# 1. JavaScript Fundamentals

## 1.1 `const`, `let`, `var`, and scope

### `const`

Use `const` when you do not need to reassign a variable:

```js
const name = "Ada";
// name = "Grace"; // Error: a const variable cannot be reassigned
```

If a `const` variable refers to an object or array, the object’s contents can still change:

```js
const user = { name: "Ada" };
user.name = "Grace"; // Allowed
```

`const` prevents reassignment of the variable. It does not freeze the object it refers to.

### `let`

Use `let` when you need to reassign a variable. Both `let` and `const` are block-scoped, meaning they are only available inside the `{}` block where they are declared.

### `var`

`var` is function-scoped and is hoisted. This can make a variable’s scope less obvious than expected. Modern JavaScript generally favors `const`, with `let` when reassignment is necessary.

### The temporal dead zone

`let` and `const` cannot be accessed before their declaration is reached:

```js
console.log(value); // ReferenceError
let value = 1;
```

The region before the declaration is known as the **temporal dead zone**.

**Interview answer:**

> I generally use `const` for values that should not be reassigned, and `let` when reassignment is necessary. This makes code easier to reason about and reduces accidental reassignment. However, `const` does not make objects immutable, so React state still needs to be updated by creating a new object or array.

## 1.2 Primitive values, reference values, and copying

Common primitive types are `string`, `number`, `boolean`, `null`, `undefined`, `bigint`, and `symbol`. When a primitive is assigned to another variable, its value is copied.

Objects and arrays are reference values. A variable stores a reference to the object, so assigning it to another variable does not create an independent copy:

```js
const first = { name: "Ada" };
const second = first;
second.name = "Grace";
console.log(first.name); // "Grace"
```

The spread syntax creates a **shallow copy**. The top-level object is new, but nested objects are still shared:

```js
const original = { name: "Ada", settings: { theme: "dark" } };
const copy = { ...original };
copy.settings.theme = "light";
console.log(original.settings.theme); // "light"
```

In React, copy each level that you need to change:

```js
setUser((currentUser) => ({
  ...currentUser,
  settings: {
    ...currentUser.settings,
    theme: "light",
  },
}));
```

React state should generally be updated by creating a new object or array rather than mutating the existing one. Direct mutation can make changes harder to track and may not work as expected with React’s rendering or optimization logic.

## 1.3 Functions, callbacks, and higher-order functions

In JavaScript, functions can be assigned to variables, passed as arguments, and returned from other functions.

A **callback** is a function passed to another function so that it can be called later:

```js
function greet(name, callback) {
  callback(`Hello, ${name}`);
}

greet("Ada", (message) => console.log(message));
```

React event handlers are callbacks:

```jsx
<button onClick={handleClick}>Save</button>
```

A **higher-order function** takes a function as an argument or returns a function. Array methods such as `map`, `filter`, and `reduce` are common examples.

## 1.4 Closures

A closure is a function that can access variables from the scope in which it was created, even after that outer function has finished running:

```js
function createCounter() {
  let count = 0;

  return function increment() {
    count += 1;
    return count;
  };
}

const counter = createCounter();
counter(); // 1
counter(); // 2
```

Closures are commonly used to keep private state, create configured functions, and access outer variables in callbacks.

In React, a component function runs again during each render. Functions created during a render can retain the values from that render. This can lead to a **stale closure** when an asynchronous callback or effect uses an outdated state or prop value. A closure is not inherently a bug; check effect dependencies, state update patterns, and callback lifetime when outdated values appear.

## 1.5 `this` and arrow functions

In a regular function, the value of `this` generally depends on how the function is called. When a function is called as an object method, `this` usually refers to that object.

Arrow functions do not have their own `this`; they use `this` from the surrounding scope. Modern React function components commonly use functions and arrow functions, but interviewers may still ask about `this`, particularly when discussing older class components or JavaScript in general.

## 1.6 Array methods

- **`map`** transforms each array item and returns a new array, usually with the same number of items. It is commonly used to render React lists.
- **`filter`** returns a new array containing items that match a condition.
- **`find`** returns the first matching item, or `undefined` if there is no match.
- **`some`** checks whether at least one item matches; **`every`** checks whether all items match.
- **`reduce`** combines array items into one result, such as a total or grouped object. Provide an initial value, especially to handle empty arrays.
- **`sort`** mutates the original array. Copy first when sorting React state:

```js
const sortedItems = [...items].sort((a, b) => a.price - b.price);
```

## 1.7 Destructuring, spread syntax, optional chaining, and nullish coalescing

Destructuring extracts values from an object:

```js
const { name, email } = user;
```

A default value applies when a property is `undefined`, but not when it is `null`:

```js
const { role = "member" } = user;
```

Spread syntax copies or combines arrays and objects, and is commonly used for immutable React updates:

```js
const updatedUser = { ...user, name: "Grace" };
const updatedItems = [...items, newItem];
```

Optional chaining safely accesses a property that may not exist:

```js
const city = user.profile?.address?.city;
```

Nullish coalescing uses a default only when the left side is `null` or `undefined`:

```js
const pageSize = inputValue ?? 10;
```

Unlike `||`, `??` preserves valid falsy values such as `0`, `false`, and an empty string.

# 2. Asynchronous JavaScript and Network Requests

## 2.1 Promises

A Promise represents an asynchronous operation that may complete successfully or fail. Its states are:

- `pending`: still in progress.
- `fulfilled`: completed successfully.
- `rejected`: failed.

Once a Promise settles, it does not change to another state.

## 2.2 `async` and `await`

An `async` function always returns a Promise. `await` pauses execution of the async function until the Promise settles. If the Promise is rejected, the error can be handled with `try/catch`.

```js
async function loadUsers() {
  try {
    const response = await fetch("/api/users");

    if (!response.ok) {
      throw new Error("Could not load users");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
```

`fetch()` usually rejects for network failures, but not automatically for HTTP errors such as 404 or 500. Check `response.ok`.

## 2.3 Parallel and sequential requests

When requests are independent, they can run in parallel with `Promise.all`:

```js
const [user, orders] = await Promise.all([
  fetchUser(),
  fetchOrders(),
]);
```

If any Promise passed to `Promise.all` rejects, the overall call rejects. If the second request depends on the first, run them sequentially. Use `Promise.allSettled` when you need the result of every operation even if some fail.

## 2.4 Request states in the UI

A data-driven page should account for:

- **Loading:** the request is in progress.
- **Success:** the request succeeded and returned data.
- **Empty:** the request succeeded but returned no data.
- **Error:** the request failed.
- **Retry or refresh:** the user may need a way to try again.

Also consider whether the component unmounts before a request completes, whether an older search response can overwrite a newer one, whether requests can be retried, and whether to prevent duplicate submissions while a request is running.

# 3. HTML and Browser Fundamentals

## 3.1 Semantic HTML

Semantic HTML uses elements that reflect the meaning and purpose of the content, instead of using `<div>` for everything.

Examples include `<nav>` for navigation, `<main>` for the main page content, `<article>` for independent content, `<section>` for a section, `<header>` and `<footer>` for page regions, `<button>` for an action, and `<a>` for navigation.

Semantic HTML helps browsers and assistive technologies understand the page, provides predictable keyboard behavior, improves maintainability, and helps search engines understand content.

Use a `<button>` to perform an action such as saving, deleting, or expanding content. Use an `<a>` to navigate to a URL or another location on the page. Do not use a `<div>` for an interactive control just because it can be styled to look like a button.

## 3.2 The DOM and events

The browser parses HTML into a DOM tree. JavaScript can read or modify the DOM through browser APIs. React generally manages the DOM based on component state, so directly changing React-managed DOM should be done carefully.

Events can bubble from the target element to its ancestors. `event.preventDefault()` prevents the browser’s default behavior, such as a form submission causing a page refresh. `event.stopPropagation()` prevents an event from continuing to bubble.

In React, prefer using state and component event handlers to update the UI rather than manually changing DOM elements.

# 4. CSS and Responsive Layout

## 4.1 The box model

An element consists of content, padding, border, and margin. By default, the declared `width` usually applies to the content box, so padding and borders can make the total width larger than expected.

```css
* {
  box-sizing: border-box;
}
```

With `border-box`, the declared width includes content, padding, and border, making layout calculations easier.

## 4.2 Flexbox

Flexbox is suited to one-dimensional layouts, where items are arranged primarily in a row or column.

- **Main axis:** determined by `flex-direction`.
- **Cross axis:** perpendicular to the main axis.
- `justify-content`: distributes items along the main axis.
- `align-items`: aligns items along the cross axis.
- `flex-wrap`: controls whether items wrap when space is limited.
- `gap`: sets spacing between items.

Common uses include navigation bars, button groups, card rows, and centering content.

## 4.3 CSS Grid

Grid is suited to two-dimensional layouts, where both rows and columns matter. Common uses include product card grids, dashboards, and page layouts with a main area and sidebar.

As a rule of thumb, Flexbox is often a good fit for one-directional layouts, while Grid is useful when you need to control rows and columns together. They can be used together.

## 4.4 Responsive design

Responsive design makes a UI usable at different screen sizes; it is more than shrinking a desktop layout. Consider whether multi-column layouts should become single-column, how navigation works on narrow screens, whether content overflows, whether fixed dimensions cause clipping, and whether touch targets are large enough.

```css
.cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 700px) {
  .cards {
    grid-template-columns: 1fr;
  }
}
```

`minmax(0, 1fr)` can help prevent long content from forcing a grid item wider than expected.

## 4.5 CSS specificity and debugging

If a style is not taking effect, check whether the selector matches, whether a more specific selector overrides it, whether inline styles or `!important` are involved, and whether a parent’s layout, `overflow`, fixed height, or positioning affects the element. Browser developer tools show the computed styles that actually apply.

# 5. React Concepts

## 5.1 The core idea of React

React uses components to describe the UI. A component returns UI based on its props and state:

\[
UI = f(props, state)
\]

When props or state change, React recalculates the component output and updates the parts of the DOM that need to change.

The typical flow is:

1. Components receive props and maintain state.
2. User interactions trigger event handlers.
3. Event handlers update state.
4. React renders the UI again based on the new state.

React is not simply a way to attach event handlers to the DOM. Its central idea is to describe what the UI should look like for the current state.

## 5.2 Props

Props are data that a component receives from outside, usually from its parent:

```jsx
function UserCard({ user }) {
  return <p>{user.name}</p>;
}
```

Props are inputs to a component. A child should not directly modify its props. Props can be strings, numbers, objects, arrays, functions, or JSX. A parent can pass a callback to a child so the child can notify the parent about an interaction:

```jsx
<UserCard user={user} onSelect={handleSelect} />
```

## 5.3 State

State is data managed by a component that can change over time, such as input values, whether a panel is expanded, the selected filter, server data, or loading and error status.

Good state design means storing only values that need to be tracked, avoiding values that can be calculated from existing state, placing shared state in the closest common parent, and creating new objects or arrays rather than mutating existing state.

## 5.4 One-way data flow and lifting state up

Data commonly flows from parent to child through props. When a child needs to change shared data, it calls a callback passed by the parent; the parent then updates its state.

If two child components need to share state, move that state to their closest common parent. For example, a parent can own the search term used by both a search box and a results list. This avoids maintaining conflicting copies of the same data.

## 5.5 Declarative UI

Imperative code focuses on the steps needed to change the page. Declarative code describes what the page should look like based on the current data.

A common React approach is to store state, calculate what should be displayed from that state, update state in response to interactions, and let React update the page. This is usually easier to maintain than manually finding DOM elements and changing them.

## 5.6 Rendering and re-rendering

Rendering means calling a component to calculate its UI. A component renders when it first appears and may render again when its props or state change.

A re-render does not mean the entire page’s DOM is rebuilt. React compares the new UI description with the previous one and updates the necessary DOM. State updates can cause related components in the tree to execute again; React then determines which DOM updates are required. Analyze performance issues based on evidence rather than assumptions.

## 5.7 `key`

When rendering a list, provide a stable, unique `key` for each item so React can identify it. Avoid using an array index as a key in lists that can be sorted, inserted into, or deleted from. If the order changes, React may reuse UI state for the wrong item.

```jsx
{tasks.map((task) => (
  <TaskItem key={task.id} task={task} />
))}
```

`key` is used internally by React and is not automatically passed to the component as a normal prop. Pass the ID separately if the component needs it.

# 6. React Hooks

## 6.1 The Rules of Hooks

Hooks let function components use state, effects, and other React features.

- Call Hooks at the top level of a component, not inside conditions, loops, or nested functions.
- Call Hooks only from React function components or custom Hooks.
- Keep the order of Hook calls consistent across renders.

React relies on the order of Hook calls to associate each Hook with its state. If a render skips a Hook, those associations can become incorrect.

## 6.2 `useState`

`useState` stores component state:

```jsx
const [count, setCount] = useState(0);
```

Calling the setter does not change the `count` variable in the current render. It asks React to render the component again with the new state.

When the next state depends on the previous state, use the functional form:

```jsx
setCount((previousCount) => previousCount + 1);
```

React may batch updates. The functional form calculates the next value from the latest state. When updating an object, return a new object rather than mutating the existing one.

## 6.3 `useEffect`

`useEffect` synchronizes a component with an external system, such as fetching data, adding event listeners, subscribing to data, managing timers, or interacting with a non-React library.

A useful mental model is: **When the relevant dependencies change, synchronize the external system with the latest state.**

Dependency array behavior:

- No dependency array: runs after every render.
- `[]`: runs after the initial render, subject to the component’s lifecycle and development behavior.
- `[value]`: runs after the initial render and again when `value` changes.

Include props and state values used by the effect that may change. Missing dependencies can cause the effect to use outdated values.

An effect can return a cleanup function to cancel subscriptions, clear timers, or remove event listeners:

```jsx
useEffect(() => {
  const timerId = setInterval(() => {
    setCount((count) => count + 1);
  }, 1000);

  return () => clearInterval(timerId);
}, []);
```

Common mistakes include putting every calculation inside an effect, storing duplicate state just to synchronize it, omitting dependencies, failing to clean up listeners, and allowing an older request to overwrite a newer result. If `filteredItems` can be calculated from `items` and `searchTerm` during rendering, it usually does not need its own state and effect.

## 6.4 `useRef`

`useRef` returns a mutable object whose `current` property stays available across renders. Updating `current` does not trigger a re-render.

Common uses include referencing a DOM element, storing a timer ID, or keeping a mutable value that does not need to appear in the UI.

- Updating state triggers a re-render.
- Updating a ref does not trigger a re-render.
- If a value affects what is displayed, it should generally be state rather than a ref.

## 6.5 `useMemo` and `useCallback`

`useMemo` caches a calculated value while its dependencies remain unchanged. `useCallback` caches a function reference while its dependencies remain unchanged.

These are performance optimizations, not requirements for every component. They may help when a calculation is demonstrably expensive, a memoized child repeatedly renders due to a changing function reference, or profiling identifies a rendering bottleneck.

Avoid adding memoization everywhere, adding complexity without evidence of a problem, or expecting memoization to fix incorrect state design.

## 6.6 Custom Hooks

A custom Hook is a function, usually named with a `use` prefix, that packages reusable stateful logic. Good candidates include data fetching, form state and validation, window-size subscriptions, and reusable interaction state.

A custom Hook reuses logic, not automatically the same state. Each component that calls a custom Hook generally gets its own Hook state.

# 7. React Forms

## 7.1 Controlled components

A controlled input has a value managed by React state:

```jsx
const [email, setEmail] = useState("");

<input
  value={email}
  onChange={(event) => setEmail(event.target.value)}
/>
```

Controlled inputs are useful when you need immediate validation, input values affect other UI, fields need dynamic behavior, or form state must be managed in the component.

Avoid starting with `value={undefined}` and later setting a string, which may cause a controlled/uncontrolled input warning.

## 7.2 Uncontrolled components

An uncontrolled input mainly manages its own value in the DOM. A component can read the value when needed, often through a ref. This can be appropriate for simple forms or when there is no need to manage every keystroke in React. The right choice depends on the form’s complexity and project conventions.

## 7.3 Validation and error feedback

A complete form should consider required fields, valid formats, which field has an error, when to show errors, whether to prevent duplicate submissions, how to display server-side errors, and what feedback to show after success.

Error messages should explain the problem and how to fix it, rather than simply saying “Invalid input.”

# 8. UI/UX and Accessibility

## 8.1 The goal of accessibility

Accessibility helps users with different abilities and devices understand and operate an interface. Users may rely on a keyboard, screen reader, magnification, voice control, or high-contrast settings. Accessibility often improves usability for everyone.

## 8.2 Keyboard interaction

Check that Tab moves focus in a logical order, Enter or Space activates the appropriate button, focus is clearly visible, focus moves into a dialog when it opens, focus returns to the trigger when the dialog closes, and users cannot become trapped in an unintended focus area.

## 8.3 Labels, names, and error messages

Inputs need an accessible name. The simplest approach is usually to associate a `<label>` with the input.

Error messages should clearly identify the field, explain how to fix the problem, be available to assistive technology, and not rely on red color alone.

## 8.4 ARIA

ARIA can add roles, names, or state information for assistive technologies. Prefer the correct native HTML element first. Use ARIA when native semantics are not enough. ARIA does not automatically give a `<div>` complete keyboard behavior; test keyboard interactions and screen-reader semantics after adding it.

# 9. Frontend Debugging and Engineering Practices

## 9.1 A debugging process

Interviewers may evaluate how you debug, not just the final result. Use a structured approach:

1. Clarify the expected behavior and the actual behavior.
2. Find steps that reliably reproduce the problem.
3. Identify the likely layer: data, React state, events, network, CSS, or browser behavior.
4. Check the console and network requests.
5. Inspect relevant props, state, and effects.
6. Test one hypothesis at a time.
7. Verify the fix and check related scenarios for regressions.

Avoid rewriting large sections of code or changing many styles without evidence.

## 9.2 Maintainable code

A GCB5 interview does not usually require elaborate architecture, but it does expect solid engineering habits:

- Use clear names for variables and functions.
- Give components clear responsibilities.
- Handle error, empty, and loading states.
- Avoid unnecessary duplicated logic.
- Do not add abstractions for their own sake.
- Avoid putting all UI, data handling, and network logic into one enormous component.
- When modifying an existing project, follow its existing structure and conventions.

# 10. A Structure for Interview Answers

When answering a concept question, use this structure:

1. **Definition:** Explain the concept in one or two sentences.
2. **Purpose:** Say what problem it solves.
3. **Example:** Give a practical use case.
4. **Caveat:** Mention a common pitfall or trade-off.

For example, if asked, “When do you use `useEffect`?”:

> I use `useEffect` to synchronize a component with an external system, such as fetching data, subscribing to events, or managing a timer. If a value can be calculated directly from the current props or state, I usually do not put that calculation in an effect. I also check the dependency list and provide a cleanup function for subscriptions or timers.

It is more important to explain each topic in your own words than to memorize definitions. Prioritize **immutable updates, effect dependencies, list keys, controlled forms, asynchronous UI states, responsive layouts, and keyboard accessibility**.
