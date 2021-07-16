---
id: create-kmod-pkg
sidebar_label: Package kernel modules
sidebar_position: 8
---

Introduction

Kernel modules are a special case in rpm packaging and need careful handling. There are a lot of ways to package kernel modules -- to avoid confusion for the users and reviewers as well as to make it easier for RPM depsolvers to support kernel-modules the Fedora (Extras|Engineering) Steering Commitee (FESCo) in 2005/2006 worked out the kmod concept for packaging kernel-modules in Fedora. By mid 2007 packages with kernel modules (like kmods or dkms) were completely banned from Fedora. Livna developers (which started shipping kmod packages soon after FESCo developed the concept) at that point picked up the kmod standard and improved it for Fedora 8. For Fedora 9 it was later a improved a bit more to provide let standard kmod srcs build a akmod rpm, that together with the akmods scripts provides a dkms-like functionality.

This document describes the enhanced version which is also known as kmod 2.x. The description of the first version can be found in this wiki as well. The initial version of this document further is based on that document, thus you can use the wiki-internal diff tools to see the differences by comparing the first version with the latest one. You can also read the section that explains the main differences roughly.

Split

There are always at least two SRPMS when a kernel-module gets packaged -- one builds a userland package from the source while the other builds packages with *only* the kernel-module(s) in it. That way new kernel-modules (build for newer kernels or modified because new patches were needed) can be shipped without shipping new userland packages, which avoids unnecessary downloads and updates for our users.

userland package

The binary packages built from the userland SRPM contains tools, documentation, license files, udev configuration etc. There always has to exist such a package -- even if the packaged software only builds kernel-modules it has at least some docs and a license file that need to be packaged in the userland package.

The packager is free to split the userland-package further into those with the general userland parts, that works fine without the kernel-modules (docs, general tools, devel-files), and one with the kernel-module related parts (udev rules for example).

The userland packages need to follow the usual Fedora Packaging Guidelines. Two additional rules MUST be followed for packages with parts related to the kernel-module(s):
```
    MUST: The package must tie itself to the kernel-module using 'Requires: %{name}-kmod  >= %{version}'

    MUST: The package must provide %{name}-kmod-common using 'Provides: %{name}-kmod-common = %{version}'; it is possible to name the package directly %{name}-kmod-common, but it should be avoided, as that's meaningless for users and confusing. 
```
kernel-module package

Besides the normal packaging rules there are several additional rules for the package that contains the modules, which is called kmod package from now on. Instead of writing all those down a specfile template was created.

That template (and thus all kmod packages) make use of a bash script called kmodtool, which normally should be in a package called kmodtool that gets provided by the repo. There are further `buildsys-build-<repo>-{newest,current}` packages needed, which is used when the kmods get build in the buildsys of the repo; those packages holds the information for which kernel versions the kmods get built.

All kmod packages should use the template(see below) as a base. Reviewers of kmod packages should diff the proposed packages against the template. Normally only the names and the way the modules itself are built should differ. There shouldn't be other differences without a good reason.

