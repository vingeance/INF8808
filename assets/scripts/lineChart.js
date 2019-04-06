/**
 * @see https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89
 */
function create_lineChart(svg, width, height, sources){
  var margin = {top: 50, right: 50, bottom: 50, left: 80}

  var n = 13;
  var xScale = d3.scaleLinear()
      .domain([0, n-1])
      .range([0, width]);

  var yScale = d3.scaleLinear()
      .domain([0, 4000])
      .range([height, 0]);

var months = [0,"Janvier","Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];

  var line = d3.line()
      .x(function(d, i) { return xScale(i); })
      .y(function(d) { return yScale(d); })
      .curve(d3.curveMonotoneX)

  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  svg = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale).tickFormat(function(d,i){return months[i]})); // Create an axis component with d3.axisBottom

      svg.append("text")
             .attr("y", height + 20)
             .attr("x", width/2)
             .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Mois");
  svg.append("g")
      .attr("class", "y axis")
      .text("Total")
      .call(d3.axisLeft(yScale));
      svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Total");
  svg.append("path")
      .datum(sources)
      .attr("class", "line")
      .attr("d", line)
      .attr("id", "line");


  svg.selectAll(".dot")
      .data(sources)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", function(d, i) { return xScale(i) })
      .attr("cy", function(d) { return yScale(d) })
      .attr("r", 5)
        .on("mouseover", function(a, b, c) {
    			console.log(a);
          (this).attr('class', 'focus')
  		})
      .on("mouseover", function(d) {
        d3.select(this).classed("focus", true);
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html("<b> Nombre de  tournages: " + d + "</b>" )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");

            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

}
