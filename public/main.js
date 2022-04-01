const byPassMinify = `// Hello there fellow nerd. Couldn't help sneaking a peak at the code huh?
// This project was pulled together VERY quickly, so please don't judge!
// There's some odd code choices here, but if it works, it works.
// I'll be working on cleaning it and publicly releasing soon.
// In the meantime, feel free to email info@slapchris.com with ideas, questions, suggestions or bugs!`;

/** Just a boolean global, JS Shitness */
var firstAudioRun = true;

/** just a 5 sec loader to check Koulis Image */
window.onload = function () {
  setTimeout(function () {
    preload();
  }, 50000);
};

function preventBehavior(e) {
  e.preventDefault();
}

document.addEventListener("touchmove", preventBehavior, {
  passive: false,
});
function Face() {
  this.graphics = {
    face: koulis,
    slapLeft: slapLeft,
    slapRight: slapRight,
  };
  this.iWidth = 253;
  this.iHeight = 306;
  this.ratio = 2.5;
  this.padding = 30 / this.ratio;
  this.width = this.iWidth / this.ratio;
  this.height = this.iHeight / this.ratio;
  this.gravity = 0.2;
  this.velocity_x = 0;
  this.velocity_y = 0;
  this.ypos = height / 2 - this.height;
  this.xpos = W - this.width - 20;
  this.collision = false;

  this.show = function () {
    image(this.graphics.face, this.xpos, this.ypos, this.width, this.height);
    noFill();
    noStroke();
    rect(this.xpos, this.ypos, 100, 100);
  };

  this.update = function () {
    this.minY = this.height / 2;
    this.maxY = height - this.height / 2;
    // calculate gravity

    this.velocity_y = this.velocity_y + this.gravity;
    this.ypos = this.ypos + this.velocity_y;

    // calculate side movement

    this.xpos = this.xpos + this.velocity_x;
    this.velocity_x = this.velocity_x * 0.99;
  };
}

function Hand() {
  this.iHeight = 120;
  this.iWidth = 120;
  this.ratio = 1.2;
  this.height = this.iHeight / this.ratio;
  this.width = this.iWidth / this.ratio;
  this.v_speed = 0;
  this.gravity = 0.5;
  this.ypos = height / 2 - 100;
  this.xpos = 10;
  this.drag = false;
  this.v_speed_x = 0;
  this.isFish = false;
  const getHandImg = () => {
    if (startScreen === 1) {
      return handstart;
    }
    if (Math.random() < 0.0001 || secretCounter >= 3) {
      this.isFish = true;
      return fishHand;
    }
    if (Math.random() < 0.004) {
      return Math.random() > 0.5 ? rarehand1 : rarehand2;
    }
    return handstart;
  };
  this.img = getHandImg();
  this.startImg = this.img;
  this.onBall = function (x, y) {
    return (
      x >= this.xpos &&
      x <= this.xpos + this.width &&
      y >= this.ypos &&
      y <= this.ypos + this.height
    );
  };

  this.startDrag = function () {
    if (this.isFish) {
      this.img = fishHandMove;
    } else {
      this.img = handimg;
    }
    this.drag = true;
    this.mousex = mouseX;
    this.mousey = mouseY;
  };

  this.endDrag = function () {
    this.img = this.startImg;
    this.drag = false;
  };

  this.update = function () {
    this.minY = this.height / 2;
    this.maxY = height - this.height / 2;

    if (this.drag) {
      this.xpos = mouseX - this.width / 2;
      this.ypos = mouseY - this.height / 2;
      this.v_speed_x = this.v_speed_x / 2 + (mouseX - this.mousex);
      this.v_speed = this.v_speed / 2 + (mouseY - this.mousey);
      this.mousex = mouseX;
      this.mousey = mouseY;
    } else {
      if (Math.abs(this.v_speed_x) > 1) {
        this.xpos += this.v_speed_x * 0.5;
        this.v_speed_x = this.v_speed_x * 0.5;
      }
      if (Math.abs(this.v_speed) > 1) {
        this.ypos += this.v_speed * 0.5;
        this.v_speed = this.v_speed * 0.5;
      }
    }
  };

  this.show = function () {
    image(this.img, this.xpos, this.ypos, this.width, this.height);
    noFill();
    noStroke();
    rect(this.xpos, this.ypos, 100, 100);
  };
}

var face;
var hand;

let metric = true;
let startScreen = 0;
let container = document.getElementById("container");
let W = container.getBoundingClientRect().width;
let H = container.getBoundingClientRect().height;
let secretCounter = 0;

function mousePressed() {
  if (startScreen === 1) {
    startScreen = 0;
  }

  if (hand.onBall(mouseX, mouseY)) hand.startDrag();
}

