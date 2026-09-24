# ---- Stage 1: build the React app ----
FROM node:22-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# The API URL is baked in at build time by Vite
ARG VITE_API_URL=http://localhost:5001
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---- Stage 2: serve the static build with nginx ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
