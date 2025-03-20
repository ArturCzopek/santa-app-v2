# Santa App V2

## About

**Santa App V2** is a Christmas-themed draw and messaging app built with React, Firebase, and Material UI.

- **Author**: Artur Czopek
- **Technologies**:
  - React 18
  - Firebase
  - Material UI
  - TypeScript

## Developer Setup

### Prerequisites

1. **Install Yarn**:

   - If you don't have Yarn installed, you can install it globally via Homebrew or npm:
     - Using Homebrew:
       ```bash
       brew install yarn
       ```
     - Using npm:
       ```bash
       npm install --global yarn
       ```

2. **Create a Firebase project**:
   - Enable **Google Authentication**.
   - Set up **Firestore Database**.
   - Enable **Analytics** for logging.

### Setup Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/santa-app-v2.git
   cd santa-app-v2
   ```
2. Install dependencies: Use Yarn to install the required dependencies:

`yarn install`

3. Configure Firebase:
   Go to Firebase Console.
   Copy your Firebase project configuration (API Key, Auth Domain, etc.).
   Create a .env file in the root of the project and add the following:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_APP_URL=http://localhost:5173 # path to your application, without '/' at the end!
```

4. Run the app: To start the development server, run:

`yarn dev`