kmod template
```spec
# (un)define the next line to either build for the newest or all current kernels
%define buildforkernels newest
#define buildforkernels current
#define buildforkernels akmod

# name should have a -kmod suffix
Name:           

Version:        
Release:        1%{?dist}.1
Summary:        Kernel module(s)

Group:          System Environment/Kernel

License:        
URL:            
Source0:        
BuildRoot:      %{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)

BuildRequires:  %{_bindir}/kmodtool


# Verify that the package build for all architectures.
# In most time you should remove the Exclusive/ExcludeArch directives
# and fix the code (if needed).
# ExclusiveArch:  i686 x86_64 ppc64 ppc64le armv7hl aarch64
# ExcludeArch: i686 x86_64 ppc64 ppc64le armv7hl aarch64

# get the proper build-sysbuild package from the repo, which
# tracks in all the kernel-devel packages
BuildRequires:  %{_bindir}/kmodtool

%{!?kernels:BuildRequires: buildsys-build-rpmfusion-kerneldevpkgs-%{?buildforkernels:%{buildforkernels}}%{!?buildforkernels:current}-%{_target_cpu} }

# kmodtool does its magic here
%{expand:%(kmodtool --target %{_target_cpu} --repo rpmfusion --kmodname %{name} %{?buildforkernels:--%{buildforkernels}} %{?kernels:--for-kernels "%{?kernels}"} 2>/dev/null) }


%description


%prep
# error out if there was something wrong with kmodtool
%{?kmodtool_check}

# print kmodtool output for debugging purposes:
kmodtool  --target %{_target_cpu}  --repo %{repo} --kmodname %{name} %{?buildforkernels:--%{buildforkernels}} %{?kernels:--for-kernels "%{?kernels}"} 2>/dev/null

%setup -q -c -T -a 0

# apply patches and do other stuff here
# pushd foo-%{version}
# #patch0 -p1 -b .suffix
# popd

for kernel_version in %{?kernel_versions} ; do
    cp -a foo-%{version} _kmod_build_${kernel_version%%___*}
done


%build
for kernel_version in %{?kernel_versions}; do
    make %{?_smp_mflags} -C "${kernel_version##*___}" SUBDIRS=${PWD}/_kmod_build_${kernel_version%%___*} modules
done


%install
rm -rf ${RPM_BUILD_ROOT}

for kernel_version in %{?kernel_versions}; do
    make install DESTDIR=${RPM_BUILD_ROOT} KMODPATH=%{kmodinstdir_prefix}/${kernel_version%%___*}/%{kmodinstdir_postfix}
    # install -D -m 755 _kmod_build_${kernel_version%%___*}/foo/foo.ko  ${RPM_BUILD_ROOT}%{kmodinstdir_prefix}/${kernel_version%%___*}/%{kmodinstdir_postfix}/foo.ko
done
%{?akmod_install}


%clean
rm -rf $RPM_BUILD_ROOT


%changelog
```
So how does it work? let's go through important parts and describe the different bits:

# (un)define the next line to either build for the newest or all current kernels
%define buildforkernels newest
#define buildforkernels current
#define buildforkernels akmod

The buildforkernels is quite important, as it decides what packages and modules will actually be build when the SRPM is build with rpmbuild. As the Fedora project is releasing new kernels quite frequently in rawhide it would be to hard to build real modules for each of them. Thus in the devel branch it's normally best to build only an akmods package; that is done by activating only the akmods line like this:

    # (un)define the next line to either build for the newest or all current kernels
    #define buildforkernels newest
    #define buildforkernels current
    %define buildforkernels akmod

    It's a bit more complicated for released Fedora versions, as there up to and including Fedora 9 exist two kind of kernel flavors: the stock kernel (which also builds PAE and SMP kernels on some archs) and a xen-kernel. Updates for those two flavors most of the time are released independently of each other. Thus we sometimes want to build new kernel modules only for one of those two kernel flavors, to prevent that users of the other flavour get useless kmod updates. That can be done by using the following setting.

    # (un)define the next line to either build for the newest or all current kernels
    %define buildforkernels newest
    #define buildforkernels current
    #define buildforkernels akmod

    That way the modules will only be built for the last batch of kernels that was released by Fedora. The list of those kernels is defined by a subpackage of buildsys-build-rpmfusion; is thus needs to be updated each time a new kernel is released by Fedora; only once that happened modules can be build for the new kernel in the buildsys. In case you ship a new version of your kernel modules you want it to be build for all kernel flavors and a new akmods package for the akmods-users. Thus you need to set this:

    # (un)define the next line to either build for the newest or all current kernels
    #define buildforkernels newest
    %define buildforkernels current
    #define buildforkernels akmod

    /!\ In CVS please always define buildforkernels newest; that way someone else can just rebuild your kernel-module from CVS when a new Kernel is shipped by Fedora and the right thing will happen 

# needed for plague to make sure it builds kmods for i586 and i686

ExclusiveArch:  i586 i686 x86_64 ppc ppc64

These are needed for plague; without it would try to build the kmod for a i386 kernel on x86-32, which is not available.

# get the proper build-sysbuild package from the repo, which
# tracks in all the kernel-devel packages
%{!?kernels:BuildRequires: buildsys-build-%{repo}-kerneldevpkgs-%{?buildforkernels:%{buildforkernels}}%{!?buildforkernels:current}-%{_target_cpu} }

This line manages the BuildRequires. If user specified the "kernels" macro, then it does nothing -- kmodtool will manage the build requires. If the "kernels" macro is not set either buildsys-build-rpmfusion-kerneldevpkgs-newest or buildsys-build-rpmfusion-kerneldevpkgs-current will be used as BuildRequire. Those are managed by the repo admins and depend on the newest or all currentt kernels.

