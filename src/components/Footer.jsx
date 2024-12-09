import { useState } from "react";

function Footer({ onSend, isTyping }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    onSend(input);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <footer className="sticky bottom-0 bg-white dark:bg-gray-900 shadow p-4">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          disabled={isTyping}
          className="w-full p-2 pr-10 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSend}
          disabled={isTyping || !input.trim()}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 
            ${
              isTyping || !input.trim()
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
            <path d="M6 12h16" />
          </svg>
        </button>
      </div>
    </footer>
  );
}

export default Footer;
