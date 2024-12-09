import { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import Footer from "./components/Footer";
import { getChatbotResponse } from "./services/huggingFaceApi";
import storageService from "./services/storageService";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [currentEmptyConversation, setCurrentEmptyConversation] =
    useState(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const loadedConversations = storageService.loadConversations();
    if (loadedConversations.length > 0) {
      setConversations(loadedConversations);
      setCurrentConversationId(loadedConversations[0].id);
    } else {
      handleNewConversation();
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      storageService.saveConversations(conversations);
    }
  }, [conversations]);

  const currentConversation =
    currentEmptyConversation?.id === currentConversationId
      ? currentEmptyConversation
      : conversations.find((conv) => conv.id === currentConversationId) ||
        currentEmptyConversation;

  const handleNewConversation = () => {
    const newId = Math.max(0, ...conversations.map((c) => c.id), 0) + 1;
    const newConversation = {
      id: newId,
      title: "New chat",
      messages: [],
    };
    setCurrentEmptyConversation(newConversation);
    setCurrentConversationId(newId);
  };

  const handleSend = async (input) => {
    const userMessage = { text: input, sender: "user" };
    const isNewConversation = currentConversation.messages.length === 0;

    if (isNewConversation) {
      const newConversation = {
        ...currentConversation,
        title: input.slice(0, 30) + (input.length > 30 ? "..." : ""),
        messages: [userMessage],
      };
      setConversations((prev) => [newConversation, ...prev]);
      setCurrentEmptyConversation(null);
    } else {
      setConversations((prevConversations) =>
        prevConversations.map((conv) => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, userMessage],
            };
          }
          return conv;
        })
      );
    }

    setIsTyping(true);
    try {
      let responseText = await getChatbotResponse(
        input,
        currentConversation.messages
      );

      if (!responseText || typeof responseText !== "string") {
        throw new Error("Invalid response received");
      }

      const aiMessage = { text: responseText, sender: "ai" };

      setConversations((prevConversations) => {
        if (isNewConversation) {
          const conversationWithResponse = {
            ...currentConversation,
            title: input.slice(0, 30) + (input.length > 30 ? "..." : ""),
            messages: [userMessage, aiMessage],
          };
          return [
            conversationWithResponse,
            ...prevConversations.filter((c) => c.id !== currentConversationId),
          ];
        }
        return prevConversations.map((conv) => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, aiMessage],
            };
          }
          return conv;
        });
      });
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

  const handleRenameConversation = (conversationId, newTitle) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === conversationId ? { ...conv, title: newTitle } : conv
      )
    );
  };

  const handleDeleteConversation = (conversationId) => {
    const updatedConversations = conversations.filter(
      (conv) => conv.id !== conversationId
    );
    setConversations(updatedConversations);

    if (currentConversationId === conversationId) {
      if (updatedConversations.length > 0) {
        setCurrentConversationId(updatedConversations[0].id);
        setCurrentEmptyConversation(null);
      } else {
        handleNewConversation();
      }
    }
  };

  const sidebarConversations = conversations.filter(
    (conv) => conv.messages.length > 0
  );

  return (
    <ThemeProvider>
      <div className="min-h-screen flex dark:bg-gray-900">
        <div className="flex flex-1 relative h-screen overflow-hidden">
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}
          <Sidebar
            isOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            conversations={sidebarConversations}
            currentConversationId={currentConversationId}
            onConversationSelect={setCurrentConversationId}
            onNewConversation={handleNewConversation}
            onRenameConversation={handleRenameConversation}
            onDeleteConversation={handleDeleteConversation}
          />
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <Header
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
            <main className="flex-1 bg-gray-100 p-4 dark:bg-gray-800 overflow-hidden">
              <Chat
                messages={currentConversation?.messages || []}
                isTyping={isTyping}
              />
            </main>
            <Footer onSend={handleSend} isTyping={isTyping} />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
