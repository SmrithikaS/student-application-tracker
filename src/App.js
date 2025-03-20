import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login/login";
import Signup from "./Login/signin";
import Home from "./Home/home";
import { AuthProvider } from "./context/auth";


function App() {
  return (
    <div className="App">
      <AuthProvider> 
      <Router>
        <Routes>
          
          <Route path="/" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Home" element={<Home />} />
        </Routes>
      </Router>
      </AuthProvider> 
    </div>
  );
}

export default App;
