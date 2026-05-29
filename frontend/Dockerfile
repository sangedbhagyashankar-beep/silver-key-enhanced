FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_RAZORPAY_KEY_ID
ARG VITE_GOOGLE_MAPS_API_KEY
ENV VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
ENV VITE_API_URL=/api

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Nginx production stage
FROM nginx:1.25-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
