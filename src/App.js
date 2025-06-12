import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserProfileForm from './components/UserProfileForm';
import AssessmentForm from './components/AssessmentForm';
import ResultsPage from './components/ResultsPage';
import LoadingScreen from './components/LoadingScreen';
import SharedResultsPage from './components/SharedResultsPage';
import { assessmentQuestions } from './data/assessmentQuestions';
import { generateLLMAnalysis } from './services/api';

// Main Assessment Component
function AssessmentApp() {
  const [currentStep, setCurrentStep] = useState('profile'); // 'profile', 'assessment', 'loading', 'results', 'error'
  const [userProfile, setUserProfile] = useState({});
  const [results, setResults] = useState(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisInProgress, setAnalysisInProgress] = useState(false);
  const [error, setError] = useState(null);

  const handleProfileSubmit = (profileData) => {
    setUserProfile(profileData);
    setCurrentStep('assessment');
  };

  const handleAssessmentSubmit = async (answers) => {
    // Prevent multiple calls
    if (analysisInProgress) {
      console.log('⚠️ Analysis already in progress, skipping...');
      return;
    }

    console.log('🚀 Starting assessment submission...');
    setAnalysisInProgress(true);
    setCurrentStep('loading');
    setAnalysisComplete(false);
    setError(null);
    
    try {
      // Calculate scores
      const scores = calculateScores(answers);
      const maturityTier = getMaturityTier(scores.overall);
      
      console.log('📊 Scores calculated, calling LLM analysis...');
      
      // Generate LLM analysis (now using real LLM integration)
      const analysis = await generateLLMAnalysis(userProfile, scores, maturityTier);
      
      console.log('✅ LLM analysis complete, setting results...');
      
      setResults({
        scores,
        maturityTier,
        analysis
      });
      
      setAnalysisComplete(true);
      
      // Small delay to show completion before transitioning
      setTimeout(() => {
        setCurrentStep('results');
        setAnalysisInProgress(false);
      }, 1000);
    } catch (error) {
      console.error('❌ Error during analysis:', error);
      setError({
        message: error.message,
        retryable: error.retryable || false,
        errorId: error.errorId || null
      });
      setAnalysisInProgress(false);
      setCurrentStep('error');
    }
  };

  const handleRetryAssessment = () => {
    setCurrentStep('assessment');
    setError(null);
    setAnalysisInProgress(false);
    setAnalysisComplete(false);
  };

  const handleStartOver = () => {
    setCurrentStep('profile');
    setUserProfile({});
    setResults(null);
    setError(null);
    setAnalysisComplete(false);
    setAnalysisInProgress(false);
  };

  // TEST FUNCTION - Remove in production
  const handleSimulateError = () => {
    const errorId = 'ERR-TEST' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setError({
      message: `This is a simulated retryable error for testing the user experience. The error has been logged for debugging purposes. (Test Error ID: ${errorId})`,
      retryable: true,
      errorId: errorId
    });
    setCurrentStep('error');
  };

  const calculateScores = (answers) => {
    const dimensionScores = {};
    let totalScore = 0;
    let questionCount = 0;

    assessmentQuestions.forEach(dimension => {
      let dimensionTotal = 0;
      dimension.questions.forEach(question => {
        const answer = answers[question.id] || 1;
        dimensionTotal += answer;
        totalScore += answer;
        questionCount++;
      });
      dimensionScores[dimension.id] = dimensionTotal / dimension.questions.length;
    });

    return {
      dimensions: dimensionScores,
      overall: totalScore / questionCount
    };
  };

  const getMaturityTier = (score) => {
    if (score >= 5) return { name: 'Optimized', level: 5 };
    if (score >= 4) return { name: 'Managed', level: 4 };
    if (score >= 3) return { name: 'Developing', level: 3 };
    if (score >= 2) return { name: 'Reactive', level: 2 };
    return { name: 'Ad-hoc', level: 1 };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <div className="mb-6">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/fuse-logo.png" 
                alt="Fuse Data Logo" 
                className="h-12 w-auto"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Data Maturity Self-Assessment
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your organization's data maturity level and receive personalized recommendations 
            to accelerate your data-driven transformation.
          </p>
        </header>

        {currentStep === 'profile' && (
          <UserProfileForm onSubmit={handleProfileSubmit} />
        )}

        {currentStep === 'assessment' && (
          <AssessmentForm 
            onSubmit={handleAssessmentSubmit}
            userProfile={userProfile}
          />
        )}

        {currentStep === 'loading' && (
          <LoadingScreen analysisComplete={analysisComplete} />
        )}

        {currentStep === 'results' && (
          <ResultsPage 
            userProfile={userProfile}
            results={results}
            onRequestReport={() => {
              // Handle report request
              console.log('Report requested for:', userProfile.email);
            }}
            onSimulateError={handleSimulateError}
          />
        )}

        {currentStep === 'error' && (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center">
            <div className={`text-6xl mb-4 ${error?.retryable ? 'text-orange-600' : 'text-red-600'}`}>
              {error?.retryable ? '⚠️' : '❌'}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error?.retryable ? 'Analysis Processing Issue' : 'Analysis Service Unavailable'}
            </h2>
            <p className="text-gray-600 mb-6">
              {error?.message || 'We\'re unable to generate your personalized analysis at this time. This may be due to temporary service maintenance or configuration issues.'}
            </p>
            
            {error?.errorId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">
                  <strong>Error ID:</strong> <code className="bg-gray-200 px-2 py-1 rounded text-xs font-mono">{error.errorId}</code>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Please include this ID if contacting support
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {error?.retryable ? (
                <button
                  onClick={handleRetryAssessment}
                  className="bg-orange-500 text-white py-3 px-6 rounded-md font-semibold hover:bg-orange-600 transition duration-200"
                >
                  Try Analysis Again
                </button>
              ) : (
                <button
                  onClick={handleRetryAssessment}
                  className="bg-primary-500 text-white py-3 px-6 rounded-md font-semibold hover:bg-primary-600 transition duration-200"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={handleStartOver}
                className="bg-gray-500 text-white py-3 px-6 rounded-md font-semibold hover:bg-gray-600 transition duration-200"
              >
                Start New Assessment
              </button>
            </div>
            
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Need immediate assistance?</strong><br/>
                Contact us directly to discuss your data maturity assessment results.
              </p>
              <button
                onClick={() => window.open('https://calendly.com/dave-findlay', '_blank')}
                className="mt-3 text-secondary-600 hover:text-secondary-700 font-semibold text-sm"
              >
                Schedule a Consultation →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main App with Router
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AssessmentApp />} />
        <Route path="/results/:id" element={<SharedResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App; 