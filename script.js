/* by: ZIMONH src: https://github.com/zimonh/PasswordGenerator
License: https://creativecommons.org/licenses/by-nc-sa/4.0/ */

//FUNCTIONS
//calculate bin group for fill with '◊' so 128 if 100
const binlength = dec => {
	let pow = 2,
		r = 1;
	dec -= 1;
	while (dec > 1) {
		dec -= pow;
		pow = pow * 2;
		r++;
	}
	return 2 ** r;};

//Convert Decimal to binary with fixed length of in this case 32 bit
const decbin = (dec, length) => {
	let out = '';
	while (length--) out += (dec >> length) & 1;
	return out;};

//get first or last half of options
const half = (i, bin) => (bin === '1') ? i.slice(i.length / 2, i.length) : i.slice(0, i.length / 2);

//List amounts after sorting the result
const compress = (s, n = 1) => `${s}_`.split('').map((e, i, r, j) => {
	if (e !== r[i - 1]) {
		if (n > 1) {
			j = '-' + n + '  ' + e;
			n = 1;
			return j;
		}
		return e;
	}
	++n; }).join('').slice(0, -1);

Object.prototype.ony = function(action,func,element,t=this){if(t.length>1) for(element of t)element['on' + action] = func; else t['on' + action] = func; return t; };





//max length of random options
let maxResultLength = 500;

//set length of binary input
const GenereatedChunks = 200;

//used to check there is proper randomness
const ValidateMode = false;



const BuildAll = () => {


	//Clear
	document.querySelector('keyboard').innerHTML = '';
	document.querySelector('result').innerHTML = '';
	let Options = '';
	//Valid Password options:
	const validate = [];




	if(document.querySelector('.checkbox_az').checked) Options += 'abcdefghijklmnopqrstuvwxyz';
	if(document.querySelector('.checkbox_AZ').checked) Options += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	if(document.querySelector('.checkbox_09').checked) Options += '0123456789';
	if(document.querySelector('.checkbox_sy').checked) Options += ' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';

	//fill options to make it a round binary number
	Options += '◊'.repeat(binlength(Options.length) - Options.length);

	//Generate  32 bit randomness binary:
	const CryptoArray = new Uint32Array(GenereatedChunks);
	let CryptoBinString =
		window
			.crypto
			.getRandomValues(CryptoArray)
			.toString(2)
			.split(',')
			.map(e => decbin(e, 32))
			.join('');


	let stringOfRandomOptions = '',
		stringOfRandomOptionsL = 0;

	while (CryptoBinString.length > 10) {
		let tempCryptoBinString = CryptoBinString,
			tempOptions = Options,
			result = '';

		for (let counter = 0; tempOptions.length > 1; counter++){
			tempOptions = half(tempOptions, tempCryptoBinString[counter]);
			if(tempOptions.length === 1){
				if (tempOptions === '◊'){
					//slice first half of failing binary
					CryptoBinString = CryptoBinString.slice(counter / 2);
					counter = 0;
					tempCryptoBinString = CryptoBinString;
					tempOptions = Options;
					result = '';
				}else{
					result = tempOptions;
					CryptoBinString = CryptoBinString.slice(counter);}}}
		//only needed if you validate
		if(ValidateMode) validate.push(result);

		stringOfRandomOptionsL++;
		if(stringOfRandomOptionsL<maxResultLength)	stringOfRandomOptions += `<key>${result}</key>`;

	}
	//insert the random options
	document.querySelector('keyboard').innerHTML = stringOfRandomOptions;


	//make sure options are equally spread
	if(ValidateMode) console.log(compress(validate.sort().join('')));


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
