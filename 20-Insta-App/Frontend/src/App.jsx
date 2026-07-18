import {Routes, Route} from 'react-router-dom'
import Home from '../pages/Home.jsx' ; 
import CreatePost from '../pages/CreatePost.jsx';
import Feed from '../pages/Feed.jsx';
import Navbar from './components/Navbar.jsx';

const App = () => {
  return (
    <div>
        <Navbar/>
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/create-post' element={<CreatePost/>} />
            <Route path='/feed' element={<Feed/>} />
        </Routes>
    </div>
  )
}

export default App ;