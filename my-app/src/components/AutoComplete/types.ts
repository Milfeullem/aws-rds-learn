export interface AutocompleteProps {
  options: string[];
  onSelect?: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
}
