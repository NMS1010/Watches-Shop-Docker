FROM node:14-alpine AS development 

WORKDIR /app

# This is separate so layers are cached nicely
COPY ./package.json .
COPY ./package-lock.json .

RUN npm install --legacy-peer-deps
CMD ["npm", "start"]