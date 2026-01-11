import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./app/AppRoutes";
import { LayoutProvider } from "./context/LayoutContext";
import { AuthProvider } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";
import Navbar from "./components/Navbar";
import "./i18n"; // Import i18n configuration

const App = () => {
  return (
    <AuthProvider>
      <GameProvider>
        <LayoutProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </LayoutProvider>
      </GameProvider>
    </AuthProvider>
  );
};

export default App;
