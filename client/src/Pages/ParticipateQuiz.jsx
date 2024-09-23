import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const ParticipateQuiz = () => {
  const { id } = useParams(); // Quiz ID from the URL
  const [quiz, setQuiz] = useState(null); // Store the quiz data
  const [currentQuestion, setCurrentQuestion] = useState(0); // Track current question
  const [selectedOption, setSelectedOption] = useState(null); // Selected answer
  const [result, setResult] = useState(null); // Store result of each question
  const [quizFinished, setQuizFinished] = useState(false); // To track if quiz is finished
  const [startTime, setStartTime] = useState(null); // Start time for quiz
  const [endTime, setEndTime] = useState(null); // End time for quiz
  const [totalTime, setTotalTime] = useState(null); // Total time taken
  console.log(endTime,id)
  useEffect(() => {
    // Emit a request to join the quiz room and get quiz data
    socket.emit('join_quiz', id);
    socket.on('quiz_data', (data) => {
      setQuiz(data);
      setStartTime(new Date()); // Start the quiz timer
    });

    return () => {
      socket.off('quiz_data'); // Clean up when component is unmounted
    };
  }, [id]);

  const submitAnswer = () => {
    if (selectedOption === null) return;

    // Emit the selected answer to the server
    socket.emit('submit_answer', { quizId: id, answerIndex: selectedOption, questionIndex: currentQuestion });

    // Listen for the result from the server
    socket.on('answer_result', ({ isCorrect }) => {
      setResult(isCorrect ? 'Correct!' : 'Incorrect!');

      // Move to the next question after 2 seconds
      setTimeout(() => {
        setResult(null);

        // If the current question is the last one, finish the quiz
        if (currentQuestion === quiz.questions.length - 1) {
          finishQuiz();
        } else {
          setCurrentQuestion(currentQuestion + 1); // Move to the next question
          setSelectedOption(null); // Reset selected option
        }
      }, 2000);
    });
  };

  const finishQuiz = () => {
    const endTime = new Date();
    setEndTime(endTime);
    const timeTaken = Math.floor((endTime - startTime) / 1000); // Calculate time in seconds
    setTotalTime(timeTaken);
    setQuizFinished(true);
  };

  if (!quiz) return <p>Loading quiz...</p>; // Display loading message while quiz data is being fetched

  // Check if quiz is finished
  if (quizFinished) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Quiz Finished!</h1>
        <p className="text-lg">Your total time: {totalTime} seconds</p>
        <p className="text-lg">Thank you for participating!</p>
      </div>
    );
  }

  // Display the current question
  const question = quiz.questions[currentQuestion];
  if (!question) return <p>No questions available for this quiz!</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{quiz.title}</h1>
      <p className="text-lg mt-4">Question {currentQuestion + 1} of {quiz.questions.length}</p>

      <div className="my-4">
        <p className="text-xl">{question.questionText}</p>

        <div className="grid grid-cols-1 gap-2 mt-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedOption(index)}
              className={`p-2 border rounded ${selectedOption === index ? 'bg-blue-500 text-white' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {result && <p className="mt-2 text-lg font-bold">{result}</p>} {/* Display correct/incorrect result */}

      <button
        onClick={submitAnswer}
        className="bg-green-500 text-white p-2 rounded mt-4"
      >
        Submit Answer
      </button>
    </div>
  );
};

export default ParticipateQuiz;
