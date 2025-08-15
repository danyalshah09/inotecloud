import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import messageContext from "../context/messages/messageContext";

const Forum = () => {
  const navigate = useNavigate();
  const context = useContext(messageContext);
  const { messages, getMessages, addMessage, deleteMessage, updateMessage, likeMessage, unlikeMessage, addReply } = context;
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");
  const [userName, setUserName] = useState("Guest");
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [userIdFromStorage, setUserIdFromStorage] = useState("");

  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem("auth-token");
      if (!authToken) {
        navigate("/login");
        return false;
      }
      return true;
    };

    const loadMessages = async () => {
      if (checkAuth()) {
        await getMessages();
        setLoading(false);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const authToken = localStorage.getItem("auth-token");
        if (!authToken) {
          setUserName("Guest");
          return;
        }

        const userId = localStorage.getItem("userId");
        if (userId) {
          setUserIdFromStorage(userId);
        }

        // Try getting username from localStorage first
        const storedUserName = localStorage.getItem("user-name");
        if (storedUserName) {
          setUserName(storedUserName);
        }

        const response = await fetch("http://localhost:5000/api/auth/getuser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken
          }
        });

        if (response.ok) {
          const userData = await response.json();
          if (userData && userData.name) {
            setUserName(userData.name);
          }
          if (userData && userData._id && !userId) {
            localStorage.setItem("userId", userData._id);
            setUserIdFromStorage(userData._id);
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        // Keep existing username from localStorage if there's an error
      }
    };

    loadMessages();
    fetchUserDetails();

    // Set up interval to refresh messages periodically
    const refreshInterval = setInterval(getMessages, 30000); // Every 30 seconds

    // Cleanup function
    return () => {
      clearInterval(refreshInterval);
    };
  }, [getMessages, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    const result = await addMessage(newMessage.trim());
    if (result) {
      setNewMessage("");
      toast.success("Message posted successfully!");
    } else {
      toast.error("Failed to post message. Please try again.");
    }
  };

  const handleDelete = async (messageId) => {
    const confirmed = window.confirm("Are you sure you want to delete this message?");
    if (confirmed) {
      const success = await deleteMessage(messageId);
      if (success) {
        toast.success("Message deleted successfully!");
      } else {
        toast.error("Failed to delete message");
      }
    }
  };

  const handleEdit = async (messageId, newText) => {
    if (!newText.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    const success = await updateMessage(messageId, newText.trim());
    if (success) {
      setEditingMessage(null);
      setEditText("");
      toast.success("Message updated successfully!");
    } else {
      toast.error("Failed to update message");
    }
  };

  const handleReply = async (messageId) => {
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    const success = await addReply(messageId, replyText.trim());
    if (success) {
      setReplyingTo(null);
      setReplyText("");
      toast.success("Reply added successfully!");
    } else {
      toast.error("Failed to add reply");
    }
  };

  const handleLike = async (messageId, isLiked) => {
    const success = isLiked
      ? await unlikeMessage(messageId)
      : await likeMessage(messageId);

    if (!success) {
      toast.error(isLiked
        ? "Failed to unlike message"
        : "Failed to like message");
    }
  };

  // Utility function to check if the user is the owner of a message
  const isMessageOwner = (msg) => {
    const userId = userIdFromStorage;

    if (!userId) return false;

    // Check different possible formats of user ID in messages
    if (msg.user && typeof msg.user === 'object' && msg.user._id === userId) {
      return true;
    }

    if (msg.user && typeof msg.user === 'string' && msg.user === userId) {
      return true;
    }

    return false;
  };

  // Format date to more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5;

    if (diffInHours < 24) {
      // Today
      return `Today at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } else if (diffInHours < 48) {
      // Yesterday
      return `Yesterday at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } else {
      // Other days
      return date.toLocaleDateString([], {day: 'numeric', month: 'short', year: 'numeric'}) +
             ` at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center ">
        <div className="text-center">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-white">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-lg rounded-3 border-0 mb-4">
              <div className="card-header bg-primary text-white py-3">
                <h2 className="text-center mb-0 fs-4">Community Discussion Forum</h2>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit} className="mb-4">
                  <div className="form-group">
                    <label htmlFor="newMessage" className="form-label">
                      <i className="fas fa-comment-alt me-2"></i>Start a new discussion
                    </label>
                    <textarea
                      id="newMessage"
                      className="form-control"
                      rows="3"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`What's on your mind today, ${userName}?`}
                    ></textarea>
                  </div>
                  <div className="d-grid mt-3">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!newMessage.trim()}
                    >
                      <i className="fas fa-paper-plane me-2"></i>Post Message
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {messages.length === 0 ? (
              <div className="card shadow border-0 rounded-3">
                <div className="card-body p-5 text-center">
                  <i className="fas fa-comments fa-3x text-muted mb-3"></i>
                  <h3 className="text-muted">No messages yet</h3>
                  <p className="mb-0">Be the first to start a discussion!</p>
                </div>
              </div>
            ) : (
              <div className="messages">
                {messages.map((msg) => (
                  <div key={msg._id} className="card shadow-sm border-0 rounded-3 mb-4 message-card">
                    <div className="card-header bg-light py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="message-avatar me-2">
                            <i className="fas fa-user-circle fa-2x text-primary"></i>
                          </div>
                          <div>
                            <h6 className="mb-0 fw-bold">{msg.userName || (msg.user && msg.user.name) || "Anonymous"}</h6>
                            <small className="text-muted">
                              {formatDate(msg.date)}
                            </small>
                          </div>
                        </div>
                        {isMessageOwner(msg) && !editingMessage && (
                          <div className="dropdown">
                            <button className="btn btn-sm btn-light" type="button" id={`dropdownMenu-${msg._id}`} data-bs-toggle="dropdown" aria-expanded="false">
                              <i className="fas fa-ellipsis-v"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdownMenu-${msg._id}`}>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => {
                                    setEditingMessage(msg._id);
                                    setEditText(msg.content || msg.message);
                                  }}
                                >
                                  <i className="fas fa-edit me-2"></i>Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => handleDelete(msg._id)}
                                >
                                  <i className="fas fa-trash-alt me-2"></i>Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="card-body p-4">
                      {editingMessage === msg._id ? (
                        <div>
                          <textarea
                            className="form-control mb-3"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows="3"
                          ></textarea>
                          <div className="d-flex justify-content-end">
                            <button
                              className="btn btn-outline-secondary me-2"
                              onClick={() => {
                                setEditingMessage(null);
                                setEditText("");
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleEdit(msg._id, editText)}
                              disabled={!editText.trim()}
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="card-text mb-4">{msg.content || msg.message}</p>
                          <div className="d-flex flex-wrap justify-content-between align-items-center mt-3">
                            <div className="mb-2 mb-md-0">
                              <button
                                className={`btn btn-sm ${msg.likedBy && msg.likedBy.includes(userIdFromStorage) ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => handleLike(msg._id, msg.likedBy && msg.likedBy.includes(userIdFromStorage))}
                              >
                                <i className={`${msg.likedBy && msg.likedBy.includes(userIdFromStorage) ? "fas" : "far"} fa-thumbs-up me-1`}></i>
                                {msg.likes || 0} {msg.likes === 1 ? "Like" : "Likes"}
                              </button>

                              <button
                                className={`btn btn-sm ${replyingTo === msg._id ? "btn-primary" : "btn-outline-primary"} ms-2`}
                                onClick={() => {
                                  setReplyingTo(replyingTo === msg._id ? null : msg._id);
                                  setReplyText("");
                                }}
                              >
                                <i className="far fa-comment me-1"></i>
                                {msg.replies && msg.replies.length > 0 ? msg.replies.length : ""} Reply
                              </button>
                            </div>
                          </div>

                          {/* Reply form */}
                          {replyingTo === msg._id && (
                            <div className="mt-4 border-top pt-3">
                              <div className="d-flex mb-3">
                                <div className="message-avatar me-2 align-self-start mt-1">
                                  <i className="fas fa-user-circle text-secondary"></i>
                                </div>
                                <div className="flex-grow-1">
                                  <textarea
                                    className="form-control form-control-sm"
                                    placeholder="Write your reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    rows="2"
                                  ></textarea>
                                  <div className="d-flex justify-content-end mt-2">
                                    <button
                                      className="btn btn-sm btn-outline-secondary me-2"
                                      onClick={() => {
                                        setReplyingTo(null);
                                        setReplyText("");
                                      }}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      className="btn btn-sm btn-primary"
                                      onClick={() => handleReply(msg._id)}
                                      disabled={!replyText.trim()}
                                    >
                                      Post Reply
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Replies section */}
                          {msg.replies && msg.replies.length > 0 && (
                            <div className="replies mt-4 pt-3 border-top">
                              <h6 className="text-muted mb-3 fs-6">
                                <i className="fas fa-reply fa-flip-horizontal me-2"></i>
                                {msg.replies.length} {msg.replies.length === 1 ? "Reply" : "Replies"}
                              </h6>
                              {msg.replies.map((reply, index) => (
                                <div key={index} className="d-flex mb-3">
                                  <div className="message-avatar me-2 align-self-start mt-1">
                                    <i className="fas fa-user-circle text-secondary"></i>
                                  </div>
                                  <div className="reply-content p-3 bg-light rounded flex-grow-1">
                                    <div className="d-flex justify-content-between">
                                      <h6 className="mb-1 fw-bold">{reply.userName}</h6>
                                      <small className="text-muted">{formatDate(reply.date)}</small>
                                    </div>
                                    <p className="mb-0">{reply.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;