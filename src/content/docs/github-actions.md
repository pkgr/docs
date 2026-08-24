---
title: Build and publish with GitHub Actions
description: Configure pkgr/action package matrices, versions, channels, artifacts, caches, and Packager.io publishing.
label: GitHub Actions
navGroup: Build and publish
groupOrder: 2
navOrder: 1
---

Packager.io separates building from hosting. `pkgr/action/package` builds a native package on a GitHub runner, while `pkgr/action/publish` sends the finished file to your Packager.io repository.

## The build action

```yaml
- name: Build package
  id: package
  uses: pkgr/action/package@v1
  with:
    target: ubuntu/24.04
    version: 1.4.2
```

The runner needs Docker. GitHub-hosted Ubuntu runners include it.

### Package inputs

| Input | Default | Purpose |
| --- | --- | --- |
| `target` | Required | Distribution as `dist/version`, such as `debian/13` or `el/9`. |
| `name` | GitHub repository | Package name passed to `pkgr`. |
| `path` | GitHub workspace | Directory containing the application. |
| `version` | `0.0.0` | Package version, without the generated iteration and commit suffix. |
| `pkgr_version` | `master` | Version of the underlying `pkgr` build image. |
| `cache_prefix` | `v1` | Namespace for the build cache. Change it to invalidate existing caches. |
| `env` | Empty | Newline-separated environment variables available during the build. |
| `debug` | `false` | Enable verbose `pkgr` output. |

The action returns `package_path`, `package_name`, `package_type`, and `workspace` outputs.

### Keep using .pkgr.yml

The GitHub Action runs the same `pkgr` packaging engine. Existing `.pkgr.yml` settings for buildpacks, dependencies, hooks, process types, and package layout continue to apply. The important migration is where the build runs, not how your application package is defined.

## Build a target matrix

Use a matrix so distributions build independently and in parallel:

```yaml
strategy:
  fail-fast: false
  matrix:
    target:
      - debian/12
      - debian/13
      - ubuntu/22.04
      - ubuntu/24.04
      - el/9
      - sles/15

steps:
  - uses: actions/checkout@v4
  - uses: pkgr/action/package@v1
    id: package
    with:
      target: ${{ matrix.target }}
      version: ${{ steps.release.outputs.version }}
```

Use the canonical slash format in new workflows. The action also normalizes older colon and dash forms.

## The publish action

```yaml
- name: Publish package
  uses: pkgr/action/publish@v1
  with:
    file: ${{ steps.package.outputs.package_path }}
    target: ${{ matrix.target }}
    repository: acme/widget
    channel: ${{ steps.release.outputs.channel }}
    token: ${{ secrets.PACKAGER_PUBLISH_TOKEN }}
```

| Input | Default | Purpose |
| --- | --- | --- |
| `file` | Required | Path to the generated `.deb` or `.rpm`. |
| `target` | Required | Distribution that the package was built for. |
| `repository` | GitHub repository | Destination in `organization/repository` form. |
| `channel` | `master` | One channel or a comma-separated list of channels. |
| `token` | Required | Repository token with `push` permission. |
| `url` | `https://go.packager.io` | Packager.io endpoint; normally leave unchanged. |

The action masks the token in logs, retries failed uploads, and returns the package `uuid`.

## Derive versions and channels

Use a setup step to keep release policy visible in your workflow:

```yaml
- name: Resolve release
  id: release
  shell: bash
  run: |
    if [[ "$GITHUB_REF_TYPE" == "tag" ]]; then
      echo "version=${GITHUB_REF_NAME#v}" >> "$GITHUB_OUTPUT"
      echo "channel=stable" >> "$GITHUB_OUTPUT"
    else
      echo "version=0.0.0" >> "$GITHUB_OUTPUT"
      echo "channel=$GITHUB_REF_NAME" >> "$GITHUB_OUTPUT"
    fi
```

Channels may contain slashes, so names such as `stable/16` and `release/3.2` are valid.

## Keep build artifacts

Publishing does not stop you from retaining the package in GitHub:

```yaml
- name: Upload workflow artifact
  uses: actions/upload-artifact@v4
  with:
    name: ${{ steps.package.outputs.package_name }}
    path: ${{ steps.package.outputs.package_path }}
```

## Cache behavior

The package action caches the `pkgr` workspace by target, `pkgr_version`, cache prefix, and commit. Set a repository- or branch-specific `cache_prefix` when build inputs differ substantially. Change the prefix when you need a clean cache.

## Real-world example: OpenProject

[OpenProject’s public Packager workflow](https://github.com/opf/openproject/blob/dev/.github/workflows/packager.yml) demonstrates a production setup:

- Tag, release-branch, scheduled, and manual triggers.
- A multi-distribution build matrix.
- A PostgreSQL service used during packaging.
- Application versions loaded from the source tree.
- Stable major-version channels for tags and branch channels for development builds.
- Cache prefixes scoped to the Git reference.
- Commit-pinned action references for supply-chain control.

Start with the smaller workflow in [Getting started](/getting-started/), then adopt these patterns as your release process needs them.
