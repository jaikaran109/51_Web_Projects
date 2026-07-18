import Card from './components/Card.jsx' ;

const App = ()=>  {
  const jobs = [
    {
      company: "Amazon",
      img: "https://i.pinimg.com/originals/01/ca/da/01cada77a0a7d326d85b7969fe26a728.jpg",
      posted: "5 days ago",
      role: "Software Developer",
      type: "Part-Time",
      experience: "Fresher",
      salary: "$120/hr",
      location: "Mumbai, India"
    },
    {
      company: "Google",
      img: "https://th.bing.com/th/id/OIP.fdZ1QXChVTeaa5YbnGoaZgHaHa?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
      posted: "2 days ago",
      role: "Frontend Developer",
      type: "Full-Time",
      experience: "Fresher",
      salary: "$140/hr",
      location: "Bangalore, India"
    },
    {
      company: "Microsoft",
      img: "https://static.vecteezy.com/system/resources/previews/028/339/963/non_2x/microsoft-icon-logo-symbol-free-png.png",
      posted: "1 week ago",
      role: "Backend Developer",
      type: "Internship",
      experience: "Fresher",
      salary: "$100/hr",
      location: "Hyderabad, India"
    },
    {
      company: "Meta",
      img: "https://pngimg.com/uploads/meta/meta_PNG12.png",
      posted: "3 days ago",
      role: "React Developer",
      type: "Full-Time",
      experience: "1-2 Years",
      salary: "$150/hr",
      location: "Pune, India"
    },
    {
      company: "Netflix",
      img: "https://vignette2.wikia.nocookie.net/logopedia/images/b/b2/NetflixIcon2016.jpg/revision/latest/scale-to-width-down/2000?cb=20160620223003",
      posted: "4 days ago",
      role: "Full Stack Developer",
      type: "Part-Time",
      experience: "Fresher",
      salary: "$130/hr",
      location: "Chennai, India"
    },
    {
      company: "Flipkart",
      img: "https://th.bing.com/th/id/OIP.OQrbMsmN86RrB-hXq7AfSQHaHY?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
      posted: "Today",
      role: "MERN Stack Developer",
      type: "Full-Time",
      experience: "Fresher",
      salary: "$110/hr",
      location: "Gurgaon, India"
    }
];
  return (
    <div className="parent">
      {jobs.map((elem) => {
        return <Card 
          company={elem.company}
          img={elem.img}
          posted={elem.posted}
          type={elem.type}
          role={elem.role}
          experience={elem.experience}
          salary={elem.salary}
          location={elem.location}/>
      })}
    </div>
  )
}

export default App ;