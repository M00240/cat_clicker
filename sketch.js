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
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
  noStroke();
}

function draw() {
  background(220);

  if (gameOver) {
    // Display the end message if the game is over
    textSize(32);
    fill(0, 114, 187);
    text("Congratulations!", width / 2, height / 2 - 20);
    textSize(20);
    text("You are now a millionaire!", width / 2, height / 2 + 20);
    return; // Stop further drawing when game is over
  }

  // Display gold
  textSize(24);
  fill(0, 114, 187);
  textAlign(CENTER, CENTER);
  text("Money: $" + gold, 200, 30);

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
  if (mouseX > 50 && mouseX < 175 && mouseY > 260 && mouseY < 310) {
    purchaseUpgrade("portal");
  }
  if (mouseX > 225 && mouseX < 350 && mouseY > 260 && mouseY < 310) {
    purchaseUpgrade("click");
  }
  if (mouseX > 125 && mouseX < 275 && mouseY > 320 && mouseY < 370) {
    purchaseUpgrade("multiplier");
  }
}

function generateGold() {
  gold += goldPerCat * clickEfficiency;
}

function drawButtons() {
  // Draw upgrade buttons dynamically from upgrades object with specified colors
  textSize(16);
  let yPos = 260;
  let xPos = 50;
  
  // Portal Upgrade Button
  fill(0, 114, 187);
  text(`${upgrades.portal.description}\nLvl ${upgrades.portal.level} | Cost: ${upgrades.portal.cost}`, 112.5, yPos + 25);

  // Click Upgrade Button
  fill(0, 114, 187);
  text(`${upgrades.click.description}\nLvl ${upgrades.click.level} | Cost: ${upgrades.click.cost}`, 287.5, yPos + 25);

  // Gold Multiplier Upgrade Button
  fill(0, 114, 187);
  text(`${upgrades.multiplier.description}\nLvl ${upgrades.multiplier.level} | Cost: ${upgrades.multiplier.cost}`, 200, yPos + 85);
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
    textSize(16);
    fill(173, 40, 49, map(effect.lifespan, 0, 60, 0, 255)); // Fade out effect for text
    text(effect.text, effect.x, effect.y - (60 - effect.lifespan) / 2);
    effect.lifespan--;
    if (effect.lifespan <= 0) {
      vfx.splice(i, 1); // Remove effect once lifespan is over
    }
  }
}
