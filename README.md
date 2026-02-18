Authentication Module

What Is It?
This is an athentication template designed for React applications.

It connects your frontend directly to Google's Firebase infrastructure to handle identity management securely. It is designed to be dropped into new projects to instantly provide user management capabilities.

Tech Stack
Frontend Framework:

React 18 (Vite): Uses the latest React features for speed and modularity.

React Router v7: Manages navigation and protects "private" pages from being accessed by logged-out users.

Backend / Service:

Firebase Authentication: Google’s backend-as-a-service that handles the actual storage of users and passwords.

UI / Styling:

Bootstrap 5: Provides the visual components for login forms and dashboards.

Quality Assurance:

Vitest: Runs automated tests to ensure login/signup logic doesn't break.

What It Does
When integrated, this module manages the entire user lifecycle:

Session Guard: It wraps your application in an "Auth Provider" that tracks if a user is logged in or out across the entire site.

Gatekeeper: If a user tries to access a dashboard without logging in, the PrivateRoute component intercepts them and kicks them back to the login screen.

Self-Service: It allows users to reset their own passwords and verify their email addresses without admin intervention.

How to Run It
FOR PROPER SETUP, YOU WILL NEED A FIREBASE PROJECT ALREADY CREATED.

Get the Code:
Clone this repository to your local machine.

Install Dependencies:
Open your terminal in the project folder and run:

Bash
npm install
Configure Keys:
You need to connect this to your specific Firebase project.

Go to your Firebase Console and find your "Project Settings."

Create a file named .env in the root of this folder.

Paste your specific API keys into that file (matching the variables in .env.example).

Launch:
Once your keys are saved, run the startup command:

Bash
npm run dev
This will open a local development server (usually at http://localhost:5173).

Verify:
You should now see the Login screen. Try creating a new account to test that the connection to Firebase is working.
