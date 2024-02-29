
#Google Fit Integration with Node.js

This Node.js application allows users to authenticate via Google OAuth2 and retrieve fitness data from Google Fit API.

#Features
User authentication via Google OAuth2.
Retrieves fitness data including activity and body metrics from Google Fit API.
Uses MongoDB for user data storage.
Uses Passport.js for authentication middleware.


#Prerequisites
Before running the application, make sure you have the following:

Node.js installed on your machine.
MongoDB database set up and running.
Google Cloud Platform project with the Google Fit API enabled and OAuth 2.0 credentials set up.

#Installation
Clone the repository:

git clone https://github.com/4321Khari/Google_Sign_In.git

#Install dependencies:

cd your_project
npm install

#Set up environment variables:

Create a .env file in the root directory and provide the following variables:


COOKIE_SECRET=your_cookie_secret
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
MONGODB_URI=your_mongodb_connection_uri

#Usage
Start the application:

npm start
Navigate to http://localhost:5000 in your browser.

Click on the "Login with Google" button to authenticate via Google OAuth2.

After successful authentication, you will be redirected to the dashboard where you can view your fitness data.

#Endpoints
/auth/google: Initiates Google OAuth2 authentication flow.
/auth/google/callback: Callback URL for handling OAuth2 callback.
/login/success: Returns user login status.
/logout: Logs out the user.
/google-fit-data: Retrieves fitness data from Google Fit API.
