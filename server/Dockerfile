FROM node:14-alpine
WORKDIR /src

COPY . /src
RUN yarn
EXPOSE 4000

CMD ["yarn", "dev"]