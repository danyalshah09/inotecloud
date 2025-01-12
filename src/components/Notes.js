import {React,useContext} from 'react'
import { NoteItem } from './NoteItem';
import { Addnote } from "./Addnote";

export const Notes = (props) => {
       
  return (
    
    <div> 
              <Addnote/>
              <h1>Your Notes</h1>
        {notes.map((note) => (
         <NoteItem note={note}/>
    ))}
    </div>
  )
}
