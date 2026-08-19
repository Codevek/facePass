# FacePass 🆔⚡

> **One Face. One Identity. Entire Campus.**

FacePass is an AI-powered smart campus identity and authentication platform. It replaces traditional physical ID cards with a unified facial recognition identity layer, allowing students to access facilities, record attendance, and manage campus identity seamlessly and securely.

---

## 📸 Overview

Educational institutions struggle with traditional physical ID cards—cards get misplaced, shared, or lost, while attendance systems require manual work and access logs remain fragmented. 

**FacePass** solves this by providing a unified digital identity infrastructure:
1. **Institutional Verification**: Authenticates students via official institutional email (`@iitp.ac.in`) and OTP.
2. **One-Time Face Enrollment**: Captures user facial features using OpenCV and InsightFace AI models.
3. **Privacy-Preserving Vector Storage**: Converts raw biometric face images into high-dimensional vector embeddings stored securely in PostgreSQL using Prisma ORM.
4. **Unified Access Management**: Enables instant, camera-based authentication across campus facilities.

---

## ✨ Key Features

- **🔐 College Email OTP Verification**: Restricts enrollment to authorized campus domains (e.g. `@iitp.ac.in`) with automated OTP delivery via Nodemailer.
- **👤 AI Facial Embedding Generation**: Uses **InsightFace** and **OpenCV** to extract 512-D deep feature vector embeddings from captured face frames.
- **🛡️ Biometric Privacy**: Stored identities use mathematical embeddings rather than raw photos, preventing unauthorized image theft.
- **🔑 Secure JWT Authentication**: Issues signed JSON Web Tokens for authenticated API calls and session management.
- **📊 Modern Interactive UI**: React + Vite frontend featuring glassmorphism design, real-time webcam camera feed, interactive OTP inputs, and dashboard state management.

---

## 🏗️ System Architecture

```
                                    +-----------------------+
                                    |   React + Vite App    |
                                    |  (facepass-client)    |
                                    +-----------+-----------+
                                                |
                                        HTTP / REST (JWT)
                                                |
                                                v
                                    +-----------------------+
                                    |   Express Node API    |
                                    |  (facepass-server)    |
                                    +-----+-----------+-----+
                                          |           |
                           Prisma ORM     |           | HTTP / JSON (base64 img)
                         (PostgreSQL DB)  v           v
                            +---------------+       +-----------------------+
                            | Supabase PG   |       | Python FastAPI AI     |
                            | - User        |       | (face-service)        |
                            | - FaceEmbed   |       | - InsightFace Model   |
                            | - Verification|       | - OpenCV Processing   |
                            +---------------+       +-----------------------+
```

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, React Router DOM | Dynamic Single Page Application (SPA) with webcam integration |
| **Backend API** | Node.js, Express.js | Core REST API backend handling routing, auth & session control |
| **Database & ORM** | PostgreSQL, Prisma ORM | Relational schema management for users and facial vector records |
| **AI / Microservice** | Python 3.x, FastAPI, InsightFace, OpenCV, NumPy | High-performance facial detection and embedding extraction |
| **Authentication** | JWT (jsonwebtoken), Bcrypt | Stateless token-based security and passwordless email OTP validation |
| **Email Service** | Nodemailer | Transactional email handler for OTP verification codes |

---

## 📁 Repository Structure

