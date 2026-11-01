Build a Data Table component in React that displays tabular data with column sorting functionality.

1. Table Display
   Render data in a table format with headers and rows
   Display all columns from the data
   Basic table styling with borders and spacing
   Responsive layout
2. Column Sorting
   Click on column header to sort by that column
   Toggle between ascending, descending, and unsorted states
   Visual indicator (arrow) showing sort direction
   Sort by string (alphabetical) and number (numerical) types
3. Data Structure

interface Column<T> {
key: keyof T;
label: string;
sortable?: boolean;
}

interface DataTableProps<T> {
data: T[];
columns: Column<T>[];
}
Examples

const columns = [
{ key: 'name', label: 'Name', sortable: true },
{ key: 'age', label: 'Age', sortable: true },
{ key: 'email', label: 'Email', sortable: true },
];

const data = [
{ name: 'John Doe', age: 28, email: 'john@example.com' },
{ name: 'Jane Smith', age: 32, email: 'jane@example.com' },
];

<DataTable data={data} columns={columns} />

Build an enhanced Data Table component that extends the base Data Table with pagination functionality. This builds on top of the sorting feature from the base Data Table.

=================================================================================

1. Pagination
   Configurable items per page (10, 25, 50, 100)
   Page navigation (first, previous, next, last)
   Display current page and total pages
   Show total number of items
   Example 1:

Input: Change page size to 25
Output: Table displays 25 items per page
Explanation: Pagination updates based on new page size
Example 2:

Input: Click next page button
Output: Table displays next set of results
Explanation: Pagination navigates through data

Build an enhanced Data Table component that extends the base Data Table with column filtering functionality. This builds on top of the sorting feature from the base Data Table.

========================================

1. Column Filtering
   Filter input for each filterable column
   Real-time filtering as user types
   Clear filter button for each column
   Multiple column filters work together (AND logic)
2. Data Structure

interface Column {
key: string;
label: string;
sortable?: boolean;
filterable?: boolean;
}

interface DataTableProps {
data: Record<string, any>[];
columns: Column[];
}
Examples

<DataTable 
  data={data} 
  columns={columns}
/>

====================================================================

Build an enhanced Data Table component that extends the base Data Table with row selection functionality. This builds on top of the sorting feature from the base Data Table.

1. Row Selection
   Checkbox in header to select/deselect all rows
   Individual row checkboxes
   Track selected rows
   Display count of selected rows
   Bulk actions on selected rows (optional)
2. Data Structure

interface Column {
key: string;
label: string;
sortable?: boolean;
}

interface DataTableProps {
data: Record<string, any>[];
columns: Column[];
showSelection?: boolean;
}
Examples

<DataTable 
  data={data} 
  columns={columns}
  showSelection={true}
/>

=========================================================================

Build a production-ready Data Table component that extends the base Data Table with CSV export functionality. This builds on top of the sorting feature from the base Data Table.

1. CSV Export
   Export filtered/sorted data to CSV
   Include column headers
   Handle special characters (commas, quotes, newlines)
   Download file with proper filename
   Export button in UI
2. Data Structure

interface Column {
key: string;
label: string;
sortable?: boolean;
}

interface DataTableProps {
data: Record<string, any>[];
columns: Column[];
enableExport?: boolean;
}
Examples

<DataTable 
  data={data} 
  columns={columns}
  enableExport={true}
/>

========================================================================================

Build an enhanced Data Table component that extends the base Data Table with global search functionality. This builds on top of the sorting feature from the base Data Table.

1. Global Search
   Single search input that filters across all columns
   Debounced search input (optional enhancement)
   Clear search button
   Highlight matching text (optional)
2. Data Structure

interface Column {
key: string;
label: string;
sortable?: boolean;
}

interface DataTableProps {
data: Record<string, any>[];
columns: Column[];
}
Examples

<DataTable 
  data={data} 
  columns={columns}
/>
