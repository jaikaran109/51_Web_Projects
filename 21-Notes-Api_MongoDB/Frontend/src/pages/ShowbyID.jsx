import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const ShowbyID = () => {
    const [note, setNote] = useState({
        title : '' , 
        desc : '' 
    })
    
    const params = useParams() ; 
    let id = params.id ;
    
    useEffect(()=> {
        getSpecific(id) ; 
    }, [id])

    const getSpecific = async (id) => {
        const response = await fetch(`http://localhost:5050/notes/${id}`) ;
        const data = await response.json() ;
        setNote({
            title : data.data.title ,
            desc : data.data.desc
        }) 
    }

    return (
    <div>
        {note.title} 
    </div>
    )
}

export default ShowbyID