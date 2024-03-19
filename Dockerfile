# Use this image as the platform to build the app
FROM node:21-alpine AS builder
ENV NODE_OPTIONS="--max-old-space-size=3000"

LABEL Developers="Jan Tomassi"

WORKDIR /app

COPY package*.json ./
COPY node_modules ./node_modules

# Clean install all node modules
RUN npm i


FROM builder as install

WORKDIR /app

COPY .svelte-kit         ./svelte-kit
COPY src                 ./src
COPY static              ./static
COPY .*ignore            ./
COPY *.config.js         ./
COPY *.config.ts         ./
COPY tsconfig.json       ./
COPY .eslintrc.cjs       ./
COPY .*rc                ./

# Build SvelteKit app
RUN npm run build

RUN find -maxdepth 1 \( -type d -not \( -name node_modules -o -name . -o -name build \) -or -type f -not \( -name package.json -o -name package-lock.json \) \) -exec rm -rf {} \;

USER node:node
EXPOSE 3000/tcp
ENV PROTOCOL_HEADER=x-forwarded-proto 
ENV HOST_HEADER=x-forwarded-host

CMD ["node","build"]
