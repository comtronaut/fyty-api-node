remote_host := 159.223.80.31
port_prod := 8001
port_dev := 8002
app_name := fyty-api
app_name_dev := fyty-api-dev

# usage example: make git m="your message"

git:
	git add .
	git commit -m "$m"
	git push
docker-deploy.%:
	docker build -t ${app_name_$*} -f ./docker/dockerfile.$* .
	docker save ${app_name_$*} | xz -0 > ${app_name_$*}.tar.xz
	docker rmi ${app_name_$*}
	scp ./${app_name_$*}.tar.xz ${remote_host}:/root/
	rm ./${app_name_$*}.tar.xz
	ssh -t ${remote_host} 'docker rm -f $$(docker ps -f name=^/${app_name_$*}$$ -q) 2>/dev/null || true \
    &&  docker rmi -f ${app_name_$*}:latest 2>/dev/null || true \
    &&  docker load < /root/${app_name_$*}.tar.xz \
    &&  rm /root/${app_name_$*}.tar.xz \
    &&  docker run -d -p ${port_$*}:80 --name ${app_name_$*} -t ${app_name_$*}'
remote-ssh:
	ssh -t ${remote_host} '$m'