import React, {useContext, useState} from 'react'
import noteContext from "../context/notes/noteContext"

const AddNote = () => {
    const context = useContext(noteContext);
    const {addNote} = context;

    const [note, setNote] = useState({title: "", description: "", tag: ""})

    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag || "default");
        setNote({ title: "", description: "", tag: "" });
    };
    
    const onChange = (e)=>{
        setNote({...note, [e.target.name]: e.target.value})
    }
    
    return (
        <div className="container text-white h-[100%] background-radial-gradient overflow-hidden p-4 rounded shadow-lg" style={{ maxWidth: "400px" }}>
            <h2 className="mb-4">Add a Note</h2>
            <form className="my-3">
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input 
                        required 
                        type="text" 
                        className="form-control" 
                        id="title" 
                        value={note.title} 
                        name="title" 
                        placeholder="Enter title"
                        onChange={onChange} 
                    /> 
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea 
                        required 
                        className="form-control" 
                        value={note.description} 
                        id="description" 
                        name="description" 
                        rows="3"
                        placeholder="Enter description" 
                        onChange={onChange} 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={note.tag} 
                        id="tag" 
                        name="tag" 
                        placeholder="Optional tag"
                        onChange={onChange} 
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary w-100" 
                    onClick={handleClick}
                    disabled={!note.title || !note.description}
                >
                    Add Note
                </button>
            </form>
        </div>
    )
}

export default AddNote
