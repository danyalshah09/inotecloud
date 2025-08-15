import React, { useState } from "react";

const DirectPostTest = () => {
  const [content, setContent] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const authToken = localStorage.getItem("auth-token");

      if (!authToken) {
        setError("No auth token found. Please log in first.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/messages/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken
        },
        body: JSON.stringify({ content })
      });

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        setError(`Failed to parse response: ${e.message}\nRaw response: ${responseText}`);
        setLoading(false);
        return;
      }

      if (response.ok) {
        setResult(data);
        setContent("");
      } else {
        setError(`Error: ${response.status} - ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      setError(`Exception: ${err.message}`);
      console.error("Error posting message:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-6">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h3>Direct Message Post Test</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Message Content:</label>
              <textarea
                className="form-control"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="3"
                placeholder="Enter your message here"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Message"}
            </button>
          </form>

          {error && (
            <div className="alert alert-danger mt-3">
              <h5>Error:</h5>
              <pre className="mb-0">{error}</pre>
            </div>
          )}

          {result && (
            <div className="alert alert-success mt-3">
              <h5>Success!</h5>
              <pre className="mb-0">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectPostTest;