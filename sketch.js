let data;
let rivers = [];
let maxLenght = 0;
let maxDischarge = 0;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log('p5.js version:', p5.VERSION);
  // put setup code here
  
  //carico il dataset
  data = await loadTable("assets/rivers.csv", ",", "header");

  //creo l'array di oggetti
  //per ogni fiume salvo il nome, la lunghezza, la portata e il continente
  for (let r = 0; r < data.getRowCount(); r++) {
  let river = {
    name: data.getString(river, "name"),
    lenght: data.getNum(river, "lenght"),
    discharge: data.getNum(river, "discharge"),
    continent: data.getString(river, "continent")
  };
  rivers.push(river);

  //salvo la lunghezza e la portata maggiore 
  if(river.lenght > maxLenght) {
    maxLenght = river.lenght;
  }
  if(river.discharge > maxDischarge) {
    maxDischarge = river.discharge;
  }
}
  noLoop();
}

function draw() {
  // put drawing code here
  }

