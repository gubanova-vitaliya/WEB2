import { Routes, Route, Navigate } from "react-router-dom";
import { AppNavbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { GasesPage } from "./pages/GasesPage";
import { GasDetailPage } from "./pages/GasDetailPage";
import { ReduxDemo } from "./components/ReduxDemo";
import { NotesManager } from "./components/NotesManager";
import { ROUTES } from "./Routes";

function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.GASES} element={<GasesPage />} />
        <Route path={`${ROUTES.GASES}/:id`} element={<GasDetailPage />} />
        <Route path={ROUTES.REDUX_DEMO} element={<ReduxDemo />} />
        <Route path={ROUTES.NOTES} element={<NotesManager />} />
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </>
  );
}

export default App;


