# Design Document - Job Seeking Portal

This document outlines the architectural and technical design of the Job Seeking Portal, a full-stack application for managing job postings and applications.

## 1. System Architecture

The application follows a classic **client-server architecture**:
- **Frontend**: A single-page application (SPA) built with React.
- **Backend**: A RESTful API built with Spring Boot.
- **Database**: A relational database (MySQL) for persistent storage.

## 2. Technology Stack

### Backend
- **Java**: 25 (targeting 23 bytecode compatibility for Spring ASM compatibility).
- **Framework**: Spring Boot 3.5.0.
- **Security**: Spring Security 6 with JSON Web Token (JWT) based authentication.
- **Data Access**: Spring Data JPA with Hibernate.
- **Database**: MySQL 8.0+.
- **Build Tool**: Maven.

### Frontend
- **Framework**: React 18+.
- **Styling**: Vanilla CSS.
- **API Client**: Axios.
- **State Management**: LocalStorage for session/JWT.
- **Build Tool**: Vite.

## 3. Core Features

- **Authentication**: Role-based access control (RBAC) for Admin and User roles.
- **Job Management**: Admins can create, update, and delete job postings.
- **Application Tracking**: Users can apply for jobs and track the status of their applications.
- **User Dashboard**: Personalized views for applicants to see their history.
- **Admin Dashboard**: Comprehensive view of all jobs and applications.

## 4. Entity Relationship Diagram (ERD)

The system consists of three primary entities:
- **User**: Stores profile information, credentials, and role.
- **Job**: Stores job details (title, company, description, location).
- **Application**: Links a User to a Job and stores the status (APPLIED, REVIEWING, REJECTED, ACCEPTED).

### Relational Mapping
- **User (1) <---> Application (N)**: A user can have multiple applications.
- **Job (1) <---> Application (N)**: A job can receive multiple applications.

## 5. Security Design

- **JWT Authentication**: Secured stateless sessions.
- **Password Hashing**: BCrypt algorithm used for secure credential storage.
- **CORS**: Configured to allow cross-origin requests from the known React development server.

## 6. API Structure

- `/api/auth/**`: Public endpoints for Login and Registration.
- `/api/jobs/**`: Job posting and retrieval (secured by role).
- `/api/applications/**`: Application management (secured by user/role).
