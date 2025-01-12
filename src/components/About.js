import React from 'react'
import { useContext } from 'react'
import { NoteContext } from "../context/notes/NoteState";
import { useEffect } from 'react';
 const About = () => {
    const a = useContext(NoteContext);
    useEffect(() => {
        a.update()
    },  [])
    return (
    <div>this is about {a.first.name} and he is {a.first.age} years old</div>
  )
}
export default About
