# Live Demo Script – URL Shortener DevOps Project

This document describes the live demo flow for the project presentation (12–15 minutes).

---

## 1. High-level Solution Design (1–2 minutes)

- The project is a URL Shortener implemented as a Node.js microservice.
- The service exposes a REST API and stores data in PostgreSQL.
- The application is containerized using Docker.
- CI/CD pipelines are implemented using GitHub Actions.
- The application is deployed to Kubernetes (Docker Desktop cluster).

Main components:
- Node.js (Express) application
- PostgreSQL database
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Kubernetes

---

## 2. Low-level Solution Design (3–4 minutes)

### Application
- Express-based REST API
- Endpoints:
  - `POST /shorten`
  - `GET /:code`
  - `GET /health`
  - `GET /ready`

### Database
- PostgreSQL with versioned SQL migrations
- Migrations are stored in `db/migrations`
- A dedicated migrator container applies schema changes

### Kubernetes
- Separate deployments for application and database
- Secrets used for database credentials
- Liveness and readiness probes configured
- Rolling update strategy enabled

---

## 3. CI Pipeline (3–4 minutes)

Open GitHub → Actions → CI workflow.

Show:
- Linting (ESLint)
- Unit tests (Jest)
- Database migration smoke test
- Docker image build
- SAST scan using CodeQL

Explain that CI runs automatically on every Pull Request.

---

## 4. CD Pipeline and Artifact Delivery (2–3 minutes)

Open GitHub → Actions → CD workflow.

Show:
- Trigger on push to `main`
- Docker image build
- Push to GitHub Container Registry (GHCR)

Open GitHub → Packages:
- Show the image `ghcr.io/jemenchev/url-shortener-devops`
- Tags: `latest`, `sha-<commit>`

Explain that this represents the delivery of a deployable artifact.

---

## 5. Kubernetes Live Demo (3–4 minutes)

Show Kubernetes state:
```bash
kubectl -n urlshortener get pods
```

Port-forward the application:
```bash
kubectl -n urlshortener port-forward svc/urlshortener-app 8080:8080
```

Test the application:
```bash
curl http://localhost:8080/health
```

Create a short URL:
```bash
curl -X POST http://localhost:8080/shorten   -H "Content-Type: application/json"   -d '{"url":"https://example.com"}'
```

Open the returned short URL in a browser to demonstrate redirect.

---

## 6. Rolling Update Demonstration (1–2 minutes)

Show rollout information:
```bash
kubectl -n urlshortener rollout history deploy/urlshortener-app
kubectl -n urlshortener rollout status deploy/urlshortener-app
```

Explain how new images are deployed without downtime.

---

## 7. Future Improvements (1 minute)

Possible future enhancements:
- Kubernetes Ingress and custom domain
- Horizontal Pod Autoscaling
- Observability (Prometheus, Grafana)
- Rate limiting and authentication
- Caching (Redis)

---

## End of Demo
