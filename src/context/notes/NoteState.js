import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000";

  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // Get all notes
  const getNotes = async () => {
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc4MzBiNzE2NjMxYjkwZmNmM2JiNzg2In0sImlhdCI6MTczNjgwNDg4MiwiZXhwIjoxNzM2ODA4NDgyfQ.h3gsdl46GeUPQ0ypxCRORi0xceLEoiCp9WbuQ5_W2PY",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const json = await response.json();
      setNotes(json);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };
  
  
  // Add a Note
  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc4MzBiNzE2NjMxYjkwZmNmM2JiNzg2In0sImlhdCI6MTczNjgwNDg4MiwiZXhwIjoxNzM2ODA4NDgyfQ.h3gsdl46GeUPQ0ypxCRORi0xceLEoiCp9WbuQ5_W2PY"   },
      body: JSON.stringify({ title, description, tag }),
    });

    const json = await response.json();
    setNotes(notes.concat(json));
  };

  // Delete a Note
  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note._id !== id));
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc4MzBiNzE2NjMxYjkwZmNmM2JiNzg2In0sImlhdCI6MTczNjgwNDg4MiwiZXhwIjoxNzM2ODA4NDgyfQ.h3gsdl46GeUPQ0ypxCRORi0xceLEoiCp9WbuQ5_W2PY" },
      body: JSON.stringify({ title, description, tag }),
    });

    const json = await response.json();

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
