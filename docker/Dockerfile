FROM node:20.0.0-slim

ARG TIMEZONE="Asia/Dhaka"

ENV TZ="${TIMEZONE}"

# For common packages
RUN echo "deb http://archive.debian.org/debian stretch main" > /etc/apt/sources.list

# Apt install, openssl setup
RUN apt-get update -y \
  && apt-get install curl -y \
  && apt-get autoremove -y \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# For App
WORKDIR /usr/src/app

COPY ./app/package*.json ./

RUN npm install && \
    npm install -g dedupe-csv && \
    npm list --depth=0 && \
    npm cache verify

COPY ./app/ .

RUN npm run build

CMD ["node", "dist/index"]
