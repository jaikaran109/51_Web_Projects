import { useEffect, useState } from "react";

const STORAGE_KEY = "notes-app:notes";

// Notes saved by a previous visit. A bad or missing value just means no notes.
const loadNotes = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const App = () => {
  // form handler
  const formHandler = (e) => {
    console.log(`Form Submitted Successfully...`);
    e.preventDefault();
    console.log(`Task : ${task}\nDetails : ${details}`);

    if (!task.trim() && !details.trim()) return;

    setNotes([...notes, { id: crypto.randomUUID(), task, details }]);
    setTask("");
    setDetails("");
  };

  // 2-way binding
  const [task, setTask] = useState("");
  const [details, setDetails] = useState("");
  const [notes, setNotes] = useState(loadNotes);
  const [search, setSearch] = useState("");

  // Keep notes between visits.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // Storage can be full or blocked; the notes still work for this visit.
    }
  }, [notes]);

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const query = search.trim().toLowerCase();
  const visibleNotes = notes.filter(
    (note) =>
      note.task.toLowerCase().includes(query) ||
      note.details.toLowerCase().includes(query),
  );

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
          onChange={(e) => setTask(e.target.value)}
          className="p-4 border-2 h-20 w-100 text-2xl"
          placeholder="Enter Task"
          value={task}
        />
        <textarea
          type="text"
          className="p-5 border-2 w-200 h-30 "
          placeholder="Enter Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <button type="submit" className="h-15 w-40 text-xl text-white bg-green-500 font-bold transition delay-100 duration-200 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 cursor-pointer active:scale-95">
          Add Notes
        </button>
      </form>

      <h1 className="text-3xl font-bold text-center my-10">Your Notes</h1>
      <div className="flex justify-center mb-10">
        <input
          type="search"
          aria-label="Search notes"
          className="p-3 border-2 w-100 text-xl"
          placeholder="Search notes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {notes.length > 0 && visibleNotes.length === 0 && (
        <p className="text-center text-xl">No notes match your search.</p>
      )}
      <div className="display flex gap-30 flex-wrap justify-center">
        {visibleNotes.map((elem) => {
          return (
            <div key={elem.id} className="card h-70 bg-cover bg-[url('https://static.vecteezy.com/system/resources/previews/013/521/799/original/dusty-pink-sticky-note-free-png.png')] text-wrap text-xl w-100 rounded-2xl">
              <button
                onClick={() => {
                  deleteNote(elem.id);
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
