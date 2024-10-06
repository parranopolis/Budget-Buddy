
```markdown
# Budget Buddy

**Budget Buddy** is a financial tracking application that allows users to record and manage their daily expenses, income, loans, and savings across different accounts such as bank accounts, credit cards, and cash. It automates the tracking process, which was previously done manually via Excel, and provides users with a multi-user platform where they can register transactions, manage savings, and generate reports.

## Features

- **User Authentication**: Secure login and logout using Firebase Authentication (email/password and Google Sign-In).
- **Track Financial Movements**: Users can record and manage their daily expenses and income, categorize transactions, and select payment methods.
- **Automated Savings Calculation**: Automatically divide 15% of income into various savings categories like entertainment and investments.
- **Multi-User**: Each user has their own independent instance, ensuring personalized tracking of their finances.
- **Monthly Breakdown**: Transactions can be sectioned monthly for performance optimization.
- **Reports and Graphs**: Users can generate detailed financial reports, although graphs are to be determined at a later stage.

## Technologies Used

- **Frontend**: React + Vite
- **Backend**: Firebase (using Firestore and Firebase Authentication)
- **Hosting**: Firebase Hosting and Vercel
- **Database**: Firestore (NoSQL)
- **Version Control**: Git & GitHub
- **Deployment**: Automatic deployments using Firebase Hosting when a pull request is merged.

## Project Structure

```bash
/BudgetBuddy
│
├── /public                     # Static public files
│   └── index.html
├── /src
│   ├── /assets                 # Images, icons, fonts, etc.
│   ├── /components             # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── GoogleButton.jsx
│   │   ├── SubmitButton.jsx
│   │   └── /movements          # Movement-related components
│   ├── /pages                  # Page components for routing
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   └── AddExpensePage.jsx
│   ├── /services               # Firebase services (auth, Firestore)
│   │   ├── firebaseConfig.js
│   │   ├── authService.js
│   │   └── firestoreService.js
│   ├── /context                # Context providers for global state
│   ├── /hooks                  # Custom React hooks
│   ├── /routes                 # Route definitions
│   ├── /styles                 # Global styles
│   ├── App.jsx                 # Main app component
│   └── index.jsx               # Entry point for the React app
│
├── .env                        # Environment variables (Firebase config)
├── .gitignore                  # Files to ignore in Git
├── firebase.json               # Firebase Hosting configuration
├── firestore.rules             # Firestore security rules
├── package.json                # Project dependencies and scripts
└── vite.config.js              # Vite configuration
```

## Setup and Installation

### Prerequisites
- **Node.js** and **npm**
- **Firebase account**
- **Vercel account (optional)** for deployment

### 1. Clone the repository:
```bash
git clone https://github.com/parranopolis/Budget-Buddy.git
cd BudgetBuddy
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Firebase Setup:
1. Go to the [Firebase Console](https://console.firebase.google.com/), create a new project, and enable **Authentication** (Email/Password and Google Sign-In).
2. Enable **Firestore Database**.
3. Add your project credentials to a `.env` file:
```bash
REACT_APP_API_KEY=your-api-key
REACT_APP_AUTH_DOMAIN=your-auth-domain
REACT_APP_PROJECT_ID=your-project-id
REACT_APP_STORAGE_BUCKET=your-storage-bucket
REACT_APP_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_APP_ID=your-app-id
```

### 4. Start the development server:
```bash
npm run dev
```

### 5. Deploy to Firebase Hosting:
1. Set up Firebase Hosting:
```bash
firebase init hosting
```
2. Deploy:
```bash
firebase deploy
```

## Usage

- **Login**: Users can log in using email/password or Google Sign-In.
- **Add a Daily Expense**: Go to the "Add Expense" page to log a daily transaction, specifying the amount, payment method, and category.
- **View and Edit Movements**: Users can view and edit their recorded expenses and income.
- **Generate Reports**: Monthly and custom reports can be generated to analyze the user's financial data.

## Rules and Security

Firestore security rules are in place to ensure that each user can only access their own data. Here’s an example of the security rules applied:

```bash
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /movements/{movementId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Contributions

Feel free to open a pull request if you'd like to contribute. Please make sure to follow the code standards and include tests for any new features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

### Key Points:
1. **Project Overview**: Describes the purpose and features of the "Budget Buddy" app.
2. **Technologies**: Lists the key technologies used (React, Firebase, Vite, etc.).
3. **Project Structure**: Provides an overview of the folder and file structure for better navigation.
4. **Setup Instructions**: Guides the user on how to clone, set up Firebase, and run the project locally.
5. **Usage**: Describes how to use the key features like login, adding expenses, and generating reports.
6. **Security**: Includes Firestore security rules to ensure data privacy for each user.
7. **Contributions**: Encourages collaboration and contributions.
8. **License**: Covers the licensing information.

Este README está preparado para que puedas subirlo a tu repositorio en GitHub o compartirlo en otras plataformas de control de versiones. ¿Hay algo más que te gustaría agregar o modificar?