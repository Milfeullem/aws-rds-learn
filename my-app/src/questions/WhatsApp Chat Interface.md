Build a WhatsApp Chat Interface component in React that allows users to send and display messages.

1. Message Display
   Show a list of messages
   Each message should display the text content
   Messages should be displayed in chronological order (oldest first)
   Show a visual distinction between sent and received messages
2. Input Box
   Input field to type new messages
   Send button to submit messages
   Support Enter key to send messages
   Clear input after sending
3. Message Structure

interface Message {
id: number;
text: string;
sender: 'user' | 'other';
timestamp: Date;
} 4. Layout
Messages container that scrolls
Input area fixed at the bottom
Clean, WhatsApp-like styling
Examples

// Initial messages
const initialMessages: Message[] = [
{ id: 1, text: 'Hey! How are you?', sender: 'other', timestamp: new Date() },
{ id: 2, text: 'I am doing great!', sender: 'user', timestamp: new Date() },
];
