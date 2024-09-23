import { useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [quizId, setQuizId] = useState('');

  const addQuestion = () => {
    setQuestions([...questions, { questionText, options, correctAnswer }]);
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswer(0);
  };

  const createQuiz = () => {
    socket.emit('create_quiz', { title, questions });
    socket.on('quiz_created', (id) => {
      setQuizId(id);
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Create a Quiz</h1>
      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <div>
        <input
          type="text"
          placeholder="Question"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <div className="grid grid-cols-2 gap-2">
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              className="p-2 border rounded mb-2"
            />
          ))}
        </div>

        <select
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(Number(e.target.value))}
          className="w-full p-2 border rounded mb-2"
        >
          <option value={0}>Option 1</option>
          <option value={1}>Option 2</option>
          <option value={2}>Option 3</option>
          <option value={3}>Option 4</option>
        </select>

        <button onClick={addQuestion} className="bg-blue-500 text-white p-2 rounded mb-4">
          Add Question
        </button>

        {questions.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-2">Questions</h3>
            <ul className="list-disc pl-5">
              {questions.map((q, index) => (
                <li key={index}>
                  {q.questionText} (Correct Answer: {q.correctAnswer + 1})
                </li>
              ))}
            </ul>
          </div>
        )}

        <button onClick={createQuiz} className="bg-green-500 text-white p-2 rounded">
          Create Quiz
        </button>

        {quizId && (
          <div className="mt-4">
            <p>Share this link to take the quiz:</p>
            <a href={`http://localhost:3000/quiz/${quizId}`} className="text-blue-500">
              http://localhost:3000/quiz/{quizId}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateQuiz;
