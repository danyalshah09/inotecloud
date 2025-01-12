import React, { createContext } from "react";
import { useState  } from "react";
// Create a Context
const NoteContext = createContext();


const NoteState = (props) => {
  const s1 = {
    name: "danyal",
    age: 20,
  };



  const [first, setfirst] = useState(s1)
  const update = ()=>{
setTimeout(() => {
    setfirst({
        name: "zakir",
        age: 19,
      })
}, 1000);



   
  }
  return (
    // Use the NoteContext.Provider to pass the state
    <NoteContext.Provider value={{first, update}}>
      {props.children}
    </NoteContext.Provider>
  );
};

export { NoteContext }; // Export the context to use in other components
export default NoteState;
