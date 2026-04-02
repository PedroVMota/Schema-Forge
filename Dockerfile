FROM node:24-alpine

ARG VERSION=unknown
ARG BUILD_DATE
ARG VCS_REF

LABEL org.opencontainers.image.title="SQL Visualizer" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.vendor="SQL Visualizer"

WORKDIR /app

# Copy changelog and package files
COPY CHANGELOG.md* ./
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
