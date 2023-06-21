import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
    setDoc,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { v4 } from "uuid";
import { db } from "../../firebase";

const QuizQuestionsComponent = ({ documentId }) => {
 // console.log(documentId);
  // documentId = router.query.docId;
  const [questions, setQuestions] = useState([]);
    const [currentDocId, setCurrentDocId] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    answers: ["", "", "", ""],
    correctAnswer: null,
  });
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const quizzesCollection = collection(db, 'quizzes');
        const querySnapshot = await getDocs(
          query(quizzesCollection, where('contentId', '==', documentId))
        );
  
        const questionsData = [];
        querySnapshot.forEach((doc) => {
          if (doc.exists()) {
            setCurrentDocId(doc.id);
            const videoQuestion = doc.data().questions;
            questionsData.push(videoQuestion);
          }
        });
        const loadedQuestions = [].concat(...questionsData);

        setQuestions(loadedQuestions);
        console.log(loadedQuestions)
      } catch (error) {
        console.error('Error retrieving video questions:', error);
        throw error;
      }
    };
  
    fetchQuestions();
  }, [documentId]);
  

  const handleDeleteQuestion = async (index) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete this question?"
      );
    
      if (confirmation) {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
    
        const docRef = doc(db, "quizzes", currentDocId);
        await updateDoc(docRef, { questions: updatedQuestions });
    
        console.log("Question updated with ID: ", currentDocId);
      }
    } catch (error) {
      console.error("Error deleting question: ", error);
    }
  };
  
  

  

 
  const handleQuestionChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (e, index, questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].answers[questionIndex] = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (e, index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctAnswer = value;
    setQuestions(updatedQuestions);
  };


  const handleAddNewQuestion = async () => {
    //console.log(questions)
    const updatedQuestions = [
      ...questions,
      { ...newQuestion } 
    ];

    console.log(updatedQuestions)
  
    try {
      // Query the collection for documents with contentId equal to documentId
      const quizzesCollection = collection(db, 'quizzes');
      const querySnapshot = await getDocs(
        query(quizzesCollection, where('contentId', '==', documentId))
      );
  
      if (querySnapshot.size > 0) {
        // Document exists, update the questions field
        const docRef = querySnapshot.docs[0].ref;
        const docSnapshot = await getDoc(docRef);
        const existingData = docSnapshot.data();
        const mergedData = {
          ...existingData,
          questions: updatedQuestions,
        };
        await setDoc(docRef, mergedData);
      } else {
        // Document does not exist, create a new document with the questions field
        const newDocRef = await addDoc(collection(db, 'quizzes'), {
          questions: updatedQuestions,
          contentId: documentId,
        });
      }
  
      setQuestions(updatedQuestions);
      console.log(updatedQuestions)
      setNewQuestion({
        question: '',
        answers: ['', '', '', ''],
        correctAnswer: 10,
      });
    } catch (error) {
      console.error('Error updating/creating document: ', error);
    }
  };
  
  

  const handleNewQuestionChange = (e) => {
    setNewQuestion((prevQuestion) => ({
      ...prevQuestion,
      question: e.target.value,
    }));
  };

  const handleNewAnswerChange = (e, index) => {
    setNewQuestion((prevQuestion) => {
      const updatedAnswers = [...prevQuestion.answers];
      updatedAnswers[index] = e.target.value;

      return {
        ...prevQuestion,
        answers: updatedAnswers,
      };
    });
  };

  const handleNewCorrectAnswerChange = (e, value) => {
    setNewQuestion((prevQuestion) => ({
      ...prevQuestion,
      correctAnswer: value,
    }));
  };

  const handleSubmit = async (e) => {
     e.preventDefault();


  };

  return (
    <>
      <form className="form-lg pb-10">
        <div>
          {questions.map((question, index) => (
          
            <div className="existing-q-wrapper pb-10" key={index}>
                 {/* {console.log(question)} */}
              <label>Question {index + 1}</label>

              <div className="flex flex-col">
                <label className="sm">Question: </label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => handleQuestionChange(e, index)}
                ></input>
              </div>
              <div className="flex flex-row mt-5 gap-x-5">
                <div className="flex flex-col">
                  <label className="sm mr-2">Option 1</label>
                  <input
                    className="w-40"
                    type="text"
                    placeholder="Option 1"
                    value={question.answers[0]}
                    onChange={(e) => handleAnswerChange(e, index, 0)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="sm mr-2">Option 2</label>
                  <input
                    className="w-40"
                    type="text"
                    placeholder="Option 2"
                    value={question.answers[1]}
                    onChange={(e) => handleAnswerChange(e, index, 1)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="sm mr-2">Option 3</label>
                  <input
                    className="w-40"
                    type="text"
                    placeholder="Option 3"
                    value={question.answers[2]}
                    onChange={(e) => handleAnswerChange(e, index, 2)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="sm mr-2">Option 4</label>
                  <input
                    className="w-40"
                    type="text"
                    placeholder="Option 4"
                    value={question.answers[3]}
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
                        name={`correctAnswer-${index}`}
                        value={0}
                        checked={question.correctAnswer === 0}
                        onChange={(e) =>
                          handleCorrectAnswerChange(e, index, 0)
                        }
                      />{" "}
                      Option 1
                    </label>
                  </div>
                  <div>
                    <label className="sm">
                      <input
                        type="radio"
                        name={`correctAnswer-${index}`}
                        value={1}
                        checked={question.correctAnswer === 1}
                        onChange={(e) =>
                          handleCorrectAnswerChange(e, index, 1)
                        }
                      />{" "}
                      Option 2
                    </label>
                  </div>
                  <div>
                    <label className="sm">
                      <input
                        type="radio"
                        name={`correctAnswer-${index}`}
                        value={2}
                        checked={question.correctAnswer === 2}
                        onChange={(e) =>
                          handleCorrectAnswerChange(e, index, 2)
                        }
                      />{" "}
                      Option 3
                    </label>
                  </div>
                  <div>
                    <label className="sm">
                      <input
                        type="radio"
                        name={`correctAnswer-${index}`}
                        value={3}
                        checked={question.correctAnswer === 3}
                        onChange={(e) =>
                          handleCorrectAnswerChange(e, index, 3)
                        }
                      />{" "}
                      Option 4
                    </label>
                  </div>
                </div>
              </div>
              <Button
                className="btn"
                variant="contained"
                onClick={() => handleAddNewQuestion()}
              >
                Edit Question
              </Button>
              <Button
                style={{ marginLeft: "1rem" }}
                className="btn"
                variant="contained"
                onClick={() =>
                  handleDeleteQuestion(index)
                }
              >
                Delete Question
              </Button>
            </div>
          ))}
        </div>
        <div className="new-q-wrapper">
          <label>New Question</label>{" "}
          <div className="flex flex-col">
            <label className="sm">Question: </label>
            <input
              type="text"
              value={newQuestion.question}
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
                value={newQuestion.answers[0]}
                onChange={(e) => handleNewAnswerChange(e, 0)}
              />
            </div>
            <div className="flex flex-col">
              <label className="sm mr-2">Option 2</label>
              <input
                className="w-40"
                type="text"
                placeholder="Option 2"
                value={newQuestion.answers[1]}
                onChange={(e) => handleNewAnswerChange(e, 1)}
              />
            </div>
            <div className="flex flex-col">
              <label className="sm mr-2">Option 3</label>
              <input
                className="w-40"
                type="text"
                placeholder="Option 3"
                value={newQuestion.answers[2]}
                onChange={(e) => handleNewAnswerChange(e, 2)}
              />
            </div>
            <div className="flex flex-col">
              <label className="sm mr-2">Option 4</label>
              <input
                className="w-40"
                type="text"
                placeholder="Option 4"
                value={newQuestion.answers[3]}
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
                    name="newCorrectAnswer"
                    value={0}
                    onChange={(e) => handleNewCorrectAnswerChange(e, 0)}
                  />{" "}
                  Option 1
                </label>
              </div>
              <div>
                <label className="sm">
                  <input
                    type="radio"
                    name="newCorrectAnswer"
                    value={1}
                    onChange={(e) => handleNewCorrectAnswerChange(e, 1)}
                  />{" "}
                  Option 2
                </label>
              </div>
              <div>
                <label className="sm">
                  <input
                    type="radio"
                    name="newCorrectAnswer"
                    value={2}
                    onChange={(e) => handleNewCorrectAnswerChange(e, 2)}
                  />{" "}
                  Option 3
                </label>
              </div>
              <div>
                <label className="sm">
                  <input
                    type="radio"
                    name="newCorrectAnswer"
                    value={3}
                    onChange={(e) => handleNewCorrectAnswerChange(e, 3)}
                  />{" "}
                  Option 4
                </label>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <Button className="btn" variant="contained" onClick={handleAddNewQuestion}>
              Add New Question
            </Button>
          </div>
        </div>
        <Button className="btn" variant="contained" color="success" type="submit" onClick={handleSubmit}>
          Submit All Questions
        </Button>
      </form>
    </>
  );
};

export default QuizQuestionsComponent;
