# Courier Booking Web App

A production-ready courier booking platform with real-time tracking, multi-user support, and Delhivery API integration.

## Features
- **Two User Types**: Individual senders & Business accounts.
- **Booking Flow**: Parcel booking → Admin Approval → AWB Generation → Tracking.
- **Real-time Tracking**: Live map updates using Socket.io and Leaflet.
- **Admin Dashboard**: Comprehensive order management and metrics.
- **Notifications**: Automated Email (Nodemailer) and SMS (Twilio) triggers.
- **Carrier Integration**: Delhivery API ready for AWB and tracking.
- **PDF Labels**: Automated 4x6 thermal-ready shipping labels.

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Axios, React Query, Leaflet.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io.
- **Services**: Puppeteer (PDF), Nodemailer, Twilio.

## Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env # Update with your credentials
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables
Refer to `backend/.env.example` for the required configuration keys.
