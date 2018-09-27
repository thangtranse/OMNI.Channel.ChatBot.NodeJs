FROM node:10.7.0
MAINTAINER Thang Tran <thangtran.se@gmail.com>

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Bundle app src
COPY package.json /app
RUN npm install
# Bundle app source
COPY . /app

EXPOSE 3000
CMD [ "npm", "start" ]