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
# Install Maven manually since official maven:3-eclipse-temurin-25 is not yet available
RUN apk add --no-cache maven
# Copy the frontend build to the backend's static resources
COPY --from=build-frontend /app/frontend/dist /app/backend/src/main/resources/static/
COPY backend/pom.xml .
RUN mvn dependency:go-offline
COPY backend/src ./src
RUN mvn package -DskipTests

# Stage 3: Runtime
FROM eclipse-temurin:25-jre-alpine-3.23
WORKDIR /app
COPY --from=build-backend /app/backend/target/*.jar app.jar

# Render passes the PORT environment variable
ENV PORT 8080
EXPOSE ${PORT}

# Run the application
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]
