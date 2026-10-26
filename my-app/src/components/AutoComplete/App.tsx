import { Autocomplete } from "./AutoComplete";

const sampleOptions = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Elderberry",
  "Fig",
  "Grape",
  "Honeydew",
  "Kiwi",
  "Lemon",
];

export default function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Autocomplete</h1>

      <Autocomplete
        options={sampleOptions}
        onSelect={(value) => console.log("Selected:", value)}
        label="Fruit"
        placeholder="Search fruits..."
      />
    </div>
  );
}
