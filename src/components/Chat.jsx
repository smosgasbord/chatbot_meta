import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

function Chat({ messages, isTyping }) {
  const messagesEndRef = useRef(null);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleCopy = (text, index) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedCodeIndex(index);
        setTimeout(() => setCopiedCodeIndex(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white dark:bg-gray-700 rounded-lg shadow overflow-x-hidden">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white ml-4"
                  : "bg-gray-200 dark:bg-gray-600 dark:text-white mr-4"
              }`}
            >
              {msg.sender === "ai" ? (
                <ReactMarkdown
                  className="prose dark:prose-invert max-w-none"
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const codeText = String(children).trim();
                      return inline ? (
                        <code
                          className="bg-gray-800 text-gray-200 px-1 rounded"
                          {...props}
                        >
                          {children}
                        </code>
                      ) : (
                        <div className="relative bg-gray-800 rounded-md p-2 my-2 overflow-x-auto">
                          <button
                            onClick={() => handleCopy(codeText, index)}
                            className="absolute top-2 right-2 text-sm text-gray-400 hover:text-white"
                          >
                            {copiedCodeIndex === index ? "Copied!" : "Copy"}
                          </button>
                          <code className="text-gray-200 block" {...props}>
                            {children}
                          </code>
                        </div>
                      );
                    },
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              ) : (
                <div>{msg.text}</div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-600 dark:text-white mr-4 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default Chat;
