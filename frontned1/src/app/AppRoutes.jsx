import { Routes, Route } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Add your routes here */}
      <Route path="/" element={<div>Welcome to the Buildathon App!</div>} />
      {/* Example: 
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      */}
    </Routes>
  );
};

export default AppRoutes;
