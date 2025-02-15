let gold = 0;
let goldPerCat = 1; // Starting gold per generation
let clickEfficiency = 1;
let catTimer = 0;
let catInterval = 1500; // Initial rate: 1.5 seconds per generation
let catFace = ">o,o<"; // Start with open eyes
let isBlinking = false; // Track blinking state
let gameOver = false; // Track if the game has ended

// Set up a 5-second interval for blinking
setInterval(() => {
  isBlinking = true; // Start blinking
  setTimeout(() => {
    isBlinking = false; // End blinking after a short delay
  }, 300); // Duration of blink (300 ms)
}, 5000); // Blink every 5 seconds

// Upgrade system with controlled growth and no decimal increments
let upgrades = {
  portal: {
    cost: 50,
    level: 0,
    effect: () => {
      catInterval = max(500, Math.round(catInterval * 0.9)); // Gradual speed increase
      goldPerCat = Math.ceil(goldPerCat * 1.05); // Small incremental increase in gold per generation
    },
    description: "Upgrade Portal",
  },
  click: {
    cost: 25,
    level: 0,
    effect: () => {
      clickEfficiency += Math.round(Math.pow(1.1, upgrades.click.level)); // Rounded click efficiency increase
    },
    description: "Upgrade Click",
  },
  multiplier: {
    cost: 300,
    level: 0,
    effect: () => {
      goldPerCat = Math.ceil(goldPerCat * 1.3); // More moderate multiplier
    },
    description: "Gold Multiplier",
  }
};

// Visual effects messages
const vfxMessages = ["meow~", "purr~", "nya~", "gold meow!", "mrrrrp~"];
let vfx = []; // Array to store visual effects

function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent("canvas-container"); // Attach canvas to the container
  textAlign(CENTER, CENTER);
  noStroke();
}


function draw() {
  background(255, 255, 255); // Set background to white

  if (gameOver) {
    // Display the end message if the game is over
    textSize(32);
    fill(0, 114, 187);
    text("Congratulations!", width / 2, height / 2 - 20);
    textSize(20);
    text("You are now a millionaire!", width / 2, height / 2 + 20);
    return; // Stop further drawing when game is over
  }

  // Display gold in the top left corner
  textSize(16);
  fill(0, 114, 187);
  textAlign(LEFT, TOP);
  text("Money: $" + gold, 20, 20);

  // Check if the player has reached $1,000,000
  if (gold >= 1000000) {
    gameOver = true;
  }

  // Display cat art with blinking effect
  textAlign(CENTER, CENTER);
  textSize(18);
  let currentFace = isBlinking ? ">^,^<" : catFace; // Toggle face based on blink state
  text(`        /\\_/\\  ♥\n   ${currentFace}\n   /   \\\n      (___)_/`, width / 2, 150);

  // Generate gold automatically at set interval
  if (millis() - catTimer > catInterval) {
    generateGold();
    catTimer = millis();
  }

  // Draw upgrade buttons
  drawButtons();

  // Display and animate visual effects
  displayVFX();
}

function mousePressed() {
  // Stop further interaction if the game is over
  if (gameOver) return;

  // Generate money and add random effect text at click location
  generateGold();
  const randomMessage = vfxMessages[Math.floor(Math.random() * vfxMessages.length)];
  vfx.push({ text: randomMessage, x: mouseX, y: mouseY, lifespan: 60 });

  // Check for each upgrade button
  let buttonWidth = 120;
  let buttonHeight = 30;
  
  if (mouseX > 50 && mouseX < 50 + buttonWidth && mouseY > 260 && mouseY < 260 + buttonHeight) {
    purchaseUpgrade("portal");
  }
  if (mouseX > 230 && mouseX < 230 + buttonWidth && mouseY > 260 && mouseY < 260 + buttonHeight) {
    purchaseUpgrade("click");
  }
  if (mouseX > 140 && mouseX < 140 + buttonWidth && mouseY > 320 && mouseY < 320 + buttonHeight) {
    purchaseUpgrade("multiplier");
  }
}

function generateGold() {
  gold += goldPerCat * clickEfficiency;
}

function drawButtons() {
  textSize(12);
  let buttonWidth = 120;
  let buttonHeight = 30;
  
  fill(0, 114, 187);
  textAlign(CENTER, CENTER);
  text(`${upgrades.portal.description}\nLvl ${upgrades.portal.level} | Cost: ${upgrades.portal.cost}`, 110, 275);
  text(`${upgrades.click.description}\nLvl ${upgrades.click.level} | Cost: ${upgrades.click.cost}`, 290, 275);
  text(`${upgrades.multiplier.description}\nLvl ${upgrades.multiplier.level} | Cost: ${upgrades.multiplier.cost}`, 200, 335);
}

function purchaseUpgrade(upgradeKey) {
  const upgrade = upgrades[upgradeKey];
  if (gold >= upgrade.cost) {
    gold -= upgrade.cost;
    upgrade.effect();
    upgrade.level += 1;
    upgrade.cost = Math.ceil(upgrade.cost * 2.2); // Slower exponential cost increase for controlled growth
  }
}

function displayVFX() {
  for (let i = vfx.length - 1; i >= 0; i--) {
    let effect = vfx[i];
    textSize(12);
    fill(173, 40, 49, map(effect.lifespan, 0, 60, 0, 255)); // Fade out effect for text
    text(effect.text, effect.x, effect.y - (60 - effect.lifespan) / 2);
    effect.lifespan--;
    if (effect.lifespan <= 0) {
      vfx.splice(i, 1); // Remove effect once lifespan is over
    }
  }
}
