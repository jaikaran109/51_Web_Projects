import LeftContent from "./LeftContent";
import RightContent from "./RightContent";

const Content = (props)=> {
    return (
        <div className="py-3 px-16 h-full flex justify-between align-middle">
            <LeftContent/>
            <RightContent img = {props.img}/>
        </div>
    )
}
export default Content ;