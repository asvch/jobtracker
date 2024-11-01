# Step 1: Build the React app
FROM node:18 AS build

ARG REACT_APP_BACKEND_BASE_URL

ENV REACT_APP_BACKEND_BASE_URL=${REACT_APP_BACKEND_BASE_URL}

# Set the working directory inside the container
WORKDIR /app

RUN npm install -g pnpm

# Copy package.json and package-lock.json
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

RUN mkdir -p public/resume-templates && \
    for dir in /resume_templates/*; do \
        if [ -d "$dir" ]; then \
            folder_name=$(basename "$dir"); \
            cp "$dir/sample.pdf" "public/resume-templates/${folder_name}.pdf"; \
        fi; \
    done

# Build the React app for production
RUN pnpm build

# Step 2: Serve the static files using nginx
FROM nginx:alpine

# Copy the built React files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]