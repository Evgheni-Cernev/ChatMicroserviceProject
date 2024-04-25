FROM node:14-alpine as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # If you have a build process

FROM node:14-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
RUN npm install --only=production
EXPOSE 3009
CMD ["node", "dist/app.js"]  # Adjust the start command according to your setup
