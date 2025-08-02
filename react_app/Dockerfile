# Use the official Node.js image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose port 5173 and start the development server
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
