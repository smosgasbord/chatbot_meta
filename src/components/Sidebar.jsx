import { useState } from "react";
import appLogo from "../assets/app-logo.svg";

function Sidebar({
  isOpen,
  setIsSidebarOpen,
  conversations,
  currentConversationId,
  onConversationSelect,
  onNewConversation,
  onRenameConversation,
  onDeleteConversation,
}) {
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const handleRename = (conversationId) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    setEditingId(conversationId);
    setEditTitle(conversation.title);
    setMenuOpenId(null);
  };

  const handleSaveRename = (conversationId) => {
    if (editTitle.trim()) {
      onRenameConversation(conversationId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle("");
  };

  const handleKeyDown = (e, conversationId) => {
    if (e.key === "Enter") {
      handleSaveRename(conversationId);
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditTitle("");
    }
  };

  const handleConversationSelect = (conversationId) => {
    onConversationSelect(conversationId);
    setIsSidebarOpen(false);
  };

  const handleNewChat = () => {
    onNewConversation();
    setIsSidebarOpen(false);
  };

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-200 ease-in-out
        w-64 bg-gray-200 dark:bg-gray-800 flex flex-col z-30
      `}
    >
      <div className="sticky top-0 z-20 bg-gray-200 dark:bg-gray-800">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <img src={appLogo} alt="App Logo" className="w-8 h-8" />
              <h1 className="text-xl font-bold dark:text-white">
                AI Assistant
              </h1>
            </div>
            <button
              onClick={handleNewChat}
              className="p-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="New Chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-600 dark:text-gray-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div
        className="flex-1 overflow-y-auto isolate mt-2"
        onWheel={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold dark:text-white px-4 mb-2">
          Conversations
        </h2>
        <ul className="space-y-1 px-2">
          {conversations.map((conversation) => (
            <li key={conversation.id} className="relative">
              <button
                onClick={() => handleConversationSelect(conversation.id)}
                className={`
                  w-full text-left px-3 py-2 rounded-lg transition-colors
                  hover:bg-gray-300 dark:hover:bg-gray-700 group
                  ${
                    currentConversationId === conversation.id
                      ? "bg-gray-300 dark:bg-gray-700"
                      : ""
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  {editingId === conversation.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => handleSaveRename(conversation.id)}
                      onKeyDown={(e) => handleKeyDown(e, conversation.id)}
                      className="flex-1 bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-500 dark:text-white"
                      autoFocus
                    />
                  ) : (
                    <span className="text-sm dark:text-gray-300 truncate flex-1">
                      {conversation.title}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(
                        menuOpenId === conversation.id ? null : conversation.id
                      );
                    }}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>
              </button>
              {menuOpenId === conversation.id && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRename(conversation.id);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Rename
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                        setMenuOpenId(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
