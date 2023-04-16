# Base image
FROM node:18 AS builder

# Create app directory
WORKDIR /app/

# Bundle app source
COPY . .
RUN npm install
RUN npm run build


FROM node:18-alpine
WORKDIR /app/
COPY --from=builder /app/dist/ ./
COPY package*.json ./
RUN npm ci --omit=dev
CMD [ "node", "main.js" ]