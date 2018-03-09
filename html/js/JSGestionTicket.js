$(document).ready(function() {
	
	/* Click boutons top */

	$('#btnTraiter').click(function() {
		$('#divBlur').addClass('blur');
		$('#contenuAjout').css('visibility','visible');
	});

	$('#btnCloturer').click(function() {
		$('#divBlur').addClass('blur');
		$('#contenuCloture').css('visibility','visible');
	});

	$('#btnRequalifier').click(function() {
		$('#divBlur').addClass('blur');
		$('#contenuRequalification').css('visibility','visible');
	});

	$('#btnRediriger').click(function() {
		$('#divBlur').addClass('blur');
		$('#contenuRedirection').css('visibility','visible');
	});

	/* Clicks 'X' */
	$('#fermeturePopupAjout').click(function() {
		$('#divBlur').removeClass('blur');
		$('#contenuAjout').css('visibility','hidden');
	});

	$('#fermeturePopupAjout').click(function() {
		$('#divBlur').removeClass('blur');
		$('#contenuAjout').css('visibility','hidden');
	});

	$('#fermeturePopupAjout').click(function() {
		$('#divBlur').removeClass('blur');
		$('#contenuAjout').css('visibility','hidden');
	});

	$('#fermeturePopupAjout').click(function() {
		$('#divBlur').removeClass('blur');
		$('#contenuAjout').css('visibility','hidden');
	});
})