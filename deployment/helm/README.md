# Heml chart for RPM Fusion website

This repositry provides a chart configuration to deploy our website.

## Requirements

1. Install [Helm v3](https://helm.sh/docs/helm/helm_install/)

1. Install Google Cloud Storage plugin for helm (to access rpmfusion private registry)
    ```shell
    helm plugin install https://github.com/hayorov/helm-gcs.git --version 0.3.7
    ```

## Configuration
This chart comes with a default configuration which is not suitale for a production deployement.
We strongly recommend to adapt it to your need. See the file `values.yml` for values customization.

## Usage

```shell
# Initialize private repo
helm gcs init gs://rpmfusion-charts

# Install and deploy the website
helm upgrade -i --create-namespace <namespace> rpmfusion/website -f custom-values.yml

# Uninstall the website
helm uninstall rpmfusion-website -n <namespace>
```

For advanced usage of helm, check out its [documentation](https://helm.sh/docs/helm/).
