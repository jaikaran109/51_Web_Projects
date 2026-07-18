import { useState } from "react";

const App = () => {
  // form handler
  const formHandler = (e) => {
    console.log(`Form Submitted Successfully...`);
    e.preventDefault();
    console.log(`Task : ${task}\nDetails : ${details}`);

    let copyNotes = [...notes];
    copyNotes.push({ task, details });
    setNotes(copyNotes);
    console.log(copyNotes);
    setTask("");
    setDetails("");
  };

  // 2-way binding
  const [task, setTask] = useState("");
  const [details, setDetails] = useState("");
  const [notes, setNotes] = useState([]);

  const deleteNote = (idx) => {
    let copyNotes = [...notes];
    copyNotes.splice(idx, 1);
    setNotes(copyNotes);
    console.log("Note Deleted");
    console.log(copyNotes);
  };

  return (
    <div>
      <h1 className="font-bold text-4xl text-center py-10 ">Notes-App</h1>
      <form
        onSubmit={(e) => {
          formHandler(e);
        }}
        className="flex gap-10 flex-col p-5 items-center flex-wrap"
      >
        <input
          type="text"
          onChange={(e) => {
            console.log(`Pressed : ${e.target.value}`);
            setTask(e.target.value);
          }}
          className="p-4 border-2 h-20 w-100 text-2xl"
          placeholder="Enter Task"
          value={task}
        />
        <textarea
          type="text"
          className="p-5 border-2 w-200 h-30 "
          placeholder="Enter Details"
          value={details}
          onChange={(e) => {
            console.log(`Pressed : ${e.target.value}`);
            setDetails(e.target.value);
          }}
        />
        <button className="h-15 w-40 text-xl text-white bg-green-500 font-bold transition delay-100 duration-200 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 cursor-pointer active:scale-95">
          Add Notes
        </button>
      </form>

      <h1 className="text-3xl font-bold text-center my-10">Your Notes</h1>
      <div className="display flex gap-30 flex-wrap justify-center">
        {notes.map((elem, idx) => {
          return (
            <div className="card h-70 bg-cover bg-[url('https://static.vecteezy.com/system/resources/previews/013/521/799/original/dusty-pink-sticky-note-free-png.png')] text-wrap text-xl w-100 rounded-2xl">
              <button
                onClick={(idx) => {
                  deleteNote();
                }}
                className="ml-85 mt-12  hover:bg-red-500 px-2 cursor-pointer active:scale-95"
              >
                X
              </button>
              <h1 className="mt-3 ml-10 mr-10 text-center text-3xl font-bold text-wrap">
                {elem.task}
              </h1>
              <p className="mt-5 ml-8 mr-8 text-center text-xl">
                {elem.details}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default App;
