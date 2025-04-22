# Use Node.js for building Angular
FROM node:18 AS build

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the Angular app code
COPY . .

# Build the Angular app
RUN npm run build --output-path=dist

# Use Nginx to serve Angular
FROM nginx:latest

# Modify the default Nginx config to listen on port 8080 without a separate config file
RUN sed -i 's/listen\s*80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

# Copy the built Angular app to Nginx
COPY --from=build /app/dist/local-archive/browser /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
