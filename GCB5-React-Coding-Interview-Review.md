# GCB5 Frontend Engineer: React Coding Interview Review

Based on the role description, a GCB5 coding interview is likely to involve more than writing a standalone CSS solution. You may be asked to work in an existing frontend codebase, understand how it works, improve a page, debug a problem, and add functionality using HTML, CSS, JavaScript, and React.

## 1. What May Be Tested Beyond CSS?

### 1.1 JavaScript functionality

Common tasks involve processing data and updating the UI, such as:

- Searching, filtering, and sorting a list.
- Adding, deleting, or editing list items.
- Validating a form and showing errors.
- Implementing pagination or a “Load more” button.
- Handling empty input, no results, or repeated clicks.
- Updating the UI based on user actions.

**Example: Product list**

Given a list of products:

- Search by name, case-insensitively.
- Filter by category.
- Sort by price in ascending or descending order.
- Display an empty state when there are no matches.
- Do not mutate the original array.

This tests `map`, `filter`, `find`, `sort`, immutable updates, and edge cases.

**Example: Form**

Build a registration or feedback form with:

- Required-field validation.
- Email format validation.
- A loading state during submission.
- Protection against duplicate submissions.
- Success and error feedback.

This tests event handling, input state, conditional rendering, and asynchronous logic.

### 1.2 React state and component issues

A React task may ask you to fix an existing state problem, for example:

- Typing in an input does not update the page.
- A list becomes inconsistent after an item is added or deleted.
- A child component cannot update data owned by its parent.
- State is stored in the wrong component.
- Derived data is stored separately and becomes out of sync.
- A component or effect runs more often than expected.

For example, delete an item by creating a new array:

```jsx
setItems((currentItems) =>
  currentItems.filter((item) => item.id !== id)
);
```

Do not mutate the state array directly with methods such as `splice()`.

**Key areas to understand:**

- The difference between props and state.
- Whether state is owned by the right component.
- Immutable updates.
- Child-to-parent communication through callbacks.
- Whether a value can be derived from existing state instead of stored again.

### 1.3 List rendering and `key`

Possible symptoms include:

- After adding or deleting an item, input values appear on the wrong row.
- Sorting causes a row to display the wrong state.
- React warns that list items need keys.

Check that each list item has a stable, unique key. Avoid using the array index when the list can be sorted, inserted into, or deleted from. A key should come from a stable item ID when possible.

This is not just about removing a console warning: an unstable key can cause actual UI state to become associated with the wrong item.

### 1.4 React Hooks and `useEffect`

Possible debugging tasks include:

- An effect is missing a dependency and uses old props or state.
- Typing triggers a request on every keystroke, without debouncing.
- A request continues after the component unmounts.
- Timers or event listeners are registered repeatedly.
- An effect runs repeatedly because an object dependency is recreated on each render.
- A calculation is stored in state and synchronized with an effect, causing duplicate state or flicker.

When debugging, ask:

1. Does this effect need to exist?
2. Which external system is it synchronizing with?
3. Which props and state values does it read?
4. Which changes should cause it to run again?
5. Does it need to clean up a timer, listener, or request?

Possible fixes include adding the correct dependencies, using a functional state update to avoid relying on a stale value, cleaning up timers and listeners, or deriving a value during render instead of storing it in state.

### 1.5 API requests and asynchronous states

You may be asked to connect a page to an API or repair existing request logic. At a minimum, handle:

- Loading.
- Success with data.
- Success with no data.
- Request failure.
- Retry.
- Duplicate requests.
- Responses arriving out of order.

For a search race condition, a user might search for `ca` and then `cat`. If the `ca` request returns later, it could overwrite the newer result. Possible solutions include:

- Debouncing input to reduce request frequency.
- Cancelling outdated requests with `AbortController`.
- Using a request ID to ignore stale responses.
- Setting and clearing loading state consistently.

Remember that `fetch()` generally does not reject for HTTP 404 or 500 responses. Check `response.ok`.

### 1.6 Forms and input interactions

Form tasks may test more than CSS:

- Whether a controlled input correctly pairs `value` and `onChange`.
- How empty and invalid values are handled.
- Whether an error appears next to the correct field.
- Whether the submit button is disabled while submitting.
- Whether the form works with a keyboard.
- Whether an ordinary button accidentally submits the form.
- Whether the browser’s default submit behavior reloads the page.

Controlled inputs are useful when the UI needs immediate validation, search, or dynamic behavior. Avoid switching an input between uncontrolled and controlled modes across renders.

