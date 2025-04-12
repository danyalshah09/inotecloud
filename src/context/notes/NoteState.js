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
      console.log("Fetched Notes:", fetchedNotes); // Add this for debugging
      console.log("Auth Token:", authToken);

      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

   
  // Add a Note
  const addNote = async (title, description, tag) => {
    try {
      console.log("Adding note with data:", { title, description, tag });
      const authToken = localStorage.getItem("auth-token");
      console.log("Auth token:", authToken ? "Present" : "Missing");

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
      console.log("Note added successfully:", newNote);
      setNotes(notes.concat(newNote));
      return newNote;
    } catch (error) {
      console.error("Error in addNote function:", error.message);
      throw error;
    }
  };

  // Delete a Note
  const deleteNote = async (id) => {
    const authToken = localStorage.getItem("auth-token");

    //API CALL
    await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": authToken
      },
    });
   
    console.log("Deleting the note with id " + id);
    const newNotes = notes.filter((note) => note._id !== id);
    setNotes(newNotes);
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    const authToken = localStorage.getItem("auth-token");

    await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": authToken
      },
      body: JSON.stringify({ title, description, tag }),
    });
   
    const newNotes = notes.map((note) =>
      note._id === id ? { ...note, title, description, tag } : note
    );
    setNotes(newNotes);
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
