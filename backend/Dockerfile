# Build Stage
FROM eclipse-temurin:25-jdk-alpine-3.23 AS build
WORKDIR /app
# Install Maven
RUN apk add --no-cache maven
# Copy pom and fetch dependencies
COPY pom.xml .
RUN mvn dependency:go-offline
# Copy source and build
COPY src ./src
RUN mvn package -DskipTests

# Runtime Stage
FROM eclipse-temurin:25-jre-alpine-3.23
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
ENV PORT 8080
EXPOSE ${PORT}
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]
