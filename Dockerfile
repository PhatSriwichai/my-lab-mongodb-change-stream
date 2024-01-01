FROM node:16.15.1

WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY src src

# CMD ["npm", "run", "start:change-stream"]
CMD ["node", "./src/change-stream.js"]