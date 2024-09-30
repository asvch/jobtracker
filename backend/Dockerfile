# Use an official Python runtime as a parent image
FROM python:3.12

# Set the working directory in the container
WORKDIR /app

# Copy only requirements.txt first to leverage Docker cache
COPY requirements.txt /app/

# Install dependencies specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . /app

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Ensure output is not buffered (useful for logging in Docker)
ENV PYTHONUNBUFFERED=1

# Run the Flask server
CMD ["flask", "run"]