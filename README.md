# URL Shortener – DevOps Project

This project is a simple URL Shortener microservice built with Node.js and PostgreSQL, designed to demonstrate a complete automated software delivery process following DevOps best practices.

The solution covers the full lifecycle from source control and CI to containerization, security scanning, continuous delivery, and deployment to Kubernetes.

---

## Architecture Overview

**High-level architecture:**

- Client interacts with a REST API
- Node.js (Express) microservice handles requests
- PostgreSQL stores shortened URLs and metadata
- The application is containerized with Docker
- CI/CD pipelines are implemented using GitHub Actions
- The service is deployed to a Kubernetes cluster

**Core components:**

- **Application:** Node.js + Express
- **Database:** PostgreSQL
- **CI/CD:** GitHub Actions
- **Registry:** GitHub Container Registry (GHCR)
- **Orchestration:** Kubernetes (Docker Desktop)

---

## Repository Structure

```text
.
├── app/                    # Node.js application
|   ├── public/		    # UI source code
│   ├── src/                # Application source code
│   ├── tests/              # Unit and integration tests (Jest)
│   ├── Dockerfile          # Application Docker image
│   └── package.json
├── db/
│   ├── migrations/         # SQL migration scripts
│   ├── Dockerfile          # Migrator image
│   └── apply-migrations.sh
├── infra/
│   └── k8s/                # Kubernetes manifests
│       ├── namespace.yaml
│       ├── postgres.yaml
│       ├── postgres-secret.yaml
│       └── app.yaml
├── docs/
│   └── demo.md             # Live demo script
├── .github/
│   └── workflows/          # CI/CD pipelines
├── docker-compose.yml      # Local development setup
└── README.md
```

---

## Application Functionality

### API Endpoints

- `GET /health` – liveness probe
- `GET /ready` – readiness probe
- `POST /shorten` – create a shortened URL
- `GET /:code` – redirect to the original URL
- `GET /stats/:code` – statistics for a shortened URL

---

## Running Locally (Docker Compose)

### Prerequisites

- Docker
- Docker Compose

### Start the full stack

```bash
docker compose up --build
```

### Test the service

```bash
curl http://localhost:8080/health

curl -X POST http://localhost:8080/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

---

## Database Migrations

Database schema changes are managed using versioned SQL migrations.

- Migrations are stored in `db/migrations/`
- A dedicated **migrator container** applies them automatically

Run migrations manually:

```bash
docker compose up -d postgres
docker compose run --rm migrator
```

This approach ensures:

- Repeatable migrations
- No manual database changes
- Compatibility with CI pipelines

---

## CI Pipeline (Continuous Integration)

Implemented using **GitHub Actions**, triggered on Pull Requests.

### CI steps

1. Linting (ESLint)
2. Unit tests (Jest)
3. Database migrations smoke test
4. Docker image build
5. SAST – CodeQL security scan

This ensures every change is validated before being merged.

---

## CD Pipeline (Continuous Delivery)

The CD pipeline is triggered on **push to `main`**.

### CD steps

1. Build Docker image for the application
2. Tag image with:
   - `latest`
   - `sha-<commit>`
3. Push image to **GitHub Container Registry (GHCR)**

Image location:

```
ghcr.io/jemenchev/url-shortener-devops
```

---

## Kubernetes Deployment

The application is deployed to a Kubernetes cluster using declarative manifests.

### Kubernetes resources

- Namespace
- PostgreSQL Deployment + Service
- Application Deployment + Service
- Secrets for database credentials
- Liveness and readiness probes
- Rolling update strategy

### Deploy to Kubernetes

```bash
kubectl apply -f infra/k8s/namespace.yaml
kubectl apply -f infra/k8s/postgres-secret.yaml
kubectl apply -f infra/k8s/postgres.yaml
kubectl apply -f infra/k8s/app.yaml
```

### Port-forward for local access

```bash
kubectl -n urlshortener port-forward svc/urlshortener-app 8080:8080
```

### Test

```bash
curl http://localhost:8080/health
```

---

## Rolling Updates

The application supports rolling updates via Kubernetes.

```bash
kubectl -n urlshortener rollout status deploy/urlshortener-app
kubectl -n urlshortener rollout history deploy/urlshortener-app
```

---

## Security – SAST (CodeQL Deep Dive)

This project uses **CodeQL** for Static Application Security Testing (SAST).

### Why CodeQL?

- Detects vulnerabilities early in the SDLC
- Analyzes code without executing it
- Prevents insecure code from reaching production

### How it is used

- Runs automatically on every Pull Request
- Scans the full codebase
- Fails the pipeline if critical issues are found

Results are visible in:

```
GitHub → Security → Code scanning alerts
```

---

## Demo

A step-by-step live demo script is available in:

```
docs/demo.md
```

The demo covers:

- Architecture overview
- CI/CD pipelines
- Kubernetes deployment
- Live API usage
- Rolling updates

---

## Future Improvements

- Kubernetes Ingress with custom domain
- Horizontal Pod Autoscaling (HPA)
- Observability (Prometheus, Grafana)
- Rate limiting and authentication
- Caching layer (Redis)

---

## Conclusion

This project demonstrates a complete DevOps workflow:

- Infrastructure as Code
- Automated CI/CD pipelines
- Secure containerized application
- Kubernetes-based deployment

It is designed as an educational example of modern DevOps practices applied to a real microservice.
