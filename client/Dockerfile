# build stage
FROM node as builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY public/ public/
COPY src/ src/
RUN yarn build

# serve stage
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
