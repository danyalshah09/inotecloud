import React, { useState, useEffect } from "react";

const TestAuth = () => {
  const [token, setToken] = useState("");
  const [testResult, setTestResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth-token");
    setToken(storedToken || "");
  }, []);

  const testAuthentication = async () => {
    setLoading(true);
    setTestResult("");
    
    try {
      // First, test that we have a token
      if (!token) {
        setTestResult("No authentication token found in localStorage.");
        setLoading(false);
        return;
      }

      // Display token info
      setTestResult(`Token found: ${token.substring(0, 15)}...\n\n`);
      
      // Test token verification endpoint first
      setTestResult(prev => prev + "Testing token verification endpoint...\n");
      
      const verifyResponse = await fetch("http://localhost:5000/api/auth/verify-token", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        }
      });
      
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        setTestResult(prev => 
          prev + `Token verification successful!\n` + 
          `User ID: ${verifyData.userId}\n\n`
        );
      } else {
        const errorData = await verifyResponse.text();
        setTestResult(prev => 
          prev + `Token verification failed!\n` + 
          `Status: ${verifyResponse.status}\n` +
          `Response: ${errorData}\n\n`
        );
        // If verification failed, don't continue with message test
        setLoading(false);
        return;
      }
      
      // Test POST endpoint with token
      setTestResult(prev => prev + "Testing message creation endpoint...\n");
      const response = await fetch("http://localhost:5000/api/messages/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        },
        body: JSON.stringify({ content: "Test message from auth debugger" })
      });
      
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        data = { error: "Failed to parse response", raw: responseText };
      }
      
      setTestResult(prev => 
        prev + `Response status: ${response.status}\n` +
        `Response data: ${JSON.stringify(data, null, 2)}`
      );
      
    } catch (error) {
      setTestResult(prev => 
        prev + `\nError: ${error.message}\n` +
        `${error.stack || ""}`
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    // This is just for testing - in a real app, you'd implement a proper token refresh
    localStorage.removeItem("auth-token");
    setTestResult("Token removed. Please log in again to get a new token.");
    setToken("");
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h3>Authentication Debug Tool</h3>
        </div>
        <div className="card-body">
          <p>This tool helps test if your authentication is working correctly.</p>
          
          <div className="mb-3">
            <label className="form-label">Current JWT Token:</label>
            <textarea 
              className="form-control" 
              value={token} 
              onChange={(e) => setToken(e.target.value)}
              rows="3"
              readOnly
            />
          </div>
          
          <div className="mb-3">
            <button 
              className="btn btn-primary me-2" 
              onClick={testAuthentication}
              disabled={loading}
            >
              {loading ? "Testing..." : "Test Authentication"}
            </button>
            
            <button 
              className="btn btn-danger" 
              onClick={refreshToken}
              disabled={loading}
            >
              Remove Token
            </button>
          </div>
          
          {testResult && (
            <div className="mt-4">
              <h5>Test Results:</h5>
              <pre className="bg-light p-3 border rounded">
                {testResult}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestAuth; 