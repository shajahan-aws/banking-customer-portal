pipeline {
    agent any

    environment {
        IMAGE_NAME = 'customer-portal'
        IMAGE_TAG = "build-${BUILD_NUMBER}"
        CONTAINER_NAME = "temp-customer-portal-${BUILD_NUMBER}"
        TEST_PORT = '8081'
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
                        url: 'https://github.com/shajahan-aws/banking-customer-portal.git'
                    ]]
                )
            }
        }

        stage('Build') {
            steps {
                echo "Installing dependencies..."
                bat 'npm install'
            }
        }

        stage('Test') {
            steps {
                echo "Executing automated unit tests..."
                bat 'npm test'
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
                bat "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Container Verification') {
            steps {
                echo "Starting temporary container on port ${TEST_PORT}..."
                bat "docker run -d --name ${CONTAINER_NAME} -p ${TEST_PORT}:8080 ${IMAGE_NAME}:${IMAGE_TAG}"
                
                echo "Waiting for service to initialize..."
                bat "timeout /t 5 /nobreak"

                echo "Verifying application via /health endpoint..."
                bat "curl --fail http://localhost:${TEST_PORT}/health"
            }
        }
    }

    post {
        always {
            echo "Cleaning up temporary container..."
            bat """
                docker stop ${CONTAINER_NAME} || exit 0
                docker rm ${CONTAINER_NAME} || exit 0
            """
        }
        success {
            echo "Pipeline completed successfully! Image created: ${IMAGE_NAME}:${IMAGE_TAG}"
        }
        failure {
            echo "Pipeline failed! Check build/test logs."
        }
    }
}