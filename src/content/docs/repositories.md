---
title: Repositories
description: Create and manage public or private Packager.io repositories with packagehall-ctl.
navGroup: Manage
groupOrder: 3
navOrder: 1
---

A Packager.io repository belongs to one organization and contains packages grouped by channel and target. The usual name matches the GitHub repository that builds the package.

## Create a repository

Create a private repository:

```bash
packagehall-ctl repo create widget \
  --org=acme \
  --description="Acme Widget packages"
```

Add `--public` when package metadata and downloads should work without credentials:

```bash
packagehall-ctl repo create widget --org=acme --public
```

Private is the default. The choice does not affect publishing: uploads always require a token with `push` permission.

## List repositories

```bash
packagehall-ctl repo list --org=acme
```

The table includes visibility, package statistics, and push/pull token counts. For scripts, request JSON:

```bash
packagehall-ctl --format=json repo list --org=acme
```

## Edit a repository

Change the description or visibility:

```bash
packagehall-ctl repo edit widget \
  --org=acme \
  --description="Signed release packages" \
  --public=true
```

Use `--public=false` to make an existing repository private. Existing installer configurations without credentials will stop working after that change.

## Create repository tokens

Use separate credentials for each job:

```bash
# Publish from GitHub Actions
packagehall-ctl token create github-actions \
  --org=acme --repo=widget --permissions=push

# Install from a private repository
packagehall-ctl token create production-install \
  --org=acme --repo=widget --permissions=pull
```

The full token is returned only when it is created. Store it immediately, and rotate it by creating a replacement before deleting the old token.

## Delete a repository

```bash
packagehall-ctl repo delete widget --org=acme
```

The CLI displays the affected token, package, and channel counts before asking for confirmation. Deletion removes the repository and its associated metadata; use `--force` only in automation where that scope has already been verified.
