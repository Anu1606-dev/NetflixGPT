# NetflixGPT 🎬

A Netflix-inspired streaming web app with an AI-powered movie assistant. Built as a personal project to demonstrate production-grade React architecture — authentication, real-time data sync, streaming AI responses, function calling, multimodal search, and full-stack thinking around a purely frontend-and-BaaS stack.

🔗 **Live App:** [https://netflixgpt-a03a2.web.app](https://netflixgpt-a03a2.web.app)
🔧 **Firebase Console:** [https://console.firebase.google.com/project/netflixgpt-a03a2/overview](https://console.firebase.google.com/project/netflixgpt-a03a2/overview)

---

## ✨ Features

### Authentication & Account
- Email/password sign up and sign in via Firebase Authentication
- Regex-based form validation with specific, human-readable error messages
- Custom avatar picker with presets and custom image URL support
- Persistent sessions with auth-guarded routes

### Browsing Experience
- Netflix-style landing page and post-login Browse page
- Autoplaying trailer hero banner with mute toggle and randomized featured title
- Movie/TV rows across Now Playing, Popular, Top Rated, Upcoming, Trending, Airing Today, and more
- Dedicated pages for Movies, Shows, New & Popular, Browse by Languages, and Notifications
- Fully responsive layout, from phones to desktop, including touch-friendly navigation

### AI Movie Assistant
- Conversational chat interface with streamed, real-time responses
- **Gemini function calling** — the model chooses between `recommend_movies` and `get_movie_details` as structured tool calls, not brittle text parsing
- **Voice search** via the native Web Speech API
- **Multimodal image search** — upload a screenshot, Gemini's vision model identifies the movie or show
- **Lightweight personalization** — recommendations are informed by the user's saved list and watch history, injected into the model's context
- **Persistent chat history** — conversations are saved to Firestore and restored on return visits
- Rich movie detail cards with trailer playback, cast, genres, and ratings

### Search
- Text search across movies and TV shows via TMDB
- Mood/genre keyword search (e.g. "funny", "scary") mapped to real TMDB genres
- Image-based identification, shared with the AI chat's image search

### Personal Data (Firestore-backed)
- **My List** — add/remove titles, synced in real time, persists across sessions
- **Continue Watching** — tracks trailer playback progress, resumes from last position, auto-clears once finished

### Engineering
- **TypeScript** across the entire state layer — Redux slices, store, and data-fetching hooks
- **Tests** — Jest + React Testing Library covering validation logic, Redux reducers, and component behavior
- **CI/CD** — GitHub Actions automatically builds, tests, and deploys to Firebase Hosting on every push to `main`, with PR preview deploys
- **Performance** — route-based code splitting via `React.lazy`
- **Accessibility** — visible focus states, skip-to-content link, ARIA labels on icon controls, Escape-to-close on all modals

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | React, TypeScript (state layer) |
| Styling | Tailwind CSS |
| Routing | React Router |
| State Management | Redux Toolkit, React-Redux |
| Authentication | Firebase Authentication |
| Database | Cloud Firestore (My List, Continue Watching, chat history) |
| Hosting | Firebase Hosting |
| CI/CD | GitHub Actions |
| Testing | Jest, React Testing Library |
| Movie Data | TMDB API |
| AI | Google Gemini (function calling, streaming, vision) |
| Voice | Web Speech API |

---

## 🚀 Getting Started

### Prerequisites
- Node.js and npm
- A Firebase project with Authentication and Firestore enabled
- A TMDB account with an API Read Access Token
- A Gemini API key from [Google AI Studio](https://aistudio.google.com)

### Installation

```bash
git clone https://github.com/Anu1606-dev/NetflixGPT.git
cd NetflixGPT
npm install
```

Create a `.env` file in the project root:
```
REACT_APP_TMDB_KEY=your_tmdb_read_access_token
REACT_APP_GEMINI_KEY=your_gemini_api_key
```

Update `src/Utils/Firebase.js` with your own Firebase project credentials.

Deploy Firestore security rules:
```bash
firebase deploy --only firestore:rules
```

Run locally:
```bash
npm start
```

### Running Tests
```bash
npm test -- --watchAll=false
```

---

## 📦 Deployment

Deploys automatically via GitHub Actions on every push to `main`. To deploy manually:
```bash
npm run build
firebase deploy
```

---

## 📁 Project Structure

```
src/
├── Components/       # Pages and UI components
├── hooks/            # Data-fetching and sync hooks (TypeScript)
├── Utils/            # Redux slices, Firebase/Firestore helpers, constants (TypeScript)
├── App.js
└── index.css
.github/workflows/    # CI/CD pipelines
firestore.rules        # Firestore security rules
tsconfig.json
```

---

## 👩‍💻 Author

Built by Anushka Sarkar as a personal project to practice production-level React architecture, state management, real-time data sync, and AI integration.