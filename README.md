**Muser Overview: Muser is an application designed to allow users to review music albums and view other user's reviews using the Muser website interface. Muser allows users to create and manage their own accounts and uses authentication functions to allow them to log in. Users can manage their own reviews using update and delete operation buttons, allowing them to curate their collection of album reviews easily.**

**This application contains the following features:**

* Signup
* Login
* Logout
* Update profile
* Add reviews
* View reviews
* Update reviews
* Delete reviews
* Search reviews

**The application also contains features for admin accounts, which can be enabled by setting the "Admin" flag on a user's account data to true using MongoDB, admins have access to an Admin portal which currently allows:**

* Deletion of any user's reviews

**Project Setup Instructions**

sudo apt install git nodejs npm –y #Development Tools

git clone https://github.com/ninqt/muser #Initial cloning of Muser

cd muser

npm run install-all #Install all project dependancies

Create .env file that includes:

MONGO_URI From MongoDB

JWT_SECRET

PORT=5001

Start the project using:

npm start

**Muser Current Public URL**
http://3.106.133.24/

**Example admin account**

User: qut@muser.com

Password: admin