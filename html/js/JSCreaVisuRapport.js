var ticketCreation = new Vue({
	el: "#app",
	created() {

        this.init();
    },
    data: {
    },
    methods: {
        init(){
            axios.post('/getOpe')
            .then(function(response){
                console.log(response);
                response.data.operateurs.forEach(function(item){
                    $("#ope").append("<option value="+item.mail+">"+item.nom+" "+item.prenom+"</option>");
                });
                
            });
        },
        createChart() {
            var data ={mailOpe : $("#ope").val()};

            axios.post('/createRapport',data)
            .then(function(response){
                console.log(response.data);
                
                $(".chart-container").empty()
                                    .append("<canvas id='myChart'></canvas>");
                
                var ctx = document.getElementById("myChart").getContext('2d');
                //ctx.clear();
                var myChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ["Ticket en cours", "Ticket cloturé", "Ticket redirigé"],
                    datasets: [{
                        label: '# of Votes',
                        data: [response.data.info.ticketEnCour,response.data.info.ticketCloturer,response.data.info.ticketRediriger],
                        backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                        ],
                        borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            });
            });

            
        }
    }
});