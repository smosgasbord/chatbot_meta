import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import Footer from "./components/Footer";
import { getChatbotResponse } from "./services/huggingFaceApi";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([
    { id: 1, title: "New conversation", messages: [] },
  ]);
  const [currentConversationId, setCurrentConversationId] = useState(1);
  const [isTyping, setIsTyping] = useState(false);

  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );

  const handleNewConversation = () => {
    const newId = Math.max(0, ...conversations.map((c) => c.id)) + 1;
    const newConversation = {
      id: newId,
      title: "New chat",
      messages: [],
    };
    setConversations([...conversations, newConversation]);
    setCurrentConversationId(newId);
  };

  const handleSend = async (input) => {
    const userMessage = { text: input, sender: "user" };

    setConversations((prevConversations) =>
      prevConversations.map((conv) => {
        if (conv.id === currentConversationId) {
          const newTitle =
            conv.messages.length === 0
              ? input.slice(0, 30) + (input.length > 30 ? "..." : "")
              : conv.title;

          return {
            ...conv,
            title: newTitle,
            messages: [...conv.messages, userMessage],
          };
        }
        return conv;
      })
    );

    setIsTyping(true);
    try {
      const responseText = await getChatbotResponse(
        input,
        currentConversation.messages
      );
      const aiMessage = { text: responseText, sender: "ai" };

      setConversations((prevConversations) =>
        prevConversations.map((conv) => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, aiMessage],
            };
          }
          return conv;
        })
      );
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        text: "Sorry, I encountered an error. Please try again.",
        sender: "ai",
      };
      setConversations((prevConversations) =>
        prevConversations.map((conv) => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, errorMessage],
            };
          }
          return conv;
        })
      );
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
          <Sidebar
            isOpen={isSidebarOpen}
            conversations={conversations}
            currentConversationId={currentConversationId}
            onConversationSelect={setCurrentConversationId}
            onNewConversation={handleNewConversation}
          />
          <main className="flex-1 bg-gray-100 p-4 dark:bg-gray-800">
            <Chat messages={currentConversation.messages} isTyping={isTyping} />
          </main>
        </div>
        <Footer onSend={handleSend} />
      </div>
    </ThemeProvider>
  );
}

export default App;
