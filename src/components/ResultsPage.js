import React, { useEffect, useState, useCallback } from 'react';
import { assessmentQuestions } from '../data/assessmentQuestions';

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
          ×
        </button>
      </div>
    </div>
  );
};

// Helper function to format text with proper line breaks and numbered lists
const formatText = (text) => {
  if (!text) return '';
  
  // Split by numbered items (1., 2., 3., etc.)
  const numberedItems = text.split(/(\d+\.\s)/).filter(item => item.trim());
  
  if (numberedItems.length > 2) {
    // We have numbered items
    let formatted = '';
    for (let i = 0; i < numberedItems.length; i += 2) {
      const number = numberedItems[i];
      const content = numberedItems[i + 1];
      if (number && content) {
        formatted += `${number}${content.trim()}\n\n`;
      }
    }
    return formatted.trim();
  }
  
  // No numbered items, just return with proper line breaks
  return text.replace(/\. /g, '.\n\n').trim();
};

const ResultsPage = ({ userProfile, results, isSharedView = false }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const saveResults = useCallback(async () => {
    if (saving) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/save-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          results
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShareUrl(data.shareUrl);
      } else {
        showToast('Failed to save results', 'error');
      }
    } catch (error) {
      showToast('Failed to save results', 'error');
    } finally {
      setSaving(false);
    }
  }, [userProfile, results, saving]);

  // Auto-save results when component mounts (only for new assessments, not shared views)
  useEffect(() => {
    if (!isSharedView && userProfile && results && !shareUrl) {
      saveResults();
    }
  }, [userProfile, results, isSharedView, shareUrl, saveResults]);

  const copyShareUrl = async () => {
    if (!shareUrl) {
      showToast('Results are still being saved...', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Link copied to clipboard!', 'success');
    } catch (error) {
      showToast('Failed to copy link', 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };



  const getScoreColor = (score) => {
    if (score >= 5) return 'text-green-600'; // Green for optimized (5.0)
    if (score >= 4) return 'text-yellow-600'; // Yellow for managed (4.0)
    if (score >= 3) return 'text-purple-600'; // Purple for developing (3.0)
    if (score >= 2) return 'text-teal-600'; // Teal for reactive (2.0)
    return 'text-red-600'; // Red for ad-hoc (1.0)
  };

  const getProgressBarColor = (score) => {
    if (score >= 5) return 'bg-green-600'; // Green for optimized (5.0)
    if (score >= 4) return 'bg-yellow-600'; // Yellow for managed (4.0)
    if (score >= 3) return 'bg-purple-600'; // Purple for developing (3.0)
    if (score >= 2) return 'bg-teal-600'; // Teal for reactive (2.0)
    return 'bg-red-600'; // Red for ad-hoc (1.0)
  };

  // Parse SWOT analysis from the LLM response
  const parseSWOT = () => {
    const swot = {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: []
    };

    // Check if we have structured SWOT data from the new JSON format
    if (results.analysis.swot) {
      return {
        strengths: results.analysis.swot.strengths || [],
        weaknesses: results.analysis.swot.weaknesses || [],
        opportunities: results.analysis.swot.opportunities || [],
        threats: results.analysis.swot.threats || []
      };
    }

    // Fallback: Check if we have improvements array with emoji prefixes (old format)
    if (results.analysis.improvements && Array.isArray(results.analysis.improvements)) {
      swot.strengths = results.analysis.improvements
        .filter(item => item.includes('💪 Strength:'))
        .map(item => item.replace('💪 Strength: ', ''));
      
      swot.weaknesses = results.analysis.improvements
        .filter(item => item.includes('⚠️ Weakness:'))
        .map(item => item.replace('⚠️ Weakness: ', ''));
      
      swot.opportunities = results.analysis.improvements
        .filter(item => item.includes('🚀 Opportunity:'))
        .map(item => item.replace('🚀 Opportunity: ', ''));
      
      swot.threats = results.analysis.improvements
        .filter(item => item.includes('⚡ Threat:'))
        .map(item => item.replace('⚡ Threat: ', ''));
    }

    // Final fallback: Try to parse from the full analysis text (legacy support)
    if (swot.strengths.length === 0 && swot.weaknesses.length === 0 && 
        swot.opportunities.length === 0 && swot.threats.length === 0) {
      
      const fullText = String(results.analysis.summary || results.analysis.recommendations || '');
      
      // Extract SWOT sections using regex patterns
      const strengthsMatch = fullText.match(/\*Strengths\*(.*?)(?=\*Weaknesses\*|\*Opportunities\*|\*Threats\*|$)/s);
      const weaknessesMatch = fullText.match(/\*Weaknesses\*(.*?)(?=\*Strengths\*|\*Opportunities\*|\*Threats\*|$)/s);
      const opportunitiesMatch = fullText.match(/\*Opportunities\*(.*?)(?=\*Strengths\*|\*Weaknesses\*|\*Threats\*|$)/s);
      const threatsMatch = fullText.match(/\*Threats\*(.*?)(?=\*Strengths\*|\*Weaknesses\*|\*Opportunities\*|$)/s);

      if (strengthsMatch) {
        swot.strengths = strengthsMatch[1]
          .split(/- \*\*/)
          .filter(item => item.trim())
          .map(item => item.replace(/\*\*/g, '').trim());
      }

      if (weaknessesMatch) {
        swot.weaknesses = weaknessesMatch[1]
          .split(/- \*\*/)
          .filter(item => item.trim())
          .map(item => item.replace(/\*\*/g, '').trim());
      }

      if (opportunitiesMatch) {
        swot.opportunities = opportunitiesMatch[1]
          .split(/- \*\*/)
          .filter(item => item.trim())
          .map(item => item.replace(/\*\*/g, '').trim());
      }

      if (threatsMatch) {
        swot.threats = threatsMatch[1]
          .split(/- \*\*/)
          .filter(item => item.trim())
          .map(item => item.replace(/\*\*/g, '').trim());
      }
    }

    return swot;
  };

  const swotData = parseSWOT();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">


      {/* Enhanced Analysis Section */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Comprehensive Data Maturity Assessment
        </h3>
        
        {/* Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Disclaimer:</strong> This assessment provides a general indication of your organization's data maturity based on your responses. Results are for informational purposes and should be considered alongside professional consultation for strategic decision-making.
          </p>
        </div>

        {/* Company Name and Submitted By */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-6 bg-secondary-600 rounded mr-3"></span>
              Company Name
            </h4>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed font-semibold text-xl">
                {userProfile.companyName}
              </p>
            </div>
          </div>

          {/* Submitted By */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-6 bg-secondary-600 rounded mr-3"></span>
              Submitted By
            </h4>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed font-semibold text-xl">
                {userProfile.fullName}
              </p>
            </div>
          </div>
        </div>

        {/* Maturity Levels Breakdown */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-6 bg-secondary-600 rounded mr-3"></span>
            Maturity Levels
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-gray-900">Ad-hoc</h5>
                <span className="font-bold text-red-600">1.0</span>
              </div>
              <p className="text-xs text-gray-600">No formal data processes, ad-hoc approaches, data silos</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-gray-900">Reactive</h5>
                <span className="font-bold text-teal-600">2.0</span>
              </div>
              <p className="text-xs text-gray-600">Basic processes exist, inconsistent, firefighting data issues</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-gray-900">Developing</h5>
                <span className="font-bold text-purple-600">3.0</span>
              </div>
              <p className="text-xs text-gray-600">Structured processes in place, some governance, gaps remain</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-gray-900">Managed</h5>
                <span className="font-bold text-yellow-600">4.0</span>
              </div>
              <p className="text-xs text-gray-600">Comprehensive governance, reliable processes, data-informed decisions</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-gray-900">Optimized</h5>
                <span className="font-bold text-green-600">5.0</span>
              </div>
              <p className="text-xs text-gray-600">Data-driven culture, advanced analytics, continuous improvement</p>
            </div>
          </div>
        </div>

        {/* Maturity Tier Details */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-6 bg-secondary-600 rounded mr-3"></span>
            Your Maturity Level
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h5 className="font-medium text-gray-900">{results.maturityTier.name}</h5>
              <span className={`font-bold ${
                results.maturityTier.name === 'Optimized' ? 'text-green-600' :
                results.maturityTier.name === 'Managed' ? 'text-yellow-600' :
                results.maturityTier.name === 'Developing' ? 'text-purple-600' :
                results.maturityTier.name === 'Reactive' ? 'text-teal-600' :
                'text-red-600'
              }`}>
                {results.scores.overall.toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-4">
              {results.maturityTier.name === 'Ad-hoc' && 
                'No formal data processes, ad-hoc approaches, data silos'}
              {results.maturityTier.name === 'Reactive' && 
                'Basic processes exist, inconsistent, firefighting data issues'}
              {results.maturityTier.name === 'Developing' && 
                'Structured processes in place, some governance, gaps remain'}
              {results.maturityTier.name === 'Managed' && 
                'Comprehensive governance, reliable processes, data-informed decisions'}
              {results.maturityTier.name === 'Optimized' && 
                'Data-driven culture, advanced analytics, continuous improvement'}
            </p>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-700 leading-relaxed">
                {results.maturityTier.name === 'Ad-hoc' && 
                  'Your organization has no formal data processes and uses ad-hoc approaches with data silos everywhere. You have data somewhere, but you\'re not sure where or if it\'s reliable. Focus on establishing basic data inventory and governance foundations.'}
                {results.maturityTier.name === 'Reactive' && 
                  'Your organization has basic processes that exist but are inconsistent, often in firefighting mode for data issues. You know you have data problems and you\'re trying to fix them as they come up. Focus on implementing systematic approaches and preventive measures.'}
                {results.maturityTier.name === 'Developing' && 
                  'Your organization has structured processes in place with some governance, but gaps remain. You have good practices in some areas but need to standardize across the organization. Focus on filling gaps, standardizing processes, and building consistency.'}
                {results.maturityTier.name === 'Managed' && 
                  'Your organization has comprehensive governance, reliable processes, and makes data-informed decisions. You have strong data capabilities and use data effectively for business decisions. Focus on optimizing existing processes and exploring advanced analytics.'}
                {results.maturityTier.name === 'Optimized' && 
                  'Your organization has a data-driven culture with advanced analytics, continuous improvement, and competitive advantage. Data is central to everything you do and gives you a significant competitive edge. Focus on maintaining excellence, innovating, and sharing best practices.'}
              </p>
            </div>
          </div>
        </div>

        {/* Your Summary */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-6 bg-secondary-600 rounded mr-3"></span>
            Your Summary
          </h4>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed">
              {results.analysis.summary}
            </p>
          </div>
        </div>

        {/* Dimension Scores Breakdown */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-6 bg-secondary-600 rounded mr-3"></span>
            Detailed Dimension Analysis
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessmentQuestions.map(dimension => {
              const score = results.scores.dimensions[dimension.id] || 0;
              return (
                <div key={dimension.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium text-gray-900">{dimension.title}</h5>
                    <span className={`font-bold ${getScoreColor(score)}`}>
                      {score.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`${getProgressBarColor(score)} h-2 rounded-full`}
                      style={{ width: `${(score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600">{dimension.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SWOT Analysis */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-6 bg-secondary-600 rounded mr-3"></span>
            SWOT Analysis
          </h4>
          
          {/* Group SWOT elements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="mr-2">💪</span>
                Strengths
              </h5>
              <ul className="space-y-2">
                {swotData.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700 text-sm">
                      {strength}
                    </span>
                  </li>
                ))}
                {swotData.strengths.length === 0 && (
                  <li className="text-gray-500 text-sm italic">No strengths identified</li>
                )}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="mr-2">⚠️</span>
                Weaknesses
              </h5>
              <ul className="space-y-2">
                {swotData.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700 text-sm">
                      {weakness}
                    </span>
                  </li>
                ))}
                {swotData.weaknesses.length === 0 && (
                  <li className="text-gray-500 text-sm italic">No weaknesses identified</li>
                )}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="mr-2">🚀</span>
                Opportunities
              </h5>
              <ul className="space-y-2">
                {swotData.opportunities.map((opportunity, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700 text-sm">
                      {opportunity}
                    </span>
                  </li>
                ))}
                {swotData.opportunities.length === 0 && (
                  <li className="text-gray-500 text-sm italic">No opportunities identified</li>
                )}
              </ul>
            </div>

            {/* Threats */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="mr-2">⚡</span>
                Threats
              </h5>
              <ul className="space-y-2">
                {swotData.threats.map((threat, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700 text-sm">
                      {threat}
                    </span>
                  </li>
                ))}
                {swotData.threats.length === 0 && (
                  <li className="text-gray-500 text-sm italic">No threats identified</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Strategic Recommendations */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-6 bg-secondary-600 rounded mr-3"></span>
            Strategic Recommendations
          </h4>
          {results.analysis.recommendations && Array.isArray(results.analysis.recommendations) && results.analysis.recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.analysis.recommendations.map((item, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h5 className="font-bold text-gray-900 mb-3">
                    {item.title}
                  </h5>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {formatText(results.analysis.recommendations)}
              </div>
            </div>
          )}
        </div>

        {/* Peer Comparison */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-6 bg-secondary-600 rounded mr-3"></span>
            Industry Benchmark
          </h4>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed">{results.analysis.peerComparison}</p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-6 bg-secondary-600 rounded mr-3"></span>
            Recommended Next Steps
          </h4>
          {results.analysis.nextSteps ? (
            results.analysis.nextSteps && Array.isArray(results.analysis.nextSteps) && results.analysis.nextSteps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.analysis.nextSteps.map((item, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h5 className="font-bold text-gray-900 mb-3">
                      {item.title}
                    </h5>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {formatText(results.analysis.nextSteps)}
                </div>
              </div>
            )
          ) : (
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-500 italic">
                Next steps analysis is only available with OpenAI API integration.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Book Review with Dave */}
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <a href="https://fusedata.co" target="_blank" rel="noopener noreferrer">
              <img 
                src="/fuse-logo.png" 
                alt="Fuse Data Logo" 
                className="h-16 w-auto bg-gray-100 rounded-lg p-2 hover:bg-gray-200 transition duration-200"
              />
            </a>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-900">
            Need guidance on achieving your data goals?
          </h3>
          <p className="text-gray-600 text-lg mb-6">
            Book a call Dave Findlay, Founder at Fuse Data, to discuss.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="font-semibold mb-2 text-gray-900">Personalized Strategy</h4>
              <p className="text-sm text-gray-600">Discuss your most pressing challenges and what you would like to acheive</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💡</span>
              </div>
              <h4 className="font-semibold mb-2 text-gray-900">Expert Insights</h4>
              <p className="text-sm text-gray-600">Leverage Dave's experience helping organizations transform their data capabilities</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="font-semibold mb-2 text-gray-900">Actionable Plan</h4>
              <p className="text-sm text-gray-600">Walk away with concrete next steps and implementation guidance</p>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          {/* Copy Link Button - Only show for new assessments, not shared views */}
          {!isSharedView && (
            <button
              onClick={copyShareUrl}
              disabled={!shareUrl || saving}
              className={`w-full py-3 px-6 rounded-md font-semibold text-base transition duration-200 mb-4 ${
                shareUrl && !saving
                  ? 'bg-secondary-500 text-white hover:bg-secondary-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {saving ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Results...
                </span>
              ) : shareUrl ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link to Your Results
                </span>
              ) : (
                'Preparing Share Link...'
              )}
            </button>
          )}

          <button
            onClick={() => window.open('https://www.fusedata.co/strategy-consult', '_blank')}
            className="w-full bg-primary-500 text-white py-4 px-6 rounded-md font-bold text-lg hover:bg-primary-600 transition duration-200 mb-4"
          >
            Book Your 30-Minute Strategy Consult
          </button>
          
          {!isSharedView && shareUrl && (
            <div className="text-center mb-4">
              <p className="text-gray-500 text-xs">
                💡 Share your results with colleagues or save the link for later
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </div>
  );
};

export default ResultsPage; 