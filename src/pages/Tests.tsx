import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Award, BookOpen, Play } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Test {
  id: number;
  title: string;
  subject: string;
  duration: number;
  questions: Question[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const Tests: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const availableTests: Test[] = [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      subject: 'JavaScript',
      duration: 15,
      difficulty: 'Easy',
      questions: [
        {
          id: 1,
          question: 'What is the correct way to declare a variable in JavaScript?',
          options: ['var myVar = 5;', 'variable myVar = 5;', 'v myVar = 5;', 'declare myVar = 5;'],
          correctAnswer: 0,
          explanation: 'In JavaScript, variables are declared using var, let, or const keywords.'
        },
        {
          id: 2,
          question: 'Which method is used to add an element to the end of an array?',
          options: ['append()', 'push()', 'add()', 'insert()'],
          correctAnswer: 1,
          explanation: 'The push() method adds one or more elements to the end of an array.'
        },
        {
          id: 3,
          question: 'What does "=== " operator do in JavaScript?',
          options: ['Assignment', 'Equality check', 'Strict equality check', 'Not equal'],
          correctAnswer: 2,
          explanation: 'The === operator checks for strict equality, comparing both value and type.'
        }
      ]
    },
    {
      id: 2,
      title: 'React Basics',
      subject: 'React',
      duration: 20,
      difficulty: 'Medium',
      questions: [
        {
          id: 1,
          question: 'What is JSX?',
          options: ['A JavaScript library', 'A syntax extension for JavaScript', 'A CSS framework', 'A database'],
          correctAnswer: 1,
          explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in React.'
        },
        {
          id: 2,
          question: 'Which hook is used for state management in functional components?',
          options: ['useEffect', 'useState', 'useContext', 'useReducer'],
          correctAnswer: 1,
          explanation: 'useState is the primary hook for managing state in functional components.'
        }
      ]
    },
    {
      id: 3,
      title: 'Python Data Structures',
      subject: 'Python',
      duration: 25,
      difficulty: 'Medium',
      questions: [
        {
          id: 1,
          question: 'Which data structure is mutable in Python?',
          options: ['Tuple', 'String', 'List', 'Integer'],
          correctAnswer: 2,
          explanation: 'Lists are mutable in Python, meaning you can modify them after creation.'
        },
        {
          id: 2,
          question: 'What method is used to add an item to a set?',
          options: ['append()', 'add()', 'insert()', 'push()'],
          correctAnswer: 1,
          explanation: 'The add() method is used to add a single element to a set.'
        }
      ]
    }
  ];

  const startTest = (test: Test) => {
    setSelectedTest(test);
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(test.questions.length).fill(-1));
    setShowResults(false);
    setTimeLeft(test.duration * 60); // Convert to seconds
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < selectedTest!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitTest = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!selectedTest) return 0;
    let correct = 0;
    selectedTest.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / selectedTest.questions.length) * 100);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'from-green-400 to-green-600';
      case 'Medium': return 'from-yellow-400 to-orange-500';
      case 'Hard': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer effect
  React.useEffect(() => {
    if (selectedTest && !showResults && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedTest && !showResults) {
      submitTest();
    }
  }, [selectedTest, showResults, timeLeft]);

  if (showResults && selectedTest) {
    const score = calculateScore();
    const correctAnswers = selectedTest.questions.filter((question, index) => 
      selectedAnswers[index] === question.correctAnswer
    ).length;

    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Test Completed!</h1>
            <p className="text-white/70 mb-4">{selectedTest.title}</p>
            <div className="flex items-center justify-center space-x-8">
              <div>
                <p className="text-2xl font-bold text-white">{score}%</p>
                <p className="text-white/60">Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{correctAnswers}/{selectedTest.questions.length}</p>
                <p className="text-white/60">Correct</p>
              </div>
            </div>
          </div>

          {/* Question Review */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Review Your Answers</h2>
            {selectedTest.questions.map((question, index) => {
              const isCorrect = selectedAnswers[index] === question.correctAnswer;
              const userAnswerText = selectedAnswers[index] !== -1 ? question.options[selectedAnswers[index]] : 'Not answered';
              
              return (
                <div key={question.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {isCorrect ? <CheckCircle className="w-5 h-5 text-white" /> : <XCircle className="w-5 h-5 text-white" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-2">
                        Question {index + 1}: {question.question}
                      </h3>
                      <p className="text-white/70 mb-2">
                        <span className="font-medium">Your answer:</span> {userAnswerText}
                      </p>
                      <p className="text-green-400 mb-2">
                        <span className="font-medium">Correct answer:</span> {question.options[question.correctAnswer]}
                      </p>
                      <p className="text-white/60 text-sm">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setSelectedTest(null);
                setShowResults(false);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Take Another Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedTest) {
    const question = selectedTest.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedTest.questions.length) * 100;

    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Test Header */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white">{selectedTest.title}</h1>
                <p className="text-white/70">Question {currentQuestion + 1} of {selectedTest.questions.length}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-white">
                  <Clock className="w-5 h-5" />
                  <span className="font-mono">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-6">
            <h2 className="text-xl font-semibold text-white mb-6">{question.question}</h2>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                    selectedAnswers[currentQuestion] === index
                      ? 'bg-blue-500/20 border-blue-500 text-white'
                      : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40'
                  }`}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center space-x-4">
              {currentQuestion === selectedTest.questions.length - 1 ? (
                <button
                  onClick={submitTest}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200"
                >
                  Submit Test
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Knowledge Tests</h1>
          <p className="text-white/70">Test your understanding with our interactive quizzes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-white/60">Tests Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">87%</p>
                <p className="text-white/60">Average Score</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">3.2h</p>
                <p className="text-white/60">Time Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Tests */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Available Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTests.map((test) => (
              <div key={test.id} className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-3 py-1 bg-gradient-to-r ${getDifficultyColor(test.difficulty)} rounded-full text-white text-sm font-medium`}>
                      {test.difficulty}
                    </div>
                    <div className="flex items-center space-x-1 text-white/60">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{test.duration}min</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{test.title}</h3>
                  <p className="text-white/70 text-sm mb-4">Subject: {test.subject}</p>
                  <p className="text-white/60 text-sm mb-6">{test.questions.length} questions</p>
                  
                  <button
                    onClick={() => startTest(test)}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Test</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tests;