---
id: mmpost
title: Multimedia Post-install
sidebar_position: 2
# sidebar_label: 
---


RPM Fusion repositories also provide a lot of complement packages, it's often difficult to remember which is the exact name of each complement package. One can easily remember using the package group that the repository extends.

### Complements multimedia packages for Gstreamer enabled applications

```shell
sudo dnf groupupdate multimedia \
    --setop="install_weak_deps=False" \
    --exclude=PackageKit-gstreamer-plugin
```

### Complements sound-and-video packages

```shell
sudo dnf groupupdate sound-and-video
```
