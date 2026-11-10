
# Stage 1: Build the React application
FROM node:24-alpine AS builder

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source code
COPY . .

# Build production files
RUN npm run build


# Stage 2: Serve using Nginx
FROM nginx:alpine

# Remove default Nginx website files
RUN rm -rf /usr/share/nginx/html/*

# Copy React production files from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
