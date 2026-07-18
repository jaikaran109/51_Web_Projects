import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NewForm = () => {
    const navigate = useNavigate() ; 

    const createNotes = async() => {
        const response = await fetch('http://localhost:5050/create-notes', {
            method : 'POST' ,
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(formData) 
        })

        const data = await response.json() ; 
        console.log(data) ; 
        setFormData({
            title : '' ,
            desc : ''
        })
    }

    const [formData, setFormData] = useState({
        title : '' , 
        desc : ''
    }) ;  

    const submitHandler = async(e) => {
        e.preventDefault() ;
        await createNotes() ; 
        navigate('/') ;
    }

    const inputChange = (e) => {
        setFormData({
            ...formData , 
            [e.target.name] : e.target.value
        })
    }
    return (
    <div>
        <form onSubmit={submitHandler}>
            <input type="text" name='title' onChange={inputChange} value={formData.title}/>
            <input type="text" name='desc' onChange={inputChange} value={formData.desc}/>
            <button >Submit</button>
        </form>
    </div>
    )
}

export default NewForm