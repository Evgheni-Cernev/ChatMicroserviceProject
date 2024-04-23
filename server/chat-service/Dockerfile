# First stage: Install dependencies and build the project
FROM node:14-alpine as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # If you have a build process

# Second stage: Copy the built project and install production dependencies only
FROM node:14-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
RUN npm install --only=production
EXPOSE 3008
CMD ["node", "dist/app.js"]  # Adjust the start command according to your setup
