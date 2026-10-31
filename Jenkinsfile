pipeline {
    agent any

    environment {
        IMAGE_NAME = 'bunny9596/novacart'
        K8S_SERVER = 'https://172.31.23.221:6443'
        K8S_CA_CERT = '/etc/jenkins/kubernetes/ca.crt'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Source code is available in the Jenkins workspace.'
                sh 'git rev-parse --short HEAD'
            }
        }

        stage('Validate Docker Compose') {
            steps {
                sh 'docker compose config -q'
                echo 'Docker Compose configuration is valid.'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build \
                      -t ${IMAGE_NAME}:${BUILD_NUMBER} \
                      -t ${IMAGE_NAME}:latest .
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_TOKEN'
                    )
                ]) {
                    sh '''
                        set +x
                        echo "$DOCKERHUB_TOKEN" | docker login \
                          --username "$DOCKERHUB_USER" \
                          --password-stdin

                        docker push ${IMAGE_NAME}:${BUILD_NUMBER}
                        docker push ${IMAGE_NAME}:latest

                        docker logout
                    '''
                }
            }
        }

        stage('Test Kubernetes Access') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'k8s-deployer-token',
                        variable: 'K8S_TOKEN'
                    )
                ]) {
                    sh '''
                        set +x
                        export KUBECONFIG="$(mktemp)"
                        trap 'rm -f "$KUBECONFIG"' EXIT
                        chmod 600 "$KUBECONFIG"

                        kubectl config set-cluster novacart \
                          --server="$K8S_SERVER" \
                          --certificate-authority="$K8S_CA_CERT" \
                          --embed-certs=true

                        kubectl config set-credentials jenkins-deployer \
                          --token="$K8S_TOKEN"

                        kubectl config set-context novacart \
                          --cluster=novacart \
                          --user=jenkins-deployer \
                          --namespace=default

                        kubectl config use-context novacart

                        echo "Checking deployment patch permission..."
                        kubectl auth can-i patch deployments \
                          --namespace=default

                        echo "Checking NovaCart deployment..."
                        kubectl get deployment novacart-app \
                          --namespace=default
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'NovaCart CI pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Check the stage logs.'
        }

        always {
            sh 'docker image prune -f || true'
        }
    }
}
