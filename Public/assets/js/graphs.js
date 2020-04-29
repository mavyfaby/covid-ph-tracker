class Graph {
	constructor(ctx, config) {		
		const newConfig = {
			data: {
				datasets: [{
					label: config.title,
					backgroundColor: Chart.helpers.color(config.color).alpha(0.5).rgbString(),
					borderColor: config.color,
					pointRadius: config.pointRadius,
					type: config.type,
					data: [],
					lineTension: 0,
					fill: true,
					borderWidth: config.borderWidth
				}]
			},
			options: {
				scales: {
					xAxes: [{
						type: config.xAxes.type,
						distribution: config.xAxes.distribution,
						offset: false,
						ticks: {
							autoSkip: true,
							major: {
								enabled: true,
								fontStyle: "bold"
							},
							source: "data",
							maxTicksLimit: 6
						}
					}],
					yAxes: [{
						gridLines: {
							drawBorder: false
						},
						scaleLabel: {
							display: true,
							labelString: config.labelY
						}
					}]
				},
				tooltips: {
					intersect: false,
					mode: 'index',
					callbacks: {
						label: function(tooltipItem, myData) {
							let label = myData.datasets[tooltipItem.datasetIndex].label || '';
							
							if (label) {
								label += ': ';
							}
							
							label += parseInt(tooltipItem.value);
							
							return label;
						}
					}
				}
			}
		};
		
		this.chart = new Chart(ctx, newConfig);
	}
	
	async update(data) {
		let dataset = this.chart.config.data.datasets[0];
		dataset.data = await data();
		this.chart.update();
	}
}