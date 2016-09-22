FROM node:6.4.0-wheezy

# Pass node environment into container at run-time
ENV NODE_ENV development
ENV DB mongodb://localhost/express-mongoose-es6-rest-api-development
ENV PORT 3000
ENV JWT_SECRET 0a6b944d-d2fb-46fc-a85e-0295c986cd9f
ENV DOCKER true

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install
RUN npm install -g gulp

# Bundle app source
COPY gulpfile.babel.js /usr/src/app
COPY index.js /usr/src/app

RUN mkdir /usr/src/app/config
COPY config /usr/src/app/config

RUN mkdir /usr/src/app/server
COPY server /usr/src/app/server

RUN npm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]