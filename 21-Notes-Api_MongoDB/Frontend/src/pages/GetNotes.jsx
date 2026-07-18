import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const GetNotes = () => {
    const [notes, setNotes] = useState([]) ; 

    useEffect(()=> {
        getallNotes() ; 
    }, [])

    const getallNotes = async () => {
        const response = await fetch("http://localhost:5050/notes");
        const data = await response.json() ; 
        setNotes(data.data) ; 
        // console.log(notes) ; 
    }

    return (
        <div>
            <button>
                <Link to='/new'>
                    Create a new Note
                </Link>
            </button>
            {notes.map((elem, idx) => {
                // console.log(elem); 
                return (
                    <div key={elem._id}>
                        <button>
                            <Link to={`/notes/${elem._id}`}>View</Link>
                        </button>
                        {idx}: {elem.title}
                        {elem.desc}
                        <button>
                            <Link to={`/delete-notes/${elem._id}`}>Delete</Link>
                        </button>
                    </div>
                ); 
            })}
        </div>
    )
}

export default GetNotes