# Scalability Notes

## Current Architecture

The app follows a modular MVC pattern with versioned routes (`/api/v1/`), making it straightforward to extend with new features or API versions without breaking existing clients.

## How This Scales

### Horizontal Scaling

- The server is stateless — JWT auth doesn't require server-side sessions, so you can run multiple instances behind a load balancer (e.g., Nginx, AWS ALB) without sticky sessions.
- PostgreSQL handles concurrent connections well with connection pooling (already configured via Sequelize pool settings).

### Caching (Redis)

For read-heavy routes (like task listing), adding Redis as a caching layer would cut database load significantly:

- Cache task lists with a short TTL (30-60s)
- Invalidate on create/update/delete
- Store JWT blacklist for token revocation on logout

### Database Scaling

- Add indexes on frequently queried columns (`userId`, `status`, `priority`)
- Read replicas for scaling read operations
- Partitioning for large datasets (e.g., by date range)

### Microservices

As the app grows, it can be split into independent services:

- **Auth Service** — handles registration, login, token management
- **Task Service** — handles all task CRUD
- **Notification Service** — email/push notifications for task deadlines

Each service communicates via REST or a message queue (RabbitMQ, Kafka).

### Containerization

- Dockerize each service for consistent deployment
- Use Docker Compose for local dev, Kubernetes for production orchestration
- CI/CD pipeline with GitHub Actions for automated testing and deployment

### Rate Limiting & Security

- Add rate limiting (e.g., `express-rate-limit`) to prevent abuse
- Helmet.js for security headers
- API gateway (Kong, AWS API Gateway) for centralized auth and throttling

## Summary

The current codebase is built with scalability in mind: stateless auth, modular route structure, connection pooling, and clean separation of concerns. Moving to a distributed architecture would involve adding Redis, containerizing services, and introducing a load balancer — none of which require major rewrites.
