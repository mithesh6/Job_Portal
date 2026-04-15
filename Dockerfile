# Stage 1: Build Frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM eclipse-temurin:25-jdk-alpine-3.23 AS build-backend
WORKDIR /app/backend
# Install Maven manually
RUN apk add --no-cache maven

# Copy backend files first
COPY backend/pom.xml .
RUN mvn dependency:go-offline
COPY backend/src ./src

# Overlay the frontend build assets into the backend static resources
COPY --from=build-frontend /app/frontend/dist /app/backend/src/main/resources/static/

# Build the final JAR
RUN mvn package -DskipTests

# Stage 3: Runtime
FROM eclipse-temurin:25-jre-alpine-3.23
WORKDIR /app
# Use the exact artifact ID and version from pom.xml
COPY --from=build-backend /app/backend/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Render passes the PORT environment variable
ENV PORT 8080
EXPOSE ${PORT}

# Run the application
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]
