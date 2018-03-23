var app = new Vue({
	el: "#app",
	created() { 
		this.showTicket()
	},
	methods: {
		showTicket() {
				axios.get("/manageTicket")
					.then( (response)=>{
						console.log(response.data.ticket);
						if(response.data.ticket != null){
							var item = response.data.ticket[0];
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
							if(item.statut =="Cloturer")
								$('#commentaire').css('display','none');
						}
					})
					.catch(error => {
						console.log(error);
					});
		},
		disconnect() {
			axios.get("/disconnect").then( (response)=>{
				window.location = "/";				    
			})
		},
		retour(){
			window.location = "/accueil";
		},
		cloture(){
			axios.get("/clotureTicket")
				.then( (response) => {
						if(response.data.status == 200)
							window.location = "/gestionTicket";	
						else
							alert(response.data.message);
				})
				.catch(error => {
						console.log(error);
				})
		},
		loadQualification(){
			$('#menuQualification').empty();
			$('#menuPrecision').empty();
			axios.get("/loadFilter").then( (response)=>{
				if(response.data.status != 503) {
					// Load
					response.data.qualification.forEach(function(item){  
						$('#menuQualification').append("<option value='"+item.qualification+"'>"+item.qualification+"</option>");
					});
					response.data.precision.forEach(function(item){
						$('#menuPrecision').append("<option value='"+item.precision+"'>"+item.precision+"</option>");					
					});
					$('#requalification').css('display','block');
				}
				else
					alert(response.data.message);
			})
		},
		loadOperator(){
			$('#operator').empty();
			axios.get('/loadOperator').then( (response)=>{
				if(response.data.status != 503) {
					// Load
					response.data.operateurs.forEach(function(item){
						console.log(item.nom);
						$('#operator').append("<option value='"+item.mail+"'>"+item.nom+" "+item.prenom+"</option>");					
					});
					$('#redirection').css('display','block');
				}
				else
					alert(response.data.message);
			})
		},
		requalifier(){
			data = {};

			data.qualification = $('#menuQualification').val();
			data.precision = $('menuPrecision').val();

			axios.post('/requalificationTicket',data).then( (response)=>{
				$('#requalification').css('display','none');
			})

		},
		rediriger(){
			data = {};
			data.mailOpe = $('operator').val();

			axios.post('/redirigerTicket',data).then( (response)=>{
				$('#redirection').css('display','none');
			})
		}
	}
})