---
id: pkg-retirement
title: Retire a package
sidebar_label: Retire packages
sidebar_position: 7
---


In order to retire a branch of a package, the maintainer needs to delete all but a dead.package file containing an explanation of why the package/branch has been retired.

:::info
A package cannot be retired in stable branches, only in master (rawhide) and branched (e.g. f31 until Fedora 31 is released). An EL branch can be retired at any time.
:::

Once that's done, the maintainer must [file a bugzilla ticket](https://bugzilla.rpmfusion.org/enter_bug.cgi?product=Infrastructure&component=Repo), asking the package to be blocked in koji.

This can also be done using the following command
```shell
rfpkg retire
```
:::note
At this time, the command cannot retire the package in pkgdb. You need to orphan then retire it manually from the web interface on the related branches.
:::
