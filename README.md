# NextShip - Social Media Platform

A modern social media platform built with Next.js 15 and Firebase, featuring real-time updates, user authentication, and a clean, responsive design.

## ✨ Features

- 🔐 **Authentication**: Google OAuth integration with Firebase Auth
- 📝 **Rich Content**: Create and edit posts with markdown support
- ❤️ **Real-time Interactions**: Live heart/like system with instant updates
- 🖼️ **Image Uploads**: Direct image upload to Firebase Storage
- 👤 **User Profiles**: Custom usernames and profile pages
- 📱 **Responsive Design**: Mobile-first approach with modern UI
- 🚀 **Server-Side Rendering**: SEO-optimized with Next.js App Router
- 🔒 **Security**: Comprehensive Firestore security rules

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Styling**: CSS Modules, Custom CSS Variables
- **Deployment**: Vercel (recommended)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project with Firestore, Auth, and Storage enabled

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd nextship
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Google provider)
   - Enable Firestore Database
   - Enable Storage
   - Copy your Firebase config

4. Create environment variables:
   ```bash
   # Create .env.local file with your Firebase config
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. Deploy Firebase rules:
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools
   
   # Login and deploy rules
   firebase login
   firebase deploy --only firestore:rules,storage
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
nextship/
├── src/app/                 # Next.js App Router pages
│   ├── admin/              # Admin dashboard
│   ├── [username]/         # User profile pages
│   │   └── [slug]/         # Individual post pages
│   ├── enter/              # Authentication page
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── AuthCheck.tsx       # Authentication wrapper
│   ├── HeartButton.js      # Like/heart functionality
│   ├── ImageUploader.tsx   # File upload component
│   ├── Navbar.js          # Navigation bar
│   ├── PostActions.js     # Post interaction controls
│   ├── PostContent.js     # Post display component
│   ├── PostFeed.js        # Posts list component
│   └── UserProfile.js     # User profile component
├── lib/                   # Utility libraries
│   ├── firebase.ts        # Firebase configuration
│   ├── hooks.ts          # Custom React hooks
│   └── context.ts        # React Context
├── public/               # Static assets
├── firestore.rules      # Firestore security rules
├── storage.rules        # Storage security rules
└── cors.json           # CORS configuration
```

## 🔧 Configuration

### Firebase Rules

The project includes comprehensive security rules:

- **Firestore**: Located in `firestore.rules`
- **Storage**: Located in `storage.rules`
- **CORS**: Configuration in `cors.json`

### Environment Variables

Required environment variables for production:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel settings
4. Deploy automatically on every push

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Test the build locally:
   ```bash
   npm start
   ```

3. Deploy to your hosting platform

## 📝 Usage

1. **Sign In**: Click "Log In" and authenticate with Google
2. **Set Username**: Create your unique username
3. **Create Posts**: Go to Admin panel to write and publish posts
4. **Interact**: Like posts and view user profiles
5. **Upload Images**: Add images to your posts via the image uploader

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built following the Fireship.io Next.js course
- Migrated to Next.js 15 App Router architecture
- Firebase for backend services
- Vercel for hosting platform
