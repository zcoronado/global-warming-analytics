// Define SVG area dimensions
var svgWidth = 600;
var svgHeight = 300;

// Define the chart's margins as an object
var margin = {
  top: 80,
  right: 60,
  bottom: 60,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#iceLine")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Configure a parseTime function which will return a new Date object from a string
var parseTime = d3.timeParse("%Y");

// Load data from miles-walked-this-month.csv
d3.csv("ice_data.csv").then(function(iceData) {
  
  // Format the date and cast the miles value to a number
  iceData.forEach(function(data) {
    // data.date = parseTime(data.date);
    // data.miles = +data.miles;
    data.year = parseTime(data.year);
    data.extent = +data.extent;
  });

  // Configure a time scale with a range between 0 and the chartWidth
  // Set the domain for the xTimeScale function
  // d3.extent returns the an array containing the min and max values for the property specified
  var xTimeScale = d3.scaleTime()
    .range([0, chartWidth])
    .domain(d3.extent(iceData, data => data.year));

  // Configure a linear scale with a range between the chartHeight and 0
  // Set the domain for the xLinearScale function
  var yLinearScale = d3.scaleLinear()
    .range([chartHeight, 0])
    .domain([3, d3.max(iceData, data => data.extent+.33)]);

  // Create xaxis label
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 50})`);

  xlabelsGroup.append("text")
    .text("YEAR");

  // Create yaxis label
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)", `translate(${svgWidth}, ${svgHeight})`);

  ylabelsGroup.append("text")
    .attr("x", - (svgHeight / 2))
    .attr("y", - 50)
    .text("million square km");

  // Create two new functions passing the scales in as arguments
  // These will be used to create the chart's axes
  var xAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%Y"));
  var yAxis = d3.axisLeft(yLinearScale);
  var xGrid = d3.axisBottom(xTimeScale).tickSize(-chartHeight).tickFormat('');
  var yGrid = d3.axisLeft(yLinearScale).tickSize(-chartWidth).tickFormat('');


  // append grids
  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .attr("class", "x axis-grid")
    .call(xGrid);

  chartGroup.append("g")
    .attr("class", "y axis-grid")
    .call(yGrid);

  // Configure a drawLine function which will use our scales to plot the line's points
  var drawLine = d3.line()
    .x(data => xTimeScale(data.year))
    .y(data => yLinearScale(data.extent));

  
  

  // Append an SVG group element to the SVG area, create the left axis inside of it
  chartGroup.append("g")
    .classed("axis", true)
    .call(yAxis);

  // Append an SVG group element to the SVG area, create the bottom axis inside of it
  // Translate the bottom axis to the bottom of the page
  chartGroup.append("g")
    .classed("axis", true)
    .attr("transform", "translate(0, " + chartHeight + ")")
    .call(xAxis);
  
    chartGroup.append("text")
    .attr("transform", `translate(${chartWidth/2}, ${-20   })`)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .attr("class", "aquaIce")
    .text("Ice Caps Extent Area")
    
  // interactive Play Botton  
    
    var barWrapper2 = chartGroup.append("g")
    var textWrapper2 = chartGroup.append("g")
    var play = textWrapper2.append("text")
  .attr("class", "play")
  .attr("x", 0)
  .attr("y", -10)
  .text("\u25B7")  //unicode triangle: U+25B2  \u25b2
  // var play = chartGroup.append("g").attr()
  play.on("click", function(){

    if (d3.select("path.line3")) {
      d3.select("path.line3").remove();
  }
    //   // Append an SVG path and plot its points using the line function
    // chartGroup.append("path")
    // // The drawLine function returns the instructions for creating the line for iceData
    // .attr("d", drawLine(iceData))
    // .classed("line", true)
   
    var path = barWrapper2.append("path")
        .attr("d", drawLine(iceData))
        .classed("line3", true)
        .attr("fill","none")
        

    var totalLength = path.node().getTotalLength();

    path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(15)
        .duration(duration * 40/170)
        .attr("stroke-dashoffset", 0)
        .attr("fill","none");

        

  
  });
  // Create Tooltip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([100, 60])
    .html(function(d) {
      return (`${d3.timeFormat("%Y")(d.year)}<br><br>${d.extent} million square km`);
    });

  // Append circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(iceData)
    .enter()
    .append("circle")
    .attr("cx", d => xTimeScale(d.year))
    .attr("cy", d => yLinearScale(d.extent))
    .attr("r", "3")
    .on("mouseover", function(d) {
      toolTip.show(d, this)
    })
    .on("mouseout", function(d) {
      toolTip.hide(d)
    });

  circlesGroup.call(toolTip);

  
    // }); 
   
}).catch(function(error) {
  console.log(error);
});
