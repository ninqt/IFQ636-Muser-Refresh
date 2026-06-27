const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserAdapter = require('../adapters/UserAdapter');


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};


// [Sean] Register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password });
        res.status(201).json({ id: user.id, name: user.name, email: user.email, token: generateToken(user.id) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// [Sean] Login user
// [Terry] Adapter Pattern applied
// Based on IFQ636 Module 4 - Design Patterns

// UserAdapter.adapt() normalises the user object returned
// from the database, ensuring fields introduced in
// Muser Refresh (e.g. critic, admin) are always present
// even if the account was created before the schema update.
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            // [Terry] Adapt user object to handle missing fields from legacy accounts
            const adaptedUser = UserAdapter.adapt(user);
            res.json({
                id: user.id,
                name: adaptedUser.name,
                email: adaptedUser.email,
                admin: adaptedUser.admin,   // defaults to false if missing
                critic: adaptedUser.critic, // defaults to false if missing
                token: generateToken(user.id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// [Sean] Get user profile
// UserAdapter already applied by Sean
const getProfile = async (req, res) => {
    try {
        const dbUser = await User.findById(req.user.id);
        if (!dbUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        // [Sean] Adapt user object before returning to client
        const user = UserAdapter.adapt(dbUser);
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// [Sean] Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email, university, address } = req.body;
        user.name = name || user.name;
        user.email = email || user.email;
        user.university = university || user.university;
        user.address = address || user.address;

        const updatedUser = await user.save();
        res.json({ id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, university: updatedUser.university, address: updatedUser.address, token: generateToken(updatedUser.id) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile, getProfile };