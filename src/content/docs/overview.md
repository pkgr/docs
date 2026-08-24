---
title: Packager.io Documentation
description: Build native DEB and RPM packages in GitHub Actions, publish them to signed repositories, and install them with standard Linux tools.
label: Overview
navGroup: Start here
groupOrder: 1
navOrder: 1
---

Packager.io turns an application repository into native Linux packages. Builds run in your own GitHub Actions workflow; Packager.io hosts the results as fast, signed package repositories.

<div class="feature-grid">
  <div><strong>DEB and RPM together</strong><p>Publish Debian, Ubuntu, Enterprise Linux, and SUSE packages from one workflow.</p></div>
  <div><strong>GitHub-native builds</strong><p>Build on every tag, release branch, schedule, or manual dispatch with <code>pkgr/action</code>.</p></div>
  <div><strong>Channels for every release line</strong><p>Keep <code>develop</code>, <code>stable/16</code>, and feature builds isolated without duplicating repositories.</p></div>
  <div><strong>Signed repositories</strong><p>Packager.io creates APT, DNF/YUM, and Zypper metadata and signs it with your organization key.</p></div>
  <div><strong>Granular access</strong><p>Use organization administration tokens, narrow publish tokens, and pull tokens for private repositories.</p></div>
  <div><strong>A practical CLI</strong><p>Manage repositories, channels, packages, and installer instructions with <code>packagehall-ctl</code>.</p></div>
</div>

## How the pieces fit together

1. `pkgr/action/package@v1` builds a `.deb` or `.rpm` inside GitHub Actions.
2. `pkgr/action/publish@v1` uploads that package to `go.packager.io`.
3. Packager.io indexes and signs the package under your organization, repository, channel, and target.
4. Your users install it with `apt`, `dnf`, `yum`, or `zypper`.

```text
GitHub repository → GitHub Actions → DEB / RPM → Packager.io → Linux servers
```

## Supported targets

The current build-image matrix covers these 64-bit targets:

| Family | Targets | Package |
| --- | --- | --- |
| Debian | 11, 12, 13 | DEB / amd64 |
| Ubuntu | 20.04, 22.04, 24.04, 26.04 | DEB / amd64 |
| Enterprise Linux | 8, 9, 10 | RPM / x86_64 |
| SUSE Linux Enterprise Server | 12, 15, 16 | RPM / x86_64 |

Write targets as `dist/version`, for example `ubuntu/24.04` or `el/9`.

## Start publishing

Ask [support@packager.io](mailto:support@packager.io) for an organization administrator token. Then follow [Getting started](/getting-started/) to configure the CLI, create your repository, and add a publish token to GitHub.

> **Moving from the old Packager.io?** Builds now run through GitHub Actions. We can also copy existing repositories and published package history for you. See the [migration guide](/migration/) or email [support@packager.io](mailto:support@packager.io).
