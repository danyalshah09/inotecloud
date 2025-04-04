import React, { useContext, useEffect, useState } from "react";
import noteContext from "../context/notes/noteContext";
import NoteItem from "./NoteItem";
import AddNote from "./AddNote";

const Notes = () => {
  // Correctly check for the auth token using the same key used in login
  const isLoggedIn = localStorage.getItem("auth-token") ? true : false;
  const [userName, setUserName] = useState("Guest");
  console.log("User name from localStorage:", localStorage.getItem("user-name"));
  console.log("DANYAL THE CODER");
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;

  useEffect(() => {
    if (isLoggedIn) {
      getNotes();
      
      // Fetch user details from API regardless of localStorage state
      const fetchUserDetails = async () => {
        try {
          const authToken = localStorage.getItem("auth-token");
          const response = await fetch("http://localhost:5000/api/auth/getuser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "auth-token": authToken
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            console.log("User data fetched:", userData);
            if (userData && userData.name) {
              localStorage.setItem("user-name", userData.name);
              setUserName(userData.name);
            }
          } else {
            console.log("Failed to fetch user details, using localStorage");
            // Try localStorage as fallback
            const storedName = localStorage.getItem("user-name");
            if (storedName) {
              setUserName(storedName);
            }
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          // On error, try localStorage as fallback
          const storedName = localStorage.getItem("user-name");
          if (storedName) {
            setUserName(storedName);
          }
        }
      };
      
      fetchUserDetails();
    }
  }, []);

  const [note, setNote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etag: "",
  });

  const updateNote = (currentNote) => {
    const modal = new window.bootstrap.Modal(document.getElementById("exampleModal"));
    modal.show(); // Show modal programmatically
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

  const handleClick = (e) => {
    e.preventDefault();
    editNote(note.id, note.etitle, note.edescription, note.etag); // Call editNote with updated details

    // Hide the modal after editing
    const modal = window.bootstrap.Modal.getInstance(document.getElementById("exampleModal"));
    modal.hide();
  };

  return (
    <div>
      {/* Modal */}
      <div
        className="modal fade "
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
                  <input
                    type="text"
                    className="form-control"
                    id="edescription"
                    name="edescription"
                    value={note.edescription}
                    onChange={handleChange}
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

      <div className="container d-flex flex-row m-4">
        <AddNote/>

        {/* Notes List */}
        <div className="container background-radial-gradient overflow-hidden">
          <h2 className="text-center text-white my-4">
            Welcome, <span className="fw-bold" style={{ color: "hsl(218, 81%, 75%)" }}>{userName}</span>!
          </h2>
          <div className="col my-3">
            <div className="container">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <NoteItem key={note._id} updateNote={updateNote} note={note} />
                ))
              ) : (
                <p className="text-center text-white">No notes yet. Add your first note!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;