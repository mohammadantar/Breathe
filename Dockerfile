FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json to install dependencies
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the project (creates the 'dist' folder)
RUN npm run build

# Explicitly expose port 8080
EXPOSE 8080

# Start the Express backend server (which serves the frontend and proxies Vertex API)
CMD ["node", "server.js"]