# kmodtool does its magic here
%{expand:%(kmodtool --target %{_target_cpu} --repo rpmfusion --kmodname %{name} %{?buildforkernels:--%{buildforkernels}} %{?kernels:--for-kernels "%{?kernels}"} 2>/dev/null) }

Here kmodtool does its magic -- a lot of it, thus see the next section below for the details.
```
%prep
# error out if there was something wrong with kmodtool
%{?kmodtool_check}
```
This is not strictly needed, but kmodtool sometimes fails and then puts error messages in the kmodtool_check macro for debugging purposes.

# print kmodtool output for debugging purposes:
```
kmodtool  --target %{_target_cpu}  --repo rpmfusion --kmodname %{name} %{?buildforkernels:--%{buildforkernels}} %{?kernels:--for-kernels "%{?kernels}"} 2>/dev/null
```
This is not strictly needed either, but just outputting all the stuff kmodtool did to the console can make debugging easier. Note that this call should always be identical with the earlier kmodtool call, except the "expand" stuff around it
```
%setup -q -c -T -a 0
# pushd foo-%{version}
# #patch0 -p1
# popd
for kernel_version in %{?kernel_versions} ; do
    cp -a foo-%{version} _kmod_build_${kernel_version%%___*}
done
```
This extracts source0; you can apply patches afterwards if you want to. Then a directory for each kmod to be built is being created in case modules are going to be build -- that's normally the case, but not true if you only build an akmods package.

Please note the "%{?kernel_versions}" macro. It's created by kmodtool and holds a list of kernel versions and where their development files get found; the two values per kernel get separated by the string "___", which makes it possible to easily reference the first or the second part of it in bash. This example bash code explains it better then words can do:
```
kernel_versions="2.6.23.1-42.fc8___/usr/src/kernels/2.6.23.1-42.fc8-x86_64/ 2.6.23.1-42.fc8pae___/usr/src/kernels/2.6.23.1-42.fc8pae-x86_64/ "
for kernel_version in ${kernel_versions} ; do
    echo "The builddir for ${kernel_version%%___*} is ${kernel_version##*__}"
done
```
Running it will lead to this output:
```
The builddir for 2.6.23.1-42.fc8 is /usr/src/kernels/2.6.23.1-42.fc8-x86_64/
The builddir for 2.6.23.1-42.fc8pae is /usr/src/kernels/2.6.23.1-42.fc8pae-x86_64/
```
```
%build
for kernel_version in %{?kernel_versions}; do
    make %{?_smp_mflags} -C "${kernel_version##*___}" SUBDIRS=${PWD}/_kmod_build_${kernel_version%%___*} modules
done
```
Build the module -- this or similar commands should work with most modern kernel modules.

```
%install
rm -rf ${RPM_BUILD_ROOT
}
for kernel_version in %{?kernel_versions}; do
    make install DESTDIR=${RPM_BUILD_ROOT} KMODPATH=%{kmodinstdir_prefix}/${kernel_version%%___*}/%{kmodinstdir_postfix}
${kernel_version%%___*}/%{kmodinstdir_postfix}/kmodname/
done
chmod u+x ${RPM_BUILD_ROOT}/lib/modules/*/extra/*/*
```

Install the module with "make install" and mark it executable for stripping. Note the new macros kmodinstdir_prefix (normally /lib/modules/) and kmodinstdir_postfix (normally /extra/), that get set by kmodtool. Sometimes it's easier to just install the module manually; then use something like the following instead: 
```
%install
rm -rf ${RPM_BUILD_ROOT
}
for kernel_version in %{kernel_versions}; do
    install -D -m 755 _kmod_build_${kernel_version%%___*}/foo/foo.ko ${RPM_BUILD_ROOT}%{kmodinstdir_prefix}/foo.ko
done
chmod u+x ${RPM_BUILD_ROOT}/lib/modules/*/extra/*/*

    But using "make install" should be preferred, as you that way will get a new module automatically should upstream suddenly add another one.

    %{?akmod_install}

    Last line in the install section. It is requires for akmods packages and preforms the steps to create one. 
```
kmodtool

kmodtool is a simple bash script that creates parts of the spec file dynamically depending on how you call it -- that's why the kmod template above has no files section. kmodtool gets called like this

