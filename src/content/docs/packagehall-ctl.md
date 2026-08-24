---
title: packagehall-ctl
description: Install and configure the Packager.io CLI for repository, channel, package, and token management.
label: CLI configuration
navGroup: Start here
groupOrder: 1
navOrder: 3
---

`packagehall-ctl` is the administration and inspection CLI for Packager.io. Hosted users use it over HTTPS at `go.packager.io`.

## Install

The install script supports Linux and macOS on x86-64 and ARM64:

```bash
curl -fsSL https://raw.githubusercontent.com/pkgr/packagehall-ctl/main/install.sh | sh
```

Windows and manual downloads are available from [GitHub Releases](https://github.com/pkgr/packagehall-ctl/releases).

Confirm the installation:

```bash
packagehall-ctl --version
```

## Configure the hosted endpoint

```bash
packagehall-ctl configure
```

The prompts ask for:

- **Endpoint:** accept `https://go.packager.io`.
- **Token:** paste the organization administrator token supplied by Packager.io.

The CLI writes `~/.packagehall/config.yaml` with permissions limited to your user. Inspect the active values without revealing the full token:

```bash
packagehall-ctl config show
```

## Configuration precedence

The CLI resolves settings in this order:

1. Explicit `--admin` and `--token` flags.
2. Values in `~/.packagehall/config.yaml`.
3. Built-in defaults.

Override the saved endpoint when testing a different server:

```bash
packagehall-ctl \
  --admin=https://go.packager.io \
  --token="$PACKAGER_TOKEN" \
  repo list --org=acme
```

Avoid putting tokens directly in shell history. Prefer the configuration file or an environment variable expanded from a secret store.

## Output formats

Commands return readable tables by default:

```bash
packagehall-ctl package list --org=acme --repo=widget
```

Use JSON for `jq`, scripts, and continuous integration:

```bash
packagehall-ctl --format=json package list \
  --org=acme \
  --repo=widget \
  | jq '.[] | {name, version, channels}'
```

## Everyday commands

```bash
# Repositories
packagehall-ctl repo list --org=acme
packagehall-ctl repo create widget --org=acme --public

# Tokens
packagehall-ctl token list --org=acme --repo=widget
packagehall-ctl token create github-actions \
  --org=acme --repo=widget --permissions=push

# Channels
packagehall-ctl channel list --org=acme --repo=widget
packagehall-ctl channel set-default stable --org=acme --repo=widget

# Packages
packagehall-ctl package list --org=acme --repo=widget
packagehall-ctl package show PACKAGE_UUID --org=acme --repo=widget
```

Run `packagehall-ctl COMMAND --help` for the flags supported by your installed release.

## Permission levels

Permissions are hierarchical:

| Permission | Typical use |
| --- | --- |
| `org_admin` | Manage repositories, tokens, and signing configuration across an organization. |
| `repo_admin` | Change one repository’s settings. |
| `push` | Publish packages; use for GitHub Actions. |
| `pull` | Read private repository metadata and packages. |

Higher permissions inherit lower capabilities. Keep your organization token local and create narrow repository tokens for automation.
