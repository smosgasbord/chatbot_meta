const generateUserId = () => {
  const storedUserId = localStorage.getItem("userId");
  if (storedUserId) return storedUserId;

  const newUserId = "user_" + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("userId", newUserId);
  return newUserId;
};

const getStorageKey = () => {
  const userId = generateUserId();
  return `conversations_${userId}`;
};

const storageService = {
  saveConversations: (conversations) => {
    const nonEmptyConversations = conversations.filter(
      (conv) => conv.messages.length > 0
    );
    const sortedConversations = [...nonEmptyConversations].sort(
      (a, b) => b.id - a.id
    );
    localStorage.setItem(getStorageKey(), JSON.stringify(sortedConversations));
  },

  loadConversations: () => {
    const stored = localStorage.getItem(getStorageKey());
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error parsing stored conversations:", error);
      return [];
    }
  },
};

export default storageService;
