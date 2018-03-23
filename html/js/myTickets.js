var app = new Vue({
	el: "#app",
	created() { 
		this.load()
	},
	methods: {
		load() {
			axios.get("/loadMyTickets").then( (response)=>{
				response.data.tickets.forEach(function(item){  
					$('#tickets').append("<div class='ticket'>" 
						+"<div>"
						+ "<h1> Statut : "+item.statut+"</h1>"
						+ "<h2> Poste consterné : "+item.posteConcerne+"</h2>"
						+ "<h3> Date d'ouverture du ticket : "+item.date+"</h3>"
						+"</div>"
						+"<div class='descr'>"
						+"<h2> Description du problème : </h2>"
						+"<h3>"+item.description+"</h3>"
						+"<h3> Qualification : "+item.qualification+"</h3>"
						+"<h3> Précision : "+item.precision+"</h3>"
						+"</div>"
						+ "</div>");
				});
			})
		},
		disconnect() {
			axios.get("/disconnect").then( (response)=>{
				window.location = "/";				    
			})
		},
		createTicket() {
			window.location  = "/sendTicket";
		}
	}
});
