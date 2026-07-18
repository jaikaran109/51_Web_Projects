import NavBar from "./Navbar";
import Content from "./content";

const Home = (props)=> {
    console.log(props.img) ;
    return (
        <div className="h-screen w-full">
            <NavBar/>
            <Content img = {props.img}/>
        </div>
    )
}

export default Home ;