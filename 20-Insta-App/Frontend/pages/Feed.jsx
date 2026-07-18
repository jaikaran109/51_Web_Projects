import React, { useEffect, useState } from "react";

const Feed = () => {
  const [post, setPost] = useState([]) ;

  useEffect(()=> {
    const getData = async ()=> {
        let response = await fetch('http://localhost:5050/posts') ; 
        let data = await response.json() ; 
        setPost(data) ;
    }

    getData() ;
  }, [])
  return (
    <div className="flex flex-wrap justify-center h-full mt-5 gap-6">
      {post.map((elem) => {
        return (
          <div className="text-center object-cover w-80 border flex justify-center bg-gray-100 rounded-3xl">
            <div >
              <img src={elem.img} alt=""  className="mt-2 rounded-2xl"/>
              <h3 className="p-6 text-xl">{elem.caption}</h3> 
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Feed;
