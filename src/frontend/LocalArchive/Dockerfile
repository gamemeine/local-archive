# Use Node.js for building Angular
FROM node:18 AS build

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the Angular app code
COPY . .

# Build the Angular app
RUN npm run build --output-path=dist

# Use Nginx to serve Angular
FROM nginx:latest

# Copy the built Angular app to Nginx
COPY --from=build /app/dist/local-archive/browser /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
