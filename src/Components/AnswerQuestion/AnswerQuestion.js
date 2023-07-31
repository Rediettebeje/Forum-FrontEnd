import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "./AnswerQuestion.css";
import profile from "../../images/User.png"

const AnswerQuestion = () => {
  const { postID } = useParams();
  console.log(postID);
  const [userData, setUserData] = useContext(UserContext);
  const navigate = useNavigate();
  const [question, setQuestion] = useState([]);
  const [filteredquestionId, setQuestionId] = useState(null);
  const [form, setForm] = useState({});
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // //fetching the questions from data base (getPosts(found in question.controller))
        const questionRes = await fetch("http://localhost:2000/api/questions/post", {
          method: "GET",
          // ///needs auth
          headers: {
            "x-auth-token": userData.token,
          },
        });

        if (!questionRes.ok) {
          throw new Error("Network response was not ok");
        }
        // /////if there is data change it to json fromat and put it in variable responseData
        const responseData = await questionRes.json();
        console.log(responseData);

        // ////from the changed jsonformat(which is responseData) select me only the data that why we did .data
        const data = responseData.data;
        console.log(data);

        // /////from the selected data, filter me the question by it post_id...
        // so the post_id from selected data must be equal to the current URL path which is postID
        const filteredData = data.filter(
          (question) => question.post_id === postID
        );
        // ///once filtered update it in setQuestion which is declared above
        console.log(filteredData);
        setQuestion(filteredData);

        //////////////////////// to get the Questionid/////////
        setQuestionId(filteredData[0].question_id);
        console.log(filteredData[0].question_id);
        ////////////////////////////////////////////
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    // //after doing all the above trigger the function
    fetchQuestions();
  }, [postID, userData.token]);


  const handelClick = async (e) => {
    e.preventDefault();
    try {
      const loginRes = await axios.post(
        "http://localhost:2000/api/answers/",
        {
          answer: form.answer,
          questionId: filteredquestionId,
          // ///passing the filterdId to the backend
        },
        
        {
          headers: { "x-auth-token": userData.token },
        }
      );

      console.log(loginRes.data);

      

      // After successfully posting the answer, fetch the answers again
      fetchAnswers();
      setForm({ ...form, answerDescription: "" });
    } catch (err) {
      console.log("problems", err.response.data.msg);
      alert(err.response.data.msg);
    }
  };


  const [allAnswers, setAllAnswers] = useState([]);

  const fetchAnswers = async () => {
    try {
      const answerRes = await axios.get(
        `http://localhost:2000/api/answers/${filteredquestionId}`,
        {
          headers: { "x-auth-token": userData.token },
        }
      );

      setAllAnswers(answerRes.data.data);
      console.log(answerRes.data.data);
    } catch (err) {
      console.log("problems", err.response.data.msg);
      alert(err.response.data.msg);
    }
    

  };
  
  useEffect(() => {
    fetchAnswers();
  }, [filteredquestionId, userData.token]);

  useEffect(() => {
    if (!userData.user) navigate("/login");
  }, [userData.user, navigate]);


  return (
    <div className="container my-5">
 {question.map((question) => (
          <div key={question.product_id}>
            <h3>Question</h3>
            <h6>{question.question_text}</h6>
            <p>{question.question_description}</p>
            {console.log(question.question_id)}
            <hr />
          </div>
        ))}
      <h3>Answer From The Community</h3>
      <hr />
         {allAnswers.map((answer) => (
            <div key={answer.answer_id}>
              <div className="answerInfo">
                <div>
                  <img className="avatar" src={profile} />
                  <h6 className="user" >{answer.user_name}</h6>
                </div>
                <div className="answer align-self-center ms-2 ms-md-0 text-center">{answer.answer}</div>
              </div>
             
            </div>
          ))}
        <h3 className="top">Answer The Top Question</h3>
        <Link to="/" className=" goto text-decoration-none text-reset cursor-pointer">
          Go to Question page
        </Link>
     <br/>
    <textarea
  onChange={handleChange}
  className="answer_input"
  placeholder="Your Answer..."
  name="answer"
  id=""
        style={{
    marginTop:"60px",
    width: "80%", // Set the width to 80% of its container
    height: "200px", // Set the height to 200 pixels
    overflowX: "auto" // Enable horizontal scrolling if the content overflows the width
  }}
></textarea>


      <br/>
        <button onClick={handelClick} className="answer_post_btn" type="">
          Post Your Answer
        </button>
    </div>
  );
};

export default AnswerQuestion;
