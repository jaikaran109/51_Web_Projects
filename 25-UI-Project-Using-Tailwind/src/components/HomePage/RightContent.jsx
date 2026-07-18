import React from 'react'
import RightCard from './RightCard'

const RightContent = (props) => {
  return (
     <div className="h-4/5 w-4/5 p-7 flex flex-nowrap gap-13 ">
      {props.img.map((elem) =>{
        return <RightCard img ={elem.img}/>
      })}
    </div>
  )
}

export default RightContent