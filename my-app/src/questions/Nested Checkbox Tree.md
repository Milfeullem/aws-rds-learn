Build a Nested Checkbox Tree component in React that displays a hierarchical tree structure with checkboxes. The component should handle parent-child checkbox relationships correctly.

1. Parent → Child Propagation
   When a parent checkbox is checked, all its descendants must become checked.
   When a parent checkbox is unchecked, all its descendants must become unchecked.
2. Child → Parent Aggregation (Tri-state)
   After any toggle, every ancestor must be recomputed from its direct children:

If all children are checked, the parent is checked.
If all children are unchecked, the parent is unchecked.
If some children are checked (mixed), the parent becomes indeterminate. 3. Indeterminate Rendering (DOM property)
The indeterminate state must be applied using the native HTML checkbox indeterminate DOM property (via a ref + effect). It cannot be set via JSX attributes.

4. Data Structure

type TriState = boolean | "indeterminate";

interface TreeNode {
id: number;
label: string;
checked: TriState;
children?: TreeNode[];
} 5. Example Data

const exampleData: TreeNode[] = [
{
id: 1,
label: "Electronics",
checked: false,
children: [
{
id: 2,
label: "Mobile phones",
checked: false,
children: [
{ id: 3, label: "iPhone", checked: false },
{ id: 4, label: "Samsung", checked: false },
],
},
{
id: 5,
label: "Laptops",
checked: false,
children: [
{ id: 6, label: "MacBook", checked: false },
{ id: 7, label: "ThinkPad", checked: false },
],
},
],
},
{
id: 8,
label: "Clothing",
checked: false,
children: [
{ id: 9, label: "Shirts", checked: false },
{ id: 10, label: "Pants", checked: false },
],
},
{ id: 11, label: "Books", checked: false },
];
Constraints
Handle deeply nested trees (3+ levels).
Maintain responsiveness with larger trees (100+ nodes).
Indeterminate UI must use the native HTML checkbox `indeterminate` property via refs/effects (not JSX attributes).
