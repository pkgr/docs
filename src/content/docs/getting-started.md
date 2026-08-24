---
title: Getting started
description: Set up your Packager.io organization, create a repository, and publish your first DEB or RPM from GitHub Actions.
navGroup: Start here
groupOrder: 1
navOrder: 2
---

This guide takes you from a new Packager.io organization to a package published from GitHub Actions.

## Prerequisites

You need:

- A GitHub repository with Actions enabled.
- An application already configured for `pkgr`, normally with a `.pkgr.yml` file.
- An organization administrator token from Packager.io.

Email [support@packager.io](mailto:support@packager.io) with your GitHub organization and the repositories you plan to publish. We will create your Packager.io organization and send its administrator token through a secure channel.

## 1. Install packagehall-ctl

Install the current CLI on Linux or macOS:

```bash
curl -fsSL https://raw.githubusercontent.com/pkgr/packagehall-ctl/main/install.sh | sh
```

The installer selects the correct binary for your operating system and architecture. You can also download a binary from the [packagehall-ctl releases](https://github.com/pkgr/packagehall-ctl/releases).

## 2. Configure the CLI

Run the interactive setup:

```bash
packagehall-ctl configure
```

Accept `https://go.packager.io` as the endpoint and paste the organization administrator token from support. The CLI stores the configuration in `~/.packagehall/config.yaml` with user-only permissions.

Confirm the connection:

```bash
packagehall-ctl config show
packagehall-ctl repo list --org=acme
```

## 3. Create a repository

Repository names normally match their GitHub repositories:

```bash
packagehall-ctl repo create widget \
  --org=acme \
  --description="Native packages for Acme Widget" \
  --public
```

Omit `--public` to create a private repository. Private repositories require pull credentials for metadata and package downloads.

## 4. Create a publish token

GitHub Actions should not use your organization administrator token. Create a repository-scoped token with only `push` permission:

```bash
packagehall-ctl token create github-actions \
  --org=acme \
  --repo=widget \
  --description="GitHub Actions publisher" \
  --permissions=push
```

Copy the token immediately. Its full value is shown only once.

In GitHub, open **Settings → Secrets and variables → Actions**, create a repository secret named `PACKAGER_PUBLISH_TOKEN`, and paste the token.

## 5. Add the workflow

Create `.github/workflows/packager.yml`:

```yaml
name: Package

on:
  push:
    tags: ['v*']
  workflow_dispatch:

jobs:
  build:
    name: ${{ matrix.target }}
    runs-on: ubuntu-latest
    permissions:
      contents: read
    strategy:
      fail-fast: false
      matrix:
        target:
          - debian/13
          - ubuntu/24.04
          - el/9
          - sles/15
    steps:
      - uses: actions/checkout@v4

      - name: Build package
        id: package
        uses: pkgr/action/package@v1
        with:
          target: ${{ matrix.target }}
          version: 1.0.0

      - name: Publish package
        uses: pkgr/action/publish@v1
        with:
          target: ${{ matrix.target }}
          token: ${{ secrets.PACKAGER_PUBLISH_TOKEN }}
          repository: acme/widget
          channel: stable
          file: ${{ steps.package.outputs.package_path }}
```

The job runs once per target. Each run builds one package and publishes it to the `stable` channel.

## 6. Verify and install

After the workflow finishes, inspect the repository:

```bash
packagehall-ctl package list --org=acme --repo=widget --channel=stable
```

Generate installation instructions for a target:

```bash
packagehall-ctl package install widget \
  --org=acme \
  --repo=widget \
  --channel=stable \
  --target=ubuntu/24.04
```

Continue with [GitHub Actions](/github-actions/) to derive versions and channels from tags and branches.
