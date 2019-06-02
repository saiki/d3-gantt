import * as d3 from 'd3';

var tasks = [
	{"taskId": 1,"startDate":new Date(2019, 7,  1),"endDate":new Date(2019, 7,  2),"taskName":"E Job","status":"RUNNING"},
	{"taskId": 2,"startDate":new Date(2019, 7,  3),"endDate":new Date(2019, 7,  9),"taskName":"D Job","status":"RUNNING"},
	{"taskId": 3,"startDate":new Date(2019, 7, 12),"endDate":new Date(2019, 7, 18),"taskName":"P Job","status":"SUCCEEDED"},
	{"taskId": 4,"startDate":new Date(2019, 7, 21),"endDate":new Date(2019, 7, 30),"taskName":"N Job","status":"KILLED"}
];

const MARGIN = 60;
const WIDTH = window.innerWidth - 2 * MARGIN;
const HEIGHT =window.innerHeight - 2 * MARGIN;

const svg = d3.select("#container").append("svg")

d3.json("https://unpkg.com/d3-time-format@2.1.3/locale/ja-JP.json").then(function(locale) {

	d3.timeFormatDefaultLocale(locale);

	const timeDomainStart = d3.min(tasks.map( d => d.startDate ));
	const timeDomainEnd =  d3.max(tasks.map( d => d.endDate ));
	const xRangeMax = d3.timeDay.count(timeDomainStart, timeDomainEnd) * 60;
	const yRangeMax = tasks.map( d => d.taskName ).length * 61;

	const xScale = d3.scaleTime()
		.domain([timeDomainStart, timeDomainEnd])
		.range([MARGIN, xRangeMax])
		.clamp(true)
	;

	const yScale = d3.scaleBand()
		.domain(tasks.map( d => d.taskName ))
		.range([MARGIN, yRangeMax])
		.padding(1)
	;

	const xAxis = d3.axisTop(xScale)
		.ticks(d3.timeDay.every(1))
		.tickFormat(d3.timeFormat("%m/%d"))
		.tickSize(-yRangeMax)
	;
	const yAxis = d3.axisLeft(yScale)
		.tickSize(-xRangeMax)
	;

	svg.append("g")
		.attr("class", "x axis")
		.attr('transform', `translate(0, ${MARGIN})`)
		.call(xAxis);
	svg.append("g")
		.attr("class", "y axis")
		.attr('transform', `translate(${MARGIN}, 0)`)
		.call(yAxis);

	svg.attr("width", xRangeMax + MARGIN);
	svg.attr("height", yRangeMax + MARGIN);

	var rectTransform = (function(x, y) {
		return function(d) {
			return "translate(" + x(d.startDate) + "," + y(d.taskName) + ")";
		}
	})(xScale, yScale);


	svg.selectAll("rect").data(tasks)
		.enter()
		.append("rect")
		.attr("rx", 5)
		.attr("ry", 5)
		.attr("y", 0)
		.attr("transform", rectTransform)
		.attr("height", function(d) { return 40; })
		.attr("width", function(d) {
			return (xScale(d.endDate) - xScale(d.startDate));
		});
});
