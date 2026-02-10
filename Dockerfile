# Stage 1: Build
FROM node:22.12.0-alpine AS builder

# Define build argument for environment
ARG NODE_ENV=prod
ENV NODE_ENV=$NODE_ENV

WORKDIR /usr/src/app

# Copy package.json
COPY ./package.json ./
COPY ./index.js ./
COPY . .

# Install dependencies
RUN yarn install

# Copy the correct .env file based on the build argument
# COPY .env.$NODE_ENV .env

EXPOSE 3010

CMD ["node", "index.js"]