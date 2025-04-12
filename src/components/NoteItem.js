import React, { useContext } from "react";
import NoteContext from "../context/notes/NoteContext";

const NoteItem = (props) => {
  const context = useContext(NoteContext);
  const { deleteNote } = context;
  const { note, updateNote, viewType = 'grid' } = props;

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Truncate text with ellipsis if it's too long
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substr(0, maxLength) + '...' : text;
  };

  if (viewType === 'list') {
    return (
      <div className="card shadow-sm h-100 border-0 note-item">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title mb-1">{note.title}</h5>
              {note.date && <small className="text-muted">{formatDate(note.date)}</small>}
            </div>
            <div>
              <span className="badge bg-light text-dark me-2">{note.tag}</span>
            </div>
          </div>
          <p className="card-text mt-2">{note.description}</p>
          <div className="d-flex justify-content-end mt-2">
            <button
              className="btn btn-sm btn-outline-primary me-2"
              onClick={() => {
                updateNote(note);
              }}
            >
              <i className="far fa-edit me-1"></i> Edit
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this note?")) {
                  deleteNote(note._id);
                }
              }}
            >
              <i className="far fa-trash-alt me-1"></i> Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm h-100 border-0 note-item">
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h5 className="card-title">{truncateText(note.title, 25)}</h5>
          <span className="badge bg-light text-dark">{note.tag}</span>
        </div>
        <p className="card-text flex-grow-1">{truncateText(note.description, 100)}</p>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          {note.date && <small className="text-muted">{formatDate(note.date)}</small>}
          <div className="d-flex">
            <button
              className="btn btn-sm btn-icon text-primary me-1"
              onClick={() => {
                updateNote(note);
              }}
              title="Edit note"
            >
              <i className="far fa-edit"></i>
            </button>
            <button
              className="btn btn-sm btn-icon text-danger"
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this note?")) {
                  deleteNote(note._id);
                }
              }}
              title="Delete note"
            >
              <i className="far fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
