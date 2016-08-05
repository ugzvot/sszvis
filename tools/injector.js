// This script is a nasty piece of business, but it's a one-line include
// into any file which will inject our charts onto their page,
// wherever you want them. It's gnarly code tho ¯\_(ツ)_/¯
// to include, add this line:
// <script src="injector.js" id="sszvis-injector" data-component="${SELECTOR_FOR_COMPONENT_WHERE_CHARTS_SHOULD_GO}" data-basepath="${PATH_BACK_TO_THE_DIRECTORY_THAT_HAS_SSZVIS.JS}"></script>

(function() {
  /// ****** The Business Part of the Injector
  var functionCache = window.__globalRenderFunctionCache__ = {};
  var containerCache = null;

  window.__globalRerenderAll__ = function() {
    objForEach(functionCache, function(render) { render(); });
  };

  window.addEventListener('resize', function() { __globalRerenderAll__(); })

  function monkeypatch(sszvis) {
    var _oldsszvisbounds = sszvis.bounds;
    sszvis.bounds = function(params) {
      params || (params = {});
      params.width = containerCache.getBoundingClientRect().width;
      return _oldsszvisbounds(params);
    };
    objForEach(_oldsszvisbounds, function(val, key) {
      sszvis.bounds[key] = val;
    });
  }

  var linkDependencies = [
    "sszvis.css"
  ];
  var scriptDependencies = [
    "vendor/d3/d3.min.js", "vendor/topojson/topojson.js", "sszvis.js", "map-modules/sszvis-map-switzerland.js", "map-modules/sszvis-map-zurich-agglomeration-2012.js", "map-modules/sszvis-map-zurich-neubausiedlungen.js", "map-modules/sszvis-map-zurich-stadtkreise.js", "map-modules/sszvis-map-zurich-statistischequartiere.js", "map-modules/sszvis-map-zurich-statistischezonen.js", "map-modules/sszvis-map-zurich-topolayer-clipped.js", "map-modules/sszvis-map-zurich-topolayer.js", "map-modules/sszvis-map-zurich-wahlkreise.js"
  ];
  var charts = [
    "docs/area-chart-stacked/parametric.html", "docs/area-chart-stacked/sa-three.html", "docs/area-chart-stacked/sa-twelve.html", "docs/area-chart-stacked/sa-two.html", "docs/bar-chart-grouped/basic.html", "docs/bar-chart-grouped/gb-two-small.html", "docs/bar-chart-grouped/gb-two-yearly-long.html", "docs/bar-chart-grouped/parametric.html", "docs/bar-chart-horizontal-stacked/basic.html", "docs/bar-chart-horizontal-stacked/parametric.html", "docs/bar-chart-horizontal/basic.html", "docs/bar-chart-horizontal/interactive.html", "docs/bar-chart-horizontal/parametric.html", "docs/bar-chart-horizontal/percent.html", "docs/bar-chart-vertical-stacked/eight-cat.html", "docs/bar-chart-vertical-stacked/parametric.html", "docs/bar-chart-vertical-stacked/two-cat.html", "docs/bar-chart-vertical/basic.html", "docs/bar-chart-vertical/long-names.html", "docs/bar-chart-vertical/many-years.html", "docs/bar-chart-vertical/parametric.html", "docs/heat-table/ht-binned-linear.html", "docs/heat-table/ht-kreise.html", "docs/heat-table/ht-wermitwem.html", "docs/heat-table/parametric.html", "docs/line-chart-multiple/eight-cat.html", "docs/line-chart-multiple/label-adjustment.html", "docs/line-chart-multiple/parametric.html", "docs/line-chart-multiple/two-axis.html", "docs/line-chart-multiple/two-cat.html", "docs/line-chart-single/annotated.html", "docs/line-chart-single/basic.html", "docs/line-chart-single/interactive.html", "docs/line-chart-single/negatives-x-axis.html", "docs/line-chart-single/parametric.html", "docs/line-chart-single/percentage-negatives-y-axis.html", "docs/map-baselayer/baselayer-agglomeration-2012.html", "docs/map-baselayer/baselayer-stadtkreise.html", "docs/map-baselayer/baselayer-statquart.html", "docs/map-baselayer/baselayer-statzone.html", "docs/map-baselayer/baselayer-switzerland.html", "docs/map-baselayer/baselayer-wahlkreise.html", "docs/map-extended/quartiere-neubau.html", "docs/map-extended/rastermap-bins-100m.html", "docs/map-extended/rastermap-bins-200m.html", "docs/map-extended/rastermap-bins.html", "docs/map-extended/rastermap-gradient.html", "docs/map-extended/topolayer-stadtkreise.html", "docs/map-extended/topolayer-statquart-neubau.html", "docs/map-signature/signature-statisticalquarters.html", "docs/map-signature/signature-statzone.html", "docs/map-standard/agglomeration.html", "docs/map-standard/cml-quartier-years.html", "docs/map-standard/kreis-parametric.html", "docs/map-standard/kreis.html", "docs/map-standard/quartiere-parametric.html", "docs/map-standard/statistische-zonen.html", "docs/map-standard/switzerland.html", "docs/map-standard/quartiere.html", "docs/map-standard/wahlkreis.html", "docs/pie-charts/four-cat.html", "docs/pie-charts/multiples.html", "docs/pie-charts/parametric.html", "docs/pie-charts/twelve-cat.html", "docs/population-pyramid/parametric.html", "docs/population-pyramid/pyramid-basic.html", "docs/population-pyramid/pyramid-reference.html", "docs/population-pyramid/pyramid-stacked.html", "docs/sankey/sankey-same-sets.html", "docs/sankey/sankey-two-column.html", "docs/scatterplot-over-time/scatterplot-over-time.html", "docs/scatterplot/refline-fake.html", "docs/scatterplot/simple-scatterplot-parametric.html", "docs/scatterplot/variable-radius-parametric.html", "docs/scatterplot/variable-radius.html", "docs/scatterplot/years-fake.html", "docs/sunburst/sunburst-four-cat.html", "docs/sunburst/sunburst-three-cat.html", "docs/sunburst/sunburst-two-cat.html"
  ];

  function loadScriptsSequence(list, callback) {
    var copiedList = list.slice(); // defensive clone, not really necessary for this use case, but...
    var name = copiedList.shift();
    var tag = addEl('script', { src: name });
    tag.onload = function() {
      if (!copiedList.length) { callback(); } else { loadScriptsSequence(copiedList, callback); }
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    var scriptAnchor = document.querySelector('#sszvis-injector');
    var basepath = scriptAnchor.getAttribute('data-basepath');
    var container = document.querySelector(scriptAnchor.getAttribute('data-component'));
    // Save the container
    containerCache = container;
    // Clear the container
    while (container.firstChild) { container.removeChild(container.firstChild); }

    linkDependencies.forEach(function(name) {
      addEl('link', { href: basepath + name, rel: "stylesheet" });
    });

    if (window.define) { window.define.amd = false; } // Screw you dojo

    loadScriptsSequence(scriptDependencies.map(function(s) { return basepath + s; }), function() {
      charts.forEach(function(chartFile, i) {
        var chartId = 'sszvis-chart-' + i;
        addLabel(container, (i + 1) + '.  ' + chartFile);
        addDiv(container, chartId);
        loadFileInto(basepath + chartFile, chartId);
      });
      // Yep
      monkeypatch(sszvis);
    });
  });

  /// ******* Helpers

  function addDiv(parent, divId) {
    var el = document.createElement('div');
    el.setAttribute('id', divId);
    parent.appendChild(el);
    return el;
  }

  function addLabel(parent, text) {
    var el = document.createElement('div');
    el.innerHTML = text;
    el.style = "margin: 3em 0 2.5em 0; text-align: center;";
    parent.appendChild(el);
    return el;
  }

  function reg(str) { return new RegExp(str, 'g'); }

  function objForEach(obj, fn) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        fn(obj[prop], prop, obj);
      }
    }
  }

  // see: http://stackoverflow.com/questions/2592092/executing-script-elements-inserted-with-innerhtml
  function injectScript(scriptText) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.appendChild(document.createTextNode(scriptText));
    document.querySelector('head').appendChild(script);
    return script;
  }

  function addEl(elname, attrs) {
    var element = document.createElement(elname);
    objForEach(attrs, function(val, attrname) {
      element.setAttribute(attrname, val);
    });
    document.querySelector('head').appendChild(element);
    return element;
  }

  function loadFileInto(fileName, containerId) {
    var req = new XMLHttpRequest();
    req.open('GET', fileName, true);
    req.onload = function() {
      if (!this.status === 200) {
        console.log('request failed: ', fileName);
        return;
      }

      var scriptPrefix = '<script data-catalog-project-expose="script\.js">';
      var scriptSuffix = '<\/script>'
      var exampleScript = this.response.match(reg(scriptPrefix + '([^]*)' + scriptSuffix)).join('');

      exampleScript = exampleScript.replace(reg(scriptPrefix + '|' + scriptSuffix), '');

      var fileFolder = fileName.match(new RegExp('^(.*/)([^/]*)$'))[1];
      exampleScript = exampleScript.replace(reg('data/'), fileFolder + 'data/');

      exampleScript = exampleScript.replace(reg('sszvis-chart'), containerId);

      exampleScript = exampleScript.replace(reg('\}\\(d3'), '__globalRenderFunctionCache__["' + containerId + '"] = function() { render(state); }; }(d3');

      injectScript(exampleScript);
    };
    req.onerror = function(err) { console.log('failed to load:', fileName, 'cause: ', err); } 
    req.send();
  }

})();
