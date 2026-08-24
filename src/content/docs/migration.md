---
title: Migrate from the old Packager.io
description: Move builds to GitHub Actions, preserve your pkgr configuration, migrate existing packages, and switch installer URLs safely.
label: Migration guide
navGroup: Help
groupOrder: 4
navOrder: 1
---

The new Packager.io keeps native package hosting while moving builds into your GitHub Actions account. You control when builds run, which commit produced a package, and how packages move between channels.

> **We can move the repository data for you.** Email [support@packager.io](mailto:support@packager.io) with the old repositories and channels you need. Packager can copy existing repositories and published package history to the new platform.

## What changes

| Old Packager.io | New Packager.io |
| --- | --- |
| Packager.io watched GitHub and scheduled hosted builds. | Your repository runs `pkgr/action/package` in GitHub Actions. |
| A successful hosted build published automatically. | A separate `pkgr/action/publish` step publishes explicitly. |
| Build status and logs lived on Packager.io. | Build status, logs, permissions, services, and artifacts live in GitHub Actions. |
| Packages were downloaded from `dl.packager.io`. | Repository and installer URLs use `go.packager.io`. |

Your `.pkgr.yml` remains the package definition. Buildpacks, dependencies, hooks, process types, and other `pkgr` customizations continue to apply.

## 1. Request organization access

Email [support@packager.io](mailto:support@packager.io) with:

- Your GitHub organization.
- Each repository you want on the new service.
- Whether each repository should be public or private.
- Existing channels and published packages that should be copied.

Support will create the organization and provide an `org_admin` token. Configure it locally with `packagehall-ctl configure`.

## 2. Create or confirm repositories

If support has not already created the destination:

```bash
packagehall-ctl repo create widget --org=acme --public
packagehall-ctl repo list --org=acme
```

Map old branches or release references to channels. Keeping the old names at first makes installer migration easier.

## 3. Create the GitHub publish token

Create a narrow token for each repository:

```bash
packagehall-ctl token create github-actions \
  --org=acme \
  --repo=widget \
  --permissions=push
```

Store its one-time value in GitHub as `PACKAGER_PUBLISH_TOKEN`. Do not place the organization administrator token in GitHub Actions.

## 4. Add the GitHub Actions workflow

Add `.github/workflows/packager.yml` and start with one representative target:

```yaml
name: Package

on:
  workflow_dispatch:
  push:
    branches: [packaging/*]
    tags: ['v*']

jobs:
  package:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: pkgr/action/package@v1
        id: package
        with:
          target: ubuntu/24.04
          version: 1.0.0
      - uses: pkgr/action/publish@v1
        with:
          file: ${{ steps.package.outputs.package_path }}
          target: ubuntu/24.04
          repository: acme/widget
          channel: testing-migration
          token: ${{ secrets.PACKAGER_PUBLISH_TOKEN }}
```

Run it manually, inspect the package, then expand to your full target matrix and real channel policy. See [GitHub Actions](/github-actions/) and [OpenProject’s production workflow](https://github.com/opf/openproject/blob/dev/.github/workflows/packager.yml) for larger examples.

## 5. Copy existing packages

Coordinate the backfill with [support@packager.io](mailto:support@packager.io). Provide the old repository, relevant channels, and the release history you must retain. We will confirm what was copied and call out any old build that cannot be imported.

Do not rebuild old releases merely to populate history unless you need a new artifact. Copying the original published packages preserves the exact files users already installed.

## 6. Verify before cutover

Check the new package metadata:

```bash
packagehall-ctl package list \
  --org=acme \
  --repo=widget \
  --channel=stable
```

Test at least one DEB or RPM installation on every supported distribution family. Verify upgrades as well as clean installs.

## 7. Update installer URLs

Generate fresh instructions:

```bash
packagehall-ctl package install widget \
  --org=acme \
  --repo=widget \
  --channel=stable \
  --target=ubuntu/24.04
```

Replace old `https://dl.packager.io/srv/...` sources with the generated `https://go.packager.io/srv/...` URLs. For private repositories, redistribute the generated configuration with an appropriate pull token.

Update documentation, installation scripts, configuration management, image builds, and customer onboarding material that contains the old host.

## 8. Complete the cutover

Keep old and new sources available while you verify installs. Once the new workflow publishes every supported target and your installation paths use `go.packager.io`, stop triggering old hosted builds.

If a release line has unusual history or cannot tolerate an installer change, email [support@packager.io](mailto:support@packager.io) before switching it.
