var app = new Vue({

	el: "#app",
	created() { this.load();},
	data: {
		message: "Salut"
	},
	methods: {
		hop() {
			this.message = "Ha ha ha";
		},
		load() {
			axios.get("/message").then( (response)=>{
				this.message = response.data.message;
			})
		}
	}
});
