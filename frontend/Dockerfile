# Step 1: Build the React app
FROM node:18 as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --silent

# Copy the rest of the application code
COPY . .

RUN apt-get update && apt-get install -y \
    sed \
    && rm -rf /var/lib/apt/lists/*

RUN find ./src -type f -exec sed -i 's|http://127.0.0.1:5000|https://ats-be.cyril.pw|g' {} +

# Build the React app for production
RUN npm run build

# Find and replace in the specified file
RUN sed -i 's/\/application-tracking-system\//\//g' /app/build/index.html

# Step 2: Serve the static files using nginx
FROM nginx:alpine

# Copy the built React files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]