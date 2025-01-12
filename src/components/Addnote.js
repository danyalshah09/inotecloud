import React, { useContext, useState } from 'react';
import { NoteContext } from "../context/notes/NoteState"; // Corrected import
import { Notes } from './Notes';

export const Addnote = () => {
    const context = useContext(NoteContext); // NoteContext matches the export
    const { addnote } = context;

    // useState moved to the top level of the component
    const [note, setnote] = useState({ title: "", description: "", tag: "" });

    const handleClick = (e) => {
        e.preventDefault(); // Prevent form submission
        addnote(note); // Call the context function to add the note
        setnote({ title: "", description: "", tag: "" }); // Clear the form after adding
    };

    const onChange = (e) => {
        setnote({ ...note, [e.target.name]: e.target.value });
    };

    return (
        <div className="container">
            <h1>Add a Note</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="title">Add new note</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={note.title} // Bind state
                        placeholder="Enter your Title"
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        className="form-control"
                        id="description"
                        name="description"
                        value={note.description} // Bind state
                        placeholder="Enter Description"
                        onChange={onChange}
                    />
                </div>
                <button type="submit" onClick={handleClick} className="btn btn-primary">
                    Add Note
                </button>
            </form>
            <div className="container my-3">
                <h1>Your Notes</h1>
                <Notes />
            </div>
        </div>
    );
};
