import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login/login";
import Signup from "./Login/signin";
import Home from "./Home/home";
import TimelineComponent from "./Timeline/timeline";
import { AuthProvider } from "./context/auth";
import Navigation from "./Login/navigation";
import { Navigate } from "react-router-dom";

import { useAuth } from "./context/auth";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/timeline" element={<PrivateRoute><TimelineComponent /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;