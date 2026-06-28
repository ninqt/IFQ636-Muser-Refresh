const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Task = require('../models/Task');
const { updateTask,getTasks,addTask,deleteTask,searchTasks } = require('../controllers/taskController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;

afterEach(() => {
	sinon.restore();
});

describe('AddTask Function Test', () => {

  it('should create a new task successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: "New Album", artist_name:"New Artist", description: "Review Description", rating: 5 }
    };

    // Mock task that would be created
    const createdTask = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    // Stub Task.create to return the createdTask
    const createStub = sinon.stub(Task, 'create').resolves(createdTask);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addTask(req, res);

    // Assertions
    // [Terry] Updated assertion to account for ReviewBuilder fields added by Facade
    expect(createStub.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdTask)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Task.create to throw an error
    const createStub = sinon.stub(Task, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: "New Album", artist_name:"New Artist", description: "Review Description", rating: 5 }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addTask(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});


describe('Update Function Test', () => {

  it('should update task successfully', async () => {
    // Mock task data
    const taskId = new mongoose.Types.ObjectId();
    const existingTask = {
      _id: taskId,
      title: "Old Album",
      artist_name: "Old Artist",
      description: "Old Description",
      rating: 3,
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub Task.findById to return mock task
    const findByIdStub = sinon.stub(Task, 'findById').resolves(existingTask);

    // Mock request & response
    const req = {
      params: { id: taskId },
      body: { title: "New Album", artist_name:"New Artist", description: "Review Description", rating: 5 }
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updateTask(req, res);

    // Assertions
    expect(existingTask.title).to.equal("New Album");
    expect(existingTask.artist_name).to.equal("New Artist");
    expect(existingTask.description).to.equal("Review Description");
    expect(existingTask.rating).to.equal(5);
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });



  it('should return 404 if task is not found', async () => {
    const findByIdStub = sinon.stub(Task, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateTask(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Review not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Task, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateTask(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });



});



describe('GetTask Function Test', () => {

  it('should return tasks for the given user', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock task data
    const tasks = [
      { _id: new mongoose.Types.ObjectId(), title: "Task 1", userId },
      { _id: new mongoose.Types.ObjectId(), title: "Task 2", userId }
    ];

    // Stub Task.find to return mock tasks
    const findStub = sinon.stub(Task, 'find').resolves(tasks);

    // Mock request & response
    const req = { user: { id: userId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getTasks(req, res);

    // Assertions
    expect(findStub.calledOnceWith({ userId })).to.be.true;
    expect(res.json.calledWith(tasks)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub Task.find to throw an error
    const findStub = sinon.stub(Task, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getTasks(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});

describe('SearchTask Function Test', () => {

  it('should return reviews for all users matching search', async () => {

    // Mock review data
    const tasks = [
      { _id: new mongoose.Types.ObjectId(), title: "Review"},
      { _id: new mongoose.Types.ObjectId(), title: "Review"}
    ];

    // Stub Task.find to return mock reviews
    const findStub = sinon.stub(Task, 'find').returns({
      populate: sinon.stub().resolves(tasks)
    });
    // Mock request & response
    const req = { query : {title: "Review" }};
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await searchTasks(req, res);

    // Assertions
    expect(findStub.calledOnce).to.be.true;
    expect(findStub.firstCall.args[0]).to.deep.equal({ title: "Review" });
    expect(res.json.calledWith(tasks)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub Task.find to throw an error
    const findStub = sinon.stub(Task, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getTasks(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});

describe('DeleteTask Function Test', () => {

  it('should delete a task successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock task found in the database
    const task = { remove: sinon.stub().resolves() };

    // Stub Task.findById to return the mock task
    const findByIdStub = sinon.stub(Task, 'findById').resolves(task);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteTask(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(task.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Review deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if review is not found', async () => {
    // Stub Task.findById to return null
    const findByIdStub = sinon.stub(Task, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteTask(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Review not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Task.findById to throw an error
    const findByIdStub = sinon.stub(Task, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteTask(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});

// [Terry] Auth Function Tests
// Testing RegisterUser, LoginUser (Adapter Pattern) and Middleware Pattern

const User = require('../models/User');
const bcrypt = require('bcrypt');
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { checkTokenExists, checkTokenValid, checkUserExists } = require('../middleware/authMiddleware');

describe('RegisterUser Function Test', () => {

  it('should register a new user successfully', async () => {
    // Mock request data
    const req = {
      body: { name: 'Test User', email: 'test@test.com', password: '123456' }
    };

    // Mock user that would be created
    const createdUser = {
      id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      email: req.body.email
    };

    // Stub User.findOne to return null (user does not exist)
    const findOneStub = sinon.stub(User, 'findOne').resolves(null);

    // Stub User.create to return the createdUser
    const createStub = sinon.stub(User, 'create').resolves(createdUser);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await registerUser(req, res);

    // Assertions
    expect(findOneStub.calledOnce).to.be.true;
    expect(createStub.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;

    // Restore stubbed methods
    findOneStub.restore();
    createStub.restore();
  });

  it('should return 400 if user already exists', async () => {
    // Stub User.findOne to return an existing user
    const findOneStub = sinon.stub(User, 'findOne').resolves({ email: 'test@test.com' });

    // Mock request data
    const req = {
      body: { name: 'Test User', email: 'test@test.com', password: '123456' }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await registerUser(req, res);

    // Assertions
    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: 'User already exists' })).to.be.true;

    // Restore stubbed methods
    findOneStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub User.findOne to throw an error
    const findOneStub = sinon.stub(User, 'findOne').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      body: { name: 'Test User', email: 'test@test.com', password: '123456' }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await registerUser(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;

    // Restore stubbed methods
    findOneStub.restore();
  });

});


describe('LoginUser Function Test (Adapter Pattern)', () => {

  it('should login successfully and return adapted user with critic and admin fields', async () => {
    // Mock user data (simulating legacy user without critic field)
    const mockUser = {
      id: new mongoose.Types.ObjectId(),
      name: 'Test User',
      email: 'test@test.com',
      // No critic field - simulating legacy account
      // UserAdapter.adapt() should default critic to false
    };

    // Stub User.findOne to return mock user
    const findOneStub = sinon.stub(User, 'findOne').resolves(mockUser);

    // Stub bcrypt.compare to return true
    const bcryptStub = sinon.stub(bcrypt, 'compare').resolves(true);

    // Mock request data
    const req = {
      body: { email: 'test@test.com', password: '123456' }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await loginUser(req, res);

    // Assertions
    expect(findOneStub.calledOnce).to.be.true;
    expect(bcryptStub.calledOnce).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    // Verify Adapter Pattern - critic and admin fields always present
    const responseArgs = res.json.firstCall.args[0];
    expect(responseArgs).to.have.property('critic', false);
    expect(responseArgs).to.have.property('admin', false);

    // Restore stubbed methods
    findOneStub.restore();
    bcryptStub.restore();
  });

  it('should return 401 if password is incorrect', async () => {
    // Stub User.findOne to return mock user
    const findOneStub = sinon.stub(User, 'findOne').resolves({ email: 'test@test.com' });

    // Stub bcrypt.compare to return false (wrong password)
    const bcryptStub = sinon.stub(bcrypt, 'compare').resolves(false);

    // Mock request data
    const req = {
      body: { email: 'test@test.com', password: 'wrongpassword' }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await loginUser(req, res);

    // Assertions
    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: 'Invalid email or password' })).to.be.true;

    // Restore stubbed methods
    findOneStub.restore();
    bcryptStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub User.findOne to throw an error
    const findOneStub = sinon.stub(User, 'findOne').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      body: { email: 'test@test.com', password: '123456' }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await loginUser(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;

    // Restore stubbed methods
    findOneStub.restore();
  });

});


describe('Middleware Pattern Test (Chain of Responsibility)', () => {

  it('checkTokenExists should return 401 if no token provided', async () => {
    // Mock request with no authorization header
    const req = { headers: {} };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    const next = sinon.spy();

    // Call handler
    checkTokenExists(req, res, next);

    // Assertions
    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: 'Not authorized, no token' })).to.be.true;
    expect(next.called).to.be.false; // Chain should be broken
  });

  it('checkTokenExists should call next if token exists', async () => {
    // Mock request with valid authorization header
    const req = {
      headers: { authorization: 'Bearer testtoken123' }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    const next = sinon.spy();

    // Call handler
    checkTokenExists(req, res, next);

    // Assertions
    expect(req.token).to.equal('testtoken123'); // Token extracted and attached
    expect(next.calledOnce).to.be.true; // Chain continues
  });

  it('checkTokenValid should return 401 if token is invalid', async () => {
    // Mock request with invalid token
    const req = { token: 'invalidtoken' };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    const next = sinon.spy();

    // Call handler
    checkTokenValid(req, res, next);

    // Assertions
    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: 'Not authorized, token failed' })).to.be.true;
    expect(next.called).to.be.false; // Chain should be broken
  });

  it('checkUserExists should return 401 if user not found', async () => {
    // Stub User.findById to return null
    const findByIdStub = sinon.stub(User, 'findById').returns({
      select: sinon.stub().resolves(null)
    });

    // Mock request with decoded token
    const req = { decoded: { id: new mongoose.Types.ObjectId() } };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    const next = sinon.spy();

    // Call handler
    await checkUserExists(req, res, next);

    // Assertions
    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: 'Not authorized, user not found' })).to.be.true;
    expect(next.called).to.be.false; // Chain should be broken

    // Restore stubbed methods
    findByIdStub.restore();
  });

});