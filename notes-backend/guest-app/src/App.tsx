import { Routes, Route, Navigate } from "react-router-dom";
import { AppNavbar } from "./components/Navbar.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { GasesPage } from "./pages/GasesPage.tsx";
import { GasDetailPage } from "./pages/GasDetailPage.tsx";
import { ROUTES } from "./Routes.tsx";

function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.GASES} element={<GasesPage />} />
        <Route path={`${ROUTES.GASES}/:id`} element={<GasDetailPage />} />
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </>
  );
}

export default App;

