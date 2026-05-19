import { Routes, Route } from "react-router-dom";
import FeedbackPage from "./pages/FeedbackPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PublicProfile from "./pages/PublicProfile";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/feedback/:feedbackId" element={<FeedbackPage />} />
      <Route path="/profile/:username" element={<PublicProfile />} />
    </Routes>
    
  );
}

export default App;