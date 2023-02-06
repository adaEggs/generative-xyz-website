let fps = 1;
var radius;
let radiuses = [];
let xc;
let yc;
let poly;
let excitement;
let startAngle;
let angle;
let fx;
let rotateAngle;
let mainRadius;
let shadowColor = [210, 255, 255];
let hourColor = [10, 210, 210]
let bgColor = [28, 28, 28, 0];
let logoStyle
let palette = [];

function setup() {
  createCanvas(windowWidth, windowHeight);  
  frameRate(fps);
  xc = width / 2;
  yc = height / 2;

  logoStyle = 1; // 0 - custom color, 1 - White logo, 2 - Black logo, 3 - Random color 
  
  poly = getRandomInt(1, 4);
  //poly = 2; // 1, 2, 3, 4, 5
  if (poly == 1){    
    mainRadius = height*0.05*4
  }
  else {
    
    mainRadius = height*0.05*getRandomInt(1,6);
    //mainRadius = height*0.05*3;
  }

  
  startAngle = PI / (2.5+0.5*getRandomInt(1,5));
  //startAngle = PI / (2.5+0.5*4);
  excitement = height*0.05; 
  angle = (PI / 2 - startAngle) / poly;
  for (let a = startAngle; a < PI / 2; a += angle) {
    if (a == startAngle) {
      radius = mainRadius;
    } else {
      radius = random(height*0.2, height*0.3);
    }

    radiuses.push(radius);
  }
  fx = 2; // 0, 1, 2
  rotateAngle = 0;
  if (logoStyle == 2){
    shadowColor = [0,0,0];
    hourColor = 80;
    bgColor = 28;
  }
  else if (logoStyle == 1) {
    shadowColor = [255, 255, 255];
    hourColor = 210;
    bgColor = 28;
  }
  else if (logoStyle == 3){
    //colorMode(HSL,360,100,100); 
    h = getRandomInt(0,361);
    s = getRandomInt(30,101);
    b = getRandomInt(50,81);
    getPalette();
    
    shadowColor = hexToRgb(palette[2]);
    //shadowColor = [255, 255, 255];
    hourColor = hexToRgb(palette[2]);
    bgColor = 28;//hexToRgb(palette[3]);
    
  }


}

function draw() {

  background(bgColor);
  //clear();
  // for (let i=0; i<5; i++) { 
  // fill(palette[i]);
  // square (i*100,0,100);
  // }
  if (fx == 1){
    push();
    //noFill();
    //strokeWeight(10);
    translate(xc,yc);
    rotate(PI);
    //scale(0.5);
    rotate(rotateAngle);
    noStroke();
    shadowColor[3] = 100;
    fill(shadowColor);
    polygon(0,mainRadius*2.5, poly, 1);
    polygon(0,-mainRadius*2.5, poly, 2);
    
    rotate(PI/3);
    shadowColor[3] = 50;
    fill(shadowColor);
    polygon(0,mainRadius*2.5, poly, 1);
    polygon(0,-mainRadius*2.5, poly, 2);
    
    rotate(PI/3);
    shadowColor[3] = 20;
    fill(shadowColor);
    polygon(0,mainRadius*2.5, poly, 1);
    polygon(0,-mainRadius*2.5, poly, 2);
    
    rotateAngle+=PI/30;
    pop();
    
    push();
    noFill();
    strokeWeight(2);
    translate(xc,yc);
    //rotate(PI);
    //scale(0.5);
    rotate(-rotateAngle+PI/30);
    shadowColor[3] = 100;
    stroke(shadowColor);
    polygon(0,-mainRadius/2, poly, 1);
    polygon(0,mainRadius/2, poly, 2);
    
    rotate(-PI/3);
    shadowColor[3] = 250;
    stroke(shadowColor);
    polygon(0,-mainRadius/2, poly, 1);
    polygon(0,mainRadius/2, poly, 2);
    
    rotate(-PI/3);
    shadowColor[3] = 20;
    stroke(shadowColor);
    polygon(0,-mainRadius/2, poly, 1);
    polygon(0,mainRadius/2, poly, 2);
    
    rotateAngle+=PI/30;
    pop();
    
  }
  if (fx == 0){
    
    noFill();
    strokeWeight(2);
    shadowColor[3] = 20;
    stroke(shadowColor);
    polygon(xc - random(-excitement, excitement), yc - random(-excitement, excitement), poly, 1);
    polygon(xc - random(-excitement, excitement), yc - random(-excitement, excitement), poly, 2);

    shadowColor[3] = 50;
    stroke(shadowColor);
    polygon(xc - random(-excitement, excitement), yc - random(-excitement, excitement), poly, 1);
    polygon(xc - random(-excitement, excitement), yc - random(-excitement, excitement), poly, 2);
    shadowColor[3] = 100;
    stroke(shadowColor);
    polygon(xc - random(-excitement, excitement), yc - random(-excitement, excitement), poly, 1);
    polygon(xc - random(-excitement, excitement), yc - random(-excitement, excitement), poly, 2);
  }
  

  
  if (fx == 2){
    noStroke();
    shadowColor[3] = 20;
    fill(shadowColor);
    polygon(xc - random(-excitement, excitement), yc - random(-excitement, excitement), poly, 1);
    polygon(xc - random(-excitement, excitement), yc - random(-excitement, excitement), poly, 2);
    shadowColor[3] = 50;
    fill(shadowColor);
    polygon(xc - random(-excitement, excitement), yc - random(-excitement, excitement), poly, 1);
    polygon(xc - random(-excitement, excitement), yc - random(-excitement, excitement), poly, 2);
    shadowColor[3] = 100;
    fill(shadowColor);
    polygon(xc - random(-excitement, excitement), yc - random(-excitement, excitement), poly, 1);
    polygon(xc - random(-excitement, excitement), yc - random(-excitement, excitement), poly, 2);
    
    noFill();
    strokeWeight(2);
    shadowColor[3] = 20;
    stroke(shadowColor);
    polygon(xc - random(-excitement, excitement), yc - random(-excitement, excitement), poly, 1);
    polygon(xc - random(-excitement, excitement), yc - random(-excitement, excitement), poly, 2);

    shadowColor[3] = 50;
    stroke(shadowColor);
    polygon(xc - random(-excitement, excitement), yc - random(-excitement, excitement), poly, 1);
    polygon(xc - random(-excitement, excitement), yc - random(-excitement, excitement), poly, 2);
    shadowColor[3] = 100;
    stroke(shadowColor);
    polygon(xc - random(-excitement, excitement), yc - random(-excitement, excitement), poly, 1);
    polygon(xc - random(-excitement, excitement), yc - random(-excitement, excitement), poly, 2);
  }
    //draw main shape
  noStroke();
  fill(hourColor);
  polygon(xc, yc, poly, 0);
}

