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
  const [currentStep, setCurrentStep] = useState('profile'); // 'profile', 'assessment', 'loading', 'results'
  const [userProfile, setUserProfile] = useState({});
  const [results, setResults] = useState(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisInProgress, setAnalysisInProgress] = useState(false);

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
      setAnalysisInProgress(false);
      // Could add error handling here
    }
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
          />
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