import {Routes, Route, Link} from 'react-router-dom'
import Home from './pages/Home'
import GetNotes from './pages/GetNotes'
import NewForm from './pages/NewForm'
import ShowbyID from './pages/ShowbyID' ;
import DeletebyID from './pages/DeletebyID';

const App = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/notes' element={<GetNotes/>} />
                <Route path='/new' element={<NewForm/>} />
                <Route path='/notes/:id' element={<ShowbyID/>} />
                <Route path='/delete-notes/:id' element={<DeletebyID/>} />
            </Routes>
        </>
    )
}

export default App ; 