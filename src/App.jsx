import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import Footer from "./components/Footer";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col dark:bg-gray-900">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex flex-1 relative">
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}
          <Sidebar isOpen={isSidebarOpen} />
          <main className="flex-1 bg-gray-100 p-4 dark:bg-gray-800">
            <Chat />
          </main>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
