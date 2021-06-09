---
title: "Deploy a Ktor Server Using Podman Containers"
date: "2021-07-01"
year: "2021"
tags: ["kotlin", "podman"]
---
This article describes how to deploy a Ktor application on a cloud server using Podman containers. You can use [this repository](https://github.com/thunderbiscuit/podman-ktor-deploy) as a guide and code example.

First, build a simple [Ktor](https://ktor.io/) server application which targets the JVM. Here is an example:
```kotlin
// Application.kt

import io.ktor.application.*
import io.ktor.response.*
import io.ktor.routing.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module(testing: Boolean = false) {
    routing {
        get("/") {
            call.respondText("Hello from Ktor through Podman!")
        }
    }
}
```

## Install Podman
Note that Podman is only available for Linux.
```sh
# debian/ubuntu
apt install podman
```

## Create the Podman image
The basic idea behind Podman and Docker is the following: we write scripts that define how to build "images". These images are then ready-to-go templates to create "containers". Note that you can spawn hundreds of containers all built using the same image, but in our case we only need one container to deploy the app.

The workflow is something like this:
1. Provide instructions to Podman as to what our image should be;
2. Create a container from that image;
3. Start that container, hence spawning the process it holds (the Ktor service).

The typical way to build an image involves putting all necessary files in one directory (in our example the application tarball and the Containerfile that describes how to build the image).

[AdoptOpenJDK](https://adoptopenjdk.net/) maintains a whole range of images with their JDKs on Docker Hub. My choice here is the simple Java Runtime Environment 16.0.9 on Debian 10.

The file below is called a `Containerfile`, and is the equivalent of the `Dockerfile` in Docker. It states how to build an image using a set of commands. The one we use here has 4 basic parts:
1. Start from an image that already contains the main pieces we need in our containers: Debian 10 and a Java 16 runtime;
2. Create a user and activate it so we don't need to launch the process as root;
3. Copy the tarball into the image and extract it into the user's home directory;
4. Declare starting the app as the command to apply when launching the container.

```Docker
FROM docker.io/adoptopenjdk/openjdk16:x86_64-debian-jre-16.0.1_9

RUN useradd --create-home --no-log-init --shell /bin/bash basicktor
USER basicktor

COPY app-0.0.1.tar /tmp/
RUN tar --extract --verbose --file /tmp/app-0.0.1.tar --directory /home/basicktor/

CMD ["/home/basicktor/app-0.0.1/bin/app"]
```

## Launch our container
From the root of the directory where the Containerfile lives, you will be able to (a) build the image, (b) create the container, and (c) start the container (and therefore its enclosing Ktor service).

Note that by default a Ktor server listens on port `8080`, but you can redirect any port on your host machine to that port in the container using the `--publish` argument when creating the container.

```shell
podman build --tag basicktor:v0.0.1 --file ./Containerfile
podman create --name BasicKtorServer --publish 0.0.0.0:9000:8080 localhost/basicktor:v0.0.1
podman start BasicKtorServer
# podman stop BasicKtorServer
```

That's it! Now go to [https://127.0.0.1:9000/](https://127.0.0.1:9000/) to see the server responding.
