pipeline {
    agent any

    environment {
        IMAGE_NAME = 'customer-portal'
        IMAGE_TAG = "build-${BUILD_NUMBER}"
        CONTAINER_NAME = "temp-customer-portal-${BUILD_NUMBER}"
        TEST_PORT = '8081'
        // Configure this ID in Jenkins -> Manage Jenkins -> Credentials
        GIT_CREDENTIALS_ID = 'git-repo-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out source code using Jenkins Credentials..."
                checkout scmGit(
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        credentialsId: "${GIT_CREDENTIALS_ID}",
                        url: 'https://github.com/YOUR_USERNAME/banking-customer-portal.git'
                    ]]
                )
            }
        }

        stage('Build') {
            steps {
                echo "Installing dependencies and preparing application build..."
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                echo "Executing automated unit tests..."
                // Pipeline will stop here if any test fails
                sh 'npm test'
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Container Verification') {
            steps {
                echo "Starting temporary container on port ${TEST_PORT}..."
                sh "docker run -d --name ${CONTAINER_NAME} -p ${TEST_PORT}:8080 ${IMAGE_NAME}:${IMAGE_TAG}"
                
                echo "Waiting for service to initialize..."
                sleep 5

                echo "Verifying application via /health endpoint..."
                sh "curl --fail http://localhost:${TEST_PORT}/health"
            }
        }
    }

    post {
        always {
            stage('Cleanup') {
                echo "Cleaning up temporary container..."
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                """
            }
        }
        success {
            echo "Pipeline completed successfully! Image created: ${IMAGE_NAME}:${IMAGE_TAG}"
        }
        failure {
            echo "Pipeline failed! Check build/test logs."
        }
    }
}