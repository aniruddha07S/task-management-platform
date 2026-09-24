# ---- Backend API image ----
FROM node:22-slim

WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies (layer is cached unless package files change)
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Run as the non-root user that ships with the node image
USER node

EXPOSE 5001
ENV PORT=5001

CMD ["node", "server.js"]
