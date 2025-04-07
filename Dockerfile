FROM node:latest

WORKDIR /app

COPY package*.json yarn.lock* ./

RUN npm install

COPY . .

RUN npm install

CMD ["npm", "run", "build"]
