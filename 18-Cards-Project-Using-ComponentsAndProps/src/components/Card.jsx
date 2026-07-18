const Card = (props) => {
    return (
        <div className="card">
            <div className="top">
                <img src={props.img} alt="" />
                <button>Save</button>
            </div>
            <div className="center">
                <span>{props.company}</span>
                <p>{props.posted}</p>
                <h2>{props.role}</h2>
                <div className="tags">
                    <button>{props.experience}</button>
                    <button>{props.type}</button>
                </div>
            </div>
            <div className="line">
                _____________________________
            </div>
            <div className="bottom">
                <div className="price">
                    <span>{props.salary}</span>
                    <p>{props.location}</p>
                </div>
                <button>Apply Now</button>
            </div>
        </div>
    )
}


export default Card ;