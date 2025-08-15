import React from "react";
import NoteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "https://inotebackend-nloj.onrender.com";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // Get all notes
  const getNotes = async () => {
    const authToken = localStorage.getItem("auth-token");

    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const fetchedNotes = await response.json();

      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };


  // Add a Note
  const addNote = async (title, description, tag) => {
    try {
      const authToken = localStorage.getItem("auth-token");

      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken
        },
        body: JSON.stringify({ title, description, tag }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error adding note:", errorData);
        throw new Error(`Failed to add note: ${response.status} ${response.statusText}`);
      }

      const newNote = await response.json();
      setNotes(notes.concat(newNote));
      return newNote;
    } catch (error) {
      console.error("Error in addNote function:", error.message);
      throw error;
    }
  };

  // Delete a Note
  const deleteNote = async (id) => {
    try {
      const authToken = localStorage.getItem("auth-token");

      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error deleting note:", errorData);
        throw new Error(`Failed to delete note: ${response.status} ${response.statusText}`);
      }

      const newNotes = notes.filter((note) => note._id !== id);
      setNotes(newNotes);
      return true;
    } catch (error) {
      console.error("Error in deleteNote function:", error.message);
      throw error;
    }
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    try {
      const authToken = localStorage.getItem("auth-token");

      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken
        },
        body: JSON.stringify({ title, description, tag }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error updating note:", errorData);
        throw new Error(`Failed to update note: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const updatedNote = result.note; // Backend returns { note }

      const newNotes = notes.map((note) =>
        note._id === id ? updatedNote : note
      );
      setNotes(newNotes);
      return updatedNote;
    } catch (error) {
      console.error("Error in editNote function:", error.message);
      throw error;
    }
  };

  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
