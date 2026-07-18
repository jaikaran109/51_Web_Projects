import React from 'react'
import { Link } from "react-router-dom";

const Home = () => {
  return (
      <div>
          <h1>Home Page</h1>
          <button>
              <Link to="/notes">Get all notes</Link>
          </button>
      </div>
  );
}

export default Home