function touchStarted() {
  if (startScreen === 1) {
    window.navigator.getUserMedia = (...args) =>
      window.navigator.mediaDevices.getUserMedia(...args);
    userStartAudio();
    startScreen = 0;
  }
  userStartAudio();
  if (hand.onBall(mouseX, mouseY)) hand.startDrag();
}

function mouseReleased() {
  if (
    !(
      hand.xpos < face?.xpos + face?.height &&
      hand.xpos + hand?.height > face?.xpos &&
      hand.ypos < face?.ypos + face?.height &&
      hand.height + hand?.ypos > face?.ypos
    )
  ) {
  }
  if (hand?.xpos < 0 || hand?.xpos > W || hand?.ypos < 0 || hand?.ypos > H) {
    hand = new Hand();
  }
  hand?.endDrag();
}
function preload() {
  robotoFont = loadFont("assets/Roboto-Light.ttf");
  slapsfx0 = loadSound("assets/slap_str0.mp3");
  slapsfx1 = loadSound("assets/slap_str1.mp3");
  slapsfx2 = loadSound("assets/slap_str2.mp3");
  slapsfx3 = loadSound("assets/slap_str3.mp3");
  slapsfx4 = loadSound("assets/slap_str4.mp3");
  slapsfx5 = loadSound("assets/slap_str5.mp3");
  slapsfxfish = loadSound("assets/slap_fish.mp3");
  giati_gelate = createAudio("./assets/atakes/giati_gelate.mp3");
  jiggy = loadSound("assets/jiggy.mp3");

  // Hands
  handstart = loadImage("assets/hand2.png");
  rarehand1 = loadImage("assets/rarehand1.png");
  rarehand2 = loadImage("assets/rarehand2.png");
  fishHand = loadImage("assets/fish.png");
  fishHandMove = loadImage("assets/fish2.png");
  handimg = loadImage("assets/hand3.png");

  // Kiriakos Mitsotakis Faces & Sounds
  koulis = loadImage("assets/koulis.gif");
  slapRight = loadImage("assets/slap_right.gif");
  slapLeft = loadImage("assets/slap_left.gif");
  //MP3's
  koulisPaidiaMP3 = loadSound("/assets/atakes/geiasas_paidia.mp3");
  koulisDouleiaMP3 = loadSound("/assets/atakes/douleia.mp3");
  koulisEinsteinMP3 = loadSound("/assets/atakes/einstein.mp3");
  koulisEmvolioMP3 = loadSound("/assets/atakes/emvolio.mp3");
  koulisExarcheiaMP3 = loadSound("/assets/atakes/exarcheia.mp3");
  koulisFovosMP3 = loadSound("/assets/atakes/fovos.mp3");
  koulisGalopoulesMP3 = loadSound("/assets/atakes/galopoules.mp3");
  koulisSyrizaMP3 = loadSound("/assets/atakes/koulis_suriza.mp3");
  koulisNtolmadakiaMP3 = loadSound("/assets/atakes/ntolmadakia.mp3");
  koulisSkopiaMP3 = loadSound("/assets/atakes/skopia.mp3");
  koulisSupermanMP3 = loadSound("/assets/atakes/superman.mp3");
}

function setup() {
  var cnv = createCanvas(W, H);
  cnv.parent("container");
  cnv.style("z-index", "0");
  cnv.style("position", "absolute");
  cnv.style("left", "50%");
  cnv.style("top", "50%");
  cnv.style("transform", "translate(-50%, -50%)");
  giati_gelate.volume(0.4);
  giati_gelate.play();
  hand = new Hand();
  face = new Face();
  if (W <= 500) {
    startScreen = 1;
  }
}
function initScreen() {
  background(250, 250, 250);
  textAlign(CENTER);
  image(hand.img, W / 2 - 100, H / 2 - 100, 200, 200);
  fill(0);
  textSize(W / 15);
  textFont(robotoFont);

  text("How fast can you slap", W / 2, H / 2 - 200);
  textAlign(CENTER, CENTER);

  textSize(W / 9);
  text("Kiriakos Mitsotakis?", W / 2, H / 2 - 150);

  textSize(W / 15);
  text("Tap to start.", W / 2, H / 2 + 150);
}
function resetGame() {
  secretCounter += 1;
  tweet.style.fontSize = "1.05rem";
  giati_gelate.play();
  hand = new Hand();
  face = new Face();
  score.style.transition = ".2s";
  score.style.fontSize = "50px";
  score.style.color = "rgba(0, 0, 0, 0.5)";
  score.innerHTML = `0 ${metric ? "χμ/ώρα" : "Μνημόνια"}`;
}

