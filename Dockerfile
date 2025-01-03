FROM node:20

RUN apt-get update && apt-get -y upgrade && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY package*.json ./
#RUN npm ci --omit=dev
RUN npm install
COPY . .
COPY .env .env

RUN npm run build
EXPOSE 3000

CMD ["npm", "start"]
