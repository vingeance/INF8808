
function create_lineChart(svg, width, height, sources){
  // 2. Use the margin convention practice
  var margin = {top: 50, right: 50, bottom: 50, left: 80}

  // The number of datapoints
  var n = 13;

  // 5. X scale will use the index of our data
  var xScale = d3.scaleLinear()
      .domain([0, n-1])
      .range([0, width]); // output

  // 6. Y scale will use the randomly generate number
  var yScale = d3.scaleLinear()
      .domain([0, 4000]) // input
      .range([height, 0]); // output

var months = [0,"Janvier","Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
  // 7. d3's line generator
  var line = d3.line()
      .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
      .y(function(d) { return yScale(d); }) // set the y values for the line generator
      .curve(d3.curveMonotoneX) // apply smoothing to the line

  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // 1. Add the SVG to the page and employ #2
  svg = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// d3.axisBottom(xScale).tickFormat(function(d,i){return months[i]});
  // 3. Call the x axis in a group tag
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
  // 4. Call the y axis in a group tag
  svg.append("g")
      .attr("class", "y axis")
      .text("Total")
      .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft
      svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Total");
  // 9. Append the path, bind the data, and call the line generator
  svg.append("path")
      .datum(sources) // 10. Binds data to the line
      .attr("class", "line") // Assign a class for styling
      .attr("d", line); // 11. Calls the line generator


  // 12. Appends a circle for each datapoint
  svg.selectAll(".dot")
      .data(sources)
    .enter().append("circle") // Uses the enter().append() method
      .attr("class", "dot") // Assign a class for styling
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
            div	.html("<b> Nombre de  tournage: " + d + "</b>" )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");

            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

}
