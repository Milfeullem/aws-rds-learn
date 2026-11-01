Build a Multi-Select Dropdown in React that supports controlled multi-selection, query filtering, and deterministic open/close behavior.

1. Controlled Selection Contract
   Selection must be controlled by value + onChange.
   The component should never own a shadow selected-state source of truth.
   Toggling an option adds/removes its id immutably.
2. Dropdown Interaction Model
   Clicking trigger opens/closes the list.
   Clicking outside closes the list.
   Dropdown should stay open while selecting multiple options.
3. Search / Filter Projection
   Include an input for filtering options.
   Filtering must be case-insensitive and derived from source options.
   Selected options remain selected even when not visible under current query.
4. Clear and Summary UX
   Provide a summary in the trigger (placeholder or selected count).
   Provide a clear-all action that resets controlled selection.
5. Data Contract

interface Option {
id: string;
label: string;
}

interface MultiSelectProps {
options: Option[];
value: string[];
onChange: (next: string[]) => void;
placeholder?: string;
} 6. Example Seed

const sampleOptions: Option[] = [
{ id: "react", label: "React" },
{ id: "ts", label: "TypeScript" },
{ id: "node", label: "Node.js" },
{ id: "graphql", label: "GraphQL" }
];
