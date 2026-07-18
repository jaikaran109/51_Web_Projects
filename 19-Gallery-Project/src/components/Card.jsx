const Card = (props) => {
  return (
    <div className="flex flex-wrap gap-12 ">
    {props.pics.map((elem, idx) => {
        return (
          <div className="rounded hover:scale-110 transition-all" key={idx}>
            <a href={elem.url} target="_blank">
              <img
                src={elem.download_url}
                className="h-50 rounded-2xl outline-2"
                alt=""
              />
            </a>
            <h2 className="text-center text-2xl">{elem.author}</h2>
          </div>
        );
    })}
    </div>
  );
}

export default Card