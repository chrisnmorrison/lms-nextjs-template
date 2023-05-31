"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { storage, db } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  doc,
  setDoc,
  deleteField,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  collection,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { v4 } from "uuid";

let textAreaValue = "";

const AddCourseVideoContent = ({ onSubmit, documentId, courseCode }) => {
  const [formData, setFormData] = useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [videoUpload, setVideoUpload] = useState(null);
  const [courseContent, setCourseContent] = useState({});
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({});
  const [newQuestionAnswers, setNewQuestionAnswers] = useState([]);
  const [newQuestionCorrectAnswer, setNewQuestionCorrectAnswer] =
    useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const router = useRouter();
  documentId = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoQuestionsCollection = collection(db, "videoQuestions");
        const querySnapshot = await getDocs(
          query(videoQuestionsCollection, where("contentId", "==", documentId))
        );

        const videoQuestionsData = [];
        querySnapshot.forEach((doc) => {
          if (doc.exists()) {
            const videoQuestion = doc.data();
            videoQuestionsData.push(videoQuestion);
          }
        });

        setQuestions(videoQuestionsData);
      } catch (error) {
        console.error("Error retrieving video questions:", error);
        throw error;
      }
    };

    fetchData();
  }, [documentId]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //////////// For Modifying Current Questions ////////////
  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { question: "", answers: ["", "", "", ""], correctAnswer: null },
    ]);
  };

  const handleQuestionChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = e.target.value;
    setQuestions(updatedQuestions);
    console.log(updatedQuestions);
  };

  const handleAnswerChange = (e, questionIndex, answerIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers[answerIndex] = e.target.value;
    setQuestions(updatedQuestions);
    console.log(updatedQuestions);
  };

  const handleCorrectAnswerChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctAnswer = e.target.checked ? index : null;
    setQuestions(updatedQuestions);
    console.log(updatedQuestions);
  };

  //////////// For Adding New Question ////////////

  const handleNewHourChange = (e) => {
    const updatedQuestion = newQuestion;
    updatedQuestion.hour = e.target.value;
    setNewQuestion(updatedQuestion);
    console.log(newQuestion);
  };

  const handleNewMinuteChange = (e) => {
    const updatedQuestion = newQuestion;
    updatedQuestion.minute = e.target.value;
    setNewQuestion(updatedQuestion);
    console.log(newQuestion);
  };

  const handleNewSecondChange = (e) => {
    const updatedQuestion = newQuestion;
    updatedQuestion.second = e.target.value;
    setNewQuestion(updatedQuestion);
    console.log(newQuestion);
  };

  const handleNewQuestionChange = (e) => {
    const updatedQuestion = newQuestion;
    updatedQuestion.question = e.target.value;
    setNewQuestion(updatedQuestion);
    console.log(newQuestion);
  };

  const handleNewAnswerChange = (e, questionIndex) => {
    const updatedAnswers = [...newQuestionAnswers]; // Create a copy of newQuestionAnswers array
    updatedAnswers[questionIndex] = e.target.value;
    setNewQuestionAnswers(updatedAnswers);
    console.log(updatedAnswers);
  };

  const handleNewCorrectAnswerChange = (e, index) => {
    const updatedCorrectAnswer = e.target.checked ? index : null;
    setNewQuestionCorrectAnswer(updatedCorrectAnswer);
    console.log(updatedCorrectAnswer);
  };

  const handleAddNewQuestion = async () => {
    console.log("adding new question");
    setNewQuestionAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      const updatedAnswer = {
        ...updatedAnswers[newQuestionCorrectAnswer],
        is_correct: true,
      };
     
      return updatedAnswers;
    });
    console.log("Answers: ",newQuestionAnswers)
    console.log("Doc id:", documentId.docId)
    newQuestion.answers = newQuestionAnswers;
    newQuestion.contentId = documentId;

    try {
      // Add newQuestionData to the 'videoQuestions' collection
      const docRef = await addDoc(
        collection(db, "videoQuestions"),
        newQuestion
      );
      console.log("New question added with ID: ", docRef.id);

      // Reset state and perform any other necessary actions
      setNewQuestionAnswers([]);
      setNewQuestion({});

      // Additional logic or navigation can be implemented here
    } catch (error) {
      console.error("Error adding new question: ", error);
    }
  };

  ////////////////////

  const handleEditTimestamp = async (event) => {
   
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    console.log(formData);
  };

  return (
    <>
      {" "}
      <form className="form-lg" onSubmit={handleEditTimestamp}>
        {questions.map((question, index) => (
          <div key={index}>
            <label>Question {index + 1}</label>
            <input
              type="text"
              value={question.question}
              onChange={(e) => handleQuestionChange(e, index)}
            />

            <label>Answers</label>
            {question.answers.map((answer, answerIndex) => (
              <div key={answerIndex}>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => handleAnswerChange(e, index, answerIndex)}
                />
                <label>
                  Correct Answer
                  <input
                    type="checkbox"
                    checked={question.correctAnswer === answerIndex}
                    onChange={(e) => handleCorrectAnswerChange(e, index)}
                  />
                </label>
              </div>
            ))}
          </div>
        ))}
      </form>{" "}
      <form className="form-lg" onSubmit={handleAddNewQuestion}>
        <div className="new-q-wrapper">
          <label>New Question</label>{" "}
          <div className="flex flex-col">
            <label className="sm">Hours : Minutes : Seconds</label>
            <div className="flex align-center">
              <input
                onChange={(e) => handleNewHourChange(e)}
                type="number"
                name="minutes"
                min="0"
                max="10"
                defaultValue={0}
                value={newQuestion.hour}
                required
                className="w-[5rem] inline"
              />
              <p
                style={{
                  fontSize: "24px",
                  marginLeft: ".5rem",
                  marginRight: ".5rem",
                }}
                className="text-black"
              >
                {" "}
                :{" "}
              </p>
              <input
                onChange={(e) => handleNewMinuteChange(e)}
                type="number"
                name="minutes"
                min="0"
                max="59"
                defaultValue={0}
                value={newQuestion.minute}
                required
                className="w-[5rem] inline"
              />
              <p
                style={{
                  fontSize: "24px",
                  marginLeft: ".5rem",
                  marginRight: ".5rem",
                }}
                className="text-black"
              >
                {" "}
                :{" "}
              </p>
              <input
                onChange={(e) => handleNewSecondChange(e)}
                type="number"
                name="seconds"
                min="0"
                max="59"
                defaultValue={0}
                value={newQuestion.second}
                required
                className="w-[5rem] inline"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="sm">Question: </label>
            <input
              type="text"
              onChange={(e) => handleNewQuestionChange(e)}
            ></input>
          </div>
          <div className="flex flex-row mt-5">
            <div>
              <label className="sm">Option 1</label>
              <input
                type="text"
                placeholder="Option 1"
                onChange={(e) => handleNewAnswerChange(e, 0)}
              />
            </div>
            <div>
              <label className="sm">Option 2</label>
              <input
                type="text"
                placeholder="Option 2"
                onChange={(e) => handleNewAnswerChange(e, 1)}
              />
            </div>
            <div>
              <label className="sm">Option 3</label>
              <input
                type="text"
                placeholder="Option 3"
                onChange={(e) => handleNewAnswerChange(e, 2)}
              />
            </div>
            <div>
              <label className="sm">Option 4</label>
              <input
                type="text"
                placeholder="Option 4"
                onChange={(e) => handleNewAnswerChange(e, 3)}
              />
            </div>
          </div>
          <div className="mt-5">
            <label>Correct Option</label>
            <div className="flex flex-row justify-evenly">
              <div>
                <label className="sm">
                  <input
                    type="radio"
                    name="radioGroup"
                    value="option1"
                    onChange={(e) => handleNewCorrectAnswerChange(e, 0)}
                  />{" "}
                  Option 1
                </label>
              </div>
              <div>
                <label className="sm">
                  <input
                    type="radio"
                    name="radioGroup"
                    value="option2"
                    onChange={(e) => handleNewCorrectAnswerChange(e, 1)}
                  />{" "}
                  Option 2
                </label>
              </div>
              <div>
                <label className="sm">
                  <input
                    type="radio"
                    name="radioGroup"
                    value="option3"
                    onChange={(e) => handleNewCorrectAnswerChange(e, 2)}
                  />{" "}
                  Option 3
                </label>
              </div>
              <div>
                <label className="sm">
                  <input
                    type="radio"
                    name="radioGroup"
                    value="option4"
                    onChange={(e) => handleNewCorrectAnswerChange(e, 3)}
                  />{" "}
                  Option 4
                </label>
              </div>
            </div>
            <div className="mt-5"></div>
          </div>
        </div>
        <div className="mt-5">
          <Button className="btn" variant="contained" type="submit">
            Add New Question
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddCourseVideoContent;
