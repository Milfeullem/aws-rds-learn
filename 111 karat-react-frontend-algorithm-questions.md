# KARAT Mid-Level Frontend Engineer — React Algorithm Questions

> This document focuses on the algorithm and JavaScript logic topics that may appear in an English-language KARAT frontend interview.
>
> Based on the described assessment, the interview is more likely to include frontend-oriented data processing and JavaScript logic than difficult standalone LeetCode problems. The coding assessment emphasizes debugging an existing codebase, improving a page layout, and adding functionality with HTML, CSS, JavaScript, or React.

## 1. What Kind of Algorithm Questions Are Likely?

The most likely topics are:

- Filtering, sorting, and transforming arrays
- Grouping data by a property
- Removing duplicates
- Counting frequencies
- Searching user or product data
- Pagination
- Converting flat data into a tree
- Flattening nested data
- Debounce and throttle
- Promise concurrency control
- Basic stack, queue, BFS, and DFS problems
- Time and space complexity

Traditional advanced algorithm topics such as red-black trees, advanced dynamic programming, graph theory, or segment trees are usually lower priority for this frontend-focused assessment unless the recruiter specifically says otherwise.

## 2. Recommended Answer Structure in English

Do not silently start coding. Use this process:

### Step 1: Clarify the requirements

Useful phrases:

> Let me clarify the input and output first. Is the input guaranteed to be sorted? Can the array contain duplicates? What should I return if no match is found?

### Step 2: Explain the straightforward solution

> A straightforward solution would use nested loops, which would take O(n²) time.

### Step 3: Explain the optimized approach

> We can improve this by using a `Map` to store previously seen values, reducing the time complexity to O(n).

### Step 4: Mention edge cases

> I will consider an empty array, duplicate values, negative numbers, and the case where no result exists.

### Step 5: Test the implementation

> Let me test this with a normal case, an empty input, and a case where no result exists.

### Step 6: State complexity

> The time complexity is O(n), and the additional space complexity is O(n).

## 3. Array and Object Data Processing

### 3.1 Count users by department

**Question:**

> Given a list of users, return the number of users in each department.

```js
function countUsersByDepartment(users) {
  return users.reduce((result, user) => {
    const department = user.department;

    result[department] = (result[department] || 0) + 1;
    return result;
  }, {});
}
```

**English explanation:**

> I use `reduce` to build a frequency map. Each user is processed once, so the time complexity is O(n).

**Complexity:**

- Time: O(n)
- Space: O(k), where k is the number of departments

### 3.2 Remove duplicates by ID

**Question:**

> Remove duplicate users based on their ID.

```js
function uniqueUsers(users) {
  const seen = new Set();

  return users.filter((user) => {
    if (seen.has(user.id)) {
      return false;
    }

    seen.add(user.id);
    return true;
  });
}
```

**English explanation:**

> I use a `Set` to track IDs that have already appeared. This gives us O(n) time and O(n) additional space in the worst case.

### 3.3 Group products by category

**Question:**

> Group products by category.

```js
function groupByCategory(products) {
  return products.reduce((groups, product) => {
    const category = product.category;

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(product);
    return groups;
  }, {});
}
```

**English explanation:**

> I create a lookup object where each category maps to an array of products. The time complexity is O(n).

A reusable version could accept a key selector:

```js
function groupBy(items, getKey) {
  return items.reduce((groups, item) => {
    const key = getKey(item);

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(item);
    return groups;
  }, {});
}
```

### 3.4 Search and filter users

**Question:**

> Filter users by name and email, ignoring case.

```js
function searchUsers(users, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return users;
  }

  return users.filter((user) => {
    const name = user.name.toLowerCase();
    const email = user.email.toLowerCase();

    return (
      name.includes(normalizedQuery) ||
      email.includes(normalizedQuery)
    );
  });
}
```

**English explanation:**

> I normalize the query once instead of doing it repeatedly. I also define the empty-query behavior explicitly.

### 3.5 Implement pagination

**Question:**

> Return the items for a specific page.

