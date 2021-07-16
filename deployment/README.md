# Container image for RPM Fusion website

This directory provides configuration's files to build a container image for RPM Fusion website.

## Install requirements

1. Install [buildah](https://github.com/containers/buildah/blob/master/install.md)
1. Install [podman](https://podman.io/getting-started/installation)

## Set up

1. Build the image
    * The podman way
      ```shell
      podman build -f deployment/Containerfile -t rpmfusion-website:<app-version>
      ```

    * The buildah way
      ```shell
      buildah bud -rm -f deployment/Containerfile -t rpmfusion-website:<app-version>
      ```

## Run the image locally

```shell
podman run -d --name rpmfusion-website -p 8080:80 localhost/rpmfusion-website:<app-version>
```
Then open your browser and enter the following url: http://localhost:8080

> **Note**: Remove option `-d` if you want to run the image in the foreground.

