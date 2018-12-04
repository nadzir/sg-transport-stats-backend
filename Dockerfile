FROM node:8.12.0-alpine

# Create work directory
WORKDIR /usr/src/app

# Install runtime dependencies
RUN npm install yarn -g

# Copy app source to work directory
COPY . /usr/src/app

# Install app dependencies
RUN npm install
RUN npm start build

# Build and run the app
CMD npm start serve
