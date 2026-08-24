---
title: Packages
description: Inspect, publish, upload, yank, and install packages stored in Packager.io.
navGroup: Manage
groupOrder: 3
navOrder: 3
---

Every upload is parsed and recorded with its name, version, release, architecture, format, targets, channels, and immutable UUID.

## List and filter packages

```bash
packagehall-ctl package list --org=acme --repo=widget
```

Narrow large repositories with filters:

```bash
packagehall-ctl package list \
  --org=acme \
  --repo=widget \
  --channel=stable \
  --target=ubuntu/24.04 \
  --architecture=amd64 \
  --name=widget
```

Use `--format=json` for scripts and automation.

## Show one package

Use the UUID returned by publishing or listing:

```bash
packagehall-ctl package show PACKAGE_UUID --org=acme --repo=widget
```

## Publish from GitHub Actions

Publishing from the workflow that built the package is the normal path:

```yaml
- name: Publish
  uses: pkgr/action/publish@v1
  with:
    file: ${{ steps.package.outputs.package_path }}
    target: ${{ matrix.target }}
    repository: acme/widget
    channel: stable
    token: ${{ secrets.PACKAGER_PUBLISH_TOKEN }}
```

This keeps the package, target, version, commit, and release policy together in one auditable run.

## Upload manually

Use the CLI for backfills, locally built packages, and troubleshooting:

```bash
packagehall-ctl package upload \
  --org=acme \
  --repo=widget \
  --file=./dist/widget_1.4.2_amd64.deb \
  --target=ubuntu/24.04 \
  --channel=testing
```

The target must exist and its expected package format must match the file. Repeat or comma-separate `--target` and `--channel` values when the same artifact applies to several destinations.

## Yank a package

Yanking removes a package from selected channels without relying on a mutable filename:

```bash
packagehall-ctl package yank PACKAGE_UUID \
  --org=acme \
  --repo=widget \
  --channel=stable
```

Specify `--channel` more than once to yank from multiple channels. Other channel associations remain intact.

## Generate installer instructions

```bash
packagehall-ctl package install widget \
  --org=acme \
  --repo=widget \
  --channel=stable \
  --target=el/9
```

The default output is a readable Markdown guide. Add `--sh` for an executable setup script:

```bash
packagehall-ctl package install widget \
  --org=acme --repo=widget --channel=stable --target=el/9 --sh
```

See [Installing packages](/installing-packages/) before distributing private-repository instructions.
