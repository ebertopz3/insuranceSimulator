// capturamos la url
const url = document.location.href;

/**
* @description Funcion que captura las variables pasadas por la url
* @param {string} url
* @returns Devuelve un array de clave=>valor
*/
 function getParam(loc) {
     // si existe el interrogante
     if(loc.indexOf('?')>0) {
         // obtenemos un array con cada clave=valor
         var key_value = loc.split('?')[1].split('&');
         var params = {};
         // recorremos todo el array de valores y llenamos params
         key_value.forEach(element => {
            var tmp = element.split('=');
            params[tmp[0]] = unescape(decodeURI(tmp[1]));
         });
         return params;
     } else {
        return [];
     }
 }

 /**
  * 
  * @param {string} value 
  * @param {number} porcent 
  * @returns tanto porciento
  */
 function getPorcent(value, porcent) {
    return (Number(value) * porcent) / 100;
 }
 /**
  * 
  * @param {number} value 
  * @returns valores con estilo currency
  */
 function getValueCurrency(value) {
   return Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP', maximumFractionDigits: 0}).format(value);
 }

 /**
  * @description Setea los valores segun los datos
  * @param {Object} params 
  * @param {number} valueporcent 
  */
 function setValuesAnnualAndMonthly(params, porcent) {
    //comisión: el 5% del valor de los ingresos mensuales para todos.
    const commission = getPorcent(params.income, 5);
    //Cobertura: el 30% 60% 90% del avalúo del objeto.
    const coverage = getPorcent(params.appraise, porcent);
    //valor anual: cobertura más comisión.
    const annual = coverage + commission;
    //Total anual: valor anual menos el 50% del mismo valor anual.
    const annualTotal = annual - getPorcent(annual, 50)
    // Se seta el valor
    document.getElementById('annual').textContent = getValueCurrency(annualTotal);
    //Mensual: cobertura dividido entre 12  más comisión.
    const monthly = (coverage / 12) + commission
    //Total Mensual: valor mensual menos el 50% del mismo valor mensual.
    const monthlyTotal = monthly - getPorcent(monthly, 50);
    // Se seta el valor
    document.getElementById('monthly').textContent = getValueCurrency(monthlyTotal);
 }
/**
 * @description Selecciona datos  segun el tipo
 * @param {Object} params
 */
 function selectDatainsurance(params) {
    if (params.type === 'basic') {
        setValuesAnnualAndMonthly(params, 30);
     }
     if (params.type === 'gold') {
        setValuesAnnualAndMonthly(params, 60);
        
     }
     if (params.type === 'black') {
        setValuesAnnualAndMonthly(params, 90);
     }
 }
 /**
  * @description Genera el bg y el title
  * @param {string} type 
  */
 function generateBgAndTitles(type) {
    if (type === 'basic') {
        document.getElementById('infoCard').classList.add('bg-card-basic');
        document.getElementById('card_title').textContent = 'Seguro Básico';
        document.getElementById('text_insurance').textContent = 'desde tu cel hasta tu vehiculo';
        document.getElementById('porcent').textContent = '30%';
        document.getElementById('theft_protection').classList.add('hident_text');
        document.getElementById('damage_protection').classList.add('hident_text');
        document.getElementById('text_basic').classList.remove('hident_text');
     }
     if (type === 'gold') {
        document.getElementById('infoCard').classList.add('bg-card-gold');
        document.getElementById('card_title').textContent = 'Seguro Gold';
        document.getElementById('text_insurance').textContent = 'tu vehiculo';
        document.getElementById('porcent').textContent = '60%';
        
     }
     if (type === 'black') {
        document.getElementById('infoCard').classList.add('bg-card-black');
        document.getElementById('card_title').textContent = 'Seguro Black';
        document.getElementById('text_insurance').textContent = 'tu vehiculo o tecnoligia';
        document.getElementById('porcent').textContent = '90%';
     }
 }
 const dataIframe = getParam(url)
 generateBgAndTitles(dataIframe.type);
 selectDatainsurance(dataIframe);
 