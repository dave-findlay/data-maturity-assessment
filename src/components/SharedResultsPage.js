import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ResultsPage from './ResultsPage';
import LoadingScreen from './LoadingScreen';

const SharedResultsPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/get-results?id=${id}`);
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to load results');
        }
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResults();
    } else {
      setError('Invalid results ID');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
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
              Data Maturity Assessment Results
            </h1>
          </header>
          <LoadingScreen analysisComplete={false} />
        </div>
      </div>
    );
  }

  if (error) {
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
              Data Maturity Assessment Results
            </h1>
          </header>
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Results Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error === 'Results not found or expired' 
                ? 'These results may have expired or the link is invalid.'
                : 'There was an error loading the results.'}
            </p>
            <a 
              href="/" 
              className="bg-primary-500 text-white py-3 px-6 rounded-md font-semibold hover:bg-primary-600 transition duration-200"
            >
              Take New Assessment
            </a>
          </div>
        </div>
      </div>
    );
  }

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
            Data Maturity Assessment Results
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Shared assessment results for {data?.userProfile?.companyName}
          </p>
        </header>

        <ResultsPage 
          userProfile={data.userProfile}
          results={data.results}
          isSharedView={true}
          onRequestReport={() => {
            console.log('Report requested from shared view');
          }}
        />
      </div>
    </div>
  );
};

export default SharedResultsPage; 