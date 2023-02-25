remote_host := 159.223.80.31
app_name := fyty-api
app_name_dev := fyty-api-dev

# usage example: make git m="your message"

git:
	git add .
	git commit -m "$m"
	git push
push-dev:
	git push heroku main
docker-deploy:
	docker build -t ${app_name} -f ./docker/dockerfile.prod .
	docker save ${app_name} > ${app_name}.tar
	docker rmi ${app_name}
	scp ./${app_name}.tar ${remote_host}:/root/
	rm ./${app_name}.tar
	ssh -t ${remote_host} 'docker rm -f $$(docker ps -f name=^/${app_name}$$ -q) 2>/dev/null || true \
    &&  docker rmi -f ${app_name}:latest 2>/dev/null || true \
    &&  docker load < /root/${app_name}.tar \
    &&  rm /root/${app_name}.tar \
    &&  docker run -d -p 80:80 -p 443:443 --name ${app_name} -t ${app_name}'
docker-deploy-dev:
	docker build -t ${app_name_dev} -f ./docker/dockerfile.dev .
	docker save ${app_name_dev} > ${app_name_dev}.tar
	docker rmi ${app_name_dev}
	scp ./${app_name_dev}.tar ${remote_host}:/root/
	rm ./${app_name_dev}.tar
	ssh -t ${remote_host} 'docker rm -f $$(docker ps -f name=^/${app_name_dev}$$ -q) 2>/dev/null || true \
    &&  docker rmi -f ${app_name_dev}:latest 2>/dev/null || true \
    &&  docker load < /root/${app_name_dev}.tar \
    &&  rm /root/${app_name_dev}.tar \
    &&  docker run -d -p 8080:8080 --name ${app_name_dev} -t ${app_name_dev}'