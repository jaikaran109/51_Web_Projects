import RightCardContent from "./RightCardContent";

const RightCard = (props) => {
  return (
    <div className="h-full   relative rounded-4xl overflow-hidden">
        <img src={props.img} alt="" className="h-full w-full object-cover" />
    <RightCardContent/>
    </div>
  )
}

export default RightCard ; 