
const SearchList = ({ tasks }) => {



  return (
    <div>
      {tasks.map((task) => (
        <div key={task._id} className="bg-[#9B0F0F] p-4 mb-4 rounded shadow">
          <div className= "flex justify-between items-center">
            <h2 className="font-bold text-white text-2xl">{task.title}</h2>
            <span className="font-bold text-white text-2xl">{task.rating}/10</span>
          </div>
          <h1 className="text-white text-1xl font-bold">{task.artist_name}</h1>
          <p className="text-white">{task.description}</p>
          <p className="text-white translate-y-2">{task.userId.name}</p>
          <div className="mt-2">
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchList;