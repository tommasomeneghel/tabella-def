let numberOfTiles;

function init() {
    numberOfTiles = document.getElementById("toggle").checked ? 16 : 9;
    createTable()
    console.log(numberOfTiles) //! debug line
    pushSequence(createValidList()); // vado a creare una lista valida nella tabella 
    updateListeners()
}

function createTable() {
    let tbody = document.querySelector("#gameTable>tbody").innerHTML
    for ( let i = 0; i < Math.sqrt(numberOfTiles); i++) {
        tbody += `<tr id="tr${i}">`
        for( let j = 0; j < Math.sqrt(numberOfTiles); j++ ) {
            tbody += `<td class="game-tile" id="td${i * Math.sqrt(numberOfTiles) + j}"></td>`
            console.log("td")
        }
        tbody += `</tr>`
        console.log("tr")
    }
    document.querySelector("#gameTable>tbody").innerHTML = tbody
}

function updateListeners() {
    let sequence = pullSequence()
    for( let i = 0; i < numberOfTiles; i++) {
        if(sequence[i] == 0) {
            surround(i)
        }
    }
}

function surround(number) {
}


/**
 * controlla se i due numeri sono sulla stessa colonna
 * @param {Number} number primo indice da controlalre
 * @param {Number} index secondo indice da controllare
 * @returns numeri sulla stessa colonna?
 */
function sameColumn(number, index) {
  let side_len = Math.sqrt(numberOfTiles);
  if (number % side_len != index % side_len) return false;
  return true;
}

/**
 * controlla se i due numeri sono sulla stessa riga
 * @param {Number} number primo indice da controlalre
 * @param {Number} index secondo indice da controllare
 * @returns numeri sulla stessa riga?
 */
function sameRow(number, index) {
  let side_len = Math.sqrt(numberOfTiles);
  if (Math.floor(Math.sqrt(number)) != Math.floor(Math.sqrt(index)))
    return false;
  return true;
}

/**
 * inizializza la tabella a valori casuali
 */
function createValidList() {
  let values = [];
  let number_of_swaps = rn(100, 20) * 2; // il *2 assicura che sia un numero valido -> scambi pari = risolvibile
  for (let i = 0; i < 16; i++) values.push(i); // crea lista 0-15
  for (let i = 0; i < number_of_swaps; i++) {
    let x = rn(numberOfTiles, 0); // ottieni due posizioni casuali
    let y = rn(numberOfTiles, 0);
    let supp = values[x]; // scambia i valori
    values[x] = values[y];
    values[y] = supp;
  }
  return values;
}

/**
 * restituisce un numero casuale cui valore è compreso tra 0 e number
 * @param {Number} number valore massimo del numero casuale
 * @param {Number} offset valore da sommare al numero casuale
 * @returns numero casuale
 */
function rn(number, offset = 0) {
  return Math.floor(Math.random() * number + offset);
}

/**
 * trasporta la sequenza nella tabella dell'html
 * @param {number[]} valori la sequenza di numeri valida
 */
function pushSequence(valori) {
  let table_elements = document.getElementsByClassName("game-tile");
  for (let i = 0; i < table_elements.length; i++) {
    table_elements[i].innerHTML = valori[i]; // assegnamento sequenza a celle dell'html
    if (valori[i] == 0) {
      table_elements[i].classList.toggle("zero");
    }
  }
}

/**
 * legge e restituisce la sequenza di numeri dall'html
 * @returns {Number[]} sequenza di numeri presente nell'html
 */
function pullSequence() {
  let valori = [];
  let table_elements = document.getElementsByClassName("game-tile");
  for (let i = 0; i < table_elements.length; i++) {
    valori.push(+table_elements[i].innerHTML);
  }
  return valori;
}

/**
 * imposta l'elemento fornito come movable 
 * @param {HTMLElement} elem l'elemento da metter movable e da aggiungere listener 
 */
 function setMovable(elem) {
    elem.addEventListener("click", swapCells)
    elem.classList.add("movable")
    console.log(`${elem.innerHTML} is movable`)
  }
  