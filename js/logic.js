
// set the dimensions and margins of the graph
var margin = {top: 40, right: 20, bottom: 50, left: 100};
var width1 = 500 - margin.left - margin.right;
var height1 = 300 - margin.top - margin.bottom;

//Read the data
d3.csv("region_temp.csv", function(data) {

  // group the data: I want to draw one line per group
  var tempData = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(d => d.region)
    .entries(data);

  // What is the list of groups?
  allKeys = tempData.map(d => d.key)
  
  // Add X axis --> it is a date format
  var x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([ 0, width1 ]);
    
    // color palette
  var color = d3.scaleOrdinal()
    .domain(allKeys)
    .range(['limegreen','orange','blue','red','purple','lightblue','green','pink'])
    //   // interactive Play Botton  
    

  // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
  var svg = d3.select("#scatter")
    .selectAll("uniqueChart")
    .data(tempData)
    .enter()
    .append("svg")
      .attr("width", width1 + margin.left + margin.right)
      .attr("height", height1 + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
            .each(multiple);

  svg
    .append("g")
    .attr("transform", "translate(0," + height1 + ")")
    .call(d3.axisBottom(x).ticks(3).tickFormat(d3.format("d")));
  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", 200)
    .attr("y",250)
    .text("Year")
    .style('font-size', '1rem');

  
  // Add titles
  svg
    .append("text")
    .attr("text-anchor", "start")
    .attr("y", -5)
    .attr("x", 0)
    .text(d => d.key)
    .style("fill", d => color(d.key))
    
    function multiple(item) {
    	  var svg = d3.select(this);
        
          var y = d3.scaleLinear()
      .domain(d3.extent(item.values, d => +(d.avg_temp *1.8) +32))
      .range([height1, 0]);
      
      svg.append("g")
        .call(d3.axisLeft(y));
      svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 15)
      .attr("x", -10)
      .attr("dy", "-4em")
      .attr("transform", "rotate(-90)")
      .text("Temperature (F)")
      .style('font-size', '1rem');
    
      var line = d3.line()
      .x(d => x(+d.year))
      .y(d => y(+(d.avg_temp *1.8) +32));
    
    // Draw the line
  svg
    .append("path")
      .attr("fill", "none")
      .attr("stroke", d => color(d.key))
      .attr("stroke-width", 1.9)
      .attr("d", line(item.values))
    }
    

})
