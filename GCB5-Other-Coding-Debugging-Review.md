# GCB5 Frontend Engineer: Additional Coding Debugging Review

Beyond CSS and React, the GCB5 coding assessment may involve HTML, browser behavior, forms, network requests, data processing, and project setup. These issues are often mixed together: a page may appear broken because of a browser default, an unexpected response shape, request timing, or configuration rather than a CSS or React bug.

## 1. HTML and Browser Default Behavior

### Form submission reloads the page

**Possible cause:** Browsers submit forms by default, which can navigate or reload the page.

**Check:**

- Is the logic attached to the form’s `onSubmit`?
- Does the handler call `event.preventDefault()`?
- Is submission attached only to a button’s `onClick`, meaning pressing Enter may not follow the same path?

A robust approach is to handle submission through the form’s `onSubmit`, so clicking the button and submitting with the keyboard use the same logic.

### A button unintentionally submits the form

A `<button>` inside a form may act as a submit button by default. For buttons that perform another action, such as opening a dialog or clearing an input, specify `type="button"`:

```html
<button type="button">Open</button>
```

For form submission, use:

```html
<button type="submit">Save</button>
```

### Labels, focus, and keyboard behavior are incorrect

Common problems include:

- Clicking a label does not focus its input.
- Tab cannot reach an interactive element.
- Enter or Space does not activate a control.
- A `<div>` is used as a button but has no keyboard behavior or semantics.
- CSS has removed focus indicators.

First check whether the correct HTML elements are being used: use `<button>` for actions, `<a>` for navigation, and associate each input with a `<label>`.

## 2. Browser Events and Event Propagation

### Clicking a child unexpectedly triggers a parent action

For example, a card is clickable, and clicking its delete button both deletes the item and opens the card details.

**Check:**

- Whether the event bubbles from the child to the parent.
- Whether the event handler is attached at the right level.
- Whether `stopPropagation()` is appropriate for the child action.
- Whether the interaction should use separate buttons or links instead of making the entire container clickable.

Do not add `stopPropagation()` everywhere. First confirm the intended interaction.

### Rapid interactions cause duplicate submissions

Possible causes include:

- The user can click submit repeatedly.
- The submit button is not disabled while a request is in progress.
- There is no in-flight request guard.
- The backend operation is not idempotent, so repeated requests create duplicate data.

Check the event handler, submission state, and number of network requests. Set the UI state as soon as a request starts, and prevent duplicate actions when appropriate.

### `click` and `blur` ordering prevents selecting an option

In an autocomplete or dropdown, clicking an option may first blur the input. The menu can close before the option’s click handler runs.

**Check:**

- Focus changes and menu-close logic.
- Whether the menu is immediately unmounted on blur.
- Whether preventing the default blur on `mousedown` is appropriate.
- Whether mouse and keyboard interactions both work.

## 3. Network Requests and API Integration

### The URL, parameters, or HTTP method are incorrect

Check:

- Whether the URL and environment variables are correct.
- Whether query parameters are encoded.
- Whether the HTTP method matches the API contract.
- Whether the request body has the expected format.
- Whether `Content-Type` or authorization headers are required.

### A failed request is displayed as a success

`fetch()` generally does not reject automatically for HTTP 404 or 500 responses. Check the status explicitly:

```js
const response = await fetch(url);

if (!response.ok) {
  throw new Error(`Request failed: ${response.status}`);
}
```

Also verify that the `catch` block and UI state updates do not accidentally swallow the error.

### CORS or authentication problems

If the browser console reports a CORS error, the issue usually involves server configuration for allowed origins, credentials, or preflight requests. Frontend business logic alone cannot bypass the server’s CORS policy.

For authentication, check:

- Whether the expected token or cookie is included.
- Whether a request needs a `credentials` option for cookies.
- Whether the token has expired.
- Whether 401 and 403 responses have appropriate UI handling.

Do not try to “fix” CORS by disabling browser security.

### Response shape or missing data is unexpected

Possible issues include:

- The component expects an array, but the API returns `response.data.items`.
- A field is `null` or `undefined`.
- The request succeeds but returns an empty array.
- A numeric or date field is actually a string.

Inspect the actual response before deciding how to map it, provide defaults, or display an empty state. Do not assume that API data is always complete.

## 4. Async Timing and Race Conditions

Even when the React code looks correct, response timing can cause problems:

- Old search results overwrite new results.
- A request from the previous page returns after navigation.
- Repeated “Load more” clicks load the same page more than once.
- A create or delete request conflicts with a list refresh.

Debugging steps:

