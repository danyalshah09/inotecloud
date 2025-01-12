import React from 'react';

export const NoteItem = (props) => {
    const { note } = props;
    return (
        <div className="card d-inline-block flex-row m-3">
            <div className=" p-3">
                {/* Title and Description */}
                <div className="card-body flex-grow-1">
                    <h5 className="card-title mb-1">{note.title}</h5>
                    <p className="card-text mb-0">{note.description}</p>
                    <i class="fas fa-pencil-alt mx-3" > Edit</i> 
                    <i class="fas fa-trash mx-3"> Delete</i> 
                </div>

               
            </div>
        </div>
    );
};
