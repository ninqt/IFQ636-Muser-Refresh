import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const SearchList = ({ tasks }) => {
  const { user } = useAuth();
  const handleDelete = async (taskId) => {
    try {
      await axiosInstance.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
    } catch (error) {
      alert('Failed to delete review.');
    }
    window.location.reload();
  };

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
          <button
            onClick={() => handleDelete(task._id)}
            className="bg-white text-[#9B0F0F] font-bold px-4 py-1 rounded hover:underline"
          >
            Delete
          </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchList;