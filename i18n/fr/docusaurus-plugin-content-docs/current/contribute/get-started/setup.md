---
id: setup
title: RPM Fusion packager tools
sidebar_label: Install RPM Fusion tools
sidebar_position: 1
---

1. Enable [free repository](/docs/get-started/install-free)
1. Install rpmfusion-packager

    ```shell
    sudo dnf install rpmfusion-packager
    ```

    :::note
    This provides a set of utilities that helps a RPMFusion packager contributor in setting up automatically their environment to access to the git-dist and build-server. 
    The package already includes installation of others useful utilities like the rfpkg.
    :::

1. Run the setup
    ```shell
    rpmfusion-packager-setup
    ```

1. Set your SSH env if not done already

    ```shell
    ssh-agent $SHELL
    ```
    or
    ```shell
    keychain -q ~/.ssh/id_rsa
    ```