function draw() {
  clear();

  hand.update();
  hand.show();
  face.show();
  if (startScreen === 1) {
    initScreen();
  }
  if (
    ((hand.xpos < face.xpos + face.height + face.padding &&
      hand.xpos + hand.height - face.padding > face.xpos &&
      hand.ypos < face.ypos + face.height &&
      hand.height + hand.ypos > face.ypos) ||
      hand.xpos > W) &&
    face.collision === false
  ) {
    face.graphics.face =
      hand.v_speed_x > 0 ? face.graphics.slapLeft : face.graphics.slapRight;
    face.velocity_x = hand.v_speed_x * 0.1;
    face.velocity_y = hand.v_speed * 0.1;
    face.collision = true;
    const velocity = Math.sqrt(
      Math.pow(face.velocity_y, 2) + Math.pow(face.velocity_x, 2)
    );
    const speedFloat = (W < 900 ? velocity * 1.1 : velocity * 0.4) * 1.08;
    const speed = metric
      ? Math.floor(speedFloat)
      : Math.floor(speedFloat / 1.609);
    score.innerHTML = `${speed}${metric ? "χμ/ώρα" : "Μνημόνια"}`;
    tweet.innerHTML = `<a href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fkoulism.herokuapp.com%2F&text=%CE%A7%CE%B1%CF%83%CF%84%CE%BF%CF%8D%CE%BA%CE%B9%CF%83%CE%B1%20%CF%84%CE%BF%CE%BD%20%CE%9A%CE%BF%CF%8D%CE%BB%CE%B7%20%CE%BC%CE%B5%20${speed}${
      metric ? "χμ/ώρα" : "Μνημόνια"
    }%21&hashtags=mitsotakis">Tweet your score.</a><br/><a href="http://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fkoulism.herokuapp.com%2F&quote=%CE%A7%CE%B1%CF%83%CF%84%CE%BF%CF%8D%CE%BA%CE%B9%CF%83%CE%B1%20%CF%84%CE%BF%CE%BD%20%CE%9A%CE%BF%CF%8D%CE%BB%CE%B7%20%CE%BC%CE%B5%20${speed}${
      metric ? "χμ/ώρα" : "Μνημόνια"
    }%21" target="_blank" class="share-popup">Share on Facebook.</a>`;
    jiggy.stop();

    score.style.transition = ".2s";

    if (hand.isFish) {
      slapsfxfish.play();
    }

    if (speedFloat >= 30) {
      tweet.style.fontSize = "1.2rem";
      slapsfx5.play();
      jiggy.play();
      score.style.fontSize = "80px";
      score.style.color = "#22e51d";
    } else if (speedFloat > 25) {
      slapsfx4.play();
      score.style.fontSize = "70px";
      score.style.color = "#30AFFF";
    } else if (speedFloat > 20) {
      slapsfx3.play();
      score.style.fontSize = "60px";
      score.style.color = "#30AFFF";
    } else if (speedFloat > 15) {
      slapsfx2.play();
      score.style.fontSize = "50px";
      score.style.color = "#30AFFF";
    } else if (speedFloat > 10) {
      slapsfx2.play();
      score.style.fontSize = "40px";
      score.style.color = "#30AFFF";
    } else if (speedFloat > 5) {
      slapsfx1.play();
      score.style.fontSize = "30px";
      score.style.color = "#30AFFF";
    } else {
      slapsfx0.play();
      score.style.fontSize = "20px";
      score.style.color = "#30AFFF";
    }
    // button = createButton('Reset Game');
    // button.position(W / 2, H / 2);
    // button.mousePressed(resetGame);
    setTimeout(function () {
      resetGame();
    }, 2000);
  }
  if (face.collision === true) {
    face.update();
  }
}
function swapUnit() {
  if (secretCounter === 3) {
    slapsfxfish.play();
    resetGame();
  }
  if (metric === true) {
    metric = false;
    document.getElementById("units").innerText = "Χαστούκια σε Χμ/ώρα!";
  } else {
    metric = true;
    document.getElementById("units").innerText = "Χαστούκια με το Μνημόνιο!";
  }
  score.innerHTML = `0 ${metric ? "χμ/ώρα" : "Μνημόνια"}`;
}

function windowResized() {
  W = container.getBoundingClientRect().width;
  H = container.getBoundingClientRect().height;
  resizeCanvas(W, H);

  hand = new Hand();
  face = new Face();
}

/** selects a random element from Array
 * and plays the selected preloaded Koulis MP3.
 * On first run President just says HI!
 */
function koulisWillSay() {
  const koulisAtakes = [
    koulisDouleiaMP3,
    koulisEinsteinMP3,
    koulisEmvolioMP3,
    koulisExarcheiaMP3,
    koulisFovosMP3,
    koulisGalopoulesMP3,
    koulisSyrizaMP3,
    koulisNtolmadakiaMP3,
    koulisSkopiaMP3,
    koulisSupermanMP3,
  ];

  if (firstAudioRun) {
    koulisPaidiaMP3.play();
    firstAudioRun = false;
  } else {
    var koulisRandomAudio =
      koulisAtakes[Math.floor(Math.random() * koulisAtakes.length)];
    koulisRandomAudio.play();
  }
}