### 1.7 HTML semantics and accessibility

A debugging task may include issues such as:

- A clickable `<div>` cannot be operated with a keyboard.
- An input has no associated `<label>`.
- An image has missing or inappropriate `alt` text.
- An error is communicated only through color.
- A delete button has no clear accessible name.
- Tab order is confusing or focus styles have been removed.
- A modal cannot be closed with Escape or does not manage focus correctly.

Prefer the correct native elements:

- Use `<button>` for actions.
- Use `<a>` for navigation.
- Associate a `<label>` with each form input.
- Keep focus indicators visible.

ARIA can add semantics, but it does not replace the correct HTML element or keyboard behavior.

### 1.8 Browser events and component interactions

Possible topics include:

- Preventing a form submission from reloading the page.
- Understanding event bubbling between parent and child elements.
- A click inside a dropdown or modal unintentionally closing it.
- An autocomplete option becoming unselectable because the input blurs before the option click runs.
- An event handler being called during render instead of on interaction.

Check whether the handler is passed as a function, whether `preventDefault()` or `stopPropagation()` is appropriate, where the outside-click handler is attached, and whether mouse, keyboard, and touch interactions are supported.

### 1.9 Reading and modifying an existing codebase

The role description specifically mentions improving an existing codebase. You may need to understand the project before changing it rather than start from an empty file.

You may be evaluated on whether you can:

- Find the page entry point and relevant components.
- Understand where data comes from and which component owns state.
- Follow the existing CSS organization and component conventions.
- Add a feature without breaking existing behavior.
- Decide whether new logic belongs in a component or custom Hook.
- Make proportionate improvements without unnecessary rewrites.

A quick initial review should locate the component entry point, data structure, existing state, event handlers, relevant styles, and any console errors or tests. Do not rewrite a component just because its code could be cleaner. First satisfy the requirement, then make any necessary refactoring.

## 2. React Problems You May Be Asked to Fix

### Problem 1: An input cannot be edited

**Common causes:**

- A `value` is provided, but the corresponding state is not updated.
- `onChange` does not call the state setter.
- The value is reset to a constant on every render.
- The input switches between `undefined` and a string across renders.

**Fix approach:** Trace the value’s source and update path. Ensure `value` and `onChange` use the same state.

### Problem 2: A button runs on page load or behaves unexpectedly

A common mistake is:

```jsx
<button onClick={handleClick()}>Save</button>
```

This calls `handleClick` during render instead of passing the function to React. Usually write:

```jsx
<button onClick={handleClick}>Save</button>
```

To pass an argument:

```jsx
<button onClick={() => handleDelete(item.id)}>Delete</button>
```

If an action still runs multiple times, check for duplicate listeners, repeated effect setup, or duplicate form submissions.

### Problem 3: The UI does not update after changing an array or object

**Common causes:**

- The existing array or object was mutated directly.
- The setter receives the same reference.
- A nested level was not copied.

**Fix approach:** Create a new array or object and calculate it from the latest state. Use a functional state update when the new value depends on the previous value.

### Problem 4: Rows show the wrong state after a list update

**Common causes:**

- Array indexes are used as keys.
- The list supports deletion, sorting, insertion, or filtering.
- Keys are duplicate or unstable.

**Fix approach:** Use a stable, unique ID for each data item and test the behavior after insertions, deletions, and sorting.

### Problem 5: `useEffect` makes repeated requests or creates a loop

**Common causes:**

- Dependencies are missing or unstable.
- The effect updates one of its own dependencies and retriggers itself.
- A new object or function is created on each render and used as a dependency.
- The effect is doing a calculation that could happen during render.

**Fix approach:** Identify the purpose of the effect, inspect dependency identities, and clarify which changes should trigger synchronization. Do not remove dependencies arbitrarily just to stop a loop; adjust the data flow or the effect’s responsibility.

### Problem 6: A component uses old props or state

**Common causes:**

- An asynchronous callback closes over an old value.
- An effect dependency is missing.
- Multiple asynchronous requests complete in an unexpected order.

**Fix approach:** Add the correct effect dependencies, use functional state updates, cancel or ignore stale requests, and use a ref for the latest value only when it should not trigger a UI render. Do not use a ref as a replacement for UI state.

### Problem 7: Old search results overwrite new results

**Cause:** Multiple searches are in flight, and their responses arrive in a different order from the requests.

**Fix approach:** Debounce, cancel older requests, or use request IDs to ignore stale responses. Also handle an empty query and treat an intentional abort as a cancellation rather than a user-facing error.

