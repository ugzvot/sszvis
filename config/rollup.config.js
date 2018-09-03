import {join} from "path";
import uglify from "rollup-plugin-uglify";
import {version} from "../package.json";

const d3Modules = [
    "d3-array", "d3-axis", "d3-collection", "d3-color", "d3-dispatch", "d3-ease", "d3-format", "d3-geo", "d3-hierarchy",
    "d3-interpolate", "d3-scale", "d3-selection", "d3-shape", "d3-time-format", "d3-transition", "d3-voronoi"
];

const d3ModulesMap = d3Modules.reduce(function(acc, val) {
    acc[val] = "d3";
    return acc;
}, {});

const createConfig = ({input, output, plugins}) => ({
    input,
    output,
    plugins,
    external: d3Modules.concat(['topojson']),
    globals: Object.assign({}, d3ModulesMap, {topojson: "topojson"}),
    banner: `/*! sszvis v${version}, Copyright 2014-present Statistik Stadt Zürich */`
});

export default [
    createConfig({
        input: join(__dirname, "..", "src", "index.js"),
        output: [
            {
                file: join(__dirname, "..", "docs", "static", "sszvis.js"),
                format: "umd",
                name: "sszvis"
            }
        ]
    }),
    createConfig({
        input: join(__dirname, "..", "src", "index.js"),
        output: [
            {
                file: join(__dirname, "..", "docs", "static", "sszvis.min.js"),
                format: "umd",
                name: "sszvis"
            }
        ],
        plugins: [
            uglify({
                output: {
                    comments: /^!/
                }
            })
        ]
    })
];
