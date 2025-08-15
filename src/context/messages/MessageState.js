import { useState } from "react";
import messageContext from "./messageContext";

const MessageState = (props) => {
  const host = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const messagesInitial = [];
  const [messages, setMessages] = useState(messagesInitial);

  // Get all messages
  const getMessages = async () => {
    try {
      const response = await fetch(`${host}/api/messages/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const json = await response.json();
        // Only update state if there's an actual change
        if (JSON.stringify(json) !== JSON.stringify(messages)) {
          setMessages(json);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error fetching messages. Status:", response.status, errorData);
      }
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };

  // Add a message
  const addMessage = async (content) => {
    try {
      const authToken = localStorage.getItem("auth-token");

      if (!authToken) {
        console.error("No auth token found. User might not be logged in.");
        return null;
      }

      // Create the request options
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({ content }),
      };

      const response = await fetch(`${host}/api/messages/add`, options);

      // Get the raw text response first
      const rawResponse = await response.text();

      let responseData;
      try {
        // Then attempt to parse it as JSON
        responseData = rawResponse ? JSON.parse(rawResponse) : {};
      } catch (jsonError) {
        console.error("Error parsing response JSON:", jsonError.message);
        responseData = { error: "Invalid response format" };
      }

      if (response.ok) {
        // Create a new array with the new message at the beginning
        const updatedMessages = [responseData, ...messages];
        setMessages(updatedMessages);
        return responseData;
      } else {
        console.error("Error adding message. Status:", response.status, responseData);
        return null;
      }
    } catch (error) {
      console.error("Error adding message:", error.message);
      return null;
    }
  };

  // Delete a message
  const deleteMessage = async (id) => {
    try {
      const authToken = localStorage.getItem("auth-token");

      if (!authToken) {
        console.error("No auth token found for deleting message");
        return null;
      }

      const response = await fetch(`${host}/api/messages/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });

      const responseText = await response.text();

      if (response.ok) {
        // Filter out the deleted message
        const newMessages = messages.filter((message) => message._id !== id);
        setMessages(newMessages);
        return true;
      } else {
        console.error("Error deleting message:", responseText);
        return false;
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      return false;
    }
  };

  // Update a message
  const updateMessage = async (id, content) => {
    try {
      const authToken = localStorage.getItem("auth-token");

      if (!authToken) {
        console.error("No auth token found for updating message");
        return null;
      }

      const response = await fetch(`${host}/api/messages/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({ content }),
      });

      const responseText = await response.text();

      if (response.ok) {
        try {
          // Parse the JSON response
          const updatedMessage = JSON.parse(responseText);

          // Create a deep copy of messages to update
          const newMessages = JSON.parse(JSON.stringify(messages));

          // Find and replace the updated message
          for (let i = 0; i < newMessages.length; i++) {
            if (newMessages[i]._id === id) {
              newMessages[i] = updatedMessage;
              break;
            }
          }
          setMessages(newMessages);
          return true;
        } catch (parseError) {
          console.error("Error parsing update response:", parseError);
          return false;
        }
      } else {
        console.error("Error updating message:", responseText);
        return false;
      }
    } catch (error) {
      console.error("Error updating message:", error);
      return false;
    }
  };

  // Add a reply to a message
  const addReply = async (messageId, content) => {
    try {
      const authToken = localStorage.getItem("auth-token");

      if (!authToken) {
        console.error("No auth token found for adding reply");
        return null;
      }

      const response = await fetch(`${host}/api/messages/reply/${messageId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({ content }),
      });

      const responseText = await response.text();

      if (response.ok) {
        try {
          // Parse the JSON response
          const updatedMessage = JSON.parse(responseText);

          // Create a deep copy of messages to update
          const newMessages = JSON.parse(JSON.stringify(messages));

          // Find and replace the updated message
          for (let i = 0; i < newMessages.length; i++) {
            if (newMessages[i]._id === messageId) {
              newMessages[i] = updatedMessage;
              break;
            }
          }
          setMessages(newMessages);
          return true;
        } catch (parseError) {
          console.error("Error parsing reply response:", parseError);
          return false;
        }
      } else {
        console.error("Error adding reply:", responseText);
        return false;
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      return false;
    }
  };

  // Like a message
  const likeMessage = async (id) => {
    try {
      const authToken = localStorage.getItem("auth-token");
      if (!authToken) {
        console.error("No auth token found. User might not be logged in.");
        return false;
      }

      const response = await fetch(`${host}/api/messages/like/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });

      const rawResponse = await response.text();
      let data;
      try {
        data = JSON.parse(rawResponse);
      } catch (error) {
        console.error("Error parsing response:", error);
        return false;
      }

      if (response.ok) {
        const updatedMessage = data;
        const newMessages = JSON.parse(JSON.stringify(messages));

        // Find and replace the updated message
        for (let i = 0; i < newMessages.length; i++) {
          if (newMessages[i]._id === id) {
            newMessages[i] = updatedMessage;
            break;
          }
        }
        setMessages(newMessages);
        return true;
      } else {
        if (data.alreadyLiked) {
          return 'already-liked';
        }
        console.error("Error liking message:", data.error);
        return false;
      }
    } catch (error) {
      console.error("Error liking message:", error.message);
      return false;
    }
  };

  // Unlike a message
  const unlikeMessage = async (id) => {
    try {
      const authToken = localStorage.getItem("auth-token");
      if (!authToken) {
        console.error("No auth token found. User might not be logged in.");
        return false;
      }

      const response = await fetch(`${host}/api/messages/unlike/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });

      const rawResponse = await response.text();
      let data;
      try {
        data = JSON.parse(rawResponse);
      } catch (error) {
        console.error("Error parsing response:", error);
        return false;
      }

      if (response.ok) {
        const updatedMessage = data;
        const newMessages = JSON.parse(JSON.stringify(messages));

        // Find and replace the updated message
        for (let i = 0; i < newMessages.length; i++) {
          if (newMessages[i]._id === id) {
            newMessages[i] = updatedMessage;
            break;
          }
        }
        setMessages(newMessages);
        return true;
      } else {
        console.error("Error unliking message:", data.error);
        return false;
      }
    } catch (error) {
      console.error("Error unliking message:", error.message);
      return false;
    }
  };

  // Check if the current user has liked a message
  const hasUserLikedMessage = (message) => {
    if (!message || !message.likedBy) return false;

    // Try to get user ID from the authToken
    const authToken = localStorage.getItem("auth-token");
    if (!authToken) return false;

    try {
      // Decode JWT to get user ID
      const tokenParts = authToken.split('.');
      if (tokenParts.length !== 3) return false;

      const payload = JSON.parse(atob(tokenParts[1]));
      const userId = payload.user.id;

      // Check if userId exists in the likedBy array
      return message.likedBy.some(id => id.toString() === userId);
    } catch (error) {
      console.error("Error checking if user liked message:", error);
      return false;
    }
  };

  return (
    <messageContext.Provider
      value={{
        messages,
        getMessages,
        addMessage,
        deleteMessage,
        updateMessage,
        addReply,
        likeMessage,
        unlikeMessage,
        hasUserLikedMessage
      }}
    >
      {props.children}
    </messageContext.Provider>
  );
};

export default MessageState;