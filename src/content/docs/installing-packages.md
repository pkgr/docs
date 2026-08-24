---
title: Installing packages
description: Configure signed APT, DNF/YUM, and Zypper repositories from Packager.io, including private access.
navGroup: Build and publish
groupOrder: 2
navOrder: 2
---

Packager.io publishes native repository metadata, so users install and upgrade your software through their operating system’s package manager.

## Generate the correct instructions

Use the CLI instead of assembling repository URLs by hand:

```bash
packagehall-ctl package install widget \
  --org=acme \
  --repo=widget \
  --channel=stable \
  --target=ubuntu/24.04
```

The response includes the organization signing key, repository configuration, package-manager refresh, and install command. Add `--sh` when you want a ready-to-run setup script.

## Debian and Ubuntu

The generated flow:

1. Installs the Packager.io organization key under `/usr/share/keyrings`.
2. Creates a source file under `/etc/apt/sources.list.d`.
3. Runs `apt update`.
4. Installs the package with `apt install`.

The public repository configuration URL has this form:

```text
https://go.packager.io/srv/acme/widget/stable/installer/ubuntu/24.04.list
```

## Enterprise Linux

For Enterprise Linux targets, the generated instructions import the GPG key, create a file under `/etc/yum.repos.d`, and install with `dnf` or `yum`:

```text
https://go.packager.io/srv/acme/widget/stable/installer/el/9.repo
```

## SUSE Linux Enterprise Server

SLES uses the same `.repo` endpoint shape. Save the configuration under `/etc/zypp/repos.d`, refresh repositories, and install with `zypper`:

```text
https://go.packager.io/srv/acme/widget/stable/installer/sles/15.repo
```

## GPG verification

Packager.io signs repository metadata with the organization’s GPG key. Generated APT configuration uses `signed-by` to restrict trust to that repository. RPM-based package managers import the corresponding public key before refreshing metadata.

Do not disable signature verification to work around a key error. Regenerate the current instructions and compare the configured key and repository host first.

## Private repositories

Private repositories require a token with at least `pull` permission. Create a dedicated token for each environment or customer:

```bash
packagehall-ctl token create production-install \
  --org=acme \
  --repo=widget \
  --permissions=pull
```

Configure the CLI with that token, or supply it with `--token` when generating instructions. Packager.io returns repository configuration containing the credentials required by the package manager.

Treat pull tokens as secrets:

- Do not publish private installer output in a public issue or build log.
- Use different tokens for production, staging, and external customers.
- Rotate a token by installing a newly generated repository configuration before deleting the old token.

## Pin a channel

The channel is part of the repository URL. A server configured for `stable/16` will not receive packages published only to `develop` or `stable/17`. This makes release-line changes explicit and reversible.
