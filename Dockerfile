# Base image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install

# Install axios and its type declarations
RUN npm install axios
RUN npm install @types/axios

# Grant execution permission to the nest command
RUN chmod +x ./node_modules/.bin/nest

# Copy the rest of the application code to the working directory
COPY . .

RUN npx nest build

# Expose the application port
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "run", "start:prod"]
