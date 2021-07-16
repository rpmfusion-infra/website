---
id: pkg-partnership
title: Co-maintain an existing packages
sidebar_label: Co-maintain package
sidebar_position: 5
---


You can offer to co-maintain a package in RPM Fusion.
To get commit privileges to an existing package to help out, request access to the [Package databases](https://admin.rpmfusion.org/pkgdb/).

Even if you don't have an RPM Fusion account, it can be useful to anonymously checkout a package's GIT module for various reasons.
In such case, you can use the following cmd-line

```shell
rfpkg clone -a <namespace>/<module>
```

:::note
`<namespace>` is either free or nonfree and `<module>` is the package's name.
:::