function polycurve(x, y, npoints, part) {
  let angle = (PI / 2 - startAngle) / npoints;
  let id = 0;
  if (part == 0 || part == 2){
    beginShape();
    id = poly - 1;
    let sx = x + cos(PI/2) * radiuses[id];
    let sy = y + sin(PI/2) * radiuses[id];
    curveVertex(sx, sy);
    curveVertex(sx, sy);
    for (let a = PI/2 - angle; a >= startAngle; a -= angle) {
      radius = radiuses[id];
      id -= 1;
      let sx = x + cos(a) * radius;
      let sy = y + sin(a) * radius;
      curveVertex(sx, sy);
    }
    curveVertex(x,y);
    id = 0;
    for (let a = PI - startAngle; a >= PI/2+ angle; a -= angle) {
      radius = radiuses[id];
      id += 1;
      let sx = x + cos(a) * radius;
      let sy = y + sin(a) * radius;
      curveVertex(sx, sy);
    }
    endShape(CLOSE);
  }
  
  if (part == 0 || part == 1){
    beginShape();
    id = poly - 1;
    sx = x + cos(PI/2) * radiuses[id];
    sy = y - sin(PI/2) * radiuses[id];
    curveVertex(sx, sy);
    curveVertex(sx, sy);
    for (let a = PI/2 - angle; a >= startAngle; a -= angle) {
      radius = radiuses[id];
      id -= 1;
      let sx = x + cos(a) * radius;
      let sy = y - sin(a) * radius;
      curveVertex(sx, sy);
    }
    curveVertex(x,y);
    id = 0;
    for (let a = PI - startAngle; a >= PI/2+ angle; a -= angle) {
      radius = radiuses[id];
      id += 1;
      let sx = x + cos(a) * radius;
      let sy = y - sin(a) * radius;
      curveVertex(sx, sy);
    }
    endShape(CLOSE);
  }
}

function polygon(x, y, npoints, part) {
  let angle = (PI / 2 - startAngle) / npoints;
  let id = 0;
  
  if (part == 0 || part == 2){
    beginShape();
    vertex(x, y);
    for (let a = startAngle; a < PI / 2; a += angle) {
      radius = radiuses[id];
      id += 1;
      let sx = x + cos(a) * radius;
      let sy = y + sin(a) * radius;
      vertex(sx, sy);
    }

    id = poly;
    for (let a = PI / 2 + angle; a < PI + startAngle; a += angle) {
      id -= 1;
      radius = radiuses[id];
      let sx = x + cos(a) * radius;
      let sy = y + sin(a) * radius;
      vertex(sx, sy);
    }
    vertex(x, y);
    endShape();
  }
  if (part == 0 || part == 1){  
    beginShape();
    id = 0;
    vertex(x, y);
    for (let a = PI + startAngle; a < (3 * PI) / 2; a += angle) {
      radius = radiuses[id];
      id += 1;
      let sx = x + cos(a) * radius;
      let sy = y + sin(a) * radius;
      vertex(sx, sy);
    }

    id = poly;
    for (let a = (3 * PI) / 2 + angle; a < 2 * PI + startAngle; a += angle) {
      id -= 1;
      radius = radiuses[id];
      let sx = x + cos(a) * radius;
      let sy = y + sin(a) * radius;
      vertex(sx, sy);
    }

    vertex(x, y);
    endShape();
  }
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
  // The maximum is exclusive and the minimum is inclusive
}

