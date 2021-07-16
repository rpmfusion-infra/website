---
id: install-nonfree
title: Nonfree Repository
sidebar_position: 3
sidebar_label: Enable Nonfree repository
---

To enable access to the Nonfree repository use the following instruction.

## Enable on Fedora

```shell
sudo dnf install \
    https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
```

## Enable on Silverblue

```shell
sudo rpm-ostree install \
    https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
```
:::note
You need to reboot your system for the respository to appear.
:::

## Enable on RHEL 8, CentOS 8 or derivatives

1. Install EPEL repository
    ```shell
    sudo dnf install --nogpgcheck \
        https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
    ```

1. Install Free repository
    ```shell
    sudo dnf install --nogpgcheck \
        https://mirrors.rpmfusion.org/free/el/rpmfusion-free-release-8.noarch.rpm
    ```

1. Enable codeready-builder
    ```shell
    sudo subscription-manager repos \
        --enable "codeready-builder-for-rhel-8-$(uname -m)-rpms"
    ```

1. Enable powertools on CentOS Steam 8
    ```shell
    sudo dnf config-manager --enable powertools
    sudo dnf config-manager --enable PowerTools  # For older version of CentOS
    ```


## Enable on RHEL 7 or derivatives
1. Install [EPEL repository](https://fedoraproject.org/wiki/EPEL)

1. Install Free reposiroty
    ```shell
    sudo yum localinstall --nogpgcheck \
        https://mirrors.rpmfusion.org/nonfree/el/rpmfusion-nonfree-release-7.noarch.rpm
    ```

## Enable on RHEL 6 or derivatives
1. Install [EPEL reposirory](https://fedoraproject.org/wiki/EPEL)

1. Install Free repository
    ```shell
    sudo yum localinstall --nogpgcheck \
        https://mirrors.rpmfusion.org/nonfree/el/rpmfusion-nonfree-release-6.noarch.rpm
    ```

    :::tip
    If `sudo` is not properly set on your installation, you can replace `sudo` with `su -c` in the commands above.
    :::