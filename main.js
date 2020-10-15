const margin = ({top: 20, right: 20, bottom: 20, left: 20});
const width = 650 - margin.left - margin.right;
const height = 650 - margin.top - margin.bottom;

padding = 20;

toolTip = document.querySelector('.tooltip');



d3.csv('./data/wealth-health-2014.csv', d3.autoType).then(data => {

	console.log(data);
	
	const xScale =  d3.scaleLinear()
		.domain(d3.extent(data, function(d) { return d.Income; }))
		.range([padding, width]);

	const yScale = d3.scaleLinear()
		.domain(d3.extent(data, function(d) { return d.LifeExpectancy; }))
		.range([height - padding, 0]);

	const popScale = d3.scaleLinear()
		.domain(d3.extent(data, function(d) { return d.Population; }))
		.range([5, 20]);

	const regionScale = d3.scaleOrdinal()
		.range(d3.schemeTableau10);

	const xAxis = d3.axisBottom()
		.scale(xScale)
		.ticks(5, 's');

	const yAxis = d3.axisLeft()
		.scale(yScale)
		.ticks(6, 's');


	const svg = d3.select('.chart').append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	svg.selectAll(".circles")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx", function(d) {
		return xScale(d.Income);
	})
	.attr('cy', function(d) {
		return yScale(d.LifeExpectancy);
	})
	.attr('r', function(d) {
		return popScale(d.Population);
	})
	.attr('fill', function(d) {
		return regionScale(d.Region);
	})
	.attr('stroke', '#000080')
	.attr('opacity', '0.5')
	.attr('class', 'circles')
	.on('mouseenter', (event, d) => {
		const pos = d3.pointer(event, window);
		toolTip.style.display = 'block';
		

		console.log(pos);

		d3.select('.tooltip').html(
			`
				<div class='row'>
					<p class='column txt'>Country: ${d.Country}</br>
					Life Expectancy: ${d.LifeExpectancy}</br>
					Income: $${d3.format(',')(d.Income)}</br>
					Population: ${d3.format(',')(d.Population)}</br>		
					Region: ${d.Region}</p>
				</div>
			`
		);

		toolTip.style.top = `${pos[1] + 10}px`;
		toolTip.style.left = `${pos[0] + 10}px`;
	})
	.on('mouseleave', (event, d) => {
		toolTip.style.display = 'none';
	});

	svg.append('g')
		.attr('class', 'axis x-axis')
		.attr('transform', `translate(0, ${height})`)
		.call(xAxis);

	svg.append('g')
		.attr('class', 'axis y-axis')
		.call(yAxis);

	svg.append('text')
		.attr('x', width - 75)
		.attr('y', height - 10)
		.attr('class', 'text')
		.text('Income');

	svg.append('text')
		.attr('x', 15)
		.attr('y', 20)
		.attr('class', 'yAxisLabel')
		.text('Life Expectency');
	

	const svg1 = d3.select('.chart').append('svg')
	.attr('width', 250)
	.attr('height', 175)
	.attr('class', 'legend');

	let count = 0;

	svg1.selectAll("rect")
	.data(regionScale.domain())
	.enter()
	.append("rect")
	.attr('width', 20)
	.attr('height', 20)
	.attr('x', 0)
	.attr('y', function(d) {
		let y = count * 25;
		count++;
		return y;
	})
	.attr('fill', function(d) {
		return regionScale(d);
	});

	let count1 = 0;

	svg1.selectAll('.texts')
	.data(regionScale.domain())
	.enter()
	.append('text')
	.text(function(d) {
		console.log(d);
		return d;
	})
	.attr('x', 30)
	.attr('y', function(d) {
		let y = 15 + (count1 * 25);
		count1++;
		return y;
	})

	
})


