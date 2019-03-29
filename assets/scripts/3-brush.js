"use strict";

/**
* Fichier permettant de gérer le zoom/brush.
*/


/**
 * Permet de redessiner le graphique focus à partir de la zone sélectionnée dans le graphique contexte.
 *
 * @param brush     La zone de sélection dans le graphique contexte.
 * @param g         Le groupe SVG dans lequel le graphique focus est dessiné.
 * @param line      La fonction permettant de dessiner les lignes du graphique.
 * @param xFocus    L'échelle en X pour le graphique focus.
 * @param xContext  L'échelle en X pour le graphique contexte.
 * @param xAxis     L'axe X pour le graphique focus.
 * @param yAxis     L'axe Y pour le graphique focus.
 *
 * @see http://bl.ocks.org/IPWright83/08ae9e22a41b7e64e090cae4aba79ef9       (en d3 v3)
 * @see https://bl.ocks.org/mbostock/34f08d5e11952a80609169b7917d4172    ==> (en d3 v5) <==
 */
function brushUpdate(brush, g, line, xFocus, xContext, xAxis, yAxis, sources, color, lineContext) {
  // TODO: Redessiner le graphique focus en fonction de la zone sélectionnée dans le graphique contexte.
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;
  var s = d3.event.selection || xContext.range();
  xFocus.domain(s.map(xContext.invert, xContext));
  g.selectAll("path.line").attr("d", line);
  g.select(".x.axis").call(xAxis);
  g.select(".y.axis").call(yAxis);
  d3.select("#graphChart").selectAll("path").remove();
  createFocusGraphChart(g, sources, line, color);
  createContextLineChart(focus, sources, lineContext, color);
}
