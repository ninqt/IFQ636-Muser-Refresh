//Read
const Task = require('../models/Task');  
const getTasks = async (req, res) => {
try {  
const tasks = await Task.find({ userId: req.user.id });  
res.json(tasks);  
} catch (error) {  
res.status(500).json({ message: error.message });
}
}; 

//Read-Search
const searchTasks = async (req, res) => {
try {  
const tasks = await Task.find({ title: req.query.title }).populate('userId','name');  
res.json(tasks);  
} catch (error) {  
res.status(500).json({ message: error.message });
}
}; 

//Add
const addTask = async (req, res) => { 
const { title, artist_name, description, rating } = req.body; 
try { 
const task = await Task.create({ userId: req.user.id, title, artist_name, description, rating }); 
res.status(201).json(task); 
} catch (error) { 
res.status(500).json({ message: error.message }); 
} 
}; 

//Update
const updateTask = async (req, res) => { 
const { title, artist_name, description, rating } = req.body; 
try { 
const task = await Task.findById(req.params.id); 
if (!task) return res.status(404).json({ message: 'Review not found' }); 
 
task.title = title || task.title; 
task.artist_name = artist_name || task.artist_name;
task.description = description || task.description; 
task.rating = rating || task.rating;
 
const updatedTask = await task.save(); 
res.json(updatedTask); 
} catch (error) { 
res.status(500).json({ message: error.message }); 
} 
}; 

//Delete

const deleteTask = async (req, res) => { 
try { 
const task = await Task.findById(req.params.id); 
if (!task) return res.status(404).json({ message: 'Review not found' }); 
await task.remove(); 
res.json({ message: 'Review deleted' }); 
} catch (error) { 
res.status(500).json({ message: error.message }); 
}
}; 
module.exports = { getTasks, addTask, updateTask, deleteTask, searchTasks };