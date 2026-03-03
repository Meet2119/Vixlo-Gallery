import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import CategoriesPage from "./pages/CategoriesPage";
import ExplorePage from "./pages/ExplorePage";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/explore" replace />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
      </Routes>
    </>
  );
}
