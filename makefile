remote_host := 159.223.80.31
port_prod := 8001
port_dev := 8002
app_name_prod := fyty-api
app_name_dev := fyty-api-dev

# usage example: make git m="your message"

podman-deploy.%:
	podman build -t ${app_name_$*} -f ./containers/containerfile.$* .
	podman save ${app_name_$*} > ${app_name_$*}.tar
	podman rmi ${app_name_$*}
	scp ./${app_name_$*}.tar ${remote_host}:/root/
	rm ./${app_name_$*}.tar
	ssh -t ${remote_host} 'docker rm -f ${app_name_$*} 2>/dev/null || true \
    &&  docker rmi -f ${app_name_$*}:latest 2>/dev/null || true \
    &&  docker load < /root/${app_name_$*}.tar \
    &&  rm /root/${app_name_$*}.tar \
    &&  docker run -d -p ${port_$*}:80 --name ${app_name_$*} -t localhost/${app_name_$*}'
podman-deploy-xz.%:
	podman build -t ${app_name_$*} -f ./containers/containerfile.$* .
	podman save ${app_name_$*} | xz -0 > ${app_name_$*}.tar.xz
	podman rmi ${app_name_$*}
	scp ./${app_name_$*}.tar.xz ${remote_host}:/root/
	rm ./${app_name_$*}.tar.xz
	ssh -t ${remote_host} 'docker rm -f ${app_name_$*} 2>/dev/null || true \
    &&  docker rmi -f ${app_name_$*}:latest 2>/dev/null || true \
    &&  docker load < /root/${app_name_$*}.tar.xz \
    &&  rm /root/${app_name_$*}.tar.xz \
    &&  docker run -d -p ${port_$*}:80 --name ${app_name_$*} -t localhost/${app_name_$*}'