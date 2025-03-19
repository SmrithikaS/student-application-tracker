
# Student Application Tracker
A full stack web application for students to track their application and its status. This is built with React, Go, Mysql and deployed on AWS and utilises Github Action for ci/cd.

# Features
1.User can register and login with their email and password that is  
  authenticated using firewall.
2.We can add,update application from the backend using mysql databse.
3.A timeline that helps check current status of their application, 
  dashboard that gives details of their application.
4.AI chatbot that supports OpenAI API.
5.Chatbot responds to user queries and stored FAQs.
6.Containerised using Docker.
7.
8.Deployed on AWS EC2 with Elastic IP.
9.CI/CD pipeline with GitHub Actions.

# Tech Stack
Frontend: React,JavaScript
Backend: Golang
Database: MySQL
AI Integration: OpenAI (ChatGPT)
Devops: AWS,GitHub

# Backend
InitDB: Helps in connecting to the database by taking values from the .env file.

registerUser: API end point to handles new user registeration and stores them into user databse store password in hashed format using bcrypt.

loginUser: API end point to handles users logging in to the website by fetching value from the user database.

getFAQAnswer: Checks if a question asked by a user is present in database chatbot and sends back that reply.

chatHandler: Handles user queries and responds using either FAQ that is stored in the chatbot database or OpenAI GPT.

main: Sets up the server, database connection, and all API endpoints.

# Frontend
chatbot.js: React chatbot UI that sends messages to `/api/chat`.Shows a chat box where user can ask their questions.
home.js: Displays a grid of job applications with status, interview date, and result.
login.js: Helps user with an account to login after authentication.
sigin.js: Helps a new user create an account.

Uses `axios` for API calls, localStorage to manage sessions.

timeline.js: displays a timeline of job application statuses for a logged-in user using Material UI's Timeline component. It shows the present state by using different colours.

app.js: Setsup routing logic for the application.Gives private and protected routes depending on login status.useAuth and AuthProvider handle user login state using context.

navigation.js: Displays the top navigation bar  displaying links to home page,timeline page and handling user logout.

# Devops
docker-compose.yaml: Orchestrates backend golang frontend react, and MySQL database containers.

Dockerfile.frontend:It is a multi stage dockerfile used to build react application using react

Dockerfile.backend: This multi-stage Dockerfile compiles a Go backend app in a golang container. It creates a debian image installs ssl certificate to run openapi

github/workflows/deploy.yml: GitHub Actions file that SSHes into EC2,pulls latest code and runs Docker build & deploy.

# Database (applicationdb)
user: Stores signin details of a user so that it can be authenticated when logging in.

application: Stores active application of a student where they can check the application status,interview date and result.

chatbot: Stores FAQ's that can be asked to the chatbot like 
('How often is the application status updated?','Status updates are made whenever there is progress in your application, such as document verification, interview scheduling, or final decision.'),('What are the different application statuses and their meanings?','Submitted: Your application has been successfully received.Under Review: Your application is being processed.Documents Pending: Some documents are missing; please upload them.Interview Scheduled: You have an interview scheduledcheck details in your portal.Accepted: Congratulations! Your application has been approved.Rejected: Unfortunately, your application was not selected.'),('What should I do if I miss my interview?','Contact the admissions team as soon as possible to check if rescheduling is possible.'),('Why isnt my application status updating?','If your status hasnt changed for a long time, it may be due to processing delays. Contact the admissions office for updates.'),('What should I do after my application is accepted?','Follow the next steps mentioned in your application portal, such as confirming your enrollment and submitting any required fees or documents.')

