Build a verification code (OTP) input in React with controlled value ownership and deterministic single-digit entry.

1. Controlled Data Contract
   Component is controlled by value + onChange.
   value should represent the full code as one string.
   Derive rendered boxes from controlled value.
2. Input Constraints
   Render exactly length boxes.
   Accept digits only (0-9).
   Each box stores at most one digit.
   Ignore non-digit input safely.
3. Basic Entry Behavior
   Typing a valid digit writes current box.
   After writing, focus moves to next box.
   Editing an already-filled box should overwrite that position.
4. Completion Signal
   Call onComplete(code) when all boxes are filled.
   Avoid duplicate completion calls for unchanged completed value.
   Data Contract

interface AuthCodeInputProps {
length: number;
value: string;
onChange: (next: string) => void;
onComplete?: (code: string) => void;
autoFocus?: boolean;
disabled?: boolean;
}
