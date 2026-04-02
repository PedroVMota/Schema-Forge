# Self-Hosting

Schema Forge can be self-hosted using Docker or a manual Node.js setup.

## Docker (recommended)

### Pull from GitHub Container Registry

```bash
docker pull ghcr.io/pedrovmota/schema-forge:latest
docker run -p 3000:3000 ghcr.io/pedrovmota/schema-forge:latest
```

Open [http://localhost:3000](http://localhost:3000).

### Build from source

```bash
git clone https://github.com/PedroVMota/Schema-Forge.git
cd Schema-Forge
docker build -t schema-forge .
docker run -p 3000:3000 schema-forge
```

### Docker Compose

Create a `docker-compose.yml`:

```yaml
services:
  schema-forge:
    image: ghcr.io/pedrovmota/schema-forge:latest
    ports:
      - "3000:3000"
    restart: unless-stopped
```

```bash
docker compose up -d
```

## Manual setup

### Prerequisites

- Node.js 22+
- npm

### Steps

```bash
git clone https://github.com/PedroVMota/Schema-Forge.git
cd Schema-Forge
npm ci
npm run build
npm run start
```

The app starts on port 3000 by default.

## Reverse proxy

If you're running behind Nginx, Caddy, or another reverse proxy:

### Nginx example

```nginx
server {
    listen 80;
    server_name schema.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Caddy example

```
schema.example.com {
    reverse_proxy localhost:3000
}
```

## Environment variables

Schema Forge currently has no required environment variables. It runs as a static client-side app served by Next.js.

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `production` | Node environment |