```js
function paginate(items, page, pageSize) {
  if (page < 1 || pageSize < 1) {
    return {
      items: [],
      page,
      pageSize,
      total: items.length,
      totalPages: 0,
    };
  }

  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    total: items.length,
    totalPages: Math.ceil(items.length / pageSize),
  };
}
```

**English explanation:**

> The start index is derived from the page number and page size. `slice` returns the requested range without mutating the original array.

Important edge cases include an empty array, a page number larger than the total number of pages, and invalid page values.

## 4. Tree and Nested Data

### 4.1 Convert a flat array into a tree

**Question:**

> Convert a flat list of items with `parentId` values into a nested tree.

Example input:

```js
const items = [
  { id: 1, parentId: null, name: 'Products' },
  { id: 2, parentId: 1, name: 'Books' },
  { id: 3, parentId: 1, name: 'Games' },
];
```

Implementation:

```js
function buildTree(items) {
  const nodes = new Map();
  const roots = [];

  for (const item of items) {
    nodes.set(item.id, {
      ...item,
      children: [],
    });
  }

  for (const item of items) {
    const node = nodes.get(item.id);

    if (item.parentId === null) {
      roots.push(node);
      continue;
    }

    const parent = nodes.get(item.parentId);

    if (parent) {
      parent.children.push(node);
    }
  }

  return roots;
}
```

**English explanation:**

> I first create a map from IDs to nodes. Then I make a second pass to connect each node to its parent. This is O(n) time and avoids repeatedly searching the array.

**Complexity:**

- Time: O(n)
- Space: O(n)

Possible follow-up questions:

- What should happen if a parent does not exist?
- How would you detect a cycle?
- How would you preserve the original ordering?
- How would you flatten the tree again?

### 4.2 Flatten a nested tree

**Question:**

> Flatten a nested menu tree into a list.

```js
function flattenTree(nodes) {
  const result = [];

  function visit(nodeList) {
    for (const node of nodeList) {
      result.push(node);

      if (node.children?.length) {
        visit(node.children);
      }
    }
  }

  visit(nodes);
  return result;
}
```

A version that preserves the nesting depth:

```js
function flattenTreeWithDepth(nodes) {
  const result = [];

  function visit(nodeList, depth) {
    for (const node of nodeList) {
      result.push({
        ...node,
        depth,
      });

      if (node.children?.length) {
        visit(node.children, depth + 1);
      }
    }
  }

  visit(nodes, 0);
  return result;
}
```

**English explanation:**

> I use a depth-first traversal. Each node is visited once, so the time complexity is O(n), while the recursion stack depends on the maximum tree depth.

## 5. Frontend-Specific Algorithm Questions

### 5.1 Implement debounce

**Question:**

> Implement a debounce function that delays execution until the calls stop for a specified period.

```js
function debounce(fn, delay) {
  let timer = null;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

**English explanation:**

> Each call clears the previous timer and schedules a new one. The function runs only after no new call has happened during the delay.

Typical use cases:

- Search inputs
- Window resize
- Form validation
- Autosave

A cancellable version:

```js
function debounce(fn, delay) {
  let timer = null;

  function debounced(...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  }

  debounced.cancel = () => {
    clearTimeout(timer);
    timer = null;
  };

  return debounced;
}
```

Possible follow-ups:

- Should the function execute immediately on the first call?
- How do you cancel the pending execution?
- How do you preserve `this` and arguments?
- How do you clean it up when a React component unmounts?

### 5.2 Implement throttle

**Question:**

> Implement a throttle function that runs at most once during a specified interval.

```js
function throttle(fn, interval) {
  let lastTime = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}
