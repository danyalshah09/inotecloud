import React, { useContext, useEffect, useState } from "react";
import NoteContext from "../context/notes/NoteContext";
import Addnote from "./Addnote";
import NoteItem from "./NoteItem";

const Notes = () => {
  const context = useContext(NoteContext);
  const { notes, getNotes, editNote } = context;
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [currentView, setCurrentView] = useState("grid"); // grid or list

  useEffect(() => {
    const fetchNotes = async () => {
      await getNotes();
      setLoading(false);
    };
    fetchNotes();
  }, [getNotes]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = notes.filter(
        note =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(filtered);
          } else {
      setFilteredNotes(notes);
    }
  }, [searchTerm, notes]);

  const [note, setNote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etag: "",
  });

  const updateNote = (currentNote) => {
    const modal = new window.bootstrap.Modal(document.getElementById("exampleModal"));
    modal.show();
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });
  };

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await editNote(note.id, note.etitle, note.edescription, note.etag);
      const modal = window.bootstrap.Modal.getInstance(document.getElementById("exampleModal"));
      modal.hide();
      // You could add a success toast here if you have toast notifications
    } catch (error) {
      console.error("Error updating note:", error);
      // You could add an error toast here if you have toast notifications
      alert("Failed to update note. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-container">
      {/* Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etitle"
                    name="etitle"
                    value={note.etitle}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="edescription"
                    name="edescription"
                    value={note.edescription}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label">
                    Tag
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etag"
                    name="etag"
                    value={note.etag}
                    onChange={handleChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button onClick={handleClick} type="button" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

        <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm bg-glass h-100">
            <div className="card-body">
              <Addnote />
            </div>
          </div>
          </div>

        <div className="col-lg-8">
          <div className="card shadow-sm bg-glass mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between flex-wrap align-items-center mb-3">
                <h3 className="card-title mb-0">Your Notes</h3>
                <div className="d-flex">
                  <div className="input-group me-2" style={{ maxWidth: "250px" }}>
                    <span className="input-group-text bg-white border-end-0">
                      <i className="fas fa-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search notes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className={`btn ${currentView === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setCurrentView('grid')}
                    >
                      <i className="fas fa-th-large"></i>
                    </button>
                    <button
                      type="button"
                      className={`btn ${currentView === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setCurrentView('list')}
                    >
                      <i className="fas fa-list"></i>
                    </button>
                  </div>
                </div>
              </div>

              {filteredNotes.length === 0 && (
                <div className="text-center p-5">
                  <i className="far fa-sticky-note fs-1 text-muted mb-3"></i>
                  <h5>No notes found</h5>
                  {searchTerm ? (
                    <p className="text-muted">No notes match your search criteria.</p>
                  ) : (
                    <p className="text-muted">Add your first note to get started!</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {filteredNotes.length > 0 && (
            <div className={`row ${currentView === 'list' ? 'flex-column' : ''}`}>
              {filteredNotes.map((note) => (
                <div key={note._id} className={currentView === 'list' ? 'col-12 mb-3' : 'col-md-6 col-xl-6 mb-4'}>
                  <NoteItem
                    updateNote={updateNote}
                    note={note}
                    viewType={currentView}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;