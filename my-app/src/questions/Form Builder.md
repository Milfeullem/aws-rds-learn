Build a Form Builder component that dynamically creates form fields and validates user input.

1. Dynamic Field Creation
   Support multiple field types: text, email, number, textarea, select
   Add/remove fields dynamically
   Each field has: type, label, name, placeholder, required flag
2. Form Validation
   Required field validation
   Email format validation
   Number range validation (min/max)
   Show error messages below invalid fields
   Prevent form submission if validation fails
3. Form Submission
   Collect all field values
   Validate all fields before submission
   Display success message on valid submission
   Reset form after successful submission
4. Data Structure

interface FormField {
id: string;
type: "text" | "email" | "number" | "textarea" | "select";
label: string;
name: string;
placeholder?: string;
required?: boolean;
options?: string[]; // For select fields
min?: number; // For number fields
max?: number; // For number fields
}

interface FormData {
[fieldName: string]: string | number;
}
Examples

const fields: FormField[] = [
{ id: "1", type: "text", label: "Name", name: "name", required: true },
{ id: "2", type: "email", label: "Email", name: "email", required: true },
{ id: "3", type: "number", label: "Age", name: "age", min: 0, max: 120 },
];

<FormBuilder fields={fields} onSubmit={(data) => console.log(data)} />
