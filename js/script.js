let numberOfTiles;
let score = 0;
let hiscore = getCookieValue("hiscore");
let moves = 0;

//cookie function
function getCookieValue(name) {
  let result = document.cookie.match("(^|[^;]+)\\s*" + name + "\\s*=\\s*([^;]+)")
  return result ? result.pop() : ""
}

/**
 * funzione eseguita per inizializzazione
 */
function init() {
  numberOfTiles = document.getElementById("toggle").checked ? 16 : 9;
  createTable();
  // console.log(numberOfTiles); //! debug line
  pushSequence(createValidList()); // vado a creare una lista valida nella tabella
  updateListeners();
}

/**
 * crea la tabella html
 */
function createTable() {
  let tbody = document.querySelector("#gameTable>tbody").innerHTML;
  for (let i = 0; i < Math.sqrt(numberOfTiles); i++) {
    tbody += `<tr id="tr${i}">`;
    for (let j = 0; j < Math.sqrt(numberOfTiles); j++) {
      tbody += `<td class="game-tile" id="${
        i * Math.sqrt(numberOfTiles) + j
      }"></td>`;
      // console.log("td");
    }
    tbody += `</tr>`;
    // console.log("tr");
  }
  document.querySelector("#gameTable>tbody").innerHTML = tbody;
}

/**
 * aggiorna i listener
 */
function updateListeners() {
  let sequence = pullSequence();
  surround(sequence.indexOf(0));
}

/**
 * circonda la cella di indice fornito con
 * @param {Number} number indice della cella da circondare su giù sx dx con listeners
 */
function surround(number) {
  let vd = Math.sqrt(numberOfTiles);
  let xn = number % vd;
  let yn = Math.floor(number / Math.sqrt(numberOfTiles));

  if (distance(xn, yn, getx(number + 1), gety(number + 1)) == 1)
    addlistener(number + 1);
  if (distance(xn, yn, getx(number - 1), gety(number - 1)) == 1)
    addlistener(number - 1);
  if (distance(xn, yn, getx(number + vd), gety(number + vd)) == 1)
    addlistener(number + vd);
  if (distance(xn, yn, getx(number - vd), gety(number - vd)) == 1)
    addlistener(number - vd);
}

function distance(x1, y1, x2, y2) {
  let dx = x1 - x2;
  console.log(dx);
  let dy = y1 - y2;
  console.log(dy);
  let distance = Math.sqrt(dx * dx + dy * dy);
  console.log(distance);
  return distance;
}

function getx(number) {
  console.log(
    "getting x of " + number + ": " + (number % Math.sqrt(numberOfTiles))
  );
  return number % Math.sqrt(numberOfTiles); // coordinata y della cella controllata
}

function gety(number) {
  console.log(
    "getting y of " +
      number +
      ": " +
      Math.floor(number / Math.sqrt(numberOfTiles))
  );
  return Math.floor(number / Math.sqrt(numberOfTiles)); // coordinata x della cella controllata
}

function addlistener(index) {
  if (index < 0 || index > numberOfTiles-1) return;
  document.getElementById(index).addEventListener("click", swap);
  console.log("listener in " + index);
}

function swap(evt) {
  moves++
  updateMoves()
  let collection = document.getElementsByClassName("game-tile");
  let numbers = pullSequence();
  let indexOfZero = numbers.indexOf(0);
  for (let i = 0; i < collection.length; i++) {
    collection[i].classList.remove("zero"); // togli classe 0 da ogni elemento
    collection[i].removeEventListener("click", swap);
  }
  let indexOfEvent = parseInt(evt.target.id);
  let supp = numbers[indexOfZero];
  numbers[indexOfZero] = numbers[indexOfEvent];
  numbers[indexOfEvent] = supp;
  pushSequence(numbers);
  console.log(
    "-------------------------------------------------------------------------"
  );
  sequence = pullSequence();
  rightSeq =
    numberOfTiles == 16
      ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]
      : [1, 2, 3, 4, 5, 6, 7, 8, 0];
  if(arraysEqual(sequence, rightSeq)) win()
  updateListeners();
}

function win() {
  score = Math.floor(getScore())
  if(score > hiscore) {
    hiscore = score
    document.cookie = `hiscore=${hiscore};SameSite=None;Secure`
    updateScores()
  }
}

function getScore() {
  return Math.pow(0.93, score-50)
}

function updateMoves() {
  +document.getElementById("moves-value").innerText++
}

function updateScores() {
  document.getElementById("score-value").innerHTML = score
  document.getElementById("highscore-value").innerHTML = hiscore
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
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
      table_elements[i].classList.add("zero");
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
  elem.addEventListener("click", swapCells);
  elem.classList.add("movable");
  console.log(`${elem.innerHTML} is movable`);
}
