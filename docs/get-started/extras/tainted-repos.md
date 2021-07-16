---
id: tainted
title: Tainted Repositories
sidebar_position: 3
# sidebar_label: 
---


RPM Fusion has introduced **"tainted"** repositories for free and nonfree sections. This is for Fedora, RHEL, CentOS and derived.

## Tainted Free

Tainted free is dedicated for FLOSS packages where some usages might be restricted in some countries (e.g. playback DVD with libdvdcss)
```shell
sudo dnf install rpmfusion-free-release-tainted
sudo dnf install libdvdcss
```

## Tainted Nonfree
Tainted nonfree is dedicated to non-FLOSS packages without a clear redistribution status by the copyright holder.
But is allowed as part of hardware inter-operability between operating systems in some countries :

```shell
sudo dnf install rpmfusion-nonfree-release-tainted
sudo dnf install \*-firmware
```
