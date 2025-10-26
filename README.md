# 🔥 Nextship

Nextship is a full-stack social blogging platform inspired by sites like DEV.to and Medium. It's built from scratch with Next.js and Firebase, demonstrating advanced, high-performance web development techniques.

This application is the result of an advanced Next.js & Firebase course, putting complex concepts like custom usernames, realtime data, and advanced rendering patterns (SSR, SSG, ISR) into practice.

---

## 🚀 About The Project

The goal of this project is to build a complete, SEO-friendly blogging platform. Authors can sign up, claim a unique, custom username, and create content using markdown. Readers can discover posts and "heart" them in realtime, with all data securely handled by Firestore.

---

## 🛠️ Tech Stack

This project utilizes a modern, server-first tech stack:

* **Framework:** [Next.js](https://nextjs.org/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Backend & DB:** [Firebase](https://firebase.google.com/) (Authentication, Firestore, Storage)
* **UI/State:** [React](https://reactjs.org/) (Context API, Custom Hooks)
* **Forms:** [React Hook Form](https://react-hook-form.com/)
* **UI/UX:** [React Hot Toast](https://react-hot-toast.com/) (for notifications)
* **Deployment:** [Vercel](https://vercel.com/) & [Firebase Hosting](https://firebase.google.com/products/hosting)

---

## 🔥 Features

This application implements a wide range of features, from authentication and data modeling to advanced SEO and deployment strategies.

### Core Blogging & Content
* **Markdown Post Editor:** Create and edit posts using a simple markdown form.
* **Image Uploads:** Upload cover images for posts directly to Firebase Storage.
* **Form Validation:** Secure, client-side validation using `react-hook-form`.

### User & Authentication
* **Google Sign-in:** Easy authentication with Google OAuth.
* **Custom Usernames:** Asynchronously validate and assign unique custom usernames to users.
* **Auth Context:** Global auth state managed via React Context and custom hooks.
* **Protected Routes:** Admin pages and user-specific content are protected from unauthenticated users.

### Social & Realtime
* **Realtime Hearts (Likes):** A many-to-many relationship allowing users to "heart" posts, with changes reflected in realtime.
* **Realtime Data Hydration:** Transitions from server-rendered content to a realtime Firestore stream for dynamic data.

### Performance & SEO
* **Advanced Rendering Strategy:**
    * **SSR (Server-Side Rendering):** Used for user profile pages to fetch data on the server.
    * **SSG + ISR (Incremental Static Regeneration):** Used to statically build and rebuild individual post pages on the fly.
* **Paginated Home Page Feed:** The main feed is server-rendered and paginated for performance.
* **Dynamic Metatags:** Generates dynamic `meta` tags for SEO and social link previews.
* **Custom 404 Page:** A user-friendly, custom-rendered 404 page.

### Technical Excellence
* **Backend Security:** Uses Firestore Rules to ensure the database is secure across the entire stack.
* **Data Modeling:** Implements robust data models for relationships between users, posts, and hearts.
* **UI/UX:** Includes a loading spinner for loading states and `react-hot-toast` for animated toast messages.
* **Dual Deployment:** Deploys the app with continuous integration on Vercel and Firebase Hosting.

---

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later)
* npm, yarn, or pnpm
* [Firebase Account](https://firebase.google.com/)

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/sumantwarhekar/Nextship.git](https://github.com/sumantwarhekar/Nextship.git)
    cd Nextship
    ```

2.  **Install dependencies**
    ```sh
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables**
    Create a file named `.env.local` in the root of the project. You will need to create a new Firebase project and get your web app's configuration keys.

    ```env
    # Your web app's Firebase configuration
    NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_SENDER_ID"
    NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
    ```

4.  **Set up Firebase**
    You will need to:
    * Enable **Authentication** (Google Sign-in).
    * Enable **Firestore** (database).
    * Enable **Firebase Storage**.
    * Set up your **Firestore Rules** for security (refer to the course materials for the specific rules).

5.  **Run the development server**
    ```sh
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result!

---

## 🎓 Acknowledgements

This project was built following an advanced Next.js and Firebase course. All concepts and features are based on the curriculum provided.
