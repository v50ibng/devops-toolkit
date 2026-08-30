FROM node:20-alpine

# Install openssl (required for the SSL tools)
RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json package-lock.json* ./
# Use npm install (package-lock may not exist yet in some environments)
RUN npm install --omit=dev

COPY . .

ENV PORT=3001
ENV CORS_ORIGIN=http://localhost

EXPOSE 3001

CMD ["node", "index.js"]
