# Extended Map Functionality

> These map layers provide additional features that extend the mapping capabilities of the SSZVIS library.

## sszvis.map

### Data structures

Requires data that can be matched to map entities

### Configuration

The configuration methods are the same as for the other map layers

## Zürich: Grundkarte Quartiere

A base layer example using the Statistische Quartiere map data. This is a static map

```project
{
    "name": "map-baselayer",
    "files": {
        "index.html": {
            "source": "docs/map-extended/baselayer.html",
            "template": "docs/template.html"
        },
        "sszvis.js": "sszvis.js",
        "sszvis.css": "sszvis.css",
        "fallback.png": "docs/fallback.png",
        "d3.js": "vendor/d3/d3.min.js",
        "topojson.js": "vendor/topojson/topojson.js",
        "map.js": "sszvis-map-zurich-statistischequartiere.js"
    },
    "sourceView": ["index.html"],
    "size": {
        "width": 516,
        "height": 542
    }
}
```