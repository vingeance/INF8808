"use strict";

function brushUpdate(brush, g, line, xFocus, xContext, xAxis, yAxis) {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;
  var s = d3.event.selection || xContext.range();
  xFocus.domain(s.map(xContext.invert, xContext));
  g.selectAll("path.line").attr("d", line);
  g.select(".x.axis").call(xAxis);
  g.select(".y.axis").call(yAxis);
}
