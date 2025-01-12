import React, { createContext, useState } from "react";

// Create a Context
const NoteContext = createContext();


const NoteState = (props) => {

const notesinitial = [
    {
      "_id": "6783d313828663d54a86f6b5",
      "user": "67830b716631b90fcf3bb786",
      "title": "football",
      "description": "ronaldo the goat",
      "tag": "serioiusness's issue22",
      "__v": 0
    },
    {
      "_id": "6783f7f28d1a452f129eb93a",
      "user": "67830b716631b90fcf3bb786",
      "title": "Routine ",
      "description": "wake up at 4 am",
      "tag": "dani for you",
      "__v": 0
    },
    {
        "_id": "6783f7f28d1a452f129eb93a",
        "user": "67830b716631b90fcf3bb786",
        "title": "Routine ",
        "description": "wake up at 4 am",
        "tag": "dani for you",
        "__v": 0
      },
      {
        "_id": "6783f7f28d1a452f129eb93a",
        "user": "67830b716631b90fcf3bb786",
        "title": "Routine ",
        "description": "wake up at 4 am",
        "tag": "dani for you",
        "__v": 0
      }
  ]

  const [notes, setnotes] = useState(notesinitial)
//add note
const addnote = (title,description,tag) => {
const notes = {
    "_id": "6783f7f28d1a452f129eb93a",
    "user": "67830b716631b90fcf3bb786",
    "title": "Routine ",
    "description": "wake up at 4 am Addeds",
    "tag": "dani for you",
    "__v": 0
  }
    setnotes(notes.push(note))
}

//delte note
const deletenote = () => {


}

//edit note
const editnote = () => {


}

  
  return (
    // Use the NoteContext.Provider to pass the state
    <NoteContext.Provider value={{notes,setnotes}}>
      {props.children}
    </NoteContext.Provider>
  );
};

export { NoteContext }; // Export the context to use in other components
export default NoteState;
