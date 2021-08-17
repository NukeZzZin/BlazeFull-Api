FROM node:14
WORKDIR /usr/src/backend/node
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
EXPOSE 8000
RUN yarn start
CMD ["node", "server.js"]