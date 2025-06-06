import React, { useState } from 'react';
import { assessmentQuestions, likertScale } from '../data/assessmentQuestions';

const AssessmentForm = ({ onSubmit, userProfile }) => {
  const [answers, setAnswers] = useState({});
  const [currentDimension, setCurrentDimension] = useState(0);
  const [showExplanation, setShowExplanation] = useState({});

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: parseInt(value)
    }));
  };

  const toggleExplanation = (questionId) => {
    setShowExplanation(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const isCurrentDimensionComplete = () => {
    const currentQuestions = assessmentQuestions[currentDimension].questions;
    return currentQuestions.every(question => answers[question.id]);
  };

  const getTotalProgress = () => {
    const totalQuestions = assessmentQuestions.reduce((total, dimension) => 
      total + dimension.questions.length, 0
    );
    const answeredQuestions = Object.keys(answers).length;
    return (answeredQuestions / totalQuestions) * 100;
  };

  const handleNext = () => {
    if (currentDimension < assessmentQuestions.length - 1) {
      setCurrentDimension(currentDimension + 1);
    }
  };

  const handlePrevious = () => {
    if (currentDimension > 0) {
      setCurrentDimension(currentDimension - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  const isAllComplete = () => {
    const totalQuestions = assessmentQuestions.reduce((total, dimension) => 
      total + dimension.questions.length, 0
    );
    return Object.keys(answers).length === totalQuestions;
  };

  const currentDimensionData = assessmentQuestions[currentDimension];

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progress: {Math.round(getTotalProgress())}% Complete
          </span>
          <span className="text-sm text-gray-500">
            Dimension {currentDimension + 1} of {assessmentQuestions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-secondary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getTotalProgress()}%` }}
          ></div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome, {userProfile.fullName}!
        </h2>
        <p className="text-gray-600">
          Let's assess your organization's data maturity across 8 key dimensions. 
          Each question uses a 5-point scale from Strongly Disagree to Strongly Agree.
        </p>
      </div>

      {/* Current Dimension */}
      <div className="mb-8">
        <div className="bg-secondary-50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-secondary-900 mb-2">
            {currentDimensionData.title}
          </h3>
          <p className="text-secondary-700">
            {currentDimensionData.description}
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {currentDimensionData.questions.map((question, index) => (
            <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-medium text-gray-900 flex-1 pr-4">
                    {question.text}
                  </h4>
                  <button
                    onClick={() => toggleExplanation(question.id)}
                    className="text-secondary-600 hover:text-secondary-700 text-sm font-medium whitespace-nowrap"
                  >
                    {showExplanation[question.id] ? 'Hide Info' : 'Why This Matters'}
                  </button>
                </div>
                
                {showExplanation[question.id] && (
                  <div className="bg-secondary-50 border-l-4 border-secondary-400 p-4 mb-4">
                    <p className="text-secondary-800 text-sm">
                      {question.explanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Likert Scale */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {likertScale.map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer border-2 rounded-lg p-3 text-center transition-all duration-200 ${
                      answers[question.id] === option.value
                        ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={answers[question.id] === option.value}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-sm font-medium mb-1">{option.value}</div>
                    <div className="text-xs text-gray-600">{option.label}</div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          onClick={handlePrevious}
          disabled={currentDimension === 0}
          className={`px-6 py-2 rounded-md font-medium transition duration-200 ${
            currentDimension === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Previous
        </button>

        <div className="text-sm text-gray-500">
          {currentDimension + 1} of {assessmentQuestions.length} dimensions
        </div>

        {currentDimension < assessmentQuestions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={!isCurrentDimensionComplete()}
            className={`px-6 py-2 rounded-md font-medium transition duration-200 ${
              isCurrentDimensionComplete()
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next Dimension
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isAllComplete()}
            className={`px-8 py-2 rounded-md font-medium transition duration-200 ${
              isAllComplete()
                ? 'bg-secondary-600 text-white hover:bg-secondary-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Complete Assessment
          </button>
        )}
      </div>

      {/* Dimension Navigation */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-2 justify-center">
          {assessmentQuestions.map((dimension, index) => {
            const isComplete = dimension.questions.every(q => answers[q.id]);
            const isCurrent = index === currentDimension;
            
            return (
              <button
                key={dimension.id}
                onClick={() => setCurrentDimension(index)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition duration-200 ${
                  isCurrent
                    ? 'bg-secondary-600 text-white'
                    : isComplete
                    ? 'bg-secondary-100 text-secondary-800 hover:bg-secondary-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {dimension.title}
                {isComplete && !isCurrent && ' ✓'}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssessmentForm; 