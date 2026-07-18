import { useEffect, useState } from "react";
import Card from "./components/Card";
import Pagination from "./components/Pagination";

const App = () => {
  const [pics, setPics] = useState([]);
  const [page, setPage] = useState(1);

  const getData = async () => {
    const response = await fetch(
      `https://picsum.photos/v2/list?page=${page}&limit=30`,
    );
    let data = await response.json();
    // console.log(data) ;
    setPics(data);
  };

  useEffect(() => {
    getData();
  }, [pics,page]);

  return (
    <div className="bg-black overflow-auto h-screen p-4 text-white">
      {/* <button onClick={()=>{
        getData() ; 
      }} className="bg-green-600 active:scale-95 px-5 py-2 rounded-2xl text-white">
        Get Data
      </button> */}

      <Card pics={pics}/>
      <Pagination page={page} setPage={setPage} setPics={setPics}/>
    </div>
  );
};

export default App;
