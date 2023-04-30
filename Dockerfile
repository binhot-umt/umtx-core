FROM node:18-alpine as development
WORKDIR /app
COPY package.json yarn.lock ./
COPY privateKey ./
RUN yarn install --frozen-lockfile --ignore-scripts

FROM node:18-alpine as build
WORKDIR /app
COPY . .
COPY --from=development /app/node_modules ./node_modules
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

FROM node:18-alpine as production
WORKDIR /app
COPY --from=build /app/package.json ./
COPY --from=build /app/dist ./dist
COPY privateKey ./privateKey
COPY --from=build /app/node_modules ./node_modules

CMD [ "yarn", "start:prod" ]