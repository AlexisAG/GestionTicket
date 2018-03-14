var app = new Vue({
	el: "#app",
	created() { 
		this.loadTicket()
	},
	methods: {
		loadTicket() {
				var data = {'_id':id};
				axios.post("/manageTicket",data)
					.then( (response)=>{
						console.log(response.data.message + " pas dans erreur");
						if(response.data.status == 200){
							var item = response.data
							$('#tickets').append("<div class='ticket' data-urgent='"+item.urgence+"' data-qualification='"+item.qualification+"' data-precision='"+item.precision+"'>" 
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
								+"<h3> Urgence : "+item.urgence+"</h3>"
								+"</div>"
								+ "</div>");
						}
					})
					.catch(error => {
						console.log(error.data.message);
					});
			

			})
		},
		disconnect() {
			axios.get("/disconnect").then( (response)=>{
				window.location = "/";				    
			})
		}
	}
})