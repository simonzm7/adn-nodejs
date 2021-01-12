pipeline{
	
		agent {
		label 'Slave_Induccion'
		}
	
        
		triggers {
        pollSCM('@hourly')
		}
	
		options {
			buildDiscarder(logRotator(numToKeepStr: '5'))
			disableConcurrentBuilds()
		}
		
		stages{
			stage('Install'){
                steps {
					sh 'npm run prebuild'
                    sh 'npm i'				
				}
            }
			stage('Unit Tests'){
                steps {
                    sh 'npm run test:cov'					
				}
            }
			stage('Compile'){
                steps {
					sh 'npm run prebuild'
                    sh 'npm run build'					
				}
            }

			
			 stage('Static Analysis Code'){
			 	steps{
			 		echo '------------>Analisis de código estático<------------'
			 		  withSonarQubeEnv('Sonar') {
                         sh "${tool name: 'SonarScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'}/bin/sonar-scanner -Dsonar.projectKey=co.com.cliente:adnceiba.juan.monsalve.master -Dsonar.projectName=co.com.adnceiba.juan.monsalve.master -Dproject.settings=./sonar-project.properties"
                      }
			 	}
			 }
		
		

		}
		post {
			failure {
				mail(to: 'juan.monsalve@ceiba.com.co',
				body:"Build failed in Jenkins: Project: ${env.JOB_NAME} Build /n Number: ${env.BUILD_NUMBER} URL de build: ${env.BUILD_NUMBER}/n/nPlease go to ${env.BUILD_URL} and verify the build",
				subject: "ERROR CI: ${env.JOB_NAME}")
			}
		}	
			
}