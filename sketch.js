let grid;
let cols = 40;
let rows = 10;
let resolutionX, resolutionY;
let img;
let cnv;

// Generation counter so you can confirm the simulation is actually stepping
let gen = 0;

// Pause toggle (press space) so you can place cells without them evolving
let paused = false;

// Restart button reference
let restartBtn;

async function setup() {
  // p5.js 2.0: Load the background image using await instead of preload.
  // Ensure your image file is named 'backgrounds.png' and is in the same folder.
  img = await loadImage("backgrounds.png");

  // Create canvas matching the image aspect ratio (approximate based on your upload)
  cnv = createCanvas(1024, 512);
  let cnx = (windowWidth - width) / 2;
  let cny = (windowHeight - height) / 2;
  cnv.position(cnx, cny);

  // Calculate cell size based on canvas dimensions
  resolutionX = 20;
  resolutionY = 40;

  // Initialize grid and seed the initial glider
  initGrid();

  // Create the Restart button, positioned just below the canvas
  restartBtn = createButton("Restart");
  restartBtn.position(cnx, cny + height + 12);
  restartBtn.size(120, 36);
  restartBtn.style("font-size", "16px");
  restartBtn.style("font-family", "sans-serif");
  restartBtn.style("background-color", "#1e1e1e");
  restartBtn.style("color", "#ffffff");
  restartBtn.style("border", "1px solid #555");
  restartBtn.style("border-radius", "6px");
  restartBtn.style("cursor", "pointer");
  restartBtn.mousePressed(restartSimulation);

  // Slow down the frame rate so we can see the evolution
  frameRate(4);
}

// Initialise the grid: all dead, then drop in one glider
function initGrid() {
  grid = make2DArray(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0; // start all dead
    }
  }

  // Seed a glider near the top-left
  stampGlider(2, 1, 0);
}

// Restart handler: clear grid, re-seed glider, reset generation counter
function restartSimulation() {
  initGrid();
  gen = 0;
  paused = false;
}

function draw() {
  // 1. Draw the background image
  image(img, 0, 0, width, height);

  // 2. Draw the Game of Life
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * resolutionX + 120; // offset for image
      let y = j * resolutionY;

      if (grid[i][j] == 1) {
        // Style for living cells
        fill(0, 200); // Black with slight transparency to see the ground
        noStroke();
        rect(x, y, resolutionX - 2, resolutionY - 2);
      }
    }
  }

  // 3. Compute the next generation (skip while paused)
  if (!paused) {
    let next = make2DArray(cols, rows);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let state = grid[i][j];
        let neighbors = countNeighbors(grid, i, j);

        // Standard Conway's Game of Life Rules (B3/S23)
        if (state == 0 && neighbors == 3) {
          next[i][j] = 1; // birth
        } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
          next[i][j] = 0; // death by under/overpopulation
        } else {
          next[i][j] = state; // survival
        }
      }
    }

    grid = next;
    gen++;
  }

  // 4. Generation counter overlay so you can see it stepping
  fill(255);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  text("gen: " + gen, 10, 10);

  // (Optional) count living cells to confirm evolution is happening
  let alive = 0;
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++) if (grid[i][j] == 1) alive++;
  text("alive: " + alive, 10, 30);

  // Paused indicator
  if (paused) {
    textAlign(RIGHT, TOP);
    text("PAUSED — press space to resume", width - 10, 10);
  }
}

// -----------------------------------------------------------------
// Stamp a glider (3x3 Life pattern) at grid cell (cx, cy),
// rotated by `rot` quarter-turns (0..3). Uses toroidal wrapping so it
// works near the edges too.
//
// The base glider shape (rot 0) is:
//   . X .
//   . . X
//   X X X
// Rotations are done by rotating offsets around the glider's centre.
// -----------------------------------------------------------------
function stampGlider(cx, cy, rot) {
  // Base glider cells as offsets from an anchor at (0,0)
  const base = [
    [1, 0],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ];

  // Validate rotation
  rot = ((rot % 4) + 4) % 4;

  // Optional guard: only stamp if the 3x3 area is empty.
  // Uncomment the next 3 lines to enforce it.
  // if (!isAreaEmpty(cx, cy, 3, 3)) return;

  for (const [ox, oy] of base) {
    // Apply rotation to the offset around the 1.5,1.5 centre of a 3x3
    let rx, ry;
    switch (rot) {
      case 0:
        rx = ox;
        ry = oy;
        break;
      case 1:
        rx = 2 - oy;
        ry = ox;
        break; // 90° CW
      case 2:
        rx = 2 - ox;
        ry = 2 - oy;
        break; // 180°
      case 3:
        rx = oy;
        ry = 2 - ox;
        break; // 270° CW
    }

    // Wrap onto grid
    let i = (((cx + rx) % cols) + cols) % cols;
    let j = (((cy + ry) % rows) + rows) % rows;
    grid[i][j] = 1;
  }
}

// Utility: is a w×h area starting at (cx, cy) all dead?
// (wraps toroidally)
function isAreaEmpty(cx, cy, w, h) {
  for (let dx = 0; dx < w; dx++) {
    for (let dy = 0; dy < h; dy++) {
      let i = (((cx + dx) % cols) + cols) % cols;
      let j = (((cy + dy) % rows) + rows) % rows;
      if (grid[i][j] == 1) return false;
    }
  }
  return true;
}

// -----------------------------------------------------------------
// INPUT: Stamp a glider (random rotation) at the tapped/clicked cell.
// A single cell would die immediately under B3/S23, so we stamp a
// travelling pattern instead.
// -----------------------------------------------------------------
function spawnGliderAt(mx, my) {
  // Convert screen coords -> grid coords (account for the +120 x-offset).
  // We centre the 3x3 glider roughly on the tapped cell.
  let i = floor((mx - 120) / resolutionX) - 1;
  let j = floor(my / resolutionY) - 1;

  // Bounds check: ignore taps far outside the grid
  // (allow -1..cols and -1..rows since the glider is 3 wide/tall and wraps)
  if (i < -1 || i > cols || j < -1 || j > rows) return;

  // Random orientation: 0, 90, 180, 270 degrees
  let rot = floor(random(4));
  stampGlider(i, j, rot);
}

// Mouse input
function mousePressed() {
  spawnGliderAt(mouseX, mouseY);
}

// Touch input (mobile/tablet).
// Returning false prevents default touch gestures and stops p5 from
// firing mousePressed again for the same touch.
function touchStarted() {
  for (let t of touches) {
    spawnGliderAt(t.x, t.y);
  }
  return false;
}

// Pause / resume with spacebar
function keyPressed() {
  if (key === " ") {
    paused = !paused;
  }
}

// Helper function to create a 2D Array
function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

// Helper function to count live neighbors
function countNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      // Skip the cell itself
      if (i == 0 && j == 0) continue;

      // Default: wrap around edges (Toroidal grid)
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  return sum;
}
