import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const ParticipateQuiz = () => {
  const { id } = useParams();
  const [nickname, setNickname] = useState('');
  const [room, setRoom] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [results, setResults] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setRoom(searchParams.get('room') || '');
  }, [location.search]);

  // Join room and fetch quiz
  const joinRoom = () => {
    socket.emit('join_quiz', { quizId: id, room });
    socket.on('quiz_data', (quizData) => {
      setQuiz(quizData);
      setCountdown(quizData.questions[0].timeLimit);
      setQuizStarted(true);
    });

    socket.on('error', (err) => {
      alert(err);
      navigate('/'); // Navigate back to the home page if room is wrong
    });
  };


  useEffect(() => {
    if (quiz && quizStarted && !quizEnded) {
      const timer = setInterval(() => {
        if (countdown > 0) {
          setCountdown(countdown - 1);
        } else {
          nextQuestion(); // Auto move to next question when time runs out
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown, quizStarted, quizEnded]);

  const submitAnswer = () => {
    socket.emit('submit_answer', { quizId: id, room, answerIndex: selectedAnswer, questionIndex: currentQuestionIndex });
    socket.on('answer_result', (data) => {
      setResults((prevResults) => [
        ...prevResults,
        { question: quiz.questions[currentQuestionIndex], givenAnswer: selectedAnswer, isCorrect: data.isCorrect }
      ]);
      nextQuestion();
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < quiz.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setCountdown(quiz.questions[currentQuestionIndex + 1].timeLimit);
    } else {
      endQuiz(); // End quiz after the last question
    }
  };

  const endQuiz = () => {
    setQuizEnded(true);
  };

  if (!quizStarted) {
    return (
      <div className="p-8 max-w-md mx-auto bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Join Quiz</h2>
        <input
          type="text"
          placeholder="Your Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="text"
          placeholder="Room Name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button onClick={joinRoom} className="bg-blue-500 text-white p-2 rounded w-full">
          Join Room
        </button>
      </div>
    );
  }

  if (quizEnded) {
    return (
      <div className="p-8 max-w-md mx-auto bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
        {results.map((result, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
            <p className="font-bold">{index + 1}. {result.question.questionText}</p>
            <p>Your Answer: {result.question.answers[result.givenAnswer]}</p>
            <p>Correct Answer: {result.question.answers[result.question.correctAnswer]}</p>
            <p className={result.isCorrect ? 'text-green-500' : 'text-red-500'}>
              {result.isCorrect ? 'Correct' : 'Incorrect'}
            </p>
          </div>
        ))}
        <p className="text-lg font-bold">Total Correct: {results.filter(r => r.isCorrect).length} / {quiz.questions.length}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      {quiz ? (
        <>
          <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>
          <div className="mb-4">
            <p className="font-bold">Question {currentQuestionIndex + 1}:</p>
            <p>{quiz.questions[currentQuestionIndex].questionText}</p>
          </div>
          <div className="mb-4">
            {quiz.questions[currentQuestionIndex].answers.map((answer, index) => (
              <button
                key={index}
                className={`w-full p-2 mb-2 border rounded ${selectedAnswer === index ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setSelectedAnswer(index)}
              >
                {answer}
              </button>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={submitAnswer}
              className="bg-green-500 text-white p-2 rounded"
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </button>
            <p className="text-xl font-bold">{countdown}s</p>
          </div>
        </>
      ) : (
        <div>Loading quiz...</div>
      )}
    </div>
  );
};

export default ParticipateQuiz;
