import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import messageContext from "../context/messages/messageContext";
import MessageItem from "./MessageItem";
import AddMessage from "./AddMessage";
import { useNavigate } from "react-router-dom";

const Forum = () => {
  const navigate = useNavigate();
  const context = useContext(messageContext);
  const { messages, getMessages, updateMessage: contextUpdateMessage } = context;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const refreshIntervalRef = useRef(null);

  // Create stable updateMessage function that won't change on re-renders
  const updateMessage = useCallback((id, content) => {
    console.log("Updating message:", id, content);
    return contextUpdateMessage(id, content);
  }, [contextUpdateMessage]);

  // Function to load forum data
  const loadForum = useCallback(async () => {
    try {
      const authToken = localStorage.getItem("auth-token");
      setIsLoggedIn(!!authToken);
      
      if (!authToken) {
        setLoading(false);
        navigate("/login");
        return;
      }
      
      // Get username from localStorage
      const storedName = localStorage.getItem("user-name");
      if (storedName) {
        setUserName(storedName);
      }
      
      // Load messages
      console.log("Getting messages...");
      await getMessages();
      console.log("Messages loaded:", messages ? messages.length : 0);
      setLoading(false);
    } catch (err) {
      console.error("Error loading forum:", err);
      setError("Failed to load forum. Please try again later.");
      setLoading(false);
    }
  }, [getMessages, navigate]);

  // Initial data loading and setup refresh interval
  useEffect(() => {
    // Load forum data initially
    loadForum();
    
    // Set up periodic refresh (every 30 seconds)
    refreshIntervalRef.current = setInterval(() => {
      console.log("Auto-refreshing forum messages...");
      getMessages();
    }, 30000);
    
    // Cleanup on component unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [loadForum, getMessages]);

  // Function to manually refresh messages
  const handleRefresh = () => {
    console.log("Manually refreshing messages...");
    setLoading(true);
    getMessages().finally(() => setLoading(false));
  };

  // Conditional rendering to prevent flickering
  if (loading && messages.length === 0) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner" role="status"></div>
        <p className="mt-2">Loading forum...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn btn-outline-danger btn-sm ms-3"
            onClick={loadForum}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-12 col-md-8 offset-md-2">
          <div className="text-center mb-3">
            <h2 className="h3 fw-bold mb-2">
              <span style={{ color: "hsl(218, 81%, 75%)" }}>Discussion Forum</span>
            </h2>
            <p className="mb-3 text-muted">
              Welcome, <span className="fw-bold" style={{ color: "hsl(218, 81%, 55%)" }}>{userName}</span>! 
              Join the conversation and share your thoughts.
            </p>
            <div className="border-bottom pb-2 mb-3" style={{ borderColor: "hsl(218, 81%, 85%)" }}></div>
          </div>

          {isLoggedIn ? (
            <>
              <AddMessage />
              <div className="d-flex flex-column flex-md-row align-items-center mb-3 mt-4">
                <h4 className="h5 mb-2 mb-md-0">Recent Discussions</h4>
                <div className="flex-grow-1 ms-md-3 border-bottom d-none d-md-block" style={{ borderColor: "hsl(218, 81%, 85%)" }}></div>
                <button 
                  className="btn btn-sm btn-outline-primary ms-md-2 mt-2 mt-md-0"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <i className="fas fa-sync-alt"></i>
                  )} Refresh
                </button>
              </div>
              
              {messages && messages.length > 0 ? (
                <div className="discussion-list">
                  {messages.map((message) => (
                    <MessageItem
                      key={message._id}
                      message={message}
                      updateMessage={updateMessage}
                    />
                  ))}
                </div>
              ) : (
                <div className="alert alert-info shadow-sm border-0">
                  <i className="fas fa-info-circle me-2"></i>
                  No discussions yet. Be the first to start a conversation!
                </div>
              )}
            </>
          ) : (
            <div className="alert alert-warning">
              Please log in to view and participate in discussions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forum; 