```

**English explanation:**

> Throttling limits the execution frequency. Unlike debouncing, it can execute repeatedly during a continuous interaction.

Typical use cases:

- Scroll handlers
- Mouse movement
- Dragging
- High-frequency analytics

A follow-up may ask about a trailing call, meaning whether the final call during the throttling period should also execute.

### 5.3 Implement a simple memoization function

```js
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);

    return result;
  };
}
```

Important limitations to mention:

- `JSON.stringify` does not work as a universal key strategy
- Object property order can affect the key
- The cache can grow without limits
- Async functions require special handling
- Real applications may need expiration or an eviction policy

### 5.4 Limit concurrent async tasks

**Question:**

> Given a list of async tasks, run at most two tasks at the same time while preserving the result order.

```js
async function runWithConcurrency(tasks, limit) {
  const results = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;

      results[currentIndex] = await tasks[currentIndex]();
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, tasks.length) },
    () => worker()
  );

  await Promise.all(workers);
  return results;
}
```

**English explanation:**

> I create a fixed number of workers. Each worker takes the next available task and stores the result at its original index, so the output order is preserved even if tasks finish in a different order.

Possible follow-ups:

- What happens if one task rejects?
- Should other tasks continue after a failure?
- How would you add retries?
- How would you support cancellation?
- What should happen when `tasks` is empty or `limit` is invalid?

### 5.5 Implement a simple event bus

```js
function createEventBus() {
  const listeners = new Map();

  return {
    on(eventName, handler) {
      if (!listeners.has(eventName)) {
        listeners.set(eventName, new Set());
      }

      listeners.get(eventName).add(handler);

      return () => {
        listeners.get(eventName)?.delete(handler);
      };
    },

    emit(eventName, payload) {
      listeners.get(eventName)?.forEach((handler) => {
        handler(payload);
      });
    },
  };
}
```

**English explanation:**

> The `on` method returns an unsubscribe function. That is important for preventing stale listeners and memory leaks.

This problem tests:

- Closures
- `Map` and `Set`
- Publish-subscribe design
- Cleanup behavior
- Memory-leak awareness

## 6. Basic Interview Algorithms

### 6.1 Two Sum

**Question:**

> Given an array of numbers and a target, return the indexes of two numbers that add up to the target.

```js
function twoSum(numbers, target) {
  const seen = new Map();

  for (let index = 0; index < numbers.length; index += 1) {
    const complement = target - numbers[index];

    if (seen.has(complement)) {
      return [seen.get(complement), index];
    }

    seen.set(numbers[index], index);
  }

  return [];
}
```

**English explanation:**

> For each number, I check whether its complement has already appeared. The map gives an average constant-time lookup, so the overall time complexity is O(n).

- Time: O(n)
- Space: O(n)

### 6.2 Valid parentheses

**Question:**

> Determine whether a string of brackets is valid.

```js
function isValidParentheses(value) {
  const pairs = {
    ')': '(',
    ']': '[',
    '}': '{',
  };

  const stack = [];

  for (const character of value) {
    if (character === '(' || character === '[' || character === '{') {
      stack.push(character);
      continue;
    }

    if (pairs[character] !== stack.pop()) {
      return false;
    }
  }

  return stack.length === 0;
}
```

This problem tests the stack data structure.

- Time: O(n)
- Space: O(n)

### 6.3 Merge two sorted arrays

**Question:**

> Merge two sorted arrays into one sorted array.

```js
function mergeSortedArrays(first, second) {
  const result = [];
  let left = 0;
  let right = 0;

  while (left < first.length && right < second.length) {
    if (first[left] <= second[right]) {
      result.push(first[left]);
      left += 1;
    } else {
      result.push(second[right]);
      right += 1;
    }
  }

  return result
    .concat(first.slice(left))
    .concat(second.slice(right));
}
```

**English explanation:**

> Because both arrays are already sorted, I use two pointers and always select the smaller current value.

- Time: O(n + m)
- Space: O(n + m)

### 6.4 Binary search

**Question:**

> Find the index of a target in a sorted array.

```js
function binarySearch(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);

    if (numbers[middle] === target) {
      return middle;
    }

    if (numbers[middle] < target) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return -1;
}
```

**English explanation:**

> This solution assumes the input array is sorted. Each comparison removes approximately half of the remaining search range.

- Time: O(log n)
- Space: O(1)

### 6.5 Flatten a nested array

```js
function flatten(items) {
  const result = [];

  function visit(values) {
    for (const value of values) {
      if (Array.isArray(value)) {
        visit(value);
      } else {
        result.push(value);
      }
    }
  }

  visit(items);
  return result;
}
```

Example:

```js
flatten([1, [2, [3, 4]], 5]);
// [1, 2, 3, 4, 5]
```

**English explanation:**

> I use recursion to traverse nested arrays. Every value is visited once, so the time complexity is O(n), where n is the total number of values.

### 6.6 Breadth-first search on a tree

```js
function findNode(root, targetId) {
  if (!root) {
    return null;
  }

  const queue = [root];
  let index = 0;

  while (index < queue.length) {
    const current = queue[index];
    index += 1;

    if (current.id === targetId) {
      return current;
    }

    queue.push(...(current.children || []));
  }

  return null;
}
```

Using an index instead of repeatedly calling `shift()` avoids moving all remaining elements in the array.

**English explanation:**

> I use a queue to visit nodes level by level. The index acts as the queue pointer, so I do not need to remove elements from the beginning of the array.

## 7. Complexity Cheat Sheet

| Operation | Typical complexity |
|---|---:|
| Array access by index | O(1) |
| Array search | O(n) |
| Array `filter` / `map` | O(n) |
| Array `sort` | Usually O(n log n) |
| Object property lookup | O(1) average |
| `Map` lookup | O(1) average |
| `Set` lookup | O(1) average |
| Binary search | O(log n) |
| Tree traversal | O(n) |
| Nested loops | Often O(n²) |

When describing complexity, be precise about what `n` means. For example, in a tree problem, `n` may be the total number of nodes. In a merge problem, the complexity may be O(n + m) because there are two input sizes.

## 8. What to Prioritize for This Frontend Interview

### Highest priority

1. Array filtering, mapping, and reduction
2. Object and array immutability
3. Grouping and counting
4. Removing duplicates with `Set`
5. Search and pagination
6. Tree conversion
7. Debounce and throttle
8. Promise handling and race conditions
9. Time and space complexity
10. Edge-case reasoning

### Medium priority

1. Two Sum
2. Valid parentheses
3. Binary search
4. BFS and DFS
5. Merge sorted arrays
6. Flatten nested arrays
7. Concurrency limits
8. Memoization
9. Event bus design

### Lower priority unless explicitly requested

- Red-black trees
- AVL trees
- Union-find
- Advanced dynamic programming
- Advanced graph algorithms
- Segment trees
- Complex mathematical algorithms

## 9. How to Approach Algorithms During the 40-Minute Coding Assessment

If the task involves an existing React page, do not spend the entire assessment solving an isolated algorithm problem. Prioritize the user-visible functionality.

Recommended order:

1. Make sure the page runs.
2. Reproduce and understand the existing bug.
3. Fix the primary user flow.
4. Handle loading, error, and empty states.
5. Fix the HTML and CSS layout.
6. Add accessibility behavior.
7. Test edge cases.
8. Optimize complexity if there is a real performance concern.

For example, in a search-list task, first implement the input, request, result display, loading state, error state, empty state, and stale-request handling. Do not spend fifteen minutes designing an elaborate cache before the core flow works.

## 10. Final Algorithm Preparation Checklist

Before the interview, make sure you can explain and implement the following in English:

- Remove duplicates from an array
- Group objects by a property
- Count frequencies
- Filter and search case-insensitively
- Implement pagination
- Convert a flat list to a tree
- Flatten a tree
- Flatten a nested array
- Implement debounce
- Implement throttle
- Limit concurrent Promises
- Implement Two Sum
- Validate parentheses
- Merge sorted arrays
- Perform binary search
- Traverse a tree with BFS or DFS
- Explain O(n), O(log n), and O(n²)
- Explain edge cases before coding
- Test normal, empty, invalid, and missing-result inputs

The main goal is not to memorize every possible algorithm. It is to demonstrate that you can choose a simple correct data structure, explain your reasoning clearly, write maintainable JavaScript, and connect the solution to a real frontend use case.
