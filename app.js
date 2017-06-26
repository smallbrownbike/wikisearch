window.onload = () => {
	
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
		var html = '<div class="row"><div id="magContainer" class="dropdown"><div href="#" data-toggle="dropdown" class="dropdown-toggle" role="button"><span id="secondaryMag" class="fa fa-search fa-2x"></span><span class="caret"></span></div><ul class="dropdown-menu" aria-labelledby="dropdownMenu1"><li id="wikipedia" class="active"><a class="wikiLinks">Wikipedia</a></li><li id="wikiwand"><a class="wikiLinks">Wikiwand</a></li></ul></div><input class="text-primary" id="secondaryInput" autocomplete="off">'
		for (var i = 0; i < keys.length; i++){
			
			html += `<a id="links" href='https://en.wikipedia.org/?curid=${keys[i]}'><div class='col-lg-12'><h3>${data.query.pages[`${Number(keys[i])}`].title}</h3><h5>${data.query.pages[`${Number(keys[i])}`].extract}</h5></div></a>`;
		}
		html += '</div>'
		containerFluid.innerHTML =  html;
		input = document.querySelector('input');
		input.focus();
		
		var wikipedia = document.getElementById('wikipedia');
		var wikiwand = document.getElementById('wikiwand');
		var links = document.querySelectorAll('#links');
		var names = document.querySelectorAll('h3');
		var wikipediaLinks = []
		
		links.forEach((i) => {
			wikipediaLinks.push(i.getAttribute('href'))
		})
		
		wikipedia.addEventListener('click', (e) => {
			if(wikipedia.getAttribute('class') !== 'active'){
				wikipedia.setAttribute('class', 'active')
				wikiwand.setAttribute('class', '')
			}
			for(var i=0;i<links.length; i++){
				links.item(i).setAttribute('href', wikipediaLinks[i])
			}
		})
		wikiwand.addEventListener('click', (e) => {
			if(wikiwand.getAttribute('class') !== 'active'){
				wikiwand.setAttribute('class', 'active')
				wikipedia.setAttribute('class', '')
			}
			for(var i=0;i<links.length; i++){
				links.item(i).setAttribute('href', 'http://www.wikiwand.com/en/' + names.item(i).textContent)
			}
		})
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

