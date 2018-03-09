var ticketCreation = new Vue({
	el: "#appTicketCreation",
	created() { 
		this.load();
	},
	data: {
		
	},
	methods: {
		creerTicket() {
			var data ={};
			data.mail = "test@gmail.com";
			data.posteConcerne = $("#input_posteConcerne").val();
			data.description = $("#input_description").val();
			data.pieceJointe = "";

			if ($('#input_urgent').is(":checked"))
			{
				data.urgence = "Urgent";
			}
			else
			{
				data.urgence = "Non urgent";
			}
			
			data.statut = "En cours";
			data.date = new Date();
			data.qualification = $("#input_typeProbleme option:selected").text();
			data.precision = $("#input_typePrecision option:selected").text();
/*
			$.ajax({
			   url : '/ticket/add',
			   type : 'POST', 
			   data : data
			   ,
			success : function(data){ 
				console.log("test");
			}
			})*/
			axios.post('/ticket/add',data)
			.then(function(response){
				console.log(response);
			});
		},

		disconnect() {
			axios.get("/disconnect").then( (response)=>{
				window.location = "/";				    
			})
		},

		returnTicket() {
			window.location = "/accueil";				    
		},

		load(){
			axios.get('/qualification').then((response)=>{
				var first = true;
				response.data.qualifications.forEach(function(item){
					if(first)
					{
						$("#input_typeProbleme").append("<option selected value=\""+item.qualification+"\">"+item.qualification+"</option>");
						first=false;
					}
					else
					{
						$("#input_typeProbleme").append("<option value=\""+item.qualification+"\">"+item.qualification+"</option>");
					}
					
				})
				$( "#input_typeProbleme" ).change(function() {
			  		updatePrecision();
				})

				updatePrecision();
			});
		}

	}
});

function updatePrecision()
{
	var data = {};
	data.qualification = $("#input_typeProbleme").val();
	console.log($("#input_typeProbleme").val());
	axios.get('/precision/'+$("#input_typeProbleme").val())
	.then((response)=>{
		$("#input_typePrecision").empty();
		$("#input_typePrecision").append("<option selected value=''> </option>");
		response.data.precisions.forEach(function(item){
			$("#input_typePrecision").append("<option value="+item.precision+">"+item.precision+"</option>");
		})
	});
}