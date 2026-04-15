# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Vite build
RUN npm run build

# Production Stage
FROM nginx:stable-alpine
# Copy the build output to Nginx's html folder
COPY --from=build /app/dist /usr/share/nginx/html
# Copy a custom nginx config if you have one, or use the default
# EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
