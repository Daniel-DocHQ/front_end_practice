pipeline {
    agent any
    environment {
        CI_REGISTRY_PASSWORD = credentials('ci-registry-password')
        HELM_PASSWORD = credentials('harbour_registry')
        DEPLOYMENT_NAME = "airportal"
    }
    stages {
        stage("Checkout code") {
            steps {
                checkout scm
            }
        }
        stage("Build Staging image") {
            steps {
                script {
                    TAG = sh(script: 'git log -n 1 --pretty=format:"%H"', returnStdout: true).trim()
                    myapp = docker.build("harbor.dochq.co.uk/my-health/staging:$TAG", "--no-cache --build-arg=CI_REGISTRY_PASSWORD=$CI_REGISTRY_PASSWORD .")
                }
                script {
                    TAG = sh(script: 'git log -n 1 --pretty=format:"%H"', returnStdout: true).trim()
                    docker.withRegistry('https://harbor.dochq.co.uk', 'harbour_registry') {
                            myapp.push("latest")
                            myapp.push("${TAG}")
                    }
                }
            }
        }
        stage("Build Production image") {
            steps {
                script {
                    TAG = sh(script: 'git log -n 1 --pretty=format:"%H"', returnStdout: true).trim()
                    myapp = docker.build("harbor.dochq.co.uk/my-health/production:$TAG", "--no-cache --build-arg=CI_REGISTRY_PASSWORD=$CI_REGISTRY_PASSWORD .")
                }
                script {
                    TAG = sh(script: 'git log -n 1 --pretty=format:"%H"', returnStdout: true).trim()
                    docker.withRegistry('https://harbor.dochq.co.uk', 'harbour_registry') {
                            myapp.push("latest")
                            myapp.push("${TAG}")
                    }
                }
            }
        }
        stage('Deploy to Staging') {
            environment {
                KUBECONTEXT = 'gke_dochq-production_europe-west2_dochq-staging'
                IMAGE = 'harbor.dochq.co.uk/my-health/staging'
                NAMESPACE="myhealth"
            }
            steps {
                sh '''
                    $(cd deploy/staging/ && kustomize edit set image microservice=$IMAGE:$(git log -n 1 --pretty=format:"%H"))&& \
                    kustomize build ./deploy/staging | kubectl apply --namespace $NAMESPACE -o yaml --dry-run="client" --wait=true -f -
                '''
            }
        }
        stage('Deploy to Production') {
            environment {
                KUBECONTEXT = 'gke_dochq-production_europe-west2_dochq'
                IMAGE = 'harbor.dochq.co.uk/my-health/production'
                NAMESPACE="myhealth"
            }
            steps{
                sh '''
                    $(cd deploy/production/ && kustomize edit set image microservice=$IMAGE:$(git log -n 1 --pretty=format:"%H"))&& \
                    kustomize build ./deploy/production | kubectl apply --namespace $NAMESPACE -o yaml --dry-run="client" --wait=true -f -
                '''
            }
        }
    }    
}
