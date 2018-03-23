var app = new Vue({
	el: "#app",
	created() { 
		this.loadFiltre()
	},
	methods: {
		loadTicket() {
			axios.get("/loadMyTickets").then( (response)=>{
				response.data.tickets.forEach(function(item){
					$('#tickets').append("<div class='ticket' id='"+item._id+"' data-urgent='"+item.urgence+"' data-qualification='"+item.qualification+"' data-precision='"+item.precision+"'>" 
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

					// Ajout d'un on click
					$('#'+item._id).click(function () {
						  app.setTicket(item._id);
					});
				});
			})
		},
		hideTickets(filter) {
			$(".ticket").each(function(){
				if($(this).data(filter.option) == filter.value || filter.value == "All")
					$(this).css("display","block");
				else
					$(this).css("display","none");
			});
		},
		loadFiltre() {
			axios.get("/loadFilter").then( (response)=>{
				if(response.data.status != 503) {
					// Load
					response.data.qualification.forEach(function(item){  
						$('#menuQualification').append("<option value='"+item.qualification+"'>"+item.qualification+"</option>");
					});
					response.data.precision.forEach(function(item){
						$('#menuPrecision').append("<option value='"+item.precision+"'>"+item.precision+"</option>");					
					});
					// On Change
					$("#menuQualification").change(function() {
  						app.hideTickets({option:"qualification",value:$("#menuQualification").val()});
					});
					$("#menuPrecision").change(function() {
  						app.hideTickets({option:"precision",value:$("#menuPrecision").val()});
					});
					$("#menuUrgent").change(function() {
  						app.hideTickets({option:"urgent",value:$("#menuUrgent").val()});
					});
					this.loadTicket();
				}
				else
					alert(response.data.message);
			})
		},
		setTicket(id){
			var data = {'_id':id};
				axios.post("/setTicket",data)
					.then( (response)=>{
						if(response.data.status == 200)
							window.location = "/gestionTicket";	
						else
							alert(response.data.message);			    
					})
					.catch(error => {
						alert(error);
					});
		},
		disconnect() {
			axios.get("/disconnect").then( (response)=>{
				window.location = "/";				    
			})
		}
	}
});
