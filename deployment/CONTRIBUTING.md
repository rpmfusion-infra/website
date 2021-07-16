## Contributing

Please follow the [best pratice guideline](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#label) before starting altering the `Containerfile`.

### The containerfile
The `Containerfile` provides instructions to build two images from two stages.

* Stage **doc-buidler**
  This image helps to only set up and build rpmfusion-website avoiding to spread toolchains & built objects.
* Stage **website**
  This image (based on nginx's one) provides the run-time version of the application previously built by stage `rpmfusion-website-builder` w/ an NGINX configuration to expose it on default HTTP port.

### Build and publish the run-time image

1. Build the image as described in the above set-up.
1.  Tag the image
    ```shell
    buildah tag localhost/rpmfusion-website:<app-version> eu.gcr.io/rpmfsuion/website:<app-version>
    ```
1. Publish the image to RPM fusion registry
   ```shell
   buildah push eu.gcr.io/rpmfusion/website:<app-version>
   ```

> **Note**: The above process requires you to have RW access to our registry.
