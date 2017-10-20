#/bin/bash

docker build -t glocon .
docker run --name glocon -p 8080:8080 -d glocon
echo Visit http://$(docker-machine ip default):8080
