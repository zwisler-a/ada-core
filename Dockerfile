# Base image
FROM node:18 AS builder

# Create app directory
WORKDIR /app/

# Bundle app source
COPY . .
RUN npm install
RUN cd editor && npm install
RUN npm run build:editor
RUN npm run build


FROM node:18-alpine
WORKDIR /app/
COPY --from=builder /app/dist/ ./
COPY --from=builder /app/client/ ../client/
COPY package*.json ./
RUN npm ci --omit=dev
CMD [ "node", "main.js" ]