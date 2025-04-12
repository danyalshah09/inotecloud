import React, {useContext, useState} from 'react'
import NoteContext from "../context/notes/NoteContext"

const Addnote = () => {
    const context = useContext(NoteContext);
    const {addNote} = context;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [note, setNote] = useState({title: "", description: "", tag: ""})

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await addNote(note.title, note.description, note.tag || "general");
            setNote({ title: "", description: "", tag: "" });
        } catch (error) {
            console.error("Error adding note:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const onChange = (e)=>{
        setNote({...note, [e.target.name]: e.target.value})
    }
    
    return (
        <>
            <h3 className="mb-4">Add a New Note</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input 
                        required 
                        type="text" 
                        className="form-control" 
                        id="title" 
                        value={note.title} 
                        name="title" 
                        placeholder="Enter a title for your note"
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
                        rows="4"
                        placeholder="Write your note here..." 
                        onChange={onChange} 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <select
                        className="form-select"
                        id="tag"
                        name="tag"
                        value={note.tag}
                        onChange={onChange}
                    >
                        <option value="general">General</option>
                        <option value="work">Work</option>
                        <option value="personal">Personal</option>
                        <option value="todo">To Do</option>
                        <option value="important">Important</option>
                        <option value="idea">Idea</option>
                    </select>
                </div>
                <div className="d-grid">
                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={!note.title || !note.description || isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-plus-circle me-2"></i>
                                Add Note
                            </>
                        )}
                    </button>
                </div>
            </form>
        </>
    )
}

export default Addnote
