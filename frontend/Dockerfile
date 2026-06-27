FROM node:20-alpine

WORKDIR /app

COPY lms-app/package*.json ./

RUN npm install

COPY lms-app/ .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
