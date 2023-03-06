FROM node:14-alpine
WORKDIR /src

COPY . /src
RUN yarn
EXPOSE 3000

CMD ["yarn", "dev"]