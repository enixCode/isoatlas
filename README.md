<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/isoatlas-banner-dark.svg">
  <img alt="isoAtlas, isometric network diagrams" src=".github/assets/isoatlas-banner-light.svg" width="100%">
</picture>

<div align="center">
    <h1>isoAtlas</h1>
    <h4>A React component for drawing network diagrams.</h4>
</div>

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

## About

Isoatlas is a community fork of [Isoflow](https://github.com/markmanx/isoflow), whose
development stopped in 2024. It is maintained independently and is **not affiliated with,
nor endorsed by, the authors of Isoflow**. The original work is distributed under the MIT
license, which this fork preserves.

## Key features
- **Isometric editor**: place icons, regions, connectors and text on a grid, snapped to a quarter of a tile.
- **Copy and paste**: Ctrl/⌘ + C / V on any element, even between two tabs.
- **Extensible icon system**: bring your own icon library, or use the packs for AWS, Azure, GCP, Kubernetes and more.
- **Export**: save a diagram as JSON and open it again, or export it as a PNG image.
- **Embeddable**: one React component, editable or read-only, that hands the model back on every change.

## Quick start

Install it from npm, along with the icon packs it uses:

- `npm install isoatlas @isoflow/isopacks`

Read the [documentation](https://enixcode.github.io/isoatlas/docs/) or try the [live demo](https://enixcode.github.io/isoatlas/).
The documentation sources live in [`docs/`](./docs).
