---
id: appstream
title: AppStream Metadata
sidebar_position: 1
# sidebar_label: 
---


RPM Fusion repositories also provide [Appstream metadata](https://www.freedesktop.org/software/appstream/docs/chap-Metadata.html) to enable users to install packages using Gnome Software/KDE Discover.

For the current Fedora releases the recommended method is to install appstream-data using DNF.

```shell
sudo dnf groupupdate core
```

:::info
Please note that these are a subset of all packages since the metadata are only generated for GUI packages.
:::