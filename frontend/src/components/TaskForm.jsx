import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TaskForm = ({ tasks, setTasks, editingTask, setEditingTask }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', artist_name: '', description: '', rating: '' });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        artist_name: editingTask.artist_name,
        description: editingTask.description,
        rating: editingTask.rating,
      });
    } else {
      setFormData({ title: '', artist_name: '', description: '', rating: '' });
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        const response = await axiosInstance.put(`/api/tasks/${editingTask._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(tasks.map((task) => (task._id === response.data._id ? response.data : task)));
      } else {
        const response = await axiosInstance.post('/api/tasks', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks([...tasks, response.data]);
      }
      setEditingTask(null);
      setFormData({ title: '', artist_name: '', description: '', rating: '' });
    } catch (error) {
      alert('Failed to save review.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingTask ? 'Edit Review' : 'Add Review'}</h1>
      <input
        type="text"
        placeholder="Album Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Artist Name"
        value={formData.artist_name}
        onChange={(e) => setFormData({ ...formData, artist_name: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <textarea
        type="text"
        placeholder="Review Text"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        rows = {3}
      />
      <input
        type="Number"
        placeholder="Rating (1-10)"
        value={formData.rating}
        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-[#9B0F0F] text-white p-2 rounded hover:underline">
        {editingTask ? 'Update Review' : 'Add Review'}
      </button>
    </form>
  );
};

export default TaskForm;
