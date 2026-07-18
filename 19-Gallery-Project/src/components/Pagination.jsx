
const Pagination = (props) => {
  return (
    <div className="flex justify-center gap-5 mt-10">
      <button
        className="bg-gray-300 text-xl px-4 py-2 text-black rounded active:scale-95 font-semibold cursor-pointer hover:scale-125 transition-all"
        onClick={() => {
          if (props.page > 1) {
            props.setPage(props.page - 1);
            props.setPics([]);
          }
        }}
      >
        Prev
      </button>
      <div className="bg-gray-300 text-xl px-4 py-2 text-black rounded-full active:scale-95 font-semibold">
        {props.page}
      </div>
      <button
        className="bg-gray-300 text-xl px-4 py-2 text-black rounded active:scale-95 font-semibold cursor-pointer hover:scale-125 transition-all"
        onClick={() => {
          props.setPage(props.page + 1);
          props.setPics([]);
        }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