1. Inspect request order and response order in the Network panel.
2. Confirm whether each response still belongs to the current page state.
3. Cancel or ignore outdated requests.
4. Check whether loading state prevents duplicate operations.
5. When pagination or filters change, verify that old items and cursors are reset.

## 5. Dates, Time Zones, and Formatting

Common problems include:

- A date displays one day earlier or later than expected.
- `new Date()` parses different date strings differently.
- UTC and local time are confused.
- Invalid dates are not handled.
- Currency is built by concatenating strings and has the wrong decimals or symbol.

Check whether the API returns UTC, a timezone-qualified string, or local time. Separate stored values from display values, use explicit formatting rules, and verify time zones, null values, and invalid values.

If a task involves dates or currency, confirm the expected timezone and display format rather than making assumptions.

## 6. File Uploads and Image Loading

Possible issues include:

- Selecting a file does not update the page.
- The upload request uses `FormData` incorrectly.
- Uploads can be submitted repeatedly.
- An image URL is invalid and displays a broken image.
- Images have inconsistent proportions or cause layout shifts after loading.
- There is no fallback when an image fails to load.

Check the file input’s `change` event, file size and type constraints, request format, upload state, and image error or placeholder handling. File upload behavior can also depend on browser security rules and API requirements.

## 7. Browser Storage and Restoring Page State

A task may ask you to keep filters, a cart, or a theme setting after a refresh.

Understand the usual options:

- `sessionStorage`: generally stores data for the current tab session.
- `localStorage`: generally stores small amounts of client data across sessions.
- URL query parameters: suitable for shareable or bookmarkable filters and pagination state.

Check:

- Whether JSON parsing errors are handled.
- Whether data can still be read after its shape changes.
- Whether stored data could be incomplete or expired.
- Whether sensitive data is being stored insecurely in the browser.
- Whether URL, storage, and component state have become conflicting sources of truth.

Avoid copying server data into `localStorage` without considering cache invalidation and synchronization.

## 8. Browser DevTools and Project Environment

The issue may be caused by the environment rather than application logic:

- A JavaScript exception prevents later code from running.
- A resource returns 404.
- An API request fails or returns an error status.
- An environment variable is missing.
- A dependency version or start script is incorrect.
- The page is running under the wrong route or base path.

A useful inspection order is:

1. Confirm that the application starts successfully.
2. Check the Console for errors and relevant React warnings.
3. Check the Network panel for failed requests or resources.
4. Confirm that responses match what the component expects.
5. Check whether conditional rendering returns early.
6. Verify the current URL, route, and environment variables.

## 9. Tests and Regression Issues

An existing codebase may have tests. Common issues include:

- Existing tests fail after a change.
- Only the success path is tested, not empty or error states.
- A test query breaks after text or markup changes.
- An async test does not wait for the UI to update.
- A mock API behaves differently from the real API.

Do not change the implementation blindly just to make a test pass. Determine whether the failure represents a regression, an outdated test assumption, or an async timing issue, then verify the user-visible behavior.

## 10. A Practical Debugging Order

When you encounter an unfamiliar issue, narrow it down systematically:

1. **Reproduce the issue:** Confirm the steps, input, viewport, and expected behavior.
2. **Check the Console:** Address the earliest relevant exception or React warning.
3. **Check the Network panel:** Verify whether requests were sent, their status codes, response bodies, and order.
4. **Check the DOM and events:** Confirm that the element exists, the event fires, and browser defaults are understood.
5. **Check data and state:** Verify the data type, value, and update path used by the component.
6. **Check styles and layout:** Inspect computed styles, parent constraints, and overflow.
7. **Make the smallest fix and regression-test:** Verify the normal path and relevant edge cases.

A useful interview phrase is:

> I’ll first reproduce the issue and check the console and network panel. Then I’ll trace the data and event flow to identify whether the problem is caused by the browser, the API, or the UI. I’ll make a focused change and verify the expected behavior and relevant edge cases.

## 11. Preparation Priorities

In addition to CSS and React, review:

1. HTML form semantics, default submission behavior, and keyboard interaction.
2. Browser event bubbling, default actions, and focus changes.
3. HTTP status codes, response formats, CORS, and basic authentication debugging.
4. Async race conditions, duplicate requests, and pagination state.
5. Dates, time zones, null values, and data formatting.
6. File selection, upload state, and image-loading failures.
7. Console, Network panel, and basic test debugging.

These topics may not appear as deep standalone theory questions, but they can show up as bugs in an existing page. The key is to determine whether the root cause is **browser behavior, a request, data, interaction, or layout**, and then fix that cause systematically.