function drawCenter(){
  stroke(255,255,255);
  strokeWeight(1);
  line(0, yc, width, yc);
  line(width / 2, 0, width / 2, height);
  strokeWeight(4);
  point(xc, yc);
  strokeWeight(1);
}

function keyPressed(){
  
  //if the key is a s
  if(key == 's'){
    //save out to a file
    save('my-great-proejct.png');
  }
  
}

function getPalette() {
  for (let i=0; i<5; i++) {
    let x = i%5;
    palette.push(fillComplementary(x));
  }
  return palette;

}

function fillComplementary(colorOrder) {
  if (colorOrder == 0) {
    hValue = h;
    sValue = s + 10;
    bValue = b + 30;
  } else if (colorOrder == 1) {
    hValue = h;
    sValue = s - 10;
    bValue = b + 30;
  } else if (colorOrder == 2) {
    hValue = h;
    sValue = s;
    bValue = b;
  } else if (colorOrder == 3) {
    hValue = h - 180;
    sValue = s + 20;
    //bValue = b + 30;
    bValue = b - 30;
  } else if (colorOrder == 4) {
    hValue = h - 180;
    sValue = s;
    bValue = b;
  }
  if (hValue < 0) {
    hValue+=360;
  }
  if ((colorOrder == 0 || colorOrder == 3) && bValue >= 80) {
    bValue-=60;
  }
  fill(hValue,sValue,bValue);
  console.log('hValue: ' + hValue,'sValue: ' + sValue,'bValue: ' + bValue);
  return hslToHex(hValue,sValue,bValue);
}

function fillSquare(colorOrder) {
  if (colorOrder == 0) {
    hValue = h;
    sValue = s + 20;
  } else if (colorOrder == 1) {
    hValue = h + 90;
    sValue = s - 10;
  } else if (colorOrder == 2) {
    hValue = h;
    sValue = s;
  } else if (colorOrder == 3) {
    hValue = h + 180;
    sValue = s + 10;
  } else if (colorOrder == 4) {
    hValue = h - 90;
    sValue = s + 5;
  }
  if (hValue < 0) {
    hValue+=360;
  } else if (hValue > 360) {
    hValue-=360;
  }
  if (sValue > 100) { 
    sValue-=20;
  }
  bValue = b;
  fill(hValue,sValue,bValue);
  console.log('hValue: ' + hValue,'sValue: ' + sValue,'bValue: ' + bValue);
  return hslToHex(hValue,sValue,bValue);
}

function fillTriad(colorOrder) {
  if (colorOrder == 0) {
    hValue = h - 120;
    sValue = s + 10;
    bValue = b + 30;
  } else if (colorOrder == 1) {
    hValue = h + 120;
    sValue = s - 10;
    bValue = b;
  } else if (colorOrder == 2) {
    hValue = h;
    sValue = s;
    bValue = b;
  } else if (colorOrder == 3) {
    hValue = h - 120;
    sValue = s + 10;
    bValue = b;
  } else if (colorOrder == 4) {
    hValue = h + 120;
    sValue = s + 10;
    bValue = b + 30;
  }
  if (hValue > 360) {
    hValue-=360;
  } else if (hValue < 0) {
    hValue+=360;
  }
  if (sValue > 100) {
    sValue-=20;
  }
  if (bValue >= 80) {
    bValue-=60;
  }
  fill(hValue,sValue,bValue);
  console.log('hValue: ' + hValue,'sValue: ' + sValue,'bValue: ' + bValue);
  return hslToHex(hValue,sValue,bValue);
}
function fillAnalogous(colorOrder) {
  if (colorOrder == 0) {
    hValue = h + 2*30;
    sValue = s + 5;
    bValue = b + 5;
  } else if (colorOrder == 1) {
    hValue = h + 1*30;
    sValue = s + 5;
    bValue = b + 9;
  } else if (colorOrder == 2) {
    hValue = h;
    sValue = s;
    bValue = b;
  } else if (colorOrder == 3) {
    hValue = h - 1*30;
    sValue = s + 5;
    bValue = b + 9;
  } else if (colorOrder == 4) {
    hValue = h - 2*30;
    sValue = s + 5;
    bValue = b + 5;
  }
  if (hValue < 0) {
    hValue+=360;
  } else if (hValue > 360) {
    hValue-=360;
  }
  if (bValue > 100) {
    bValue-=10;
  }
  fill(hValue,sValue,bValue);
  console.log('hValue: ' + hValue,'sValue: ' + sValue,'bValue: ' + bValue);
  return hslToHex(hValue,sValue,bValue);
}
function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToRgb(hex) {
    hex = hex.replace('#', '');

    var bigint = parseInt(hex, 16);

    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return [r, g, b];
}