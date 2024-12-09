function Sidebar({
  isOpen,
  conversations,
  currentConversationId,
  onConversationSelect,
  onNewConversation,
}) {
  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-200 ease-in-out
        w-64 bg-gray-200 dark:bg-gray-800 flex flex-col h-full z-30
      `}
    >
      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewConversation}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 flex items-center justify-center gap-2 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Chat
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-lg font-semibold dark:text-white px-4 mb-2">
          Conversations
        </h2>
        <ul className="space-y-1 px-2">
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <button
                onClick={() => onConversationSelect(conversation.id)}
                className={`
                  w-full text-left px-3 py-2 rounded-lg transition-colors
                  hover:bg-gray-300 dark:hover:bg-gray-700
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
                  <span className="text-sm dark:text-gray-300 truncate">
                    {conversation.title}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
