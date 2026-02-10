import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";

export default function App() {
  const token = useSelector((state: any) => state.auth.token);
  const isAuthenticated = !!token;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Auth />
            )
          }
        />

        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        <Route
          path="/account"
          element={
            isAuthenticated ? (
              <Account />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? "/" : "/auth"}
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
