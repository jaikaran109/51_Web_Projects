import React from 'react'
import {Link, Links} from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='flex justify-between text-2xl bg-gray-100 font-bold p-5'>
        Instagram
        <div className='flex gap-10'>
            <Link to='/'>Home</Link>
            <Link to='/create-post'>Create</Link>
            <Link to='/feed'>Feed </Link>
        </div>
    </div>
  )
}

export default Navbar