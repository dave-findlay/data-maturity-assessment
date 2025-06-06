import React, { useState, useEffect, useRef } from 'react';

const steps = [
  'Analyzing your responses...',
  'Calculating maturity scores...',
  'Generating personalized insights...',
  'Preparing strategic recommendations...',
  'Finalizing your assessment...'
];

const LoadingScreen = ({ analysisComplete = false }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const intervalRefs = useRef({ progress: null, step: null });
  const startTimeRef = useRef(null);

  useEffect(() => {
    // Only initialize if we haven't started yet
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
      console.log('🔄 LoadingScreen initialized');
    }

    // Clear any existing intervals
    if (intervalRefs.current.progress) {
      clearInterval(intervalRefs.current.progress);
    }
    if (intervalRefs.current.step) {
      clearInterval(intervalRefs.current.step);
    }

    // Create new intervals and store their IDs
    const progressIntervalId = setInterval(() => {
      setProgress(prev => {
        // If analysis is complete, jump to 100%
        if (analysisComplete) {
          return 100;
        }
        
        // Much slower progress that takes about 15-20 seconds to complete
        if (prev < 20) {
          return prev + 1; // Slower initial progress
        } else if (prev < 60) {
          return prev + 0.5; // Even slower middle progress
        } else if (prev < 85) {
          return prev + 0.3; // Very slow near end
        } else if (prev < 95) {
          return prev + 0.1; // Extremely slow final stretch
        } else {
          return prev; // Stop at 95% and wait for actual completion
        }
      });
    }, 1000); // Update every second

    const stepIntervalId = setInterval(() => {
      if (!analysisComplete) {
        setCurrentStep(prev => (prev + 1) % steps.length);
      } else {
        setCurrentStep(steps.length - 1); // Show final step when complete
      }
    }, 4000); // Change step every 4 seconds (slower)

    // Store the interval IDs in the ref for potential cleanup elsewhere
    intervalRefs.current.progress = progressIntervalId;
    intervalRefs.current.step = stepIntervalId;

    return () => {
      // Use the stored interval IDs for cleanup
      clearInterval(progressIntervalId);
      clearInterval(stepIntervalId);
    };
  }, [analysisComplete]);

  // Show completion message when analysis is done
  const displayProgress = analysisComplete ? 100 : Math.min(progress, 95);
  const displayMessage = analysisComplete ? 'Analysis complete! Preparing your results...' : steps[currentStep];

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="loading-spinner mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Analyzing Your Data Maturity
        </h2>
        <p className="text-gray-600 mb-6">
          We're processing your responses and generating personalized insights using advanced AI analysis. 
          This comprehensive evaluation takes a moment to ensure accuracy...
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        {/* Current Step Display */}
        <div className="mb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${analysisComplete ? 'bg-secondary-500' : 'bg-secondary-500 animate-pulse'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {displayMessage}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ease-out ${
              analysisComplete 
                ? 'bg-gradient-to-r from-secondary-600 to-secondary-700' 
                : 'bg-gradient-to-r from-secondary-500 to-secondary-600'
            }`}
            style={{ width: `${displayProgress}%` }}
          ></div>
        </div>

        {/* Progress Percentage */}
        <div className="text-xs text-gray-500">
          {Math.round(displayProgress)}% Complete
        </div>

        {/* Steps List */}
        <div className="mt-4 space-y-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${
                analysisComplete ? 'bg-secondary-500' :
                index < currentStep ? 'bg-secondary-500' : 
                index === currentStep ? 'bg-secondary-400 animate-pulse' : 'bg-gray-300'
              }`}></div>
              <span className={`${
                analysisComplete ? 'text-secondary-700 font-medium' :
                index < currentStep ? 'text-secondary-700 font-medium' : 
                index === currentStep ? 'text-secondary-600 font-medium' : 'text-gray-500'
              }`}>
                {step}
              </span>
              {index === currentStep && !analysisComplete && (
                <span className="text-secondary-600">...</span>
              )}
              {analysisComplete && (
                <span className="text-secondary-600">✓</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>
          💡 <strong>Did you know?</strong> Organizations with mature data practices are 
          23x more likely to acquire customers and 19x more likely to be profitable.
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen; 