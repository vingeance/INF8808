"use strict";

/**
 * Fichier permettant de dessiner les graphiques "focus" et "contexte".
 */


/**
 * Crée une ligne SVG en utilisant les domaines X et Y spécifiés.
 * Cette fonction est utilisée par les graphiques "focus" et "contexte".
 *
 * @param x               Le domaine X.
 * @param y               Le domaine Y.
 * @return d3.svg.line    Une ligne SVG.
 *
 * @see https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89      (voir line generator)
 */
function createLine(x, y) {
  // TODO: Retourner une ligne SVG (voir "d3.line"). Pour l'option curve, utiliser un curveBasisOpen.
  var line = d3.line()
               .x(function(d) { return x(d.date);})
               .y(function(d) { return y(d.count);})
               .curve(d3.curveBasisOpen);
  return line;
}

/**
 * Crée le graphique focus.
 *
 * @param g         Le groupe SVG dans lequel le graphique doit être dessiné.
 * @param sources   Les données à utiliser.
 * @param line      La fonction permettant de dessiner les lignes du graphique.
 * @param color     L'échelle de couleurs ayant une couleur associée à un nom de rue.
 */
function createFocusLineChart(g, sources, line, color) {
  // TODO: Dessiner le graphique focus dans le groupe "g".
  // Pour chacun des "path" que vous allez dessiner, spécifier l'attribut suivant: .attr("clip-path", "url(#clip)").
  g.append("g")
     .attr("id", "focus")
     .selectAll("g")
     .data(sources)
     .enter().append("g")
     .attr("id", function(source) {
          return "focus-" + source.name;
        })
     .attr("stroke-width", function(source) {
          var width;
          source.name == "Moyenne" ? width ="3px": width = "1px";
          return width;
        })
     .attr("stroke", function(source) {
          var colorName;
          source.name == "Moyenne" ? colorName = "black": colorName = color(source.name);
          return colorName;
        })
     .selectAll("path")
     .data(function(source) {
          return [source.values];
        })
     .enter()
     .append("path")
     .attr("class", "line")
     .attr("clip-path", "url(#clip)")
     .attr("d", line)
     .attr("fill", "none");
}

/**
 * Crée le graphique contexte.
 *
 * @param g         Le groupe SVG dans lequel le graphique doit être dessiné.
 * @param sources   Les données à utiliser.
 * @param line      La fonction permettant de dessiner les lignes du graphique.
 * @param color     L'échelle de couleurs ayant une couleur associée à un nom de rue.
 */
function createContextLineChart(g, sources, line, color) {
  // TODO: Dessiner le graphique contexte dans le groupe "g".
  var contextLineGroups = g.append("g")
    .attr("class", "context")
    .selectAll("g")
    .data(sources)
    .enter().append("g");

  contextLineGroups.append("path")
    .attr("class", "line")
    .attr("d", function (d) {
      return line(d.values);
    })
    .attr("clip-path", "url(#clip)")
    .style("stroke", function (d) {
      if (d.name === "Moyenne") {
        return "black"
      }
      return color(d.name);
    })
    .style("stroke-width", function (d) {
      if (d.name === "Moyenne") {
        return 2;
      }
      return 1;
    })
    .attr("id", function (d) {
      return "context" + d.name;
    });
}
