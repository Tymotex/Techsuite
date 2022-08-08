# ---------------------------------------------------------------------------- #
#                                Stage 1 (Build)                               #
# ---------------------------------------------------------------------------- #
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json .
RUN yarn install

COPY . .

RUN ["yarn", "build-docker-compose"]

# ---------------------------------------------------------------------------- #
#                                Stage 2 (Serve)                               #
# ---------------------------------------------------------------------------- #

FROM nginx:1.23-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /app/build