```
facePass/
├── facepass-client/           # React + Vite Frontend App
│   ├── src/
│   │   ├── components/        # Reusable UI Components & Modals
│   │   ├── pages/             # AuthPage (Login/Register/OTP), Dashboard
│   │   ├── AuthContext.jsx    # React Auth State Provider
│   │   ├── App.jsx            # Routing & Guarded Routes
│   │   └── main.jsx           # React Entrypoint
│   └── package.json
├── facepass-server/           # Node.js + Express Backend API
│   ├── prisma/
│   │   └── schema.prisma      # Prisma PostgreSQL Database Schema
│   ├── src/
│   │   ├── controllers/       # Auth & Face Controllers
│   │   ├── middleware/        # JWT Auth Middleware
│   │   ├── routes/            # express.Router Definitions
│   │   ├── services/          # Nodemailer Email Service
│   │   └── app.js             # Express App Configuration
│   ├── .env                   # Server Environment Variables
│   └── package.json
├── face-service/              # Python AI Microservice
│   ├── main.py                # FastAPI server with InsightFace pipeline
│   ├── test_enroll.py         # Test script for embedding extraction
│   └── requirements.txt       # Python dependencies
└── README.md                  # Project Documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v18.x or later)
- **npm** or **yarn**
- **Python** (v3.9 or later)
- **PostgreSQL** database (or Supabase account)

---

### 1. Set Up Database & Backend Server (`facepass-server`)

1. Navigate to the server folder:
   ```bash
   cd facepass-server
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `facepass-server/.env`:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>:5432/<DATABASE>"
   JWT_SECRET="your_jwt_secret_key_here"
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-password"
   ```
4. Run Prisma database migrations:
   ```bash
   npx prisma db push
   # or
   npx prisma migrate dev
   ```
5. Start the backend server in development mode:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:5000`.*

---

### 2. Set Up AI Face Service (`face-service`)

1. Navigate to the Python service folder:
   ```bash
   cd face-service
   ```
2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Linux/macOS
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install required Python packages:
   ```bash
   pip install fastapi uvicorn insightface opencv-python numpy pydantic requests
   ```
4. Launch the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The AI Face Service will load the InsightFace model and run on `http://localhost:8000`.*

---

### 3. Set Up Frontend Client (`facepass-client`)

1. Navigate to the client folder:
   ```bash
   cd facepass-client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```
   *Open your browser at `http://localhost:5173`.*

---

## 📡 API Endpoints Reference

### Authentication Endpoints (`/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/send-otp` | Validates college email domain (`@iitp.ac.in`) & dispatches 6-digit OTP code | No |
| `POST` | `/auth/verify-otp` | Validates OTP code; returns JWT token if registered | No |
| `POST` | `/auth/register` | Registers new user record with student details & returns JWT token | No |
| `GET` | `/auth/me` | Fetches current logged-in user profile | **Yes (Bearer JWT)** |

### Facial Recognition Endpoints (`/face`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/face/enroll` | Sends base64 webcam frame to FastAPI, generates embedding vector & updates DB | **Yes (Bearer JWT)** |

---

## 🗄️ Database Schema (`Prisma`)

```prisma
model User {
  id            String         @id @default(uuid())
  name          String
  rollNumber    String         @unique
  email         String         @unique
  department    String?
  year          Int?
  verified      Boolean        @default(false)
  faceEnrolled  Boolean        @default(false)
  createdAt     DateTime       @default(now())
  faceEmbedding FaceEmbedding?
}

model VerificationCode {
  id        String   @id @default(uuid())
  email     String
  otp       String
  expiresAt DateTime
}

model FaceEmbedding {
  id        String   @id @default(uuid())
  userId    String   @unique
  embedding Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
}
```

---

## 🔒 Security & Privacy Features

- **No Raw Biometric Storage**: FacePass extracts feature vectors (float arrays) and discards base64 images immediately.
- **Institutional Domain Boundary**: Only verified email addresses belonging to configured domains can register.
- **Short-Lived OTPs**: Verification codes expire automatically after 5 minutes.
- **Stateless Bearer Tokens**: Authenticated sessions are secured via JWT headers.

---

## 🔮 Future Roadmap

- [ ] Real-time Anti-Spoofing & Liveness Detection (blink & depth check)
- [ ] Automated Attendance Logging for Classrooms & Labs
- [ ] Smart Library & Hostel Gate Access Integration
- [ ] Admin Analytics Dashboard with Occupancy Insights
- [ ] Mobile App Support (React Native / Flutter)

---

## 📝 License

This project is released under the [ISC License](LICENSE).
