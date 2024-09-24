import { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [roomName, setRoomName] = useState('');
  const [questions, setQuestions] = useState([{ questionText: '', answers: ['', '', '', ''], correctAnswer: 0, timeLimit: 10 }]);
  const [quizLink, setQuizLink] = useState('');

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', answers: ['', '', '', ''], correctAnswer: 0, timeLimit: 10 }]);
  };

  const createQuiz = () => {
    const quizData = { title, roomName, questions };
    socket.emit('create_quiz', quizData);
    socket.on('quiz_created', (data) => {
      setQuizLink(data.shareableLink); // Get the shareable link from server
    });
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create a Quiz</h2>

      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <input
        type="text"
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      {questions.map((question, index) => (
        <div key={index} className="mb-6">
          <input
            type="text"
            placeholder={`Question ${index + 1}`}
            value={question.questionText}
            onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          {question.answers.map((answer, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Answer ${i + 1}`}
              value={answer}
              onChange={(e) => {
                const newAnswers = [...question.answers];
                newAnswers[i] = e.target.value;
                handleQuestionChange(index, 'answers', newAnswers);
              }}
              className="w-full p-2 border rounded mb-2"
            />
          ))}
          <select
            value={question.correctAnswer}
            onChange={(e) => handleQuestionChange(index, 'correctAnswer', parseInt(e.target.value))}
            className="w-full p-2 border rounded mb-2"
          >
            <option value={0}>Answer 1</option>
            <option value={1}>Answer 2</option>
            <option value={2}>Answer 3</option>
            <option value={3}>Answer 4</option>
          </select>
          <input
            type="number"
            placeholder="Time limit (in seconds)"
            value={question.timeLimit}
            onChange={(e) => handleQuestionChange(index, 'timeLimit', e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
        </div>
      ))}

      <button onClick={addQuestion} className="bg-gray-500 text-white p-2 rounded w-full mb-4">
        Add Another Question
      </button>
      <button onClick={createQuiz} className="bg-blue-500 text-white p-2 rounded w-full">
        Create Quiz
      </button>

      {quizLink && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
          <p>Share this link with others to participate in your quiz:</p>
          <a href={quizLink} className="text-blue-500">{quizLink}</a>
        </div>
      )}
    </div>
  );
};

export default CreateQuiz;
