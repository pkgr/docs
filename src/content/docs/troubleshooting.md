---
title: Troubleshooting
description: Resolve common CLI, GitHub Actions, publishing, target, channel, and installer problems.
navGroup: Help
groupOrder: 4
navOrder: 2
---

Start with the failing layer: GitHub builds the package, the publish action uploads it, and Packager.io serves repository metadata and files.

## The CLI connects to a Unix socket

Without a saved configuration, `packagehall-ctl` defaults to a local administration socket. Hosted users should run:

```bash
packagehall-ctl configure
```

Set the endpoint to `https://go.packager.io`, then verify it with `packagehall-ctl config show`.

## Invalid credentials or insufficient permissions

Check the token’s scope and permission:

```bash
packagehall-ctl token list --org=acme --repo=widget
```

- Repository management needs `repo_admin` or `org_admin`.
- Publishing needs `push`.
- Private installation needs `pull`.

An organization administrator token can create narrow repository tokens, but it should not be stored in GitHub Actions.

## The GitHub secret is empty

Confirm the repository or environment contains a secret named exactly `PACKAGER_PUBLISH_TOKEN`. Secrets are not passed to workflows triggered from untrusted forks. The publish action will fail authentication if the value is missing.

## No package file was produced

The package action reports `No package file found in output directory` when `pkgr` exits without a `.deb` or `.rpm`.

Check:

- The `path` input points to the application directory.
- `.pkgr.yml` and buildpack configuration are valid.
- The selected target has a published build image.
- Build dependencies and required environment variables are present.

Set `debug: true` temporarily to expose more `pkgr` output.

## Unsupported or malformed target

Use `dist/version`, such as `debian/13`, `ubuntu/24.04`, `el/9`, or `sles/15`. The uploaded file must match the target format: DEB for Debian/Ubuntu and RPM for Enterprise Linux/SLES.

Compare your workflow with the current target list on the [overview](/#supported-targets).

## Duplicate upload

Packager.io rejects a package already present in the same repository with a conflict response. Do not retry indefinitely. Confirm the version, release iteration, target, and channel, or skip publishing when that exact artifact already exists.

## Package is in the wrong channel

Inspect channel associations:

```bash
packagehall-ctl package show PACKAGE_UUID --org=acme --repo=widget
packagehall-ctl channel list --org=acme --repo=widget
```

Publish the correct artifact to the intended channel, then yank the incorrect association:

```bash
packagehall-ctl package yank PACKAGE_UUID \
  --org=acme --repo=widget --channel=wrong-channel
```

## Installer returns 401 or 403

Public repositories need no credential. Private repositories need a valid `pull` token both when fetching installer configuration and when downloading metadata or packages.

Regenerate the installer output with the current token. If you recently rotated it, replace the repository configuration before deleting the old token.

## Signature or metadata errors

Remove stale repository metadata, regenerate the installer instructions, and confirm the source uses `go.packager.io`. Do not bypass GPG verification.

If newly published packages do not appear after refreshing, verify the channel and target first. Repository metadata cache keys change automatically when the target is updated.

## Still stuck?

Email [support@packager.io](mailto:support@packager.io) with:

- The organization, repository, channel, and target.
- The GitHub Actions run URL, if the failure happened during a build.
- The exact command and error text with all tokens removed.
- Whether the repository is public or private.
