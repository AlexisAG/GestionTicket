var app = new Vue({
	el: "#app",
	created() { 
		this.load()
	},
	data: {
		ticket: null
	},
	methods: {
		load() {
			axios.get("/loadMyTickets").then( (response)=>{
				console.log(response.data.tickets);
			})
		}
	}
});
