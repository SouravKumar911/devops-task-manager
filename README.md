# DevOps Task Manager

A full-stack task management application with a DevOps workflow covering containerization, Kubernetes orchestration, CI automation, Infrastructure as Code, and application monitoring.

## Project Overview

DevOps Task Manager allows users to create, view, update, and delete tasks through a React-based interface. The backend uses Node.js and Express.js to expose REST APIs, while MongoDB Atlas stores application data.

The project demonstrates how a full-stack application can be containerized, deployed locally on Kubernetes, monitored using Prometheus and Grafana, and validated through GitHub Actions.

## Features

- Create, read, update, and delete tasks (CRUD).
- REST API integration.
- Persistent MongoDB storage.
- Responsive React frontend.
- Docker containerization.
- Kubernetes deployment and scaling.
- Health checks and self-healing.
- CI automation using GitHub Actions.
- Application metrics and monitoring.
- Grafana dashboards and alert rules.

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Containerization | Docker, Docker Compose |
| Orchestration | Kubernetes, kind |
| Kubernetes Configuration | Kustomize |
| CI Automation | GitHub Actions |
| Infrastructure as Code | Terraform (local lab) |
| Monitoring | Prometheus, Grafana |
| Version Control | Git, GitHub |

## Architecture

```text
                 User
                   |
                   v
            React Frontend
                   |
                   v
          Node.js / Express API
                   |
                   v
              MongoDB Atlas

          DevOps Workflow
                   |
       +-----------+-----------+
       |           |           |
     Docker    Kubernetes   Terraform
       |           |
       |        Kustomize
       |           |
       +-----------+
                   |
             GitHub Actions
                   |
          Prometheus Monitoring
                   |
                Grafana
```

## DevOps Implementation

### 1. Docker

- Created separate Dockerfiles for frontend and backend.
- Used a multi-stage Docker build for the frontend.
- Used Docker Compose to run application services.
- Added `.dockerignore` files to avoid copying unnecessary files and secrets into images.

### 2. Kubernetes

Deployed the application on a local Kubernetes cluster using kind.

Implemented:

- Deployments and Services.
- Multiple backend replicas.
- Ingress for application access.
- Readiness and liveness probes.
- ConfigMaps and Secrets.
- CPU and memory requests and limits.
- Horizontal Pod Autoscaler (HPA).
- Role-Based Access Control (RBAC).
- Persistent Volumes and Persistent Volume Claims.
- StatefulSets, Jobs, and CronJobs.
- Network Policies in a separate Calico-enabled lab cluster.
- Rollout updates and rollback.

### 3. Kustomize

Organized Kubernetes manifests using a reusable base and environment-specific overlays.

- Base configuration.
- Development overlay.
- Production overlay.

### 4. GitHub Actions

Implemented an automated CI workflow that:

- Checks out the repository.
- Installs frontend and backend dependencies.
- Runs frontend linting.
- Builds the frontend.
- Checks backend JavaScript syntax.
- Builds frontend and backend Docker images.

### 5. Terraform

Practiced Infrastructure as Code using Terraform and the local provider.

- Initialized Terraform.
- Created a local file resource.
- Executed `terraform plan` and `terraform apply`.
- Managed Terraform state.
- Executed `terraform destroy`.

This was a local Terraform exercise; no paid cloud infrastructure was provisioned.

### 6. Prometheus and Grafana

Implemented application monitoring using Prometheus and Grafana.

- Exposed Node.js application metrics through `/metrics`.
- Configured Prometheus to scrape backend metrics.
- Connected Grafana to Prometheus.
- Created dashboards for backend CPU, memory, and Node.js heap usage.
- Created a backend memory alert rule.

## Local Setup

### Prerequisites

- Node.js and npm
- Git
- MongoDB Atlas account or a compatible MongoDB instance

### 1. Clone the repository

```bash
git clone https://github.com/SouravKumar911/devops-task-manager.git
cd devops-task-manager
```

### 2. Start the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
```

Start the backend:

```bash
npm run dev
```

Backend: `http://localhost:5000`

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

## Kubernetes Deployment

The Kubernetes manifests are organized inside the `k8s/` directory.

After setting up a local kind cluster, building and loading the required Docker images, and creating the required Kubernetes Secret and ConfigMap, deploy the development environment using:

```bash
kubectl apply -k k8s/overlays/development
```

Check deployments and Pods:

```bash
kubectl get deployments
kubectl get pods
kubectl get services
```

## Monitoring Access

Use Kubernetes port forwarding to access the monitoring tools:

**Prometheus**

```bash
kubectl port-forward -n monitoring service/prometheus-service 9090:9090
```

Open `http://localhost:9090`.

**Grafana**

```bash
kubectl port-forward -n monitoring service/grafana-service 3000:3000
```

Open `http://localhost:3000`.

The local lab was configured with the Grafana credentials `admin/admin`. Change default credentials before any production use.

## Repository Structure

```text
devops-task-manager/
│
├── frontend/
├── backend/
│   ├── config/
│   ├── models/
│   ├── server.js
│   └── Dockerfile
│
├── k8s/
│   ├── base/
│   ├── overlays/
│   │   ├── development/
│   │   └── production/
│   ├── grafana.yaml
│   ├── prometheus.yaml
│   └── prometheus-config.yaml
│
├── terraform-lab/
│   └── main.tf
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Key Learning Outcomes

- Understanding containerization and Docker image creation.
- Deploying and managing applications on Kubernetes.
- Working with Kubernetes scaling, networking, storage, and security.
- Automating code validation and Docker builds using GitHub Actions.
- Understanding Infrastructure as Code with Terraform.
- Monitoring application performance using Prometheus and Grafana.

## Project Status

The application and DevOps workflow have been implemented and tested in a local development environment using Docker and kind Kubernetes.

Cloud deployment to AWS or another cloud provider has not been performed.

## Author

**Sourav Kumar**

GitHub: https://github.com/SouravKumar911
