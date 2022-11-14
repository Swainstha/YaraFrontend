FROM node:14-alpine as builder

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install
COPY . /usr/src/app

# Building app
RUN npm run build

FROM nginx:1.19.0
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d

# Expose port
EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
