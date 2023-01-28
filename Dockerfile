# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .
RUN npm install

RUN cd editor && npm install && npm run build

RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]