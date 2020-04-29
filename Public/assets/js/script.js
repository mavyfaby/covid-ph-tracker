$(document).ready(function() {
	const isUpload = false;
	
	const main = new Vue({
		el: "app",
		data: {
			app_name: "Coronavirus PH",
			api: [
				"https://covid19.mathdro.id/api/countries/PH/confirmed", // Country Main Data with Time
				"https://coronavirus-19-api.herokuapp.com/countries/philippines", // Country Today Deaths and Today Cases
				"https://covid-19-report-api.now.sh/api/v1/cases/timeseries?iso=PH", // Country Timeseries
			],
			data: {
				totalCases: "...",
				totalDeaths: "...",
				totalRecovered: "...",
				totalActive: "...",
				todayDeaths: "...",
				todayCases: "...",
				lastUpdated: "...",
				timeseries: {
					lastUpdated: "",
					data: [],
					activeCases: []
				}
			},
			chartColors: {
				red: "rgb(255, 99, 132)",
				orange: "rgb(255, 159, 64)",
				yellow: "rgb(255, 205, 86)",
				green: "rgb(75, 192, 192)",
				blue: "rgb(54, 162, 235)",
				purple: "rgb(153, 102, 255)",
				grey: "rgb(201, 203, 207)"
			},
			e: "config@gmail.com",
			sb: null,
			charts: [],
			appbarEl: null
		},
		methods: {
			isMobile() {
				if (window.innerWidth < 480) {
					return true;
				}
				
				return false;
			},
			fns(num) {
				if (num !== null && num !== undefined) {
					return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
				}
			},
			showLoader() {
				$(".loader").fadeIn("slow");
			},
			hideLoader() {
				$(".loader").fadeOut("slow");
			},
			getDeviceType() {
				const width = window.innerWidth;
				
				if (width < 480) {
					return 1;
				}
					else if (width >= 480 && width < 840) {
						return 2;
					}
					
					else if (width >= 840) {
						return 3;
					}
			},
			getData(api, endpoints) {
				const self = this;
				const cmp = api + (typeof endpoints === "string" ? endpoints : "");
				
				return new Promise(function(resolve, reject) {
					$.ajax({
						url: cmp,
						dataType: "json",
						success(data) {						
							resolve(data);
						},
						error(xhr, status) {
							alert("Error Loading Data!");
							
							self.hideLoader();
							self.showContent();
							
							reject();
						}
					});
				});
			},
			showContent() {
				$(".main-content, .footer").fadeTo("slow", 1);
			},
			formatDate(dit) {
				return moment(dit).format("[As of] MMMM DD, YYYY h:mm A");
			},
			async refresh() {
				const self = this;
				const { data } = self;
				
				if (navigator.onLine) {
					self.showLoader();
					
					const d1 = await self.getData(self.api[0]);
					const d2 = await self.getData(self.api[1]);
					const d3 = await self.getData(self.api[2]);
					
					data.totalCases = d1[0].confirmed;
					data.totalDeaths = d1[0].deaths;
					data.totalRecovered = d1[0].recovered;
					data.totalActive = d1[0].active;
					data.lastUpdated = self.formatDate(d1[0].lastUpdate);
					
					data.todayCases = d2.todayCases;
					data.todayDeaths = d2.todayDeaths;
					
					data.timeseries.lastUpdated = await self.formatDate(d3.lastUpdate);
					data.timeseries.data = await d3.data[0].timeseries;

					const obj = Object.keys(data.timeseries.data);
					
					for (let i = 0; i < obj.length; i++) {
						const cases = data.timeseries.data[obj[i]].confirmed;
						const deaths = data.timeseries.data[obj[i]].deaths;
						const recovered = data.timeseries.data[obj[i]].recovered;
						
						data.timeseries.activeCases.push(cases - (deaths + recovered));
					}
					
					for (let i = 0; i < self.charts.length; i++) {
						const n = self.charts[i];
						
						if (n.name == "ActiveCases") {
							n.chart.update(self.activeCasesData);
						}
						
						if (n.name == "TotalCases") {
							n.chart.update(self.totalCasesData);
						}
						
						if (n.name == "RecoveredCases") {
							n.chart.update(self.recoveriesData);
						}
						
						if (n.name == "DeathCases") {
							n.chart.update(self.deathData);
						}
						
						if (n.name == "CasesPerDay") {
							n.chart.update(self.casesPerDay);
						}
						
						if (n.name == "RecoveriesPerDay") {
							n.chart.update(self.recoveriesPerDay);
						}
						
						if (n.name == "DeathsPerDay") {
							n.chart.update(self.deathsPerDay);
						}
					}
					
					self.showContent();
					self.hideLoader();
				}
					else {
						alert("No Internet Connection!");
						
						self.showContent();				
						self.hideLoader();
					}
			},
			async totalCasesData() {
				const data = await this.data.timeseries.data;
				const time = await Object.keys(data);
				
				let a = [];
				
				for (let i = 0; i < time.length; i++) {
					const date = await moment(time[i], "MM DD YYYY");
					
					a.push({ t: date.valueOf(), y: data[time[i]].confirmed });
				}
				
				return a;
			},
			async activeCasesData() {
				const times = await this.data.timeseries;
				const data = await Object.keys(times.data);
				const active = await times.activeCases;
				
				let a = [];
				
				for (let i = 0; i < data.length; i++) {
					const date = await moment(data[i], "MM DD YYYY");
					
					a.push({ t: date.valueOf(), y: active[i] });				
				}
				
				return a;
			},
			async recoveriesData() {
				const data = await this.data.timeseries.data;
				const time = await Object.keys(data);
				
				let a = [];
				
				for (let i = 0; i < time.length; i++) {
					const date = await moment(time[i], "MM DD YYYY");
					
					a.push({ t: date.valueOf(), y: data[time[i]].recovered });
				}
				
				return a;
			},
			async deathData() {
				const data = await this.data.timeseries.data;
				const time = await Object.keys(data);
				
				let a = [];
				
				for (let i = 0; i < time.length; i++) {
					const date = await moment(time[i], "MM DD YYYY");
					
					await a.push({ t: date.valueOf(), y: data[time[i]].deaths });
				}
				
				return a;
			},
			async casesPerDay() {
				const data = await this.data.timeseries.data;
				const time = await Object.keys(data);
				
				let a = [], lastCase = 0;
				
				for (let i = 0; i < time.length; i++) {
					const date = await moment(time[i], "MM DD YYYY");
					const m = await data[time[i]].confirmed;
					
					let cc = m - lastCase;
					
					await a.push({ t: date.valueOf(), y: cc });
					
					lastCase = await m;
				}
				
				return a;
			},
			async recoveriesPerDay() {
				const data = await this.data.timeseries.data;
				const time = await Object.keys(data);
				
				let a = [], lastRd = 0;
				
				for (let i = 0; i < time.length; i++) {
					const date = await moment(time[i], "MM DD YYYY");
					const m = await data[time[i]].recovered;
					
					let rd = m - lastRd;
					
					await a.push({ t: date.valueOf(), y: rd });
					
					lastRd = await m;
				}
				
				return a;
			},
			async deathsPerDay() {
				const data = await this.data.timeseries.data;
				const time = await Object.keys(data);
				
				let a = [], lastDt = 0;
				
				for (let i = 0; i < time.length; i++) {
					const date = await moment(time[i], "MM DD YYYY");
					const m = await data[time[i]].deaths;
					
					let dt = m - lastDt;
					
					await a.push({ t: date.valueOf(), y: dt });
					
					lastDt = await m;
				}
				
				return a;
			},
			initCharts() {
				const self = this;
				let mainHeight = $(".main-card").height();
				
				const total = $("#total-cases")[0].getContext("2d");
				const active = $("#active-cases")[0].getContext("2d");
				const recovered = $("#recovered-cases")[0].getContext("2d");
				const deaths = $("#death-cases")[0].getContext("2d");
				const recoveriesPerDay = $("#recoveries-per-day")[0].getContext("2d");
				const deathsPerDay = $("#deaths-per-day")[0].getContext("2d");
				const casesPerDay = $("#cases-per-day")[0].getContext("2d");

				const b = self.getDeviceType();
				const ch = mainHeight * (3 / 4);
				
				active.canvas.height = b == 3 ? mainHeight - 32 : mainHeight;
				total.canvas.height = b !== 3 ? mainHeight : ch;
				recovered.canvas.height = b !== 3 ? mainHeight : ch;
				deaths.canvas.height = b !== 3 ? mainHeight : ch;
				recoveriesPerDay.canvas.height = b !== 3 ? mainHeight : ch;
				deathsPerDay.canvas.height = b !== 3 ? mainHeight : ch;
				casesPerDay.canvas.height = b !== 3 ? mainHeight : ch;
				
				self.charts.push({
					name: "TotalCases",
					chart: new Graph(total, {
						type: "line",
						color: self.chartColors.red,
						title: "Total Confirmed",
						labelY: "Number of Cases",
						pointRadius: 0,
						borderWidth: 2,
						xAxes: {
							type: "time",
							distribution: "series"
						}
					})
				});
				
				self.charts.push({
					name: "ActiveCases",
					chart: new Graph(active, {
						type: "line",
						color: self.chartColors.orange,
						title: "Active Cases",
						labelY: "Number of Active Cases",
						pointRadius: 0,
						borderWidth: 2,
						xAxes: {
							type: "time",
							distribution: "series"
						}
					})
				});
				
				self.charts.push({
					name: "RecoveredCases",
					chart: new Graph(recovered, {
						type: "line",
						color: self.chartColors.green,
						title: "Recovered Patients",
						labelY: "Number of Recovered Patients",
						pointRadius: 0,
						borderWidth: 2,
						xAxes: {
							type: "time",
							distribution: "series"
						}
					})
				});
				
				self.charts.push({
					name: "DeathCases",
					chart: new Graph(deaths, {
						type: "line",
						color: self.chartColors.red,
						title: "Deaths",
						labelY: "Number of Deaths",
						pointRadius: 0,
						borderWidth: 2,
						xAxes: {
							type: "time",
							distribution: "series"
						}
					})
				});
				
				self.charts.push({
					name: "CasesPerDay",
					chart: new Graph(casesPerDay, {
						type: "line",
						color: self.chartColors.orange,
						title: "Cases Per Day",
						labelY: "Number of Cases",
						pointRadius: 0,
						borderWidth: 2,
						xAxes: {
							type: "time",
							distribution: "series"
						}
					})
				});
				
				self.charts.push({
					name: "RecoveriesPerDay",
					chart: new Graph(recoveriesPerDay, {
						type: "line",
						color: self.chartColors.green,
						title: "Recoveries Per Day",
						labelY: "Number of Recoveries",
						pointRadius: 0,
						borderWidth: 2,
						xAxes: {
							type: "time",
							distribution: "series"
						}
					})
				});
				
				self.charts.push({
					name: "DeathsPerDay",
					chart: new Graph(deathsPerDay, {
						type: "line",
						color: self.chartColors.red,
						title: "Deaths Per Day",
						labelY: "Number of deaths",
						pointRadius: 0,
						borderWidth: 2,
						xAxes: {
							type: "time",
							distribution: "series"
						}
					})
				});
			},
			share() {
				const self = this;
				
				if (typeof navigator.share === "function") {
					navigator.share({
						title: "Coronavirus PH",
						text: "Get the latest coronavirus updates in the Philippines with graphical data.",
						url: "https://covid-ph.mavyfaby.ml"
					}).then(function() {
						self.showSnackbar("Shared Successfully!");
						
						self.ref.once("value").then(function(snapshot) {
							const val = snapshot.val();
							const shared = val.shared + 1;
						
							self.ref.update({ shared: shared, lastShared: Date.now() });
						});
					}).catch(function() {
						self.showSnackbar("Sharing Failed!");
					});
				}
					else {
						self.showSnackbar("Share feature is not supported by this browser!");
					}
			},
			hideOnScroll() {
				const self = this;
				
				let prevScrollpos = window.pageYOffset;
				
				$(window).scroll(function() {
					let currentScrollpos = window.pageYOffset;
					
					if (prevScrollpos > currentScrollpos) {
						self.appbarEl.css("top", "0");
						
						$(".share").css("transform", "translateY(0)");
					}
						else {
							self.appbarEl.css("top", -self.appbarEl.height() + "px");
							
							$(".share").css("transform", "translateY(90px)");
						}
						
					prevScrollpos = currentScrollpos;
				});
			},
			async showSnackbar(text) {
				await $(".sbText").text(text);
				
				this.sb.open();
			},
			init() {
				const self = this;
				
				self.appbarEl = $(".mdc-top-app-bar");

				// Defining 
				
				const MDCRipple = mdc.ripple.MDCRipple;
				const MDCSnackbar = mdc.snackbar.MDCSnackbar;
				
				// Getting
				
				const buttonsEl = document.querySelectorAll("button");
				const sb = document.querySelector(".mdc-snackbar");
				
				// Attaching
				
				for (let button of buttonsEl) {
					MDCRipple.attachTo(button);
				}
				
				self.sb = MDCSnackbar.attachTo(sb);
				
				self.hideOnScroll();
				self.initCharts();
			}
		}
	});

	main.init();
    main.refresh();
});