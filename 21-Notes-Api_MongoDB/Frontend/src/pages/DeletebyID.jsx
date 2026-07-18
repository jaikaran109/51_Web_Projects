import React, { useEffect } from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'

const DeletebyID = () => {
    const params = useParams() ; 
    const navigate = useNavigate() ; 
    let id = params.id ; 

    const deleteNote = async (id)=>{
        const response = await  fetch(`http://localhost:5050/notes/${id}`, {
            method : "DELETE"
        })
        const data = await response.json() ; 
        console.log(data) ; 
        navigate('/notes') ;
    }

    return (
    <div>
        Are you sure want to delete 
        <button onClick={() => {
            deleteNote(id)
        }}>
            YES 
        </button>
        <button>
            <Link to='/notes'>NO</Link>
        </button>
    </div>
    )
}

export default DeletebyID