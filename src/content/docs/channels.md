---
title: Channels
description: Organize release lines, choose a default channel, and control package retention.
navGroup: Manage
groupOrder: 3
navOrder: 2
---

Channels are named views of the packages in a repository. Use them for stability levels, supported release lines, or short-lived development builds.

Common patterns include:

- `stable` for production releases.
- `testing` for release candidates.
- `develop` for continuous builds.
- `stable/16` or `release/3.2` for maintained release lines.

Channel names can contain slashes. A package can be published to multiple channels in one upload.

## Create channels by publishing

You do not create an empty channel. Packager.io creates it when the first package is published:

```yaml
- uses: pkgr/action/publish@v1
  with:
    file: ${{ steps.package.outputs.package_path }}
    target: ${{ matrix.target }}
    repository: acme/widget
    channel: stable,latest
    token: ${{ secrets.PACKAGER_PUBLISH_TOKEN }}
```

## List channels

```bash
packagehall-ctl channel list --org=acme --repo=widget
```

The result shows package counts, the latest update, the default channel, and automatic compaction settings.

## Choose the default

The repository page uses its default channel when a visitor does not select one explicitly:

```bash
packagehall-ctl channel set-default stable \
  --org=acme \
  --repo=widget
```

Choose a channel intended for end users, not a branch that may disappear.

## Compact old revisions

Compaction keeps the newest revisions of each package name and removes older ones from the channel:

```bash
packagehall-ctl channel compact develop \
  --org=acme \
  --repo=widget \
  --keep-revisions=3
```

Configure the same policy to run nightly:

```bash
packagehall-ctl channel set-auto-compact develop \
  --org=acme \
  --repo=widget \
  --keep-revisions=3
```

Disable nightly compaction with `--keep-revisions=-1`.

## Delete a channel

```bash
packagehall-ctl channel delete feature/old-ui \
  --org=acme \
  --repo=widget
```

The CLI reports the package count and asks for confirmation. Deleting a channel removes its package associations and may make unreferenced files eligible for later storage cleanup.
