FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV PORT=5000
ENV MONGODB_URI=mongodb://mongodb:27017/task_management_system

EXPOSE 5000

CMD ["node", "src/server.js"]