### Problem 8: Async work continues after a component unmounts

**Common causes:**

- A request is still running after the component unmounts.
- An effect registers a listener or timer but does not clean it up.
- An observer or subscription remains active after dependencies change.

**Fix approach:** In the effect cleanup, clear timers, remove listeners, disconnect observers, or cancel requests. Also ensure old results cannot update the current UI.

### Problem 9: A child updates data, but other components do not stay in sync

**Common causes:**

- Shared state is owned by a child component.
- The child updates only its own local copy.
- The parent does not provide an update callback.

**Fix approach:** Lift shared state to the closest common parent, then pass data and callbacks to the children. Avoid keeping separate mutable copies of the same data in multiple components.

### Problem 10: A list page is blank or has incomplete states

**Common causes:**

- Only the success state is implemented.
- The code assumes the API always returns data.
- There is no error UI when a request fails.
- The response shape differs from what the component expects.

**Fix approach:** Explicitly handle loading, success, empty, and error states. Check the API response shape and boundary cases.

### Problem 11: The page briefly flickers after deleting or submitting

**Common causes:**

- Duplicate data state is maintained.
- An effect synchronizes multiple pieces of state back and forth.
- Request state is not managed consistently.
- Temporary client data and the server response are reconciled inconsistently.

**Fix approach:** Identify a single source of truth, distinguish local UI state from server data, and decide explicitly whether to retain old data or show loading during a request.

### Problem 12: A modal or dropdown interaction is incomplete

Possible symptoms include:

- Focus does not move into the modal when it opens.
- Escape does not close it.
- Clicking inside the content also triggers backdrop dismissal.
- Focus does not return to the trigger after closing.
- An ancestor’s overflow or stacking context clips the overlay.

Check React state, event bubbling, keyboard handling, focus management, `z-index`, ancestor overflow, and whether a Portal is needed.

## 3. React Coding Exercises Worth Practicing

### Exercise A: Filterable task list

Implement:

- Add, delete, and complete tasks.
- Filter by all, active, and completed tasks.
- Prevent empty tasks from being added.
- Display the number of active tasks.
- Use stable IDs as keys.
- Support keyboard interaction.

**Focus areas:** state design, forms, list updates, derived values, semantic HTML.

### Exercise B: Product search

Implement:

- Search by product name.
- Filter by category.
- Sort by price.
- Show an empty state.
- Display cards responsively.

**Focus areas:** array methods, immutable data, React state, CSS Grid or Flexbox.

### Exercise C: Contact list with an API

Implement:

- Initial loading state.
- Success and empty states.
- Error message and retry button.
- Search.
- Protection against stale responses when the user types quickly.

**Focus areas:** `useEffect`, async states, cleanup, race conditions.

### Exercise D: Fix an existing form

Possible issues may include:

- Input values do not update.
- Validation messages are incorrect.
- Submitting reloads the page.
- The user can submit repeatedly while a request is running.
- Labels are not associated with inputs.
- Error messages are inaccessible.

**Focus areas:** controlled components, form events, error state, accessibility.

## 4. A Practical Interview Workflow

1. **Restate the requirement:** Confirm the expected behavior and scope.
2. **Read the code:** Locate relevant components, state, data structures, and styles.
3. **Identify the state model:** Distinguish data state, request state, and temporary UI state.
4. **Implement the functionality first:** Build the smallest working solution, then refine styling and details.
5. **Test edge cases:** Empty input, no data, errors, repeated clicks, narrow screens, and keyboard use.
6. **Explain trade-offs:** Say why state belongs in a particular component, why you chose a Hook, and how you avoid side effects or duplicated data.

A useful phrase is:

> I’ll first understand the existing component and data flow, then reproduce the issue. I’ll make the smallest change that fixes the root cause, and verify both the normal path and relevant edge cases.

## 5. Recommended Preparation Priorities

Based on the role description, prioritize:

1. React state, props, component data flow, and list rendering.
2. JavaScript array operations, event handling, and asynchronous requests.
3. Forms and common interactions such as search, filtering, and sorting.
4. `useEffect` dependencies, cleanup, and request race conditions.
5. HTML semantics, keyboard interaction, and basic accessibility.
6. CSS layouts and responsive pages.
7. Reading and modifying existing code instead of rewriting it from scratch.

The coding assessment is likely to focus on improving a page, debugging, and adding functionality in an existing codebase. Prepare around the workflow **read the code → identify the root cause → make a focused fix → verify edge cases**, rather than focusing only on CSS properties or algorithm problems.
