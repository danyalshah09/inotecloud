import React, { useContext } from "react";
import NoteContext from "../context/notes/NoteContext";

const NoteItem = (props) => {
  const context = useContext(NoteContext);
  const { deleteNote } = context;
  const { note, updateNote } = props;

  return (
    <div className="col-md-6 mb-4">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h5 className="card-title">{note.title}</h5>
            <span className="badge bg-light text-dark">{note.tag}</span>
          </div>
          <p className="card-text">{note.description}</p>
          <div className="d-flex justify-content-end mt-3">
            <i
              className="far fa-edit mx-2 text-primary"
              style={{ cursor: "pointer", fontSize: "1.2rem" }}
              onClick={() => {
                updateNote(note);
              }}
            ></i>
            <i
              className="far fa-trash-alt mx-2 text-danger"
              style={{ cursor: "pointer", fontSize: "1.2rem" }}
              onClick={() => {
                deleteNote(note._id);
              }}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
