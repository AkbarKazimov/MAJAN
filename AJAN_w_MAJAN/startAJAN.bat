java -Dtriplestore.initialData.agentFolderPath=executionservice/use-case/agents -Dtriplestore.initialData.domainFolderPath=executionservice/use-case/domains -Dtriplestore.initialData.serviceFolderPath=executionservice/use-case/services -Dtriplestore.initialData.behaviorsFolderPath=executionservice/use-case/behaviors -Dpf4j.mode=development -Dserver.port=8060 -DloadTTLFiles=true -Dpf4j.pluginsDir=pluginsystem/plugins -Dtriplestore.url=http://localhost:8090/rdf4j -jar executionservice/target/executionservice-0.1.jar

pause
