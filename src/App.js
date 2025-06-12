import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserProfileForm from './components/UserProfileForm';
import AssessmentForm from './components/AssessmentForm';
import ResultsPage from './components/ResultsPage';
import LoadingScreen from './components/LoadingScreen';
import SharedResultsPage from './components/SharedResultsPage';
import { assessmentQuestions } from './data/assessmentQuestions';
import { generateLLMAnalysis } from './services/api';

// Debug Component for Environment Variables
function DebugPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition duration-200 text-sm"
      >
        🐛 Debug Environment Variables
      </button>
      
      {isVisible && (
        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Environment Variable Debug Info</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold text-yellow-800">OpenAI API Key Status:</span>
              <span className="ml-2 text-yellow-700">
                {openaiApiKey ? '✅ Set' : '❌ Not Set'}
              </span>
            </div>
            <div>
              <span className="font-semibold text-yellow-800">OpenAI API Key Value:</span>
              <div className="mt-1 p-2 bg-gray-100 rounded text-xs font-mono text-gray-800 break-all">
                {openaiApiKey || 'undefined'}
              </div>
            </div>
            <div>
              <span className="font-semibold text-yellow-800">Key Length:</span>
              <span className="ml-2 text-yellow-700">
                {openaiApiKey ? openaiApiKey.length : 0} characters
              </span>
            </div>
            <div>
              <span className="font-semibold text-yellow-800">Environment:</span>
              <span className="ml-2 text-yellow-700">
                {process.env.NODE_ENV || 'unknown'}
              </span>
            </div>
          </div>
          <div className="mt-3 text-xs text-yellow-600">
            ⚠️ This debug panel shows sensitive information. Remove before production!
          </div>
        </div>
      )}
    </div>
  );
}

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
      setError(error.message);
      setAnalysisInProgress(false);
      setCurrentStep('error');
    }
  };

  const handleRetryAssessment = () => {
    setCurrentStep('assessment');
    setError(null);
  };

  const handleStartOver = () => {
    setCurrentStep('profile');
    setUserProfile({});
    setResults(null);
    setError(null);
    setAnalysisComplete(false);
    setAnalysisInProgress(false);
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
          
          {/* Debug Panel for troubleshooting environment variables */}
          <div className="mt-8">
            <DebugPanel />
          </div>
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
          />
        )}

        {currentStep === 'error' && (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Analysis Service Unavailable
            </h2>
            <p className="text-gray-600 mb-6">
              We're unable to generate your personalized analysis at this time. 
              This may be due to temporary service maintenance or configuration issues.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Your assessment responses have been recorded. Please try again later or contact support for assistance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetryAssessment}
                className="bg-primary-500 text-white py-3 px-6 rounded-md font-semibold hover:bg-primary-600 transition duration-200"
              >
                Try Again
              </button>
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