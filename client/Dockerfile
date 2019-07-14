# build stage
FROM node as builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --prod
COPY . ./
RUN yarn build

# serve stage
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
