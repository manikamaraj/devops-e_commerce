pipeline {
    agent any

    environment {
        IMAGE_NAME = 'bunny9596/novacart'
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
