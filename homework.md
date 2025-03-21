# EPISODE 03

- Create a repository
- Initialize the repository
- node_modules, package.json, package-lock.json
- Install express
- Create a server
- Listen to port 7777
- Write request handlers for /test, /hello
- Install nodemon and update scripts inside package.json
- What are dependencies
- What is the use of "-g" while npm install
- Difference between caret and tilde (^ vs ~)

# EPISODE 04

- Initialize git
- .gitignore
- Create a remote repo on github
- Push all code to remote origin
- Play with routes and route extensions ex. /hello, /, /hello/2, /xyz
- Order of the routes matter a lot
- Install Postman app and make a workspace/collection > test API call
- Write logic to handle GET, POST, PUT, PATCH, DELETE API calls and test them on Postman
- Explore rounting and use of ?, +, (), \* in the routes
- Use if regex in routes /a/, /.\*fly$/
- Reading the query params in the routes
- Reading the dynamic routes

# EPISODE 05

- Multiple Route Handlers - Play with the code
- next()
- next function and errors aloong with res.send()
- app.use("/route",rH1, [rH2, rH3],rH4, rH5);
- What is a Middleware? Why do we need it?
- How express JS basically handles requests behind the scenes
- Difference app.use and app.all
- Write a dummy auth middleware for admin
- Write a dummy auth middleware for all user routes, expcept /user/login
- Error handling using app.use("/", (err,req,res,next) => {});

# EPISODE 06

- Create a free cluster on MongoDB official website (Mongo Atlas)
- Install mongoose library
- Connect your application to the Database "Connection-url/devTinder"
- Call the connectDB function and connect to database before starting application on 7777
- Create a userSchema & user Model
- Create /signup API to add data to database
- Push some documents using APL calls in postman
- Error handling using try catch

# EPISODE 07

- Difference between JS Object & JSON
- Add the express.json middleware to your app
- Make your signup API dynamic to recive data from the end user
- User.findOne() with duplicate email ids, which one it eill return
- API => Get user by email
- API => Get all users
- API => Get user by id
- API => Delete user by id
- Difference between PATCH and PUT
- API => Update a user
- Explore the Mongoose Documentation for Model methods
- What are options in a Model. findOneAndUpdate method, explore more about it
- API => Update the user with email Id

# EPISODE 08

- Explore schematype options from the documentation
- Add required, unique, lowercase, min, minLength, trim
- Add default
- Create a custom validate function for gender
- Improve the DB schema - PUT all appropiate validations on each field in Schema
- Add timestamps to the user schema
- Add API level validation on Updat Patch and Signup POST request
- DATA SANITIZING => Add API validation for each field
- Intall validator
- Explore validator library function and Use validator funcs for password, email, photoUrl
- NEVER TRUST req.body (Always use validations on your end)

# EPISODE 09

- Validate data in /signup API
- Install bcrypt package
- Create PasswordHash using bcrypt.hash & save the user is encrypted password
- API => Sign in user by email and password
- Compare passwords and throw errors if email or password is invalid

# EPISODE 10

- Install cookie-parser
- Just send a dummy cookie to user
- API => get profile and check if you get the cookie back
- Install jsonwebtoken
- In signin API, after email and password validation, create a JWT token and send it to user in cookie
- Read the cookies inside your profile API and find the looged in user
- userAuth Middleware
- Add the userAuth middleware in profile API and a new sendConnectionRequest API
- Set the expiray of JWT token and cookies to 7 days
- Create userSchema method to getJWT()
- Create userSchema method to validatePassword(passwordInputByUser)

# EPISODE 11

- Explore tinder APIs
- Create a list all API you can think of in DevTinder
- Group multiple routes under respective routers
- Read documentation for express.Router
- Craete routes folder for managing auth, profile, request routers
- Craete authRouter, profileRouter, requestRouter
- Import these routers in app.js
- API => POST /signout
- API => PATCH /profile/edit
- API => PATCH /profile/password (Forget password API)
- Make sure to validate all data in every POST, PATCH APIs

# EPISODE 12

- Create Connection Request Schema
- API => POST send connection request
- Proper validation of data
- Think about all corner cases
- $or,$and queries in Mongoose Official Docs
- schema.pre("save") function
- Read more about indexes in MongoDB
- Why do we need index in DB?
- What is the advantages and disadvantages of creating index?
- Read compound index artical from MongoDB Official Docs
- ALWAYS THINK ABOUT CORNER CASES

# EPISODE 13

- API => POST review connection request with all validation
- Thought process - POST vs GET
- Read about ref and populate from Official MongoDB Docs
- API => GET received user requests with all the checks
- API => GET connections with all the checks.
