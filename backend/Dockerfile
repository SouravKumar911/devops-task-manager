
# 1. Use Node.js as the base image
FROM node:24-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files first
COPY package*.json ./

# 4. Install project dependencies
RUN npm ci

# 5. Copy the remaining backend source code
COPY . .

# 6. Document the port used by the application
EXPOSE 5000

# 7. Start the Express backend
CMD ["npm", "start"]
