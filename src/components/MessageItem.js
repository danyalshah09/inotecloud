import React, { useState, useContext, useCallback, memo, useEffect } from "react";
import messageContext from "../context/messages/messageContext";
import { format } from "date-fns";
import { getUserIdFromToken } from "../utils/tokenHelper";

const MessageItem = ({ message, updateMessage }) => {
  const context = useContext(messageContext);
  const { deleteMessage, likeMessage, unlikeMessage, addReply } = context;
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeInProgress, setLikeInProgress] = useState(false);
  const [apiError, setApiError] = useState("");

  // Check if user has liked this message when the component mounts or message changes
  useEffect(() => {
    // Get current user ID
    const userId = localStorage.getItem("user-id");
    
    // If we have the user ID and message has likedBy array, check if user has liked
    if (userId && message.likedBy) {
      const userHasLiked = message.likedBy.some(id => id === userId);
      setHasLiked(userHasLiked);
    } else {
      setHasLiked(false);
    }
  }, [message]);

  const handleDelete = useCallback(async () => {
    const result = await deleteMessage(message._id);
    if (!result) {
      setApiError("Failed to delete message. Please try again.");
    }
  }, [deleteMessage, message._id]);

  const handleLikeToggle = useCallback(async () => {
    if (likeInProgress) return;
    
    setApiError("");
    setLikeInProgress(true);
    try {
      if (hasLiked) {
        // Unlike the message
        const result = await unlikeMessage(message._id);
        if (result) {
          setHasLiked(false);
        } else {
          setApiError("Failed to unlike the message");
        }
      } else {
        // Like the message
        const result = await likeMessage(message._id);
        if (result === true) {
          setHasLiked(true);
        } else if (result === 'already-liked') {
          setHasLiked(true);
          console.log("You've already liked this message");
        } else {
          setApiError("Failed to like the message");
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setApiError("Error processing your request");
    } finally {
      setLikeInProgress(false);
    }
  }, [likeMessage, unlikeMessage, message._id, hasLiked, likeInProgress]);

  // Format date to a readable format
  const formatDate = useCallback((date) => {
    try {
      return format(new Date(date), "MMM d, yyyy h:mm a");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Unknown date";
    }
  }, []);

  const isCurrentUserMessage = useCallback(() => {
    // Use our utility to get the user ID
    const currentUserId = getUserIdFromToken();
    if (!currentUserId) return false;
    
    // Check if the current user ID matches the message creator's ID
    if (typeof message.user === 'object') {
      return message.user._id === currentUserId;
    }
    return message.user === currentUserId;
  }, [message.user]);

  const toggleReplies = useCallback(() => {
    setShowReplies(prev => !prev);
  }, []);

  const toggleEditMode = useCallback(() => {
    setEditMode(true);
    setEditContent(message.content);
    setApiError("");
  }, [message.content]);

  const cancelEdit = useCallback(() => {
    setEditMode(false);
    setApiError("");
  }, []);

  const handleEdit = useCallback(async () => {
    if (editContent.trim() === "") {
      setApiError("Message content cannot be empty");
      return;
    }
    
    setIsSubmitting(true);
    setApiError("");
    try {
      const result = await updateMessage(message._id, editContent);
      if (result) {
        setEditMode(false);
      } else {
        setApiError("Failed to update message");
      }
    } catch (error) {
      console.error("Error updating message:", error);
      setApiError("Error saving your changes");
    } finally {
      setIsSubmitting(false);
    }
  }, [updateMessage, message._id, editContent]);

  const handleAddReply = useCallback(async (e) => {
    e.preventDefault();
    if (replyContent.trim() === "" || isSubmitting) return;
    
    setIsSubmitting(true);
    setApiError("");
    try {
      const result = await addReply(message._id, replyContent);
      if (result) {
        setReplyContent("");
      } else {
        setApiError("Failed to add reply");
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      setApiError("Error posting your reply");
    } finally {
      setIsSubmitting(false);
    }
  }, [addReply, message._id, replyContent, isSubmitting]);

  return (
    <div className="card mb-3">
      <div className="card-body">
        {apiError && (
          <div className="alert alert-danger mb-3" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {apiError}
          </div>
        )}
      
        {editMode ? (
          <div className="mb-3">
            <textarea
              className="form-control"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              disabled={isSubmitting}
            />
            <div className="mt-2">
              <button
                className="btn btn-primary btn-sm me-2"
                onClick={handleEdit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={cancelEdit}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="card-title">{message.userName}</h5>
              <small className="text-muted">
                {formatDate(message.date)}
              </small>
            </div>
            <p className="card-text">{message.content}</p>
          </>
        )}

        <div className="d-flex">
          {hasLiked ? (
            <button
              className="btn btn-primary btn-sm me-2"
              onClick={handleLikeToggle}
              disabled={likeInProgress}
            >
              <i className="fas fa-thumbs-up"></i> Liked ({message.likes})
            </button>
          ) : (
            <button
              className="btn btn-outline-primary btn-sm me-2"
              onClick={handleLikeToggle}
              disabled={likeInProgress}
            >
              <i className="far fa-thumbs-up"></i> Like ({message.likes})
            </button>
          )}
          <button
            className="btn btn-outline-secondary btn-sm me-2"
            onClick={toggleReplies}
          >
            <i className={`fas fa-chevron-${showReplies ? "up" : "down"}`}></i>{" "}
            Replies ({message.replies?.length || 0})
          </button>

          {isCurrentUserMessage() && (
            <>
              <button
                className="btn btn-outline-info btn-sm me-2"
                onClick={toggleEditMode}
              >
                <i className="fas fa-edit"></i> Edit
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleDelete}
              >
                <i className="fas fa-trash"></i> Delete
              </button>
            </>
          )}
        </div>

        {showReplies && (
          <div className="mt-3">
            {message.replies && message.replies.length > 0 ? (
              <div className="list-group">
                {message.replies.map((reply, index) => (
                  <div key={index} className="list-group-item list-group-item-action">
                    <div className="d-flex justify-content-between">
                      <h6 className="mb-1">{reply.userName}</h6>
                      <small>{formatDate(reply.date)}</small>
                    </div>
                    <p className="mb-1">{reply.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No replies yet.</p>
            )}

            <form onSubmit={handleAddReply} className="mt-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                <button
                  className="btn btn-primary" 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Reply"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrap in memo to prevent unnecessary re-renders
export default memo(MessageItem); 