
import React, { useContext } from "react";
import noteContext from "../context/notes/noteContext";

const Noteitem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note, updateNote } = props;

  return (
    <div className="card d-inline-block flex-row m-3">
      <div className="p-3">
        <div className="card-body flex-grow-1">
          <h5 className="card-title mb-1 text-red">{note.title}</h5>
          <p className="card-text mb-0">{note.description}</p>
          <i
            className="fas fa-pencil-alt mx-3"
            onClick={() => {
              updateNote(note);
            }}
          >
            
          </i>
          <i
            className="fas fa-trash mx-3"
            onClick={() => {
              deleteNote(note._id);
            }}
            style={{ cursor: "pointer" }}
          >
            
          </i>
        </div>
      </div>
    </div>
  );
};

export default Noteitem;
