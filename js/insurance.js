
const form = document.getElementById('formSimulator');
const button = document.getElementById('quotation');
button.disabled = true;
const date = document.getElementById('date');
const inputs = document.querySelectorAll('#formSimulator input');
const iframes = document.querySelectorAll('iframes');
const select = document.getElementById('ocupation');
const container_iframes = document.getElementById('container_iframes');
const radioBut = document.getElementsByName("typeInsurance");
const lavelRadio = document.getElementsByName("labelInsurance");
const message1 = 'Estos son los seguros que podemos ofrecerte';
const message2 = 'Lamentablemente en estos momentos no tenemos un seguro que se ajuste a tus necesidades';
var countInsurances = [];

const expresiones = {
	name: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    surname: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
	email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
	phone: /^\d{6,14}$/, // 6 a 14 numeros.
    income: /^\d{1,9}$/,
    appraise: /^\d{1,9}$/,
    date: /\d{4}[-/]\d{2}[-/]\d{2}/
}

const fiels = {
	name: false,
    surname: false,
    ocupation: false,
	email: false,
	phone: false,
    income: false,
    appraise: false,
    typeInsurance: false,
    date: false,
}

/**
 * @description function anonima, valida input y llena datos
 */
const validateInput = (expresion, input, name) => {
    if(expresion.test(input.value)){
		fiels[name] = input.value;
        document.getElementById(`${name}`).classList.remove('form_input-error');
        document.getElementById(`${name}Error`).classList.add('form_input-error-inactive');
	} else {
		fiels[name] = false;
        document.getElementById(`${name}`).classList.add('form_input-error');
        document.getElementById(`${name}Error`).classList.remove('form_input-error-inactive');
	}
}
/**
 * @description Function anonima, valida inputs del formulario
 */
const validateForm = (e) => {
	switch (e.target.name) {
		case "name":
			{
				validateInput(expresiones.name, e.target, 'name'); 
			}
		break;
		case "surname":
			{
				validateInput(expresiones.surname, e.target, 'surname'); 
			}
		break;
		case "typeInsurance":
			{
				fiels['typeInsurance'] = e.target.value; 
			}
		break;
        case "ocupation":
			{
				fiels['ocupation'] = e.target.value; 
			}
		break;
        case "date":
			{ 
				validateInput(expresiones.date, e.target, 'date');
			}
		break;
		case "email":
			{
				validateInput(expresiones.email, e.target, 'email'); 
			}
		break;
		case "phone":
			{
				validateInput(expresiones.phone, e.target, 'phone'); 
			}
		break;
        case "income":
			{
				validateInput(expresiones.income, e.target, 'income'); 
			}
		break;
        case "appraise":
			{
				validateInput(expresiones.appraise, e.target, 'appraise'); 
			}
		break;
	}
    validFiels();
}
/**
 * @description Funcion que valida los campos y habilita button submit
 * @returns Devuelve boolean
 */
function validFiels() {
    if(fiels.name && fiels.surname && fiels.typeInsurance && fiels.ocupation && fiels.date && fiels.email && fiels.phone && fiels.income && fiels.appraise){
        button.disabled = false;
        return true
    } else {
        button.disabled = true;
        return false
    }
}
/**
 * @description Funcion genera los parametros para pasar por la url
 * @param {String}
 * @returns Devuelve un string
 */
 function generateParam(type) {
	let data = type ? `type=${type}&` : 'type=basic&';
	Object.keys(fiels).forEach((key, i) => {
		data = data + `${key}=${fiels[key]}${(i == Object.keys(fiels).length - 1) ? '' : '&'}`;	
	})
	return data;
}
/**
 * @description genera el llenado del iframe o lo oculta segun view
 * @param {boolean} view
 * @param {string} categori
 * @returns Años de edad
 */
function viewInsuranceCategori(categori, view) {
	const campos = `${generateParam(categori)}`;
	document.getElementById(`${categori}Insurance`).src = view ? `components/card_insurance.html?${campos}` : '';
	!view ? document.getElementById(`container_iframes_${categori}`).classList.add('hident_card') : 
	document.getElementById(`container_iframes_${categori}`).classList.remove('hident_card');
	
}
/**
 * @description Retorna los años de edad
 * @param {string} d1
 * @returns Años de edad
 */
function getYears(d1) {
	// creamos la fecha actual
	const current = new Date()
	//Creamos fecha de nacimiento
	const date = new Date(d1)
    var months;
    months = (current.getFullYear() - date.getFullYear()) * 12;
    months -= date.getMonth();
    months += current.getMonth();
    return months <= 0 ? 0 : months / 12;
}
/**
 * @description Setea el mensaje
 * @param {boolean} set
 */
function setMessages(set) {
	document.getElementById('messageInfo').textContent = set ? message1 : message2
}
/**
 * @description  validamos la información y muestra las opciones de seguros
 * @param {Object} param
 */
function validateInsurances(params) {
	const years = getYears(params.date)
	// ocultamos las card
	viewInsuranceCategori('basic', false);
	viewInsuranceCategori('gold', false);
	viewInsuranceCategori('black', false);
	// validamos la información ingresada para mostrar las opciones
	// Basic edad 18 a 65 años, Ingreso mínimo: 100.000, avalúo desde 500.000 hasta 6.000.000
	if(years >= 18 && years <= 65 && params.income >= 100000 && params.appraise >= 500000 && params.appraise <= 6000000) {
		viewInsuranceCategori('basic', true);
		countInsurances.push('basic')
	}
	// Gold Autos y motos, empleados y pensionados, edad: 18 a 80 años, Ingreso mínimo: 1.000.000, Avalúo desde: 3.500.000 hasta 50.000.000.
	if (params.typeInsurance == 1 || params.typeInsurance == 2 && params.ocupation == 2 || params.ocupation == 1) {
		if (years >= 18 && years <= 80 && params.income >= 1000000 && params.appraise >= 3500000 && params.appraise <= 50000000) {
			viewInsuranceCategori('gold', true);
			countInsurances.push('gold')
		}
	}
	//Black edad 18 a 50 años, empleados, Ingreso mínimo: 5.000.000, Avalúo desde 5.500.000 hasta 500.000.000 
	if (years >= 18 && years <= 50 && params.ocupation == 1 && params.income >= 5000000 && params.appraise >= 5500000 && params.appraise <= 500000000) {
		viewInsuranceCategori('black', true);
		countInsurances.push('black')
	}
	// Se setea el menseja
	setMessages(!!countInsurances.length);
}

/**
 * @description Se generan los EventListener
 */
inputs.forEach((input) => {
	input.addEventListener('keyup', validateForm);
	input.addEventListener('blur', validateForm);
});
radioBut.forEach((radio) => {
	radio.addEventListener('click', validateForm);
});
select.addEventListener('change', validateForm);
date.addEventListener('focus', () => {
    document.getElementById('date').type = 'date';
});
date.addEventListener('blur', () => {
    document.getElementById('date').type = 'text';
});
date.addEventListener('change', validateForm);
form.addEventListener('submit', (e) => {
	e.preventDefault();
	if (validFiels()) {
		countInsurances = [];
		document.getElementById('container_iframes').classList.remove('view_iframes');
		document.getElementById('nameInfo').textContent = `${fiels.name} ${ fiels.surname}`;
		validateInsurances(fiels);
	}
});
