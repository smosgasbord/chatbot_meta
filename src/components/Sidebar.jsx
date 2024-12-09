function Sidebar({ isOpen }) {
  return (
    <aside
      className={`
      fixed lg:static inset-y-0 left-0 transform 
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0 transition-transform duration-200 ease-in-out
      w-64 bg-gray-200 dark:bg-gray-800 p-4 z-10
    `}
    >
      <h2 className="text-lg font-semibold dark:text-white">Conversations</h2>
      <ul className="mt-4">
        <li className="py-2 dark:text-gray-300">Conversation 1</li>
        <li className="py-2 dark:text-gray-300">Conversation 2</li>
      </ul>
    </aside>
  );
}

export default Sidebar;
