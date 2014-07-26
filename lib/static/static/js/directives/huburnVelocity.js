(function() {

  angular.module('huburn').directive('huburnVelocity', ['d3', function(d3) {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function(scope, element, attrs) {
        var svg = d3.select(element[0])
          .append('svg')
          .attr({ class: 'velocity' });

        var render = function(data) {
          svg.selectAll('*').remove();

          if (!data || !data.length) return;

          var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return d.title + ': ' + d.points + ' points';
            });

          svg.call(tip);
        
          var yValue = function(d) { return d.points; };

          var width = svg.node().offsetWidth;
          var height = svg.node().offsetHeight;
          var padding = 20;
          var barPadding = 2;
          var chartWidth = width - 150 - padding * 3;

          var yScale = d3.scale.linear()
            .domain([0, d3.max(data, yValue)])
            .range([height - padding * 2, 0]);

          var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .tickSize(chartWidth)
            .ticks(2);

          var gy = svg.append('g')
            .attr({ 
              class: "axis",
              transform: "translate(" + (chartWidth + padding * 2) + "," + padding + ")"
            })
            .call(yAxis);

          var xValue = function(d) { return new Date(d.due_on); };

          var xScale = d3.time.scale()
            .domain([d3.min(data,xValue), d3.max(data,xValue)])
            .rangeRound([0, chartWidth]);

          var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(d3.time.months, 3)
            .tickSize(0)
            .tickFormat(d3.time.format('%b'));

          var gx = svg.append('g')
            .attr({
              class: "axis",
              transform: "translate(" + padding + "," + (height - padding) + ")"
            })
            .call(xAxis);

          svg.selectAll('rect')
            .data(data)
            .enter()
              .append('rect')
              .attr({
                height: 0,
                width: (chartWidth - padding) / data.length - barPadding,
                x: function(d,i) { return i * (chartWidth - 8) / data.length + padding * 2 + 5; },
                y: height - padding
              })
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide)
              .transition()
              .duration(750)
              .attr({
                height: function(d) { return height - padding * 2 - yScale(yValue(d)); },
                y: function(d) { return padding + yScale(yValue(d)); }
              });

          var lastEightMilestones = data.slice(-8);

          appendBadge(svg, chartWidth + padding * 3, 5, 'Velocity', d3.mean(lastEightMilestones, yValue).toFixed(1));
        }; 

        scope.$watch('data', function(newVals, oldVals) {
          return render(newVals);
        }, true);
      }
    };
  }]);

  var appendBadge = function(svg, x, y, title, value) {
    var badge = svg.append('g').attr({ class: "badge", transform: "translate(" + x + "," + y + ")" });
    badge.append('text').attr({ class: "title", x: 0, y: 28 }).text(title);
    badge.append('text').attr({ class: "value", x: 0, y: 28 + 48 }).text(value);
  };

})();