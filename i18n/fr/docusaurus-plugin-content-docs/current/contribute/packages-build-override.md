---
id: pkg-build-override
title: Request a buildroot-override packages
sidebar_label: Buildroot-override package
sidebar_position: 6
---


1. Request a buildroot override
    ```shell
    koji-rpmfusion tag-build f2?-{,non}free-override your_rpmfusion_build_nvr
    ```

1. wait for repo be ready:
    ```shell
    koji-rpmfusion wait-repo f2?-{,non}free-build --build=your_rpmfusion_build_nvr
    ```

:::note Example
```shell
koji-rpmfusion tag-build f25-free-override VirtualBox-5.1.4-3.fc25
koji-rpmfusion wait-repo f25-free-build --build=VirtualBox-5.1.4-3.fc25
```
:::

:::info
It's not possible to tag a fedora package, that's a manual task.
In this case, please file a bug in product `Infrastructure` and select component `Build System`.

It is currently not possible to expire a buildroot override, but that is being worked on.
:::

### Requesting a buildroot override but for one package from Fedora
As we do not build with `updates-testing` repos enabled, it's sometime required for a package to be built and pushed in sync with others fedora's packages.

Please submit a specific bug for the package you want to build, and block this bug: https://bugzilla.rpmfusion.org/show_bug.cgi?id=4501

### Making the build available in the repository
RPM Fusion doesn't use Bodhi like Fedora does to request moving package to testing repository then stable repository.
Packages are pushed manually by the admins from time to time.

### Manually moving a package from testing repository to updates repository
In some rare cases, packages need to be moved in sync with packages in Fedora (e.g. **chromium**, **qt-webengine**).
For such cases, and only such cases, one can move a package using `koji-rpmfusion move-build` command.

:::note example:

```shell
koji-rpmfusion move-build f29-free-updates-testing f29-free-updates package-version-release
````
:::

:::warning
Never move a package from candidate to testing, or from updates to stable.
Only testing to stable is safe, because packages in candidate have not been signed yet.
:::


