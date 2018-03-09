var app = new Vue({
	el: "#app",
	created() { 
	},
	methods: {
		connect() {
			console.log("je passe")
			if($('#txtID').val() != "" && $('#txtMDP').val() != "") {
				var data = { mail:$('#txtID').val(), mdp:$('#txtMDP').val() }
				axios.post("/connect",data)
					.then( (response)=>{
						console.log(response.data.message + " pas dans erreur");
						if(response.data.status == 200)
							window.location = "/accueil";				    
					})
					.catch(error => {
						console.log(error.data.message);
					});
			}
		}
	}
});