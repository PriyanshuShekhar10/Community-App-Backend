# Community App Backend

This is a Node.js application using Express.js and MongoDB, that provides a simple lab management system. Users can add devices to the lab and mark them as present or absent using a checklist. Users can also register for the system, login, and logout.

### Dependencies

- bcrypt
- body-parser
- dotenv
- express
- express-flash
- express-session
- method-override
- mongoose
- passport
- passport-local

## Getting Started

Clone this repository

1. Install dependencies using

```bash
 npm install
```

2. Create a .env file in the root directory of the project with the following variables:

```
MONGO_URI : The URI to your MongoDB database
SESSION_SECRET : A secret string used to sign the session ID cookie
```

3. Start the server using

```bash
 npm start
```

4. Navigate to http://localhost:3000 to view the application.

### Available Routes

        POST /admin/add-device : Add a new device to the lab.
        GET /devices : Get a list of all devices in the lab.
        POST /checklist : Mark devices as present in the lab.
        POST /checklist-exit : Mark devices as absent from the lab.
        POST /login : Authenticate a user and create a session.
        DELETE /logout : Destroy the current user's session.
        POST /register : Create a new user account.

#### Notes

This application is not intended for production use and does not provide any security guarantees.
The front-end of this application is not included in this repository
