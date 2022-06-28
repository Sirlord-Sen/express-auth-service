# base for our image, based on buildpack-deps, based on Debian Linux
FROM node:16

# Default env file
ENV ENV_FILE=config/.env.dev

# Create app directory
WORKDIR /usr/express-auth-service

# Install app dependencies
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --save --legacy-peer-deps

# Build JavaScript from TypeScript
COPY . .
RUN NODE_OPTIONS=--max-old-space-size=8192 npm run build

# Tell docker which port will be used (not published)
EXPOSE 4000

# RUN chown -R node /usr/express-auth-service
# USER node

COPY wait-for-it.sh .
# Run this app when a container is launched
CMD npm run start:dev
