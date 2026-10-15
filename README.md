# KiroHealth

KiroHealth is a web-based healthcare management application designed to help patients, doctors, and admins handle registration, doctor applications, appointment scheduling, account management, and notifications.

This project uses a full-stack architecture with React for the frontend and Node.js/Express for the backend, with MongoDB as the database.

## Key Features

- User registration and login.
- Role-based access for patients, doctors, and admins.
- Doctor application flow that can be approved by admins.
- Doctor search and appointment booking.
- Schedule availability checks before booking.
- Doctor dashboard for viewing and managing appointments.
- Admin dashboard for managing users, doctors, and account status.
- Notification system for important actions such as doctor applications and new appointments.
- Editable patient and doctor profiles.

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Redux Toolkit
- Axios
- Bootstrap / React-Bootstrap

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token
- bcrypt
- cors
- multer

## Project Structure

```text
KiroHealth/
├── Client/        # React + Vite frontend
├── Server/        # Express + MongoDB backend
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd KiroHealth
```

### 2. Set up the backend

```bash
cd Server
npm install
```

Create a `.env` file inside the `Server` folder and add at least:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Run the backend:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd ../Client
npm install
npm run dev
```

The Vite frontend usually runs at `http://localhost:5173`, while the backend runs at `http://localhost:5000`.

## User Flow

1. A user registers or logs in.
2. Patients can view approved doctors.
3. Patients select a doctor, check availability, and book an appointment.
4. Doctors receive notifications for new appointment requests and can manage appointment status.
5. Users who want to become doctors can submit a doctor application.
6. Admins review and approve or reject doctor accounts.

## Backend Endpoints

Some of the main available endpoints are:

- `/api/users` for registration, login, profile, appointment booking, notifications, and doctor listing.
- `/api/doctor` for doctor appointment data, status updates, and doctor profile information.
- `/api/admin` for user management, doctor management, and account status control.

## Notes

This project can still be expanded further, for example by adding:

- more complete file upload integration,
- more detailed dashboard layouts,
- advanced doctor search features,
- and richer appointment history reports.