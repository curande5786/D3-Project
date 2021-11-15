var width = parseFloat(d3.select('#scatter').style('width'));
var height = .66 * width;

var svg = d3.select('#scatter')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

var scaleLoc = svg.append('g').attr('transform', `translate(${width / 6},${.77 * height})`);
var xScaleLoc = scaleLoc.append('g');
var yScaleLoc = scaleLoc.append('g');
    
var xText = svg.append('g').attr('transform', `translate(${width / 2},${.97 * height})`);

xText
    .append('text')
    .text('Household Income (Median)')
    .attr('class', 'x inactive aText')
    .attr('dataId', 'income');

xText
    .append('text')
    .text('Age (Median)')
    .attr('y', -20)
    .attr('class', 'x inactive aText')
    .attr('dataId', 'age');

xText
    .append('text')
    .text('In Poverty (%)')
    .attr('y', -40)
    .attr('class', 'x active aText')
    .attr('dataId', 'poverty');

var yText = svg.append('g')
    .attr('transform', `translate(${.03 * width},${.5 * height})rotate(-90)`);

yText
    .append('text')
    .text('Obese (%)')
    .attr('class', 'y active aText')
    .attr('dataId', 'obesity');

yText
    .append('text')
    .text('Smokes (%)')
    .attr("y", 25)
    .attr('class', 'y inactive aText')
    .attr('dataId', 'smokes');

yText
    .append('text')
    .text('Lacks Healthcare (%)')
    .attr("y", 50)
    .attr('class', 'y inactive aText')
    .attr('dataId', 'healthcare');

renderChart();

d3.selectAll('.aText').on('click', function () {
    if (d3.select(this).classed('x')) {
        d3.selectAll('.x').filter('.active').classed('active', false).classed('inactive', true);
    } else {
        d3.selectAll('.y').filter('.active').classed('active', false).classed('inactive', true);
    };
    d3.select(this).classed('inactive', false).classed('active', true);

    renderChart();
});

function renderChart() {
    var xSel = d3.selectAll('.x').filter('.active').attr('dataId');
    var ySel = d3.selectAll('.y').filter('.active').attr('dataId');

    d3.csv('assets/data/data.csv').then(data => {
        var x = data.map(obj => +obj[xSel]);
        var y = data.map(obj => +obj[ySel]);
     

        var toolTip = d3.tip().attr('class','d3-tip').html( function (d) {
            var output =
            `<div>${d.state}</div>
            <div>${xSel}: ${d[xSel]}${xSel=='poverty' ? '%' : ''}</div>
            <div>${ySel}: ${d[ySel]} %</div>`;

            return output;
        });

        svg.append('g').call(toolTip);

        var circles = scaleLoc.selectAll('g').data(data).enter().append('g').on('mouseover', function (d) {
            toolTip.show(d,this);
            d3.select(this).style('stroke','#323232');
        })
        .on('mouseout', function (d) {
            toolTip.hide(d);
            d3.select(this).style('stroke','#e3e3e3')
        });

        circles.append('circle').attr('r',.02*width).attr('class','stateCircle');
        circles.append('text').attr('class','stateText');

        var xScaler = d3.scaleLinear().range([0,.8*width]).domain([.95*d3.min(x),1.02*d3.max(x)]);
        xScaleLoc.call(d3.axisBottom(xScaler));
        var yScaler = d3.scaleLinear().range([0,-.75*height]).domain([.95*d3.min(y),1.02*d3.max(y)]);
        yScaleLoc.call(d3.axisLeft(yScaler));


        d3.selectAll('.stateCircle').transition().duration(1000).attr('cx',d=> xScaler(d[xSel])).attr('cy',d=> yScaler(d[ySel]));

        d3.selectAll('.stateText').transition().duration(1500).attr('dx',d=>xScaler(d[xSel])).attr('dy',d=>yScaler(d[ySel])+5).text(d=>d.abbr)
    });
};

