REMOTE_HOST := root@188.166.235.255

git:
	git add .
	git commit -m "$m"
	git push
push-heroku:
	git push heroku main
build-deploy:
	docker build -t $t .
	docker save $t > $t.tar
	docker rmi $t
	scp ./$t.tar ${REMOTE_HOST}:/root/
	rm ./$t.tar
	ssh -t ${REMOTE_HOST} 'docker rm $$(docker ps -aq) -f \
    &&  docker rmi $$(docker images -aq) \
    &&  docker load < /root/$t.tar \
    &&  rm /root/$t.tar \
    &&  docker run -d -p 80:80 -t $t'