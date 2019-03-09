
function create_iris_plot(parent, width, height, data){
    const margins = {top:10, bottom:50, left:50, right:10};
    const chart_width = width - margins.left - margins.right;
    const chart_height = height - margins.top - margins.bottom;

    let x_metric = 'sepal_width';
    let y_metric = 'sepal_length';
    let color = "black";
    let opacity = 1;

    const chart = parent.append("g")
    .attr("id", "scatterplot")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);

    const x_scale = d3.scaleLinear()
        .range([0, chart_width])
        .domain(d3.extent(data, (d)=>+d[x_metric]));

    const y_scale = d3.scaleLinear()
        .range([chart_height, 0])
        .domain(d3.extent(data, (d)=>+d[y_metric]));

    const x_axis = chart.append("g")
        .attr("transform", `translate(0, ${chart_height})`)
        .call(d3.axisBottom(x_scale));

    const y_axis = chart.append("g")
        .call(d3.axisLeft(y_scale));


    chart.append("text")
        .attr("id", "x_label")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${chart_width/2}, ${chart_height+ 3*margins.bottom/4})`)
        .text(x_metric);

    chart.append("text")
        .attr("id", "y_label")
        .attr("text-anchor", "middle")
        .attr("transform",`translate(${3*-margins.left/4}, ${chart_height/2})rotate(-90)`)
        .text(y_metric);

    const circles = chart.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (d,i)=> x_scale(d[x_metric]))
        .attr("cy", (d) => y_scale(d[y_metric]))
        .attr("r", 3)
        .style("fill", color);

    circles.on("mouseover", function(d){
        const coordinates = [d3.event.pageX, d3.event.pageY];

        const info = d3.select("#tooltip");

        info.style("left", (coordinates[0] + 25 )+ "px")
        .style("top", (coordinates[1] + 25 )+ "px")
        .classed("hidden", false);

        info.select("#class").text(d.class);
        info.select("#petal_length").text(d.petal_length);
        info.select("#petal_width").text(d.petal_width);
        info.select("#sepal_length").text(d.sepal_length);
        info.select("#sepal_width").text(d.sepal_width);
    })
    .on("mouseout", function(){
        d3.select("#tooltip")
        .classed("hidden", true);

    });

    const update_chart =  function(){
        console.log("scatterplot chart opacity", opacity);
        chart.transition()
        .duration(800)
        .style("opacity", opacity);

        x_scale.domain(d3.extent(data, (d)=>+d[x_metric]));
        y_scale.domain(d3.extent(data, (d)=>+d[y_metric]));
        x_axis.call(d3.axisBottom(x_scale));
        y_axis.call(d3.axisLeft(y_scale));

        d3.select("#x_label").text(x_metric);
        d3.select("#y_label").text(y_metric);

        circles.transition()
        .duration(500)
        .attr("cx", (d,i)=> x_scale(d[x_metric]))
        .attr("cy", (d) => y_scale(d[y_metric]))
        .style("fill", color);


    }

    update_chart.x_metric = (new_x_metric) => {
        if (new_x_metric){
            x_metric = new_x_metric;
            return update_chart;
        }else{
            return x_metric;
        }
    }

    update_chart.y_metric = (new_y_metric) => {
        if (new_y_metric){
            y_metric = new_y_metric;
            return update_chart;
        }else{
            return y_metric;
        }
    }

    update_chart.color = (new_color)=>{
        if (new_color){
            color = new_color;
            return update_chart;
        }else{
            return color;
        }

    }

    update_chart.opacity = (new_opacity)=>{
        if (new_opacity !==undefined){
            opacity = new_opacity;
            return update_chart;
        }else{
            return opacity;
        }

    }

    return update_chart;
}

function create_iris_barchart(parent, width, height, metric, data){
    const margins = {top:10, bottom:50, left:75, right:10};
    const chart_width = width - margins.left - margins.right;
    const chart_height = height - margins.top - margins.bottom;

    const chart = parent.append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);

    const x_scale = d3.scaleLinear()
        .range([0, chart_width])
        .domain([0,d3.max(data, (d)=>+d[metric])]);

    const y_scale = d3.scaleBand()
        .range([chart_height, 0])
        .domain(data.map((d)=>d.class));



    const y_axis = chart.append("g")
        .call(d3.axisLeft(y_scale));


    chart.append("text")
        .attr("id", "x_label")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${chart_width/2}, ${chart_height+ 3*margins.bottom/4})`)
        .text(metric);

    const bars = chart.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("y", d=>y_scale(d.class))
    .attr("width", d=>x_scale(d[metric]))
    .attr("height", y_scale.bandwidth())
    .style("fill", "lightgrey")
    .style("stroke", "black");

}

function create_mini_barcharts(parent, width, height, data){
    let opacity = 0;
    let aggregate_data = d3.nest()
        .key(d=>d.class)
        .entries(data);

    aggregate_data = aggregate_data.map(d => ({
        class: d.key,
        petal_length: d3.mean(d.values, item=>+item.petal_length),
        petal_width: d3.mean(d.values, item=>+item.petal_width),
        sepal_length: d3.mean(d.values, item=>+item.sepal_length),
        sepal_width: d3.mean(d.values, item=>+item.sepal_width),
    }));

    const chart = parent.append("g")
    .style("opacity", 0);

    const petal_length_plot = chart.append("g");
    create_iris_barchart(petal_length_plot, width/2, height/2, "petal_length", aggregate_data);
    const petal_width_plot = chart.append("g")
        .attr("transform", `translate(${width/2}, 0)`);
    create_iris_barchart(petal_width_plot, width/2, height/2, "petal_width", aggregate_data);
    const sepal_length_plot = chart.append("g")
    .attr("transform", `translate(0, ${height/2})`);
    create_iris_barchart(sepal_length_plot, width/2, height/2, "sepal_length", aggregate_data);
    const sepal_width_plot = chart.append("g")
    .attr("transform", `translate(${width/2}, ${height/2})`);
    create_iris_barchart(sepal_width_plot, width/2, height/2, "sepal_width", aggregate_data);

    const update_chart = function(){
        console.log("bar chart opacity", opacity);
        chart.transition()
        .duration(800)
        .style("opacity", opacity);
    }

    update_chart.opacity = (new_opacity)=>{
        if (new_opacity !==undefined){
            opacity = new_opacity;
            return update_chart;
        }else{
            return opacity;
        }

    }
    return update_chart;

}
