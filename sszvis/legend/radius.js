/**
 * Radius size legend
 *
 * Use for showing how different radius sizes correspond to data values.
 *
 * @module sszvis/legend/radius
 *
 * @property {function} scale         A scale to use to generate the radius sizes
 * @property {function} [tickFormat]  Formatter function for the labels (default identity)
 * @property {array} [tickValues]     An array of domain values to be used as radii that the legend shows
 *
 * @returns {d3.component}
 */
namespace('sszvis.legend.radius', function(module) {
  'use strict';

  module.exports = function() {
    return d3.component()
      .prop('scale')
      .prop('tickFormat').tickFormat(sszvis.fn.identity)
      .prop('tickValues')
      .render(function() {
        var selection = d3.select(this);
        var props = selection.props();

        var domain = props.scale.domain();
        var tickValues = props.tickValues || [domain[1], Math.round(d3.mean(domain)), domain[0]];
        var maxRadius = sszvis.scale.range(props.scale)[1];

        var group = selection.selectAll('g.sszvis-legend__elementgroup')
          .data([0]);

        group.enter().append('g').attr('class', 'sszvis-legend__elementgroup');

        group.attr('transform', sszvis.svgUtils.translateString(sszvis.svgUtils.crisp.halfPixel(maxRadius), sszvis.svgUtils.crisp.halfPixel(maxRadius)));

        var circles = group.selectAll('circle.sszvis-legend__greyline')
          .data(tickValues);

        circles.enter()
          .append('circle')
          .classed('sszvis-legend__greyline', true);

        circles.exit().remove();

        function getCircleCenter(d) {
          return maxRadius - props.scale(d);
        }

        function getCircleEdge(d) {
          return maxRadius - 2 * props.scale(d);
        }

        circles
          .attr('r', props.scale)
          .attr('stroke-width', 1)
          .attr('cy', getCircleCenter);

        var lines = group.selectAll('line.sszvis-legend__dashedline')
          .data(tickValues);

        lines.enter()
          .append('line')
          .classed('sszvis-legend__dashedline', true);

        lines.exit().remove();

        lines
          .attr('x1', 0)
          .attr('y1', getCircleEdge)
          .attr('x2', maxRadius + 15)
          .attr('y2', getCircleEdge);

        var labels = group.selectAll('.sszvis-legend__label')
          .data(tickValues);

        labels.enter()
          .append('text')
          .attr('class', 'sszvis-legend__label sszvis-legend__label--small');

        labels.exit().remove();

        labels
          .attr('dx', maxRadius + 18)
          .attr('y', getCircleEdge)
          .attr('dy', '0.35em') // vertically-center
          .text(props.tickFormat);
      });
  };

});