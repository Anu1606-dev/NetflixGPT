# NetflixGPT 🎬

A Netflix-inspired movie browsing web app built with React, Tailwind CSS, Firebase Authentication, Redux Toolkit, and the TMDB API. Users can sign up, sign in, and browse real movie data in a UI modeled after Netflix's actual design.

🔗 **Live App:** [https://netflixgpt-a03a2.web.app](https://netflixgpt-a03a2.web.app)
🔧 **Firebase Console:** [https://console.firebase.google.com/project/netflixgpt-a03a2/overview](https://console.firebase.google.com/project/netflixgpt-a03a2/overview)

---

## ✨ Features

### Authentication
- Sign Up and Sign In with email and password (Firebase Authentication)
- Regex-based form validation for email format and password strength
- Custom error messages for invalid credentials, weak passwords, and duplicate accounts
- Optional profile photo URL and display name on sign up
- Persistent sessions with sign out functionality

### Browsing Experience
- Netflix-style landing page for logged-out users
- Post-login Browse page with:
  - Hero banner showcasing a featured movie (title, overview, backdrop)
  - Horizontally scrollable movie rows with hover navigation arrows
  - Real movie posters and data fetched live from TMDB
- Responsive navigation header with profile dropdown, notifications, and language selector

### Architecture
- Global state management using Redux Toolkit (user session and movie data)
- Custom React hooks for fetching and caching movie data
- Environment-based API key management
- Deployed and hosted on Firebase Hosting

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | React |
| Styling | Tailwind CSS |
| Routing | React Router |
| State Management | Redux Toolkit, React-Redux |
| Authentication | Firebase Authentication |
| Hosting | Firebase Hosting |
| Movie Data | TMDB API |

---

## 🚀 Getting Started

### Prerequisites
- Node.js and npm installed
- A Firebase project with Email/Password authentication enabled
- A TMDB account with an API Read Access Token

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Anu1606-dev/NetflixGPT.git
   cd NetflixGPT
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables

   Create a `.env` file in the project root:
   ```
   REACT_APP_TMDB_KEY=your_tmdb_read_access_token
   ```

4. Add your Firebase configuration

   Update `src/Utils/Firebase.js` with your own Firebase project credentials.

5. Run the app locally
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`.

---

## 📦 Deployment

This project is deployed using Firebase Hosting:

```bash
npm run build
firebase deploy
```

---

## 📁 Project Structure

```
src/
├── Components/
│   ├── Header.jsx
│   ├── Login.jsx
│   ├── Landing.jsx
│   ├── Browse.jsx
│   ├── MovieList.jsx
│   └── MovieCard.jsx
├── hooks/
│   └── useNowPlayingMovies.js
├── Utils/
│   ├── Firebase.js
│   ├── Validate.js
│   ├── constants.js
│   ├── appStore.js
│   ├── userSlice.js
│   └── moviesSlice.js
├── App.js
└── index.css
```

---

## 🔮 Planned Enhancements
- AI-powered movie search
- Multi-language support
- Additional movie categories (Popular, Top Rated, Upcoming)
- Profile management and account settings

---

## 👩‍💻 Author

Built by Anushka Sarkar as a personal project to practice React, state management, authentication, and API integration.

Project Console: https://console.firebase.google.com/project/netflixgpt-a03a2/overview
Hosting URL: https://netflixgpt-a03a2.web.app
