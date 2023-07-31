import { useContext, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { UserContext } from "./context/UserContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import Question from './pages/AskQuestion/AskQuestion'
import AnswerQuestion from './pages/QuestionDetail/QuestionDetail'

function App() {
  const [userData, setUserData] = useContext(UserContext);

  const checkLoggedIn = async () => {
    let token = localStorage.getItem("x-auth-token");
    if (token === null) {
      localStorage.setItem("x-auth-token", "");
      token = "";
    } else {
      const userRes = await axios.get("http://localhost:2000/api/users", {
        headers: { "x-auth-token": token },
      });

      setUserData({
        token,
        user: {
          id: userRes.data.data.user_id,
          display_name: userRes.data.data.user_name,
        },
      });
    }
  };

  const logout = () => {
    setUserData({
      user: undefined,
      token: undefined,
    });

    localStorage.setItem("x-auth-token", "");
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  return (
    <Router>
          <Header logout={logout} />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home logout={logout} />} />
            <Route path="/ask-question" element={<Question />} />
        <Route path="/answer/:postID" element={<AnswerQuestion />} />
        </Routes>
     <Footer />
    </Router>
  );
}

export default App;
