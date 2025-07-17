FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8000
EXPOSE 9464

ENV OTEL_RESOURCE_ATTRIBUTES=service.name=node-todo-cicd

CMD ["node", "app.js"]
