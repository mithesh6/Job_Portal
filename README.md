# Job Seeking Portal

A modern, full-stack application providing a comprehensive platform for job seekers to find opportunities and for recruiters to manage openings and applications.

Built with a **Spring Boot** backend, **React** frontend, and **MySQL** database.

## 🚀 Features

- **Candidate Features**:
  - Secure Registration and Login.
  - Browse and search job openings.
  - Apply for jobs with resume links.
  - Track application status (Applied, Reviewing, Rejected, Accepted).
- **Recruiter (Admin) Features**:
  - Management of job postings (CRUD).
  - Review all candidate applications.
  - Update application statuses.
- **Security**:
  - Role-based Access Control (RBAC).
  - Stateless JWT-based authentication.

## 🛠️ Tech Stack

- **Backend**: Java 25, Spring Boot 3.5.0, JPA/Hibernate, Spring Security 6, MySQL.
- **Frontend**: React 18, Vite, Axios, Vanilla CSS.
- **DevOps**: Git.

## 📦 Prerequisites

- **Java**: JDK 25 or higher.
- **Node.js**: v18.x or higher.
- **Maven**: 3.x.
- **MySQL**: 8.x.

## ⚙️ Setup & Installation

### 1. Database Setup
1. Create a MySQL database named `job`.
2. Configure your credentials in `backend/src/main/resources/application.properties`.
3. (Optional) Run `database_schema.sql` to initialize tables manually.

### 2. Backend Setup
1. Open a terminal in the `backend/` folder.
2. Run the application:
   ```bash
   mvn clean spring-boot:run
   ```
3. The server will start on `http://localhost:8080`.

### 3. Frontend Setup
1. Open a terminal in the `frontend/` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The application will be available at `http://localhost:5173/`.

### 🔐 Default Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

## 📁 Project Structure

- `backend/`: Spring Boot source code and Maven configuration.
- `frontend/`: React source code and Vite configuration.
- `database_schema.sql`: Initial SQL schema for the database.
- `DESIGN.md`: Detailed architectural and technical design document.
