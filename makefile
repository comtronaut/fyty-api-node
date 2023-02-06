remote_host := 159.223.80.31
app_name := fyty-api

# usage example: make git m="your message"

git:
	git add .
	git commit -m "$m"
	git push
push-dev:
	git push heroku main
docker-deploy:
	docker build -t ${app_name} .
	docker save ${app_name} > ${app_name}.tar
	docker rmi ${app_name}
	scp ./${app_name}.tar ${remote_host}:/root/
	rm ./${app_name}.tar
	ssh -t ${remote_host} 'docker rm -f $$(docker ps -aq) 2>/dev/null || true \
    &&  docker rmi -f $$(docker images -aq) 2>/dev/null || true \
    &&  docker load < /root/${app_name}.tar \
    &&  rm /root/${app_name}.tar \
    &&  docker run -d -p 80:80 -p 443:443 -t ${app_name}'