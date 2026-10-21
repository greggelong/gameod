let grid;
let cols = 20;
let rows = 5;
let resolutionX, resolutionY;
let img;

// Generation counter so you can confirm the simulation is actually stepping
let gen = 0;

async function setup() {
  // p5.js 2.0: Load the background image using await instead of preload.
  // Ensure your image file is named 'background.jpg' and is in the same folder.
  img = await loadImage("background.png");

  // Create canvas matching the image aspect ratio (approximate based on your upload)
  createCanvas(1024, 512);

  // -----------------------------------------------------------------
  // OPTION B: If you want a *bigger* board for richer Life behaviour,
  // subdivide each parking spot. Uncomment the two lines below.
  // Keep cols=20, rows=5 for the visual alignment, but track a finer
  // simulation grid. (Requires adjusting resolutionX/Y and the drawing
  // loop — left as an exercise; the simple 20x5 version is below.)
  // -----------------------------------------------------------------

  // Calculate cell size based on canvas dimensions
  resolutionX = (width - 220) / cols;
  resolutionY = (height - 120) / rows;

  // -----------------------------------------------------------------
  // OPTION A: Seed a glider instead of random noise.
  // Random noise on a 20x5 torus almost always dies within a few ticks,
  // which makes it look like Life isn't running. A glider will travel.
  // -----------------------------------------------------------------
  grid = make2DArray(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0; // start all dead
    }
  }

  // Place a glider near the top-left (needs ~4x4 free space; torus wraps it)
  const gx = 2,
    gy = 1;
  grid[gx + 1][gy] = 1;
  grid[gx + 2][gy + 1] = 1;
  grid[gx][gy + 2] = 1;
  grid[gx + 1][gy + 2] = 1;
  grid[gx + 2][gy + 2] = 1;

  // -----------------------------------------------------------------
  // If you'd rather go back to random noise, replace the block above with:
  //   grid = make2DArray(cols, rows);
  //   for (let i = 0; i < cols; i++)
  //     for (let j = 0; j < rows; j++)
  //       grid[i][j] = floor(random(2));
  // -----------------------------------------------------------------

  // Slow down the frame rate so we can see the evolution
  frameRate(4);
}

function draw() {
  // 1. Draw the background image
  image(img, 0, 0, width, height);

  // 2. Draw the Game of Life
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * resolutionX;
      let y = j * resolutionY;

      if (grid[i][j] == 1) {
        // Style for living cells
        fill(0, 200); // Black with slight transparency to see the ground
        stroke(255); // White outline for contrast
        strokeWeight(2);
        rect(x, y, resolutionX, resolutionY);
      }
    }
  }

  // 3. Compute the next generation
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

      // -----------------------------------------------------------------
      // Default: wrap around edges (Toroidal grid)
      // -----------------------------------------------------------------
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];

      // -----------------------------------------------------------------
      // OPTION C: If you want WALLS instead of wrapping, comment out the
      // two lines above and uncomment the three lines below:
      //
      // let col = x + i;
      // let row = y + j;
      // if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      // sum += grid[col][row];
      // -----------------------------------------------------------------
    }
  }
  return sum;
}