# kmodtool does its magic here
```
%{expand:%(kmodtool --target %{_target_cpu} --repo %{repo} --kmodname foo %{?buildforkernels:--%{buildforkernels}} %{?kernels:--for-kernels "%{?kernels}"} 2>/dev/null) }
```
kmodtool itself is no real magic -- if you understand a bit of bash scripting you should be able to see how it works. It created three major parts:

one that defines some macros
a meta-package kmod-foo per kernel variant, and

a package `kmod-foo-<kernel-version>` per kernel variant which contains the module itself and gets tracked in for new kernels by new kmod-foo meta package. 

`kmod-foo-<kernel-version>` package

The most important part of kmodtool is the function print_rpmtemplate_per_kmodpkg, which contains a template for the package which will hold the kmod later:
```
%package       -n kmod-${kmodname}-${verrel}${variant}

Summary:          ${kmodname} kernel module(s) for ${verrel}${variant}

Group:            System Environment/Kernel

Provides:         kernel-modules-for-kernel = ${verrel}${variant}

Provides:         ${kmodname}-kmod = %{?epoch:%{epoch}:}%{version}-%{release}

Requires:         ${kmodname}-kmod-common >= %{?epoch:%{epoch}:}%{version}

Requires(post):   /sbin/depmod

Requires(postun): /sbin/depmod

Requires:         kernel-%{_target_cpu} = ${verrel}${variant}
BuildRequires:    kernel${dashvariant}-devel-%{_target_cpu} = ${verrel}


%post          -n kmod-${kmodname}-${verrel}${variant}

/sbin/depmod -aeF /boot/System.map-${verrel}${variant} ${verrel}${variant} > /dev/null || :

%postun        -n kmod-${kmodname}-${verrel}${variant}

/sbin/depmod  -aF /boot/System.map-${verrel}${variant} ${verrel}${variant} &> /dev/null || :

%description  -n kmod-${kmodname}-${verrel}${variant}

This package provides the ${kmodname} kernel modules built for the Linux

kernel ${verrel}${variant} for the %{_target_cpu} family of processors.


%files        -n kmod-${kmodname}-${verrel}${variant}

%defattr(644,root,root,755)

/lib/modules/${verrel}${variant}/extra/${kmodname}/
```
This macro later expands to something like the following when building for a standard kernel 2.6.23.1-42.fc8 on i686 and %{version} = 1.5; the output get inserted into the spec file before building :
```
%package       -n kmod-foo-2.6.23.1-42.fc8

Summary:          foo kernel module(s) for 2.6.23.1-42.fc8

Group:            System Environment/Kernel

Provides:         kernel-modules-for-kernel = 2.6.23.1-42.fc8

Provides:         foo-kmod = 1.5-1
Requires:         foo-kmod-common >= 1.5-1
Requires(post):   /sbin/depmod

Requires(postun): /sbin/depmod



Requires:         kernel-i686 = 2.6.23.1-42.fc8

BuildRequires:    kernel-devel- i686 = 2.6.23.1-42.fc8

%post          -n kmod-foo-2.6.23.1-42.fc8

/sbin/depmod -aeF /boot/System.map-2.6.23.1-42.fc8 2.6.23.1-42.fc8 > /dev/null || :

%postun        -n kmod-foo-2.6.23.1-42.fc8

/sbin/depmod  -aF /boot/System.map-2.6.23.1-42.fc8 2.6.23.1-42.fc8 &> /dev/null || :



%description  -n kmod-foo-2.6.23.1-42.fc8

This package provides the foo kernel modules built for the Linux

kernel 2.6.23.1-42.fc8 for the %{_target_cpu} family of processors.


%files        -n kmod-foo-2.6.23.1-42.fc8

%defattr(644,root,root,755)

/lib/modules/2.6.23.1-42.fc8/extra/foo/
```
Why all that? Let's go though the interesting bits in detail:

    %package       -n kmod-foo-2.6.23.1-42.fc8

