# 🚀 NovaCart — DevOps Automation, Deployment & Monitoring

**Automating the journey from source code to a deployed and monitored application.**

NovaCart is a full-stack e-commerce application used to demonstrate an end-to-end DevOps workflow. The application is built with Node.js, Express.js, MongoDB, and JavaScript, while the DevOps implementation focuses on containerization, CI/CD, infrastructure automation, orchestration, and monitoring.

This project integrates **Docker, Docker Hub, Jenkins, Terraform, Ansible, Kubernetes (K3s), Helm, Prometheus, Grafana, and AWS EC2** to demonstrate how an application can be built, deployed, and monitored in a cloud environment.

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Objectives](#-objectives)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Infrastructure Setup](#-infrastructure-setup)
- [CI/CD Workflow](#-cicd-workflow)
- [Docker and Docker Hub](#-docker-and-docker-hub)
- [Jenkins Pipeline](#-jenkins-pipeline)
- [Terraform](#-terraform)
- [Ansible](#-ansible)
- [Kubernetes Deployment](#-kubernetes-deployment)
- [Helm](#-helm)
- [Monitoring with Prometheus and Grafana](#-monitoring-with-prometheus-and-grafana)
- [Application Features](#-application-features)
- [Repository Structure](#-repository-structure)
- [Deployment Verification](#-deployment-verification)
- [Security Considerations](#-security-considerations)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## 🎯 Project Overview

The primary goal of this project is to implement a practical DevOps workflow for deploying and operating NovaCart.

The application source code is maintained in GitHub. Jenkins automates the image build and deployment workflow, Docker packages the application, and Docker Hub stores the published images. Kubernetes runs the application and database workloads, while Helm manages the application release.

Terraform and Ansible demonstrate infrastructure-as-code validation and configuration automation. Prometheus and Grafana provide application availability monitoring and metric visualization.

### Key Highlights

- Containerized application deployment using Docker.
- Automated build and deployment pipeline using Jenkins.
- Versioned Docker images published to Docker Hub.
- Infrastructure-as-code workflow using Terraform.
- Configuration automation using Ansible.
- Kubernetes orchestration using K3s.
- Application release management using Helm.
- Application health monitoring using Prometheus.
- Monitoring dashboards using Grafana.
- Cloud-hosted deployment using AWS EC2.

---

## 🎯 Objectives

- Automate the application build and deployment process.
- Reduce manual deployment steps through CI/CD.
- Package the application into a reusable Docker image.
- Publish images to a container registry.
- Deploy and manage application workloads using Kubernetes.
- Automate configuration tasks using Ansible.
- Validate infrastructure configuration using Terraform.
- Monitor application availability and visualize metrics.
- Demonstrate an end-to-end DevOps implementation using cloud infrastructure.

---

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|---|---|---|
| Source Control | Git, GitHub | Version control and source management |
| Frontend | HTML, CSS, Bootstrap, JavaScript | User interface |
| Backend | Node.js, Express.js | Application server and REST APIs |
| Database | MongoDB | Persistent application data |
| Containerization | Docker | Build and run application containers |
| Container Registry | Docker Hub | Store and distribute images |
| CI/CD | Jenkins | Automate image builds and deployment |
| Infrastructure as Code | Terraform | Infrastructure configuration, validation, and planning |
| Configuration Management | Ansible | Automate server configuration tasks |
| Orchestration | Kubernetes (K3s) | Manage application and database workloads |
| Package Management | Helm | Manage Kubernetes application releases |
| Monitoring | Prometheus | Collect monitoring and probe metrics |
| Visualization | Grafana | Display monitoring dashboards |
| Cloud Platform | AWS EC2 | Host the DevOps and application environments |

---

## 🏗️ Architecture

```text
                      Developer
                          |
                          v
                    GitHub Repository
                          |
                          v
                    Jenkins Pipeline
                    (DevOps EC2)
                          |
                          v
                    Docker Image Build
                          |
                          v
                       Docker Hub
                          |
                          v
                  Kubernetes Deployment
                          |
                          v
             +----------------------------+
             |       AWS EC2 App Server   |
             |                            |
             |          K3s Cluster       |
             |                            |
             |   +--------------------+   |
             |   |  NovaCart App      |   |
             |   |  Express.js :5000  |   |
             |   +--------------------+   |
             |             |              |
             |   +--------------------+   |
             |   |  MongoDB           |   |
             |   |  simple_store      |   |
             |   +--------------------+   |
             |                            |
             |   Helm-managed resources   |
             +----------------------------+
                          |
                          v
                  Kubernetes NodePort
                       :30486
                          |
                          v
                    User's Browser

                  Monitoring Components
                          |
                          v
                     Prometheus
                          |
                          v
                       Grafana
```

### Workflow Explanation

1. Source code is maintained in GitHub.
2. Jenkins executes the configured CI/CD pipeline.
3. Docker builds an image containing the application.
4. The image is published to Docker Hub.
5. Jenkins updates the Kubernetes application deployment.
6. K3s runs the application and MongoDB workloads.
7. Helm manages the NovaCart Kubernetes release.
8. Prometheus checks application availability using the health endpoint.
9. Grafana visualizes the configured monitoring metrics.

---

## ☁️ Infrastructure Setup

The project uses two AWS EC2 instances in the `ap-south-1` region.

| Instance | Responsibility | Components |
|---|---|---|
| `novacart-devops` | CI/CD and automation | Jenkins, Docker, Terraform, Ansible |
| `novacart-app` | Application deployment and monitoring | K3s, Helm, NovaCart, MongoDB, Prometheus, Grafana |

### DevOps Server

The DevOps server is responsible for:

- Running the Jenkins pipeline.
- Building Docker images.
- Publishing images to Docker Hub.
- Executing Terraform validation and planning.
- Running Ansible automation.
- Initiating application deployment updates.

### Application Server

The application server is responsible for:

- Running the K3s Kubernetes environment.
- Hosting the NovaCart application.
- Running MongoDB.
- Managing application resources through Helm.
- Running Prometheus and Grafana.

### Application Access

The application is exposed through Kubernetes NodePort `30486`.

```text
http://<APPLICATION_EC2_PUBLIC_IP>:30486
```

Replace `<APPLICATION_EC2_PUBLIC_IP>` with the current public IP address shown in the AWS Console.

---

## 🔄 CI/CD Workflow

The Jenkins pipeline automates the key steps involved in deploying an application update.

```text
GitHub
   |
   v
Source Code
   |
   v
Jenkins Pipeline
   |
   v
Build Docker Image
   |
   v
Push Image to Docker Hub
   |
   v
Update Kubernetes Deployment
   |
   v
Wait for Deployment Rollout
   |
   v
Verify Application
```

### Pipeline Responsibilities

- Retrieve the configured application source.
- Build the Docker image.
- Publish the image to Docker Hub.
- Update the Kubernetes Deployment to use the new image.
- Wait for the rollout to complete.

A successful pipeline execution has built and published a versioned image and updated the running Kubernetes deployment.

### Image Versioning

The pipeline uses Jenkins build numbers to identify published images.

Example:

```text
bunny9596/novacart:<BUILD_NUMBER>
```

`<BUILD_NUMBER>` represents the Jenkins build number associated with that image.

Versioned images make it easier to identify which build is deployed and to investigate deployment issues.

---

## 🐳 Docker and Docker Hub

Docker is used to package the NovaCart application into a container image.

### Docker Concepts Used

- **Dockerfile:** Defines the application image build process.
- **Image:** Contains the packaged application and its required runtime components.
- **Container:** Runs an instance of the image.
- **Docker Hub:** Stores the published application images.

### Docker Hub Repository

The application image repository is:

`bunny9596/novacart`

Jenkins builds and publishes images to this repository as part of the configured pipeline.

### Verification Commands

```bash
docker images
docker ps
```

These commands list locally available images and running containers on the machine where Docker is being used.

---

## ⚙️ Jenkins Pipeline

Jenkins automates the build and deployment process from the DevOps server.

### Main Stages

1. **Source Retrieval:** Uses the configured project source.
2. **Build:** Creates the Docker image.
3. **Publish:** Pushes the image to Docker Hub.
4. **Deploy:** Updates the Kubernetes application image.
5. **Verification:** Waits for the Kubernetes rollout to complete.

### Deployment Verification

On the application server, run:

```bash
kubectl rollout status deployment/novacart-app
```

A successful rollout indicates that Kubernetes has completed the requested Deployment update.

Jenkins uses configured credentials for Docker Hub and Kubernetes access. Credentials are managed separately and must never be committed to GitHub.

---

## 🏗️ Terraform

Terraform demonstrates an infrastructure-as-code workflow.

The current Terraform configuration uses AWS data sources and outputs to retrieve account and region information.

### Terraform Workflow

```text
Terraform Configuration
          |
          v
     terraform init
          |
          v
   terraform validate
          |
          v
     terraform plan
```

### Commands

```bash
terraform init
terraform validate
terraform plan
```

- `terraform init` initializes the working directory and required providers.
- `terraform validate` checks the configuration for structural and syntax errors.
- `terraform plan` previews the changes Terraform would make.

**Current scope:** The existing configuration supports initialization, validation, and planning. It does not currently provision the two EC2 instances.

Always review a Terraform plan before applying changes.

---

## 🔧 Ansible

Ansible automates configuration tasks on the DevOps server.

The configured playbook includes local configuration tasks under `/opt/novacart`.

### Core Concepts

| Concept | Description |
|---|---|
| Control Node | Machine from which Ansible commands are executed |
| Inventory | Defines the target hosts |
| Playbook | Describes the automation tasks |
| Modules | Perform individual configuration operations |
| Idempotence | Allows repeated execution without unnecessary changes when the desired state is already achieved |

### Benefits

- Reduces repetitive manual configuration.
- Makes configuration steps easier to reproduce.
- Keeps automation tasks in version-controlled files.
- Supports repeatable execution.

The playbook has been executed successfully. Its precise responsibilities depend on the tasks defined in the repository.

---

## ☸️ Kubernetes Deployment

K3s provides a lightweight Kubernetes environment for deploying and managing NovaCart.

### Kubernetes Resources

| Resource | Purpose |
|---|---|
| `novacart-app` Deployment | Manages NovaCart application pods |
| `novacart-mongo` Deployment | Runs MongoDB |
| `novacart-service` Service | Provides internal application service access |
| NodePort `30486` | Exposes the application through the configured node port |
| `novacart-mongo-pvc` | Provides persistent storage for MongoDB |

### Application Configuration

The Express application listens on port `5000` inside the container.

The Kubernetes Service exposes the application through NodePort `30486`.

MongoDB is accessed using its Kubernetes service hostname. The application uses the `simple_store` database.

### Useful Commands

Check cluster nodes:

```bash
kubectl get nodes
```

Check application resources:

```bash
kubectl get deployments
kubectl get pods
kubectl get services
kubectl get pvc
```

Check deployment status:

```bash
kubectl rollout status deployment/novacart-app
```

View application logs:

```bash
kubectl logs deployment/novacart-app
```

MongoDB uses persistent storage. Avoid deleting its PersistentVolumeClaim or backing volume unless the data is intentionally disposable.

---

## 📦 Helm

Helm manages the NovaCart Kubernetes release.

The chart is located at:

```text
helm/novacart/
```

The Helm release is named:

```text
novacart
```

### Useful Commands

List Helm releases:

```bash
helm list
```

Check release status:

```bash
helm status novacart
```

View configured values:

```bash
helm get values novacart
```

### Why Helm?

- Organizes Kubernetes resources into a reusable chart.
- Simplifies installation and upgrades.
- Provides release history and status information.
- Makes configuration easier to manage across deployments.

**Image-tag consideration:** Jenkins uses build-specific image tags, while the chart values have used `latest`. Keep the image tag consistent between Jenkins and Helm to prevent a future Helm upgrade from reverting the Deployment to a different image.

---

## 📊 Monitoring with Prometheus and Grafana

Prometheus and Grafana are used to monitor application availability and visualize configured metrics.

### Prometheus

Prometheus monitors NovaCart using a configured blackbox probe targeting the application's health endpoint.

```text
http://novacart-service.default.svc.cluster.local/api/health
```

The probe metric is:

```promql
probe_success{app="novacart"}
```

Interpretation:

- `1` — the probe succeeded.
- `0` — the probe failed.

### Monitoring Verification

Check monitoring pods:

```bash
kubectl get pods -n monitoring
```

Check monitoring services:

```bash
kubectl get services -n monitoring
```

Open the Prometheus interface through the configured access method and query:

```promql
probe_success{app="novacart"}
```

### Grafana

Grafana provides dashboards for visualizing configured monitoring metrics.

The dashboards can be used to inspect application probe status and other metrics available through the configured data source.

Prometheus and Grafana should not be exposed publicly without suitable access controls.

---

## 🛍️ Application Features

NovaCart is the e-commerce workload used to demonstrate the DevOps implementation.

### Customer Features

- Browse and search products.
- Filter products by category.
- View product details.
- Add products to a shopping cart.
- Adjust product quantities.
- Submit checkout details.
- Place orders.
- Retrieve order history using an email address.

### Admin Features

- Add, edit, and delete products.
- Update product prices and stock.
- Manage product descriptions and categories.
- View customer orders.
- Update order status.

### Application Technology

| Component | Technology |
|---|---|
| Frontend | HTML, CSS, Bootstrap, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Database ODM | Mongoose |
| API Communication | REST APIs and Fetch API |

### Important Endpoints

| Endpoint | Purpose |
|---|---|
| `/` | Product catalog |
| `/admin.html` | Admin dashboard |
| `/api/products` | Product API |
| `/api/products/categories` | Product categories |
| `/api/orders` | Order API |
| `/api/health` | Health check |

---

## 📁 Repository Structure

The repository contains application code and DevOps configuration.

```text
devops-e_commerce/
├── backend/                 # Node.js / Express application
├── frontend/                # Frontend assets
├── terraform/               # Terraform configuration
├── ansible/                 # Ansible automation
├── helm/
│   └── novacart/             # NovaCart Helm chart
├── Dockerfile               # Container image definition, if present at root
├── Jenkinsfile              # Jenkins pipeline, if present at root
└── README.md
```

The exact paths of `Dockerfile`, `Jenkinsfile`, and any standalone Kubernetes manifests should match the files committed to the deployment branch. Update this tree if those files are stored in different directories or are not present.

---

## ✅ Deployment Verification

Use these checks to verify the application after deployment.

### 1. Verify Kubernetes Workloads

```bash
kubectl get deployments
kubectl get pods
kubectl get services
```

Confirm that the NovaCart application and MongoDB pods are running and ready.

### 2. Verify Application Health

On the application server, run:

```bash
curl -i http://localhost:30486/api/health
```

The endpoint has returned HTTP `200` with a response similar to:

```json
{
  "status": "OK"
}
```

### 3. Verify Product Categories

```bash
curl -s http://localhost:30486/api/products/categories
```

The seeded product catalog includes:

- Electronics
- Clothing
- Accessories

### 4. Verify Monitoring

Run the following query in Prometheus:

```promql
probe_success{app="novacart"}
```

A value of `1` indicates a successful probe.

### 5. Open the Application

```text
http://<APPLICATION_EC2_PUBLIC_IP>:30486
```

Replace the placeholder with the current public IP address of the application EC2 instance.

---

## 🔐 Security Considerations

- Never commit AWS credentials, private keys, access tokens, or `.env` secrets.
- Store Docker Hub and Kubernetes credentials in Jenkins credentials or an appropriate secret manager.
- Restrict SSH and administrative access to the EC2 instances.
- Avoid exposing Jenkins, Grafana, Prometheus, and Kubernetes administration interfaces publicly.
- Permit only required inbound traffic through AWS security groups.
- Preserve MongoDB persistent storage during cleanup.
- Review Terraform plans before applying infrastructure changes.
- The database seed script clears existing product records before inserting sample data.
- Verify authentication and authorization on administrative APIs before exposing the application publicly.

A successful health check does not by itself prove that every dependency is healthy or that the application is production-secure.

---

## ⚠️ Current Scope and Limitations

This is an educational DevOps project and lab deployment.

- Terraform currently demonstrates initialization, validation, and planning rather than provisioning the EC2 instances.
- Jenkins has successfully built and published a versioned Docker image and updated the Kubernetes Deployment.
- K3s is used for Kubernetes orchestration.
- Helm manages the NovaCart application release.
- Prometheus monitors application availability through a health probe.
- Grafana visualizes configured metrics.
- Production-grade authentication, payment processing, high availability, disaster recovery, and comprehensive security hardening are outside the current demonstrated scope.

---

## 🚀 Future Improvements

Potential enhancements include:

- Provision AWS resources through reusable Terraform modules.
- Use consistent immutable image tags across Jenkins and Helm.
- Add automated unit, integration, and API tests to the pipeline.
- Add image and dependency vulnerability scanning.
- Implement deployment rollback and release promotion.
- Configure Prometheus alert rules and notifications.
- Expand Grafana dashboards for application, pod, node, and resource metrics.
- Improve secret management and access control.
- Document MongoDB backup and restore procedures.
- Create a repeatable cleanup workflow that protects persistent data.

---

## 📄 License

This project is intended for educational purposes.
