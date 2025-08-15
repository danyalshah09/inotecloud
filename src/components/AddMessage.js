import React, { useState, useContext } from "react";
import messageContext from "../context/messages/messageContext";

const AddMessage = () => {
  const context = useContext(messageContext);
  const { addMessage, getMessages } = context;

  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.trim() === "") return;

    // Reset previous status messages
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      // Ensure the user is logged in
      const authToken = localStorage.getItem("auth-token");
      if (!authToken) {
        setError("You must be logged in to post a message. Please log in and try again.");
        return;
      }

      const result = await addMessage(content);

      if (result) {
        // Success
        setContent("");
        setSuccessMessage("Message posted successfully!");

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);

        // Refresh the messages list
        getMessages();
      } else {
        // API call returned but was not successful
        setError("Failed to post your message. Please try again.");
      }
    } catch (error) {
      console.error("Error adding message:", error);
      setError("An error occurred while posting your message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-header bg-primary text-white py-2">
        <h5 className="mb-0 h6">Start a New Discussion</h5>
      </div>
      <div className="card-body p-3">
        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success mb-3" role="alert">
            <i className="fas fa-check-circle me-2"></i>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="3"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              required
            ></textarea>
          </div>
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || content.trim() === ""}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Posting...
                </>
              ) : (
                "Post Message"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMessage;