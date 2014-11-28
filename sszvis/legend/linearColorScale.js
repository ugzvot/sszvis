/**
 * Linear Color Scale Legend
 *
 * Use for displaying the values of a continuous linear color scale.
 *
 * @module sszvis/legend/linearColorScale
 *
 * @property {function} scale                   The scale to use to generate the legend
 * @property {array} displayValues              A list of specific values to display. If not specified, defaults to using scale.ticks
 * @property {number} width                     The pixel width of the legend (default 200).
 * @property {number} segments                  The number of segments to aim for. Note, this is only used if displayValues isn't specified,
 *                                              and then it is passed as the argument to scale.ticks for finding the ticks. (default 8)
 * @property {array} labelText                  Text or a text-returning function to use as the titles for the legend endpoints. If not supplied,
 *                                              defaults to using the first and last tick values.
 * @property {function} labelFormat             An optional formatter function for the end labels. Usually should be sszvis.format.number.
 */

namespace('sszvis.legend.linearColorScale', function(module) {
  'use strict';

  module.exports = function() {
    return d3.component()
      .prop('scale')
      .prop('displayValues').displayValues([])
      .prop('width').width(200)
      .prop('segments').segments(8)
      .prop('labelText')
      .prop('labelFormat').labelFormat(sszvis.fn.identity)
      .render(function() {
        var selection = d3.select(this);
        var props = selection.props();

        if (!props.scale) {
          sszvis.logger.error('legend.linearColorScale - a scale must be specified.');
          return false;
        }

        var values = props.displayValues;
        if (!values.length && props.scale.ticks) {
          values = props.scale.ticks(props.segments);
        }

        // Avoid division by zero
        var segWidth = values.length > 0 ? props.width / values.length : 0;
        var segHeight = 10;

        var segments = selection.selectAll('rect.sszvis-legend__mark')
          .data(values);

        segments.enter()
          .append('rect')
          .classed('sszvis-legend__mark', true);

        segments.exit().remove();

        segments
          .attr('x', function(d, i) { return i * segWidth - 1; }) // The offsets here cover up half-pixel antialiasing artifacts
          .attr('y', 0)
          .attr('width', segWidth + 1) // The offsets here cover up half-pixel antialiasing artifacts
          .attr('height', segHeight)
          .attr('fill', function(d) { return props.scale(d); });

        var startEnd = [values[0], values[values.length - 1]];
        var labelText = props.labelText || startEnd;

        // rounded end caps for the segments
        var endCaps = selection.selectAll('circle.ssvis-legend--mark')
          .data(startEnd);

        endCaps.enter()
          .append('circle')
          .attr('class', 'ssvis-legend--mark')
          .attr('cx', function(d, i) { return i * props.width; })
          .attr('cy', segHeight / 2)
          .attr('r', segHeight / 2)
          .attr('fill', function(d) { return props.scale(d); });

        endCaps.exit().remove();

        var labels = selection.selectAll('.sszvis-legend__label')
          .data(labelText);

        labels.enter()
          .append('text')
          .classed('sszvis-legend__label', true);

        labels.exit().remove();

        var labelPadding = 16;

        labels
          .style('text-anchor', function(d, i) { return i === 0 ? 'end' : 'start'; })
          .attr('dy', '0.35em') // vertically-center
          .attr('transform', function(d, i) { return 'translate(' + (i * props.width + (i === 0 ? -1 : 1) * labelPadding) + ', ' + (segHeight / 2) + ')'; })
          .text(function(d, i) {
            var formatted = props.labelFormat(d, i);
            return formatted;
          });
      });
  };

});