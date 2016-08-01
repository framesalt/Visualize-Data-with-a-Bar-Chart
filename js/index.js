
d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', 
           function(data){
  
          processData(data);
       
      });

function processData(data){
  /*
  data.description;
  data.source_name;
  data.code;
  data.name;
  data.updated.at;
  data.from_date;
  data.to_data; */
  
  
  
  
  var reg = /\d+/;
  
  
  var canvasWidth = 1000;
  var canvasHeight = 500;
  
  var dates = [];
  var values = [];
  for ( var i = 0; i < data.data.length; i ++ ){
    dates.push(reg.exec(data.data[i][0])[0]);
    values.push(data.data[i][1]);
  }
  
  // value scale
  var scaleValuesByHeight = d3.scale.linear()
                      .domain([d3.min(values), d3.max(values)])
                      .range([canvasHeight, 0 ]);
  
  
  var scaleValuesByDates = d3.scale.linear()
                          .domain([d3.min(dates), d3.max(dates)])
                          .range([0, canvasWidth]);
 
  
  var canvasFrame = d3.select('body')
                .append('svg');
  
  var canvas =  canvasFrame
                .append('g')
                .attr('transform', 'translate(30,50)')
                .attr('width', canvasWidth)
                .attr('height', canvasHeight);
  
  
  
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d, i ){return "<strong>$</strong><span>" + d + " billions<br>" + dates[i] + "</span>";});
  
  
  canvas.call(tip);
  
  
  var rectWidth = canvasWidth / values.length;

  
  var rect = canvas.selectAll('rect')
                    .data(values)
                    .enter()
                    .append('rect')
                    .attr('x', function(d, i ) {  return i * rectWidth+35})
                    .attr('y', function(d, i) { return scaleValuesByHeight(d)})
                    .attr('width', rectWidth)
                    .attr('height', function(d, i){ return  canvasHeight - scaleValuesByHeight(d)+20;})
                    .attr('fill', '#337ab7')
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);
  
 
  
  canvasFrame.append('g')
        .transition()
        .duration(500)
        .attr('transform', 'translate(65, ' + (canvasHeight + 80) + ')' )
        .call(d3.svg.axis().scale(scaleValuesByDates).orient('bottom').tickFormat(d3.format('d')).ticks(20).tickSize(3,1));
  
   canvasFrame.append('g')
        .transition()
        .duration(500)
        .attr('transform', 'translate(60, 50)')
        .call(d3.svg.axis().scale(scaleValuesByHeight).orient('left').ticks(25).tickSize(3,1));
                      
  
  $("#name").text(data.name);
  $('#code').text(data.code);
  $('#fromDate').text(new Date(data.from_date).toLocaleDateString());
  $('#toDate').text(new Date(data.to_date).toLocaleDateString());
  
  $('body').append('<h1>'+ data.description +"</h1>");
  
  
}