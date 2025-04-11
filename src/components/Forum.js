import React, { useState, useEffect } from 'react';
import { Alert } from './Alert';

const Forum = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all messages
  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/messages/all');
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setAlert({ type: 'danger', message: 'Failed to load messages' });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Add a new message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const authToken = localStorage.getItem('auth-token');
      const response = await fetch('http://localhost:5000/api/messages/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken
        },
        body: JSON.stringify({ content: newMessage })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([data, ...messages]);
        setNewMessage('');
        setAlert({ type: 'success', message: 'Message posted successfully!' });
      } else {
        const error = await response.json();
        setAlert({ type: 'danger', message: error.error || 'Failed to post message' });
      }
    } catch (error) {
      console.error('Error posting message:', error);
      setAlert({ type: 'danger', message: 'Failed to post message' });
    }
  };

  // Add a reply to a message
  const handleReply = async (messageId) => {
    if (!replyContent.trim()) return;

    try {
      const authToken = localStorage.getItem('auth-token');
      const response = await fetch(`http://localhost:5000/api/messages/reply/${messageId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken
        },
        body: JSON.stringify({ content: replyContent })
      });

      if (response.ok) {
        const updatedMessage = await response.json();
        setMessages(messages.map(msg => 
          msg._id === messageId ? updatedMessage : msg
        ));
        setReplyContent('');
        setSelectedMessage(null);
        setAlert({ type: 'success', message: 'Reply posted successfully!' });
      } else {
        const error = await response.json();
        setAlert({ type: 'danger', message: error.error || 'Failed to post reply' });
      }
    } catch (error) {
      console.error('Error posting reply:', error);
      setAlert({ type: 'danger', message: 'Failed to post reply' });
    }
  };

  // Like a message
  const handleLike = async (messageId) => {
    try {
      const authToken = localStorage.getItem('auth-token');
      const response = await fetch(`http://localhost:5000/api/messages/like/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken
        }
      });

      if (response.ok) {
        const updatedMessage = await response.json();
        setMessages(messages.map(msg => 
          msg._id === messageId ? updatedMessage : msg
        ));
      } else {
        const error = await response.json();
        if (!error.alreadyLiked) {
          setAlert({ type: 'danger', message: error.error || 'Failed to like message' });
        }
      }
    } catch (error) {
      console.error('Error liking message:', error);
      setAlert({ type: 'danger', message: 'Failed to like message' });
    }
  };

  // Unlike a message
  const handleUnlike = async (messageId) => {
    try {
      const authToken = localStorage.getItem('auth-token');
      const response = await fetch(`http://localhost:5000/api/messages/unlike/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken
        }
      });

      if (response.ok) {
        const updatedMessage = await response.json();
        setMessages(messages.map(msg => 
          msg._id === messageId ? updatedMessage : msg
        ));
      } else {
        const error = await response.json();
        if (!error.notLiked) {
          setAlert({ type: 'danger', message: error.error || 'Failed to unlike message' });
        }
      }
    } catch (error) {
      console.error('Error unliking message:', error);
      setAlert({ type: 'danger', message: 'Failed to unlike message' });
    }
  };

  // Delete a message
  const handleDelete = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const authToken = localStorage.getItem('auth-token');
      const response = await fetch(`http://localhost:5000/api/messages/delete/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken
        }
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg._id !== messageId));
        setAlert({ type: 'success', message: 'Message deleted successfully!' });
      } else {
        const error = await response.json();
        setAlert({ type: 'danger', message: error.error || 'Failed to delete message' });
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      setAlert({ type: 'danger', message: 'Failed to delete message' });
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Discussion Forum</h2>
      
      {alert && <Alert type={alert.type} message={alert.message} />}

      {/* New Message Form */}
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Write your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Post Message
            </button>
          </form>
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="text-center">Loading messages...</div>
      ) : (
        <div className="messages-list">
          {messages.map((message) => (
            <div key={message._id} className="card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-subtitle mb-2 text-muted">
                      Posted by {message.userName} on {new Date(message.date).toLocaleString()}
                    </h6>
                    <p className="card-text">{message.content}</p>
                  </div>
                  <div className="btn-group">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleLike(message._id)}
                    >
                      <i className="fas fa-thumbs-up"></i> {message.likes}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setSelectedMessage(selectedMessage === message._id ? null : message._id)}
                    >
                      Reply
                    </button>
                    {message.user === localStorage.getItem('user-id') && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(message._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {/* Replies Section */}
                {message.replies && message.replies.length > 0 && (
                  <div className="replies-section mt-3">
                    <h6>Replies:</h6>
                    {message.replies.map((reply, index) => (
                      <div key={index} className="reply-item border-start ps-3 mb-2">
                        <small className="text-muted">
                          {reply.userName} - {new Date(reply.date).toLocaleString()}
                        </small>
                        <p className="mb-0">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                {selectedMessage === message._id && (
                  <div className="reply-form mt-3">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => handleReply(message._id)}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Forum; 