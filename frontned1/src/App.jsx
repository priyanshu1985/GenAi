import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./app/AppRoutes";
import { LayoutProvider } from "./context/LayoutContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import "./i18n"; // Import i18n configuration

const App = () => {
  return (
    <AuthProvider>
      <LayoutProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </LayoutProvider>
    </AuthProvider>
  );
};

export default App;
