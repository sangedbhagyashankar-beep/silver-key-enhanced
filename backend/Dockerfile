FROM node:20-alpine AS base
WORKDIR /home/node/app

FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .

FROM base AS production
ENV NODE_ENV=production
COPY --from=deps /home/node/app/node_modules ./node_modules
COPY --from=build /home/node/app/src ./src
COPY --from=build /home/node/app/package.json ./

RUN mkdir -p logs && chown -R node:node /home/node/app
USER node

EXPOSE 5000
CMD ["node", "src/server.js"]
