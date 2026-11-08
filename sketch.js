//dataset: HAPPINESS INDEX. Nella visualizzazione ogni Paese è un glifo rappresentato da una faccina
//Ogni faccina sarà colorata dal gradiente freddo-caldo del 'saldo emotivo'(=emozioni positive-negative) medio del Paese

let data;

let minSaldo = Infinity;
let maxSaldo = -Infinity;

let margin = 20;
let gutter = 4;

let topSpace = 100; //spazio per il titolo
let rightSpace = 230; //spazio per la legenda

let lowLimit = 0.4;
let highLimit = 0.65; //valori presi direttamente dal dataset come limite per il saldo emotivo

let colorScale = {
  'cold': '#3a6ea5',         // gradiente: freddo (meno felice)
  'mid': '#eee8d2',          // gradiente: medio
  'warm': '#f47820',         // gradiente: caldo (più felice)
  'missing': '#c8c8c8',      // dato mancante
  'features': '#282828'      // occhi e bocca
}

async function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log('p5.js version:', p5.VERSION);
  // put setup code here
  
  //Carico il CSV
  data = await loadTable("assets/happinessIndex.csv", ",", "header");

  for (let rowNumber = 0; rowNumber < data.getRowCount(); rowNumber++) {
    let saldo = realSaldo(rowNumber);
    if (saldo > maxSaldo) maxSaldo = saldo;
    if (saldo < minSaldo) minSaldo = saldo;
  }

  noLoop();
}

function readSaldo(rowNumber) {
  return parseFloat(data.getString(rowNumber, "saldo")); //per i dati mancanti
}

function draw() {
  // put drawing code here

  background(250, 248, 243);

  //griglia
  let width = windowWidth - rightSpace - 2 * margin;
  let height = windowHeight - topSpace - margin;

  let numberOfCountries = data.getRowCount();
  let cols = ceil(sqrt(numberOfCountries * width / height));
  let rows = ceil(numberOfCountries / cols);

  //dimensioni faccina
  let faceWidth = (width - (cols - 1) * gutter) / cols;
  let faceHeight = (height - (rows - 1) * gutter) / rows;
  let face = min(faceWidth, faceHeight);

  for (let rowNumber = 0; rowNumber < numberOfCountries; rowNumber++) {
    let col = rowNumber % cols;
    let row = floor(rowNumber / cols);
    let x = margin + col * (face + gutter);
    let y = topSpace + row * (face + gutter);

     drawGlyph(readSaldo(rowNumber), x, y, face);
  }

  }

//disegno il glifo faccina
function drawGlyph(saldo, x, y, s) {
  noStroke();
  let cx = x + s / 2;      // centro della faccina
  let cy = y + s / 2;


  if (isNaN(saldo)) {
    fill(colorScale.missing);
    circle(cx, cy, s);
    return;  //se il saldo è mancante la faccina è neutra
  }

  let t = map(saldo, minSaldo, maxSaldo, 0, 1);  // map() porta il saldo (da minSaldo a maxSaldo) su una scala da 0 a 1

  //forma faccia
  fill(gradientColor(t));
  circle(cx, cy, s);

  //occhi
  fill(colorScale.features);
  circle(cx - s * 0.18, cy - s * 0.1, s * 0.1);
  circle(cx + s * 0.18, cy - s * 0.1, s * 0.1);

  //bocca
  let mouth = "smile";
    if (t < lowLimit) {
      mouth = "frown";
    } else if (t < highLimit) {
      mouth = "flat";
    }

  noFill();
  stroke(colorScale.features);
  strokeWeight(max(1, s*0.06));
  strokeCap(ROUND); // estremi arrotondati

  if (mouth == "smile") {
    // arc(centroX, centroY, larghezza, altezza, angoloInizio, angoloFine, modo)

    // da 0 a PI è la metà BASSA di un'ellisse = curva verso il basso
    arc(cx, cy + s * 0.05, s * 0.5, s * 0.4, 0, PI, OPEN);
  } else if (mouth == "frown") {
    // da PI a TWO_PI è la metà ALTA dell'ellisse = curva verso l'alto
    arc(cx, cy + s * 0.28, s * 0.5, s * 0.4, PI, TWO_PI, OPEN);
  } else {
    // linea dritta
    line(cx - s * 0.22, cy + s * 0.2, cx + s * 0.22, cy + s * 0.2);
  }
  noStroke();
}

function gradientColor(t) {
  if (t < 0.5) {
    return lerpColor(color(colorScale.cold), color(colorScale.mid), t * 2);
  }
  return lerpColor(color(colorScale.mid), color(colorScale.warm), (t - 0.5) * 2);
}
