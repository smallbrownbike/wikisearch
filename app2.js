window.onload = () =>{
	
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
	
	var container = document.querySelector('.container')
	var containerFluid = document.querySelector('.container-fluid');
	var input = document.querySelector('#input');
	var button = document.querySelector('.btn');

	function mainReqListener() {
		var arr = JSON.parse(this.responseText);
		history.replaceState({title: document.location.pathname.replace('/', ''), content: arr}, document.location.pathname.replace('/', ''), document.location.pathname.replace('/', ''))
		showContent(arr);
	};

	function clickReqListener() {
		var arr = JSON.parse(this.responseText);
		history.pushState({title: input.value, content: arr}, input.value, input.value)
		showContent(arr);
	}

	window.onpopstate = (e) => {
		if (document.location.pathname === '/'){
		location.reload();
		} else {
			showContent(e.state.content)
		}
	};

	function reqError(err) {  
		console.log('Error: ', err);  
	};

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


	var url = `https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=${document.location.pathname.replace('/', '')}`;

	var xhr = new XMLHttpRequest();
	xhr.onload = mainReqListener;  
	xhr.onerror = reqError; 
	xhr.open('get', url);
	xhr.send();

	document.addEventListener('keyup', (e) => {
		if (e.which === 13) {
			if (input.value !== ''){
				url = `https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=${encodeURI(input.value)}`
			};


			var xhr = new XMLHttpRequest();
			xhr.onload = clickReqListener;  
			xhr.onerror = reqError; 
			xhr.open('get', url);
			xhr.send();
		};
	});
};