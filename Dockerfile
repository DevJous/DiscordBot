FROM node:20

#RUN apt-get update && apt-get -y upgrade && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y ffmpeg

ENV WORK_FOLDER=/usr/DiscordBot
WORKDIR /usr/src/app
COPY package*.json package-lock.json tsconfig.json ./
RUN npm install
COPY . .

RUN npm run build
EXPOSE 3000

CMD ["npm", "start"]