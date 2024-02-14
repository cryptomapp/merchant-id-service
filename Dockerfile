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
RUN mkdir -p dist/images  

# Copy the built code from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/config/categories.json ./dist/config/categories.json
COPY --from=builder /app/images/blueprint.png ./dist/images/blueprint.png  
COPY package*.json ./
COPY yarn.lock ./

# Install only production dependencies using Yarn
RUN yarn install --production

EXPOSE 3000

CMD ["node", "dist/app.js"]
