d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', render);

function render(data) {
  var container_dim = {width:1000, height:580},
      margins = {top:80,right:40,bottom:80,left:60},
      chart_dim = {
        width:container_dim.width-margins.left-margins.right,
        height:container_dim.height-margins.top-margins.bottom
      };
  var gdp_data = data.data;

  var yScale = d3.scaleLinear()
  .domain([0, d3.max(gdp_data, function(d) { return d[1]; })])
  .range([chart_dim.height,0]);

  var timeScale = d3.scaleTime()
  .domain(d3.extent(gdp_data, function(d) { return new Date(d[0]+'GMT -11:00'); }))
  .range([0, chart_dim.width]);

  var xAxis = d3.axisBottom(timeScale);
  var yAxis = d3.axisLeft(yScale);

  var svg = d3.select('.page').append('svg')
  .attr('height', container_dim.height)
  .attr('width', container_dim.width);

  svg.append('text')
    .text('United States GDP')
    .attr('x', container_dim.width/3)
    .attr('y', 60)
    .attr('id', 'title');

  var plot = svg.append('g')
  .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

  var divtt = d3.select('body').append('div')
  .attr('id', 'tooltip');

  var rects = plot.selectAll('rect').data(gdp_data)
  .enter()
  .append('rect')
  .attr('class','bar')
  .attr('height', function(d) { return chart_dim.height - yScale(d[1])})
  .attr('width', chart_dim.width/gdp_data.length)
  .attr('x', function(d) { return timeScale(new Date(d[0]+'GMT -11:00')); })
  .attr('y', function(d) { return yScale(d[1])});

  plot.append('g')
    .attr('id','x-axis')
    .attr('class', 'tick')
    .attr('transform', 'translate(0,' + chart_dim.height + ')')
    .call(xAxis);

  plot.append('g')
    .attr('class', 'tick')
    .attr('id','y-axis')
    .call(yAxis);

  plot.append('text')
    .text('Gross Domestic Product')
    .attr('transform', 'rotate(-90, 0, 0) translate(-200,20)')
    .style('font-size', '100%')
    .style('font-family', 'Arial');

  rects.on('mouseover', function(d) {
    var fecha = new Date(d[0]+'GMT -11:00');
    var msg = fecha.getFullYear(fecha) + ' ' + quarter(fecha) 
    + '<br>$ ' + d[1].toLocaleString() + ' Billion';
    divtt.style('opacity',0.9);
    divtt.style('left', 4*margins.left + timeScale(fecha)+'px');
    divtt.style('top' , chart_dim.height + 'px');
    divtt.html(msg);
    d3.select(this)
      .style('fill','yellow');
    console.log(divtt.attr('style'));
  });

  rects.on('mouseout', function(d) {
    divtt.style('opacity',0);
    d3.select(this)
      .style('fill', 'steelblue')
  })
}

function quarter(date) {
  var m = date.getMonth();
  return 'Q' + (Math.floor(m/3) + 1);
}