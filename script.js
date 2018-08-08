/* by: ZIMONH src: https://github.com/zimonh/Password-Generator
License: https://creativecommons.org/licenses/by-nc-sa/4.0/ */

//FUNCTIONS
Object.prototype.ony = function(action,func,element,t=this){if(t.length>1) for(element of t)element['on' + action] = func; else t['on' + action] = func; return t; };

const BuildAll = () => {


	//Clear
	document.querySelector('keyboard').innerHTML = '';
	document.querySelector('result').innerHTML = '';
	let Options = '';
	//Valid Password options:
	//const validate = [];




	if(document.querySelector('.checkbox_az').checked) Options += 'abcdefghijklmnopqrstuvwxyz';
	if(document.querySelector('.checkbox_AZ').checked) Options += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	if(document.querySelector('.checkbox_09').checked) Options += '0123456789';
	if(document.querySelector('.checkbox_sy').checked) Options += ' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';





	let stringOfRandomOptions = '';

	randArray(Options.split(''),1500).map(e=>stringOfRandomOptions += `<key>${e}</key>`);


	//insert the random options
	document.querySelector('keyboard').innerHTML = stringOfRandomOptions;



	let hlStart = 0;
	let hlActive = false;


	const highlighter = hlEnd =>{

		if (hlActive) {
			let copy = '';
			for (let e of document.querySelectorAll('.selected')) e.classList.remove('selected');
			const hlAll = document.querySelectorAll('result key');
			if(hlStart < hlEnd){
				for (let i = hlStart; i <= hlEnd; i++){
					hlAll[i].classList.add('selected');
					copy += hlAll[i].textContent;
				}
			}else{
				for (let i = hlEnd; i <= hlStart; i++){
					hlAll[i].classList.add('selected');
					copy += hlAll[i].textContent;
				}
			}
			document.querySelector('#copy').value = copy;
		}
	};


	document.querySelector('copy').ony('click', function(){ Coppy(); });

	document.querySelector('#copy').value = '';

	let resultcounter = 0;
	let resultLength = 0;

	document.querySelectorAll('keyboard key').ony('mouseover', function(){

		if(this.parentElement.nodeName === 'RESULT') highlighter([...this.parentNode.children].indexOf(this));

		if(	resultLength % 4 === 0 &&
			this.parentElement.nodeName === 'KEYBOARD' &&
			resultcounter <68){

			document.querySelector('result').appendChild(this);
			resultcounter = document.querySelectorAll('result key').length;

			if (document.querySelectorAll('.selected').length === 0) {
				document.querySelector('#copy').value += this.textContent;
			}
		}

		resultLength++;
	});



	const Coppy = ()=>{
		document.querySelector('#copy').select();
		document.execCommand('copy');
		setTimeout(()=>{
			document.querySelector('message').classList.add('active');

			setTimeout(()=>{document.querySelector('message').classList.remove('active');}, 3000);

		}, 100);
	};

	document.querySelectorAll('keyboard key').ony('mousedown', function() {
		if (this.parentElement.nodeName === 'RESULT') {
			hlActive = true;
			hlStart = [...this.parentNode.children].indexOf(this);
		}
	});

	document.querySelector('body').ony('mouseup', function() {
		if (hlActive) {
			Coppy();
			hlActive = false;
		}
	});

	document.querySelectorAll('label').ony('click', function() {
		//make sure the checking is done
		setTimeout(()=>{
			let TrueCounter = 0;
			for(let e of document.querySelectorAll('.checker'))	if(e.checked) TrueCounter++;
			if(TrueCounter>0) BuildAll(); //make sure at least one is checked
		},50 );
	});

};

document.addEventListener('DOMContentLoaded',()=>{ BuildAll(); });