All kernel modules need to have the prefix kmod (that's a bit shorter than kernel-module) and need to be in a seperate package

    Provides:         kernel-modules-for-kernel = 2.6.23.1-42.fc8

Via this provides depsolvers or scripts can check for which kernel a module was build.

    Provides:         foo-kmod = 1.5

The userland-package that depends on a package that provides that to make sure that yum and other depsolvers install a proper kernel-module if you install a userland package that requires a kernel-module.

    Requires:         kernel-i686 = 2.6.23.1-42.fc8

A kernel module without the kernel it was built for is useless. Don't use /boot/vmlinuz-*, it's not portable.

    Requires:         foo = 1.5

Kernel modules without the userland part is useless in most cases. There are rare packages when kernel modules don't need a part in userland, but we require it anyway -- at least the license and the docs needs to be placed somewhere in any case and a userland package is the right place for them.

    BuildRequires:    kernel-devel-i686 = 2.6.23.1-42.fc8

Needed for building kernel-modules. This is just here if we are building for a Fedora kernel and will not show up when building for a custom kernel

    %defattr(644,root,root,755)

Kernel modules shall not be executable -- but they need to be after %install to allow /usr/lib/rpm/find-debuginfo.sh to strip them.

    /lib/modules/2.6.23.1-42.fc8/extra/foo/

Separate location -- don't mess up with the rest of the kernel. "extra" was picked because of upstream kernel documentation. Only kernel modules in that dir are allowed -- nothing else, because otherwise they might conflict between different versions!

kmod-foo

This is a meta-package which only purpose is to depend on the latest `kmod-foo-<kernel-version>` package. Without this meta-pacakge the later would be tracked in automatically for newly released kernels, because yum can't know that kmod-ntfs-2.6.23.1-49.fc8.x86_64 is a update for kmod-ntfs-2.6.23.1-42.fc8.x86_64 and that the latter should remain installed.

The meta-package gets created in the function print_rpmtemplate_kmodmetapkg from kmodtool. It will create a package which looks like this:

%package      -n kmod-foo
Summary:         Metapackage which tracks in foo kernel module for newest kernel
Group:           System Environment/Kernel
Requires:        kmod-foo-2.6.23.1-49.fc8

%description  -n kmod-foo
This is a meta-package without payload which sole purpose is to require the
foo kernel module(s) for the newest kernel,
to make sure you get it together with a new kernel.

%files        -n kmod-foo
%defattr(644,root,root,755)

macros

kmodtool further creates three macros that can be used in the spec file during the %prep, %build and %install stages.

%define kmodinstdir_prefix  /lib/modules/
%define kmodinstdir_postfix  /extra/ntfs/
%define kernel_versions 2.6.23.1-49.fc8___%{_usrsrc}/kernels/2.6.23.1-49.fc8-%{_target_cpu} 2.6.23.1-49.fc8PAE___%{_usrsrc}/kernels/2.6.23.1-49.fc8PAE-%{_target_cpu}

Look above in the kmod spec file template for details how to use those three.

kmods v1 versus v2

There were several design issues that lead to the the overhaul named kmods v2:

    kmods v1 could only build for different variants ("" (UP/Standard), SMP, Xen, ...) of one kernel-version (say 2.6.21-1.1776_FC7) in one build cycle. That became a hinderance when Fedora introduced a dedicated kernel-xen package with a different EVR than the main kernel package. The new kmods version can build for different kernel versions and variants easily and allows skipping certain variants (say for example xen) a lot easier.
    FESCo explicitly wanted to builds kmods for only the latest kernel versions when they designed kmods v1; but sometimes there are situations where a kmod for a older kernel might be handy or needed, thus the new kmods standard allows to build for old and new kernels during one build cycle as well. To make is possible for users to get the kmods for older kernels the names need to be different, which led to slightly ugly package names for kmods, as they contain the kernel-version now in the name (e.g. kmod-foo-2.6.23.8-62.fc8-1.0-1, where kmod-foo-2.6.23.8-62.fc8 is the actually %{name}), but that solves some corner cases with dep-solvers as well.
    the '--define "kversions foo" --define "kvariants bar"' syntax when rebuilding kmods v1 was not very intuitive for people that wanted to rebuild kmods; '--define "kernels $(uname -r)"' is a lot easier to remember and can be scripted more easily

    kmodtool and a big kmodtool specific header with a lot of macros was part of many packages directly, which was not easily to maintain and looked ugly. kmodtool is now in a separate package and only needed when it comes to building the kmods (beforehand it was needed needed to determine the BuildRequires as well) 

Mini-FAQ

Is it possible to compile a kmod against self compiled or other kernels?

Yes, easily, it's just a few steps. If you don't have a rpm build environment set one up like this

$ su -c "yum -y install rpmdevtools kmodtool kernel-devel"
$ rpmdev-setuptree

Now download the kmod src.rpm to the local directory and rebuild it for the running kernel:

$ yumdownloader --source kmod-foo
$ rpmbuild --rebuild foo-kmod*.src.rpm --define "kernels $(uname -r)" --target $(uname -m)

At the end of the build output you will see the names of the RPMs rpmbuild built. Use yum to install it with a command like this

$ su -c "yum --nogpgcheck install ~/rpmbuild/RPMS/i686/kmod-foo-1.0-4.i686.rpm"

Some notes, as above commands sometimes need some adjustments:

    instead of foo insert the name of the kmod you want to rebuild

    the package rpmdevtools installed in the first command contains the script rpmdev-setuptree, which creates a environment for building rpms in your home directory (~/.rpmmacros and ~/rpmbuild)

    the package kmodtool installed in the first command is needed for building kmods
    if you use a special kernel variant like xen or PAE you need to install kernel-PAE-devel or kernel-xen-devel instead of kernel-devel in the first command; these packages contain the files that are needed to build kernel modules for the kernels shipped by Fedora.
    note that yum will install the latest version of the kernel-devel packages for the latest Fedora kernels; if you didn't update and restart your system often please make sure you are running a kernel that is matching the version of the kernel-devel package
    if you want to build a kmod for a kernel you compiled yourself you may skip installing the kernel-devel package

    note third command in the "[...]--rebuild foo-kmod*.src.rpm[...]" part contains a "*" -- normally that should match the package yumdownloader downloaded earlier, but if you have old versions around in the local directory be sure to just pick the latest one

    instead of "$(uname -r)" you can use one or multiple kernel versions; e.g. "--define kernels  2.6.23.1-42.fc8 2.6.23.1-42.fc8PAE 2.6.21-2949.fc8xen" will build three kmod packages

    the "--target $(uname -m)" in the third command actually is only needed on x86-32 (i386) systems

    the "--nogpgcheck" in the last command is needed, because the package that was just built is unsigned

    using yum to install will make sure you get the package with the userland stuff (that contains the virtual provides "foo-kmod-common") from the repos. 

What's the best way to test if the spec file actually works?

Build the kmod (with and without mock) against a different kernel than the one that is running on your system.

Will there be further enhancements for the kernel module proposal?

Probably yes. We probably didn't consider every possible scenario out there. But the general scheme/direction probably will stay.

Do I need a special plugin for yum or other depsolvers?

It works fine without any plugins. Maybe a plugin will be written to fix two corner cases:

    Case 1: if yum sees the newly releases kmods from a 3rd party repo for a newly released Fedora kernel before the Fedora mirror yum selected offers that new Fedora kernel; this leads to a "dependency not met" error by yum
    Case 2: yum installs a newly released kernel but doesn't install the kmods for it, as they are not yet available in the repos or the mirror used; if the user reboots now the kmods will be missing, which can lead to problems as for example some popular graphic drivers will not work if the proper kernel modules are missing. Once the modules are available they can be easily installed by a simple "yum update". 

Does it require special support in the buildsys of a repo?

No. There is just a minor glitch in some versions of mock that makes building for older kernels a two-cycle build (if you BuildRequire both kernel-devel-2.6.23.1-42.fc8 and kernel-devel-2.6.23.1-49.fc8 in a package mock/yum will only install kernel-devel-2.6.23.1-49.fc8)

This standard is stupid.

Maybe. Post a better one. No offense, more a FYI: FESCo and some people from Livna and RPM Fusion invested a lot of time in this standard and had to make a lot of compromises to make everyone happy -- doing bigger changes just "because I like my scheme better" probably won't get accepted. But technical advantages that are properly documented (and maybe even tested in real life) might convince us. But remember, the improvements need to be worth converting all the existing packages over.

Why not simply use dkms

The short answer: Dkms especially for experienced users that often change kernels is a nice concept that also has a lot of usage cases for enterprise customers. Thus repos should consider to ship dkms packages in parallel to kmods. But for ordinary users shipping a pre-compiled module has many advantages (don't need devel environment) instead of doing a Gentoo-Like (custom build) concept.

Examples

A good example for the kmod v2 standards are the madiwfi/madwifi-kmod package from Livna; the ntfs packages are also a good starting point. For an example of the "skip the build for the xen kernel" take a look at the kmods for the graphic drivers from AMD and Nvidia. 