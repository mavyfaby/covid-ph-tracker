Vue.component("mdc-button", {
	props: ["name"],
	template: '<div class="mdc-button mdc-button--raised"><div class="mdc-button__ripple"></div><span class="mdc-button__label">{{ name }}</span></div>'
});

Vue.component("overline", {
	template: '<div style="display: grid; grid-template-columns: repeat(3, 1fr); justify-content: center; align-items: center; margin: 1em 0; padding: 1em 0;"><div style="width: 100%; height: 1px; background: #aaa;"></div><h2 style="margin: 0 0.5em; text-align: center;"><slot></slot></h2><div style="width: 100%; height: 1px; background: #aaa;"></div></div>'
});

Vue.component("app", {
	template: '<div id="app"><slot></slot></div>'
});

Vue.component("mdc-card", {
	props: ["main"],
	data: function() {
		let isMain = false;
		
		if (this.main !== undefined) {
			isMain = "main-card";
		}
		
		return {
			isMain: isMain
		}
	},
	template: '<div class="mdc-card mdc-elevation--z6" v-bind:class="isMain"><slot></slot></div>'
});

Vue.component("mdc-top-app-bar", {
	props: ["title"],
	template: `
		<header class=" mdc-top-app-bar mdc-elevation--z3">
			<div class="mdc-top-app-bar__row">
				<section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
					<span class="mdc-top-app-bar__title">{{ title }}</span>
				</section>
				<section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end">
					<button class="mdc-icon-button material-icons mdc-top-app-bar__navigation-icon--unbounded" tabindex="0" @click="$root.refresh()">refresh</button>
				</section>
			</div>
		</header>
	`
});

Vue.component("mdc-grid", {
	template: '<div class="mdc-layout-grid"><slot></slot></div>'
});

Vue.component("mdc-grid-inner", {
	template: '<div class="mdc-layout-grid__inner"><slot></slot></div>'
});

Vue.component("mdc-grid-cell", {
	props: ["col", "phone", "desktop", "tablet"],
	data: function() {
		var cellClass = "mdc-layout-grid__cell", align;
		
		const deviceType = this.$root.getDeviceType();

		if (this.col && !isNaN(this.col)) {
			cellClass += "--span-" + this.col;
		}
			else {
				if (deviceType == 1 && this.phone && !isNaN(this.phone)) {
					cellClass += "--span-" + this.phone + "-phone";
				}
				
				if (deviceType == 1 && this.tablet && !isNaN(this.tablet)) {
					cellClass += "--span-" + this.tablet + "-tablet";
				}
				
				if (deviceType == 3 && this.desktop && !isNaN(this.desktop)) {
					cellClass += "--span-" + this.desktop + "-desktop";
				}
			}
		
		return {
			type: cellClass
		};
	},
	template: '<div v-bind:class="type"><slot></slot></div>'
});

Vue.component("chart", {
	props: ["id"],
	data: function() {
		return {
			identity: this.id
		};
	},
	template: '<div class="mdc-card mdc-elevation--z6" style="padding: 1em 0.5em;"><canvas v-bind:id="identity"></canvas><small style="margin-top: 1em;">{{ $root.data.timeseries.lastUpdated }}</small></div>'
});

Vue.component("loader", {
	props: ["text"],
	template: `
		<div class="loader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.6); display: grid; justify-content: center; align-items: center; z-index: 999">
			<div class="mdc-card mdc-elevation--z6" style="width: 80vw; height: auto; display: grid; justify-content: center; align-items: center;">
				<h1 style="text-align: center; margin: 1em 0 0.5em 0;">{{ text }}</h1>
				<div style="display: grid; width: 50vw; padding: 1em 0; justify-content: center; align-items: center; margin: 0.5em 0 2em 0; filter: contrast(5); background-color: white;">
					<div class="dot-gathering"></div>
				</div>
			</div>
		</div>
	`
});