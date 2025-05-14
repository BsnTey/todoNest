FROM node:24-alpine3.20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV PORT=${PORT}
CMD ["npm", "run", "start"]
