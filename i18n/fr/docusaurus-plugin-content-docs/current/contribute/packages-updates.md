---
id: pkg-update
title: Update a package
sidebar_label: Update a package
sidebar_position: 4
---


1. Set up the environment
    ```shell
    rfpkg clone <namespace>/<package-name>
    ```

1. Download the new upstream source and save it to the branch directory you are updating (if applies):
    ```shell
    cd <package-name>
    wget -N http://dl.sf.net/foo/foo-0.0.2.tar.bz2
    ```

1. Upload the tarball to an external lookaside cache (not yet working)
    ```shell
    rfpkg new-sources "foo-0.0.2.tar.bz2"
    ```

    :::info
    Small patches, initscripts or related plain text files can be commited directly to GIT
    ```shell
    git add foo-fix-the-bar.patch
    ```
    :::

1. Change the required things in the specfile `my_package.spec` (you can validate changes with `git diff`)

1. Create a changelog entry (clog) and commit the changes
    ```shell
    rfpkg ci -c
    ```

1. Tag and request the build
    ```shell
    rfpkg push && rfpkg build

    # Resubmit a failed build
    koji-rpmfusion resubmit <taskID>

    # On another branch
    git checkout f24 && rfpkg build && git checkout master
    ```
    > "rfpkg build" is safe because check before if we already built it, if build is alreadydone, reply something like: 
    Could not execute build: Package mpgtx-1.3.1-9.fc23 has already been
    built

    :::tip
    You can skip this check with option `--skip-nvr-check`
    :::

    :::info
    * A package built for **devel** (i.e. rawhide) will directly go to the **devel** repository.
    * A package built for a stable release (e.g. f24, f23) will go to the **updates-testing** repository.
    You'll have to wait a period ranging from 10 to 14 days for your package to be transferred to the **updates** repository.
    It's a manual action, somebody real actually does that, so don't panic.
    * You can also find packages which are built but not yet pushed at our [build system](http://koji.rpmfusion.org/mash/).
    :::


## Requesting a new branch for a package

You can request new branches for a package at our [packages database system](https://admin.rpmfusion.org/pkgdb)