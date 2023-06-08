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
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  where,
  addDoc,
  collection,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { v4 } from "uuid";
import { CompressOutlined } from "@mui/icons-material";

let textAreaValue = "";

const AddCourseVideoContent = ({ onSubmit, documentIdOfVideo, courseCode }) => {
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
  documentIdOfVideo = router.query.docId;
  console.log("Test: ", router.query.docId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoQuestionsCollection = collection(db, "videoQuestions");
        const querySnapshot = await getDocs(
          query(
            videoQuestionsCollection,
            where("contentId", "==", documentIdOfVideo)
          )
        );

        const videoQuestionsData = [];
        querySnapshot.forEach((doc) => {
          if (doc.exists()) {
            const videoQuestion = doc.data();
            videoQuestion.currentDocId = doc.id;
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
  }, [documentIdOfVideo]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteTimestamp = async (index, docId) => {
    try {
      const confirmation = window.confirm("Are you sure you want to delete this question?");
  
      if (confirmation) {
        // Delete the specific question from the 'videoQuestions' collection
        await deleteDoc(doc(db, "videoQuestions", docId));
        console.log("Question deleted with ID: ", docId);
  
        // Remove the question from the state
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
  
        //alert("Successfully deleted question!");
  
        // Additional logic or navigation can be implemented here
      }
    } catch (error) {
      console.error("Error deleting question: ", error);
    }
  };
  

  //////////// For Modifying Current Questions ////////////
  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { question: "", answers: ["", "", "", ""], correctAnswer: null },
    ]);
  };

  const handleHourChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].hour = e.target.value;
    setQuestions(updatedQuestions);
    console.log(updatedQuestions);
  };

  const handleMinuteChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].minute = e.target.value;
    setQuestions(updatedQuestions);
    console.log(updatedQuestions);
  };

  const handleSecondChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].second = e.target.value;
    setQuestions(updatedQuestions);
    console.log(updatedQuestions);
  };

  const handleQuestionChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = e.target.value;
    setQuestions(updatedQuestions);
    console.log(updatedQuestions);
  };

  const handleAnswerChange = (e, index, questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].answers[questionIndex] = e.target.value;
    setNewQuestionAnswers(updatedQuestions);
    console.log(updatedQuestions);
  };

  const handleCorrectAnswerChange = (e, index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctAnswer = value;
    setQuestions(updatedQuestions);
    console.log(updatedQuestions);
  };

  const handleEditQuestion = async (index, docId) => {
    event.preventDefault();
    console.log("editing question at index", index);

    const questionToEdit = questions[index];
    console.log(questionToEdit);
    const { currentDocId, ...questionWithoutDocId } = questionToEdit;
    console.log("Edited doc: ", questionWithoutDocId);

    try {
      // Update the specific question in the 'videoQuestions' collection
      await updateDoc(
        doc(db, "videoQuestions", currentDocId),
        questionWithoutDocId
      );
      console.log("Question updated with ID: ", currentDocId);

      alert("Successfully updated question!");

      // Additional logic or navigation can be implemented here
    } catch (error) {
      console.error("Error updating question: ", error);
    }
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
    event.preventDefault();
    console.log("adding new question");

    console.log("Answers: ", newQuestionAnswers);
    console.log("Doc id:", documentIdOfVideo);
    const updatedQuestion = {
      ...newQuestion, // Create a copy of newQuestion object
      answers: newQuestionAnswers,
      correctAnswer: newQuestionCorrectAnswer,
      contentId: documentIdOfVideo,
    };

    console.log(updatedQuestion);

    try {
      // Add updatedQuestion to the 'videoQuestions' collection
      const docRef = await addDoc(
        collection(db, "videoQuestions"),
        updatedQuestion
      );
      console.log("New question added with ID: ", docRef.id);

      // Reset state and perform any other necessary actions
      setQuestions((prevQuestions) => [...prevQuestions, updatedQuestion]);
      setNewQuestionAnswers([]);
      setNewQuestion({});
      setNewQuestionCorrectAnswer(null);

      // Additional logic or navigation can be implemented here
    } catch (error) {
      console.error("Error adding new question: ", error);
    }
  };

  ////////////////////

  return (
    <>
      <div>
        {questions.map((question, index) => (
          <form
            key={index}
            className="form-lg"
            onSubmit={() => handleEditQuestion(index, question.currentDocId)}
          >
            <div className="existing-q-wrapper">
              <label>Question {index + 1}</label>
              <div className="flex flex-col">
                <label className="sm">Hours : Minutes : Seconds</label>
                <div className="flex align-center">
                  <input
                    onChange={(e) => handleHourChange(e, index)}
                    type="number"
                    name="minutes"
                    min="0"
                    max="10"
                    defaultValue={question.hour}
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
                    onChange={(e) => handleMinuteChange(e, index)}
                    type="number"
                    name="minutes"
                    min="0"
                    max="59"
                    defaultValue={question.minute}
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
                    onChange={(e) => handleSecondChange(e, index)}
                    type="number"
                    name="seconds"
                    min="0"
                    max="59"
                    defaultValue={question.second}
                    required
                    className="w-[5rem] inline"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="sm">Question: </label>
                <input
                  type="text"
                  defaultValue={question.question}
                  onChange={(e) => handleQuestionChange(e, index)}
                ></input>
              </div>
              <div className="flex flex-row mt-5 gap-x-5">
                <div className="flex flex-col">
                  <label className="sm mr-2">Option 1</label>
                  <input  className="w-40"
                    type="text"
                    placeholder="Option 1"
                    defaultValue={question.answers[0]}
                    onChange={(e) => handleAnswerChange(e, index, 0)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="sm mr-2">Option 2</label>
                  <input  className="w-40"
                    type="text"
                    placeholder="Option 2"
                    defaultValue={question.answers[1]}
                    onChange={(e) => handleAnswerChange(e, index, 1)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="sm mr-2">Option 3</label>
                  <input  className="w-40"
                    type="text"
                    placeholder="Option 3"
                    defaultValue={question.answers[2]}
                    onChange={(e) => handleAnswerChange(e, index, 2)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="sm mr-2">Option 4</label>
                  <input  className="w-40"
                    type="text"
                    placeholder="Option 4"
                    defaultValue={question.answers[3]}
                    onChange={(e) => handleAnswerChange(e, index, 3)}
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
                        checked={question.correctAnswer === 0 ? "checked" : ""}
                        onChange={(e) => handleCorrectAnswerChange(e, index, 0)}
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
                        checked={question.correctAnswer === 1 ? "checked" : ""}
                        onChange={(e) => handleCorrectAnswerChange(e, index, 1)}
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
                        checked={question.correctAnswer === 2 ? "checked" : ""}
                        onChange={(e) => handleCorrectAnswerChange(e, index, 2)}
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
                        checked={question.correctAnswer === 3 ? "checked" : ""}
                        onChange={(e) => handleCorrectAnswerChange(e, index, 3)}
                      />{" "}
                      Option 4
                    </label>
                  </div>
                </div>
                <div className="mt-5"></div>
              </div>
              <Button className="btn" variant="contained" type="submit">
                Edit Question
              </Button>
              <Button  style={{ marginLeft: '1rem' }}  className='btn' variant="contained" onClick={() => handleDeleteTimestamp(index, question.currentDocId)}>
                Delete Question
              </Button>
            </div>
          </form>
        ))}{" "}
      </div>

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
          <div className="flex flex-row mt-5 gap-x-5">
            <div className="flex flex-col">
              <label className="sm mr-2">Option 1</label>
              <input
                className="w-40"
                type="text"
                placeholder="Option 1"
                onChange={(e) => handleNewAnswerChange(e, 0)}
              />
            </div>
            <div className="flex flex-col">
              <label className="sm mr-2">Option 2</label>
              <input  className="w-40"
                type="text"
                placeholder="Option 2"
                onChange={(e) => handleNewAnswerChange(e, 1)}
              />
            </div>
            <div className="flex flex-col">
              <label className="sm mr-2">Option 3</label>
              <input  className="w-40"
                type="text"
                placeholder="Option 3"
                onChange={(e) => handleNewAnswerChange(e, 2)}
              />
            </div>
            <div className="flex flex-col">
              <label className="sm mr-2">Option 4</label>
              <input  className="w-40"
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
