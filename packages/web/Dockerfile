FROM node:15
COPY . /app
WORKDIR /app
RUN npm install -g serve
EXPOSE 80
CMD ["serve", "-l", "80", "packages/web/build"]
