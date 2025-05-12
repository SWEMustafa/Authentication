Authentication Module

A standalone Firebase Authentication module for React applications, packaged as a GitHub Template. Use this repo to quickly scaffold secure, tested authentication flows.

🧰 Tech Stack

Framework: React 18 with React Router v7 (via Vite)

Bundler: Vite (preferred) or alternative tool

Styling: Bootstrap 5 & React Bootstrap (requires @popperjs/core)

Icons: React Icons (e.g., react-icons/fa)

Authentication: Firebase Authentication (modular SDK)

Testing: Vitest + Testing Library (@testing-library/react, @testing-library/jest-dom)

🚀 Features

Signup: Email/password registration, password confirmation, email verification

Login: Persistent session or local storage “Remember me” option, friendly error mapping

Password Reset: “Forgot Password” flow with reset email and alerts

Profile Update: Change email/password with requires-recent-login handling

Protected Routes: PrivateRoute component redirects unauthenticated or unverified users

Components Included:

Login.jsx

Signup.jsx

ForgotPassword.jsx

UpdateProfile.jsx

VerifyEmail.jsx

PrivateRoute.jsx

📁 Repository Structure

/
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── src/
├── contexts/
│ └── AuthContext.jsx # signup/login/logout, remember-me logic
├── components/
│ ├── Login.jsx
│ ├── Signup.jsx
│ ├── ForgotPassword.jsx
│ ├── UpdateProfile.jsx
│ ├── VerifyEmail.jsx
│ └── PrivateRoute.jsx # route guard for un-auth / un-verified users
├── firebase.jsx # initializeApp + getAuth (modular SDK)
└── tests/
└── Auth.test.jsx # Vitest + Testing-Library unit tests

⚙️ Prerequisites

Node.js v16+ and npm or Yarn

A Firebase project with Authentication enabled

🔧 Installation

Clone as a template

git clone https://github.com/SWEMustafa/Authentication.git
cd Authentication

Install dependencies

npm install
# or
yarn install

Create your .env file

cp .env.example .env

Fill in your Firebase credentials:

VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

Modify firebase.jsx if your not using Vite

Update environment variable references to your bundler’s format (e.g., process.env.REACT_APP_… for CRA).

📦 Dependencies

Firebase (firebase modular SDK)

React Router DOM v7 (react-router-dom)

Bootstrap & React Bootstrap (bootstrap, react-bootstrap, @popperjs/core)

React Icons

Dev Dependencies

Vite & @vitejs/plugin-react

Vitest & @vitest/ui

Testing Library (@testing-library/react, @testing-library/jest-dom)

ESLint (eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh)

🧪 Running Tests

npm test
# or
yarn test

Vitest covers render states, success/failure flows, error handling, and redirects.

📖 Development

npm run dev
# or
yarn dev

Open http://localhost:5173 in your browser to try the authentication flows.

🔒 Firestore Security Rules

Include per-user access restrictions in your project:

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{doc=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}

📜 License

This project is licensed under the MIT License.

