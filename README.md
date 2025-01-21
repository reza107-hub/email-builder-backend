# Email Builder

**Email Builder** is a full-stack web application that allows users to create and customize email templates easily. The application consists of a React frontend and Node.js/Express backend with Cloudinary integration for image handling.

---

## Features

### Core Functionality
- Dynamic email template editor with real-time preview
- Custom text formatting for title and content
- Image upload capability with Cloudinary integration
- Template download functionality
- Responsive design

### Text Customization Options
- Font size adjustment
- Text alignment (left, center, right)
- Color picker for text
- Font weight options (normal, semibold, bold)

---

## Tech Stack

### Frontend
- React 18
- React Router DOM
- React Type Animation
- Tailwind CSS
- DaisyUI
- Vite

### Backend
- Node.js
- Express
- Cloudinary
- Multer
- CORS

---

## Prerequisites
Before running the application, make sure you have:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- Cloudinary account credentials

---

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   git clone https://github.com/reza107-hub/email-builder-backend.git
   cd email-builder-backend
   ```
2. Install dependencies:
   ```bash
   npm install
3. Create a ```.env``` file in the backend directory with the following variables:
    ```bash
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
4. Start the backend server:
    ```bash
    # Development mode
    npm run dev

    # Production mode
    npm start
5. The backend server will run on http://localhost:4000.

### Frontend Setup
1. Navigate to the frontend directory:
    ```bash
    git clone https://github.com/reza107-hub/email-builder-client.git
    cd email-builder-client
2. Install dependencies:
    ```bash
    npm install
3. Start the development server:
    ```bash
    npm run dev
4. The frontend application will run on http://localhost:5173.

### Live Link
https://email-builder-client.vercel.app/