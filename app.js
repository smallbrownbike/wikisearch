window.onload = () => {
	
	var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
	};
	
	var container = document.querySelector('.container');
	var containerFluid = document.querySelector('.container-fluid');
	var input = document.querySelector('input');
	var secondaryInput = document.querySelector('#secondaryInput');
	var button = document.querySelector('.btn');

	history.replaceState({title: '', content: containerFluid.innerHTML}, 'WikiSearch', '');

	window.onpopstate = (e) => {
		updateContent(e.state)
	};

	function reqListener() { 
		history.pushState({title: encodeURI(input.value), content: JSON.parse(this.responseText)}, input.value, input.value);
		var arr = JSON.parse(this.responseText);
		showContent(arr);
	};

	function reqError(err) {  
		console.log('Error: ', err);  
	};

	function updateContent(stateObj){
		if (stateObj.title !== '') {
			showContent(stateObj.content);
		} else {
		location.reload();
		}
	}

	function showContent(data) {
		
		container.style.height = '100%';
		var keys = Object.keys(data.query.pages);
		var html = '<div class="row"><span id="secondaryMag" class="fa fa-search fa-2x"></span><input class="text-primary" id="secondaryInput" autocomplete="off">'
		for (var i = 0; i < keys.length; i++){
			html += `<a href='https://en.wikipedia.org/?curid=${keys[i]}'><div class='col-lg-12'><h3>${data.query.pages[`${Number(keys[i])}`].title}</h3><h5>${data.query.pages[`${Number(keys[i])}`].extract}</h5></div></a>`;
		}
		html += '</div>'
		containerFluid.innerHTML =  html;
		input = document.querySelector('input');
		if(!isMobile.any()){
		input.focus();
		};
	}

	document.addEventListener('keyup', (e) => {
		if (e.which === 13) {
			if (input.value !== ''){
				var url = `https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=${encodeURI(input.value)}`;

				var xhr = new XMLHttpRequest();
				xhr.onload = reqListener;  
				xhr.onerror = reqError; 
				xhr.open('get', url);
				xhr.send();
				
			}
			
			
		}
	});
}