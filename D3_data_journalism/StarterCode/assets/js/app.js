var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/js/data.csv").then(function(setData) {


setData.forEach(function(data) {
    data.age = +data.age;
    data.smokes = +data.smokes;
});

var xLinearScale = d3.scaleLinear()
    .domain([20, d3.max(setData, d => d.age)])
    .range([0, width]);

var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(setData, d => d.smokes)])
    .range([height, 0]);

var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

chartGroup.append("g")
    .call(leftAxis);

var circlesGroup = chartGroup.selectAll("circle")
.data(setData)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d.age))
.attr("cy", d => yLinearScale(d.smokes))
.attr("r", "15")
.attr("fill", "green")
.attr("opacity", ".5");

var textGroup = chartGroup.selectAll("li")
    .data(setData)
    .enter()
    .append('text')
    .attr('class', 'stateText')
    .attr('x', d => xLinearScale(d.age))
    .attr('y', d => yLinearScale(d.smokes))
    .attr('font-size',10)
    .text(d => d.abbr);

var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
    return (`Age of Individual ${d.age}<br> Smokes: ${d.smokes}<br>State: ${d.abbr}`);
    });

chartGroup.call(toolTip);

circlesGroup.on("click", function(data) {
    toolTip.show(data, this);
})
    .on("mouseout", function(data, index) {
    toolTip.hide(data);
    });

chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Smokers");

chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Age");
}).catch(function(error) {
console.log(error);
});
