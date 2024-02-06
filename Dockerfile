# Stage 1: Building the application
FROM node:18 as builder

# Set the working directory in the Docker image
WORKDIR /app

# Copy package.json and yarn.lock
COPY package*.json ./
COPY yarn.lock ./

# Install Yarn and dependencies
RUN yarn install

# Copy the rest of your app's source code
COPY . .

# Compile TypeScript to JavaScript
RUN yarn build

# Stage 2: Create the production image
FROM node:18-slim

WORKDIR /app

RUN mkdir uploads/

# Copy the built code from the builder stage
COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY yarn.lock ./
COPY my-solana-wallet.json /app/ 

# Install only production dependencies using Yarn
RUN yarn install --production

EXPOSE 3000

CMD ["node", "dist/app.js"]
