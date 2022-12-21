FROM node
WORKDIR /app
COPY . /app
RUN npm i
WORKDIR /app/frontend
RUN npm i
WORKDIR /app
CMD npm run start-dev