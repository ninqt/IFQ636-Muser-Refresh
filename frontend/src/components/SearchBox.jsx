import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const SearchForm = ({ setResults }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState({ title: ''});

    const handleSearch = async (e) => {
        e.preventDefault();
        const res = await axiosInstance.get(`/api/tasks/search?title=${title.title}`,{
          headers: { Authorization: `Bearer ${user.token}` }
        });
    setResults(res.data);
    }


  return (
    <form onSubmit={handleSearch} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">Search Reviews</h1>
      <input
        type="text"
        placeholder="Album Title"
        value={title.title}
        onChange={(e) => setTitle({ ...title, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-[#9B0F0F] text-white p-2 rounded hover:underline">
        Search
      </button>
    </form>
  );
};

export default SearchForm;
