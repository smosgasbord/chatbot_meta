import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import Footer from "./components/Footer";
import { getChatbotResponse } from "./services/huggingFaceApi";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (input) => {
    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setIsTyping(true);
    try {
      const responseText = await getChatbotResponse(input, messages);
      const aiMessage = { text: responseText, sender: "ai" };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Sorry, I encountered an error. Please try again.",
          sender: "ai",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col dark:bg-gray-900">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex flex-1 relative overflow-y-auto">
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}
          <Sidebar isOpen={isSidebarOpen} />
          <main className="flex-1 bg-gray-100 p-4 dark:bg-gray-800">
            <Chat messages={messages} isTyping={isTyping} />
          </main>
        </div>
        <Footer onSend={handleSend} />
      </div>
    </ThemeProvider>
  );
}

export default App;
