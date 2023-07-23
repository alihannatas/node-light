FROM node:20-alpine as  build 
 
WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx-1.25.1-alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

RUN ["nginx", '-g', 'daemon off;']


