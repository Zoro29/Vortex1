import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Offline from "./pages/Offline";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Journey from "./pages/Journey";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import useOffline from "./hooks/useOffline";

const App = () => {
  const isOffline = useOffline();

  if (isOffline) {
    return <Offline />;
  }
  return (
    <BrowserRouter>
      <>
        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/explore/:source"
            element={<Explore />}
          />

          <Route
            path="/journey"
            element={<Journey />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<SignUp />}
          />

          <Route
            path="/404"
            element={<NotFound />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>
      </>

    </BrowserRouter>
  );
};

export default App;