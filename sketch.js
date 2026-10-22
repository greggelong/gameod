let grid;
let cols = 40;
let rows = 10;
let resolutionX, resolutionY;
let img;
let cnv;

let gen = 0;
let paused = false;
let restartBtn;

// -----------------------------------------------------------------
// Full-page scrolling text (black on white, behind the canvas)
// -----------------------------------------------------------------
let pageBg; // full-viewport white container
let scrollingText; // the paragraph block that drifts upward
let textY = 0; // current translateY
let scrollSpeed = 0.6; // px per animation frame

const ESSAY = `Which brings me to my main point.

Note that in this whole discussion of the Minab school strike I didn’t mention AI once. And that’s for a very good reason. Mistakes involving the misidentification of targets, including friendly fire incidents, happen all the time in military operations, AI or no AI. It is very possible that the mistake of the US officers was caused by their (over)reliance on an AI decision support system. It is very possible that Claude/Maven generated a target list, and that whatever data it produced never flagged the fact that, years ago, the school building was separated from the IRGC compound. Whether AI was used in the targeting process here, and if so how, is a hugely important fact that must be explored in any investigation. But — and this is my point — nothing changes from the perspective of any international criminal prosecution regardless of whether AI was used here or not. The US officers would still be able to plead an honest mistake, regardless of whether their error was a purely human one or an AI-enabled one.

It is true that cases such as these present an ‘accountability gap.’ But we’ve always had that gap in the conduct of hostilities context. The prosecution of such cases has always been difficult, especially when we’re dealing with one-off, isolated incidents (even if there may be systemic causes behind such incidents). AI can have a huge impact here, in that it will vastly multiply the number of attacks conducted while facilitating the cognitive errors of humans in the loop, so that even if the relative error rate is the same or lower than with human intelligence analysts, the absolute number of civilians killed or injured is higher.

This is exceptionally important from the perspective of ensuring respect for IHL and taking constant care to minimize the impact of military operations on civilians. But the impact on the core business of the ICC or some other international criminal tribunal is small. These kinds of cases are simply not going to be prosecuted, AI or no AI.

Which brings me to my second key point. The subset of conduct of hostilities cases that very much are part of the core business of international criminal justice are those in which war crimes are committed systematically and at scale. In those cases, civilians or civilian objects are targeted repeatedly, in a pattern that, together with other circumstantial evidence, enables an inference of intent.

Take as an example the arrest warrants issued by the ICC against four high-ranking Russian officers for the war crimes of targeting civilian objects and disproportionate attacks, due to the strikes repeatedly conducted against Ukrainian energy infrastructure, especially during winter. This is a case in which, if we looked at each attack in isolation, it could plausibly be argued that the given object being targeted was a military objective, because of its dual use. But when such attacks are conducted against power and heating plants all over Ukraine, regardless of any evidence of military use, for many years and particularly in winter, it becomes relatively straightforward to infer the intent of the persons who ordered these attacks. Time and again they’ve ordered attacks on targets that are not plausibly military objectives, and, even if they were, the anticipated impact on the civilian population was clearly disproportionate.

Imagine if we now introduced AI into this case. Could Sergei Shoigu et al plausibly rely on some kind of mistake of fact defence — we used an AI decision support system or an autonomous weapon and had no idea that the objects targeted were civilian? I mean, come on. Even if they did use some kind of AI system to support their targeting, if you continue using such a system over and over again despite the fact that its supposed ‘errors’ lead to strikes against the same type of civilian object, one can easily infer either purpose (direct intent) or oblique, indirect intent. As with our previous example, AI changes nothing. The case would be exactly the same regardless of any AI use.

It must be underlined here that, in any criminal prosecution involving the military use of AI, the relevant evidence would not just be technical in nature. The prosecutor and the judges would take all relevant evidence into account, including any circumstantial evidence about the intent of the persons in question. And there often is plenty of such evidence, including stuff that suspects stupidly say on social media. Sure, cases involving the use of AI would be difficult to prove, especially at the conviction stage where the standard of proof is one of beyond a reasonable doubt. But, as noted above, conduct of hostilities cases are already difficult to prove. I just fail to see how the military use of AI radically changes things for that subset of these cases, like Shoigu et al, which is the core business of international criminal justice. In those cases that matter the most, those cases on which international prosecutors and judges have focused their efforts and resources, the outcomes will broadly speaking be the same, AI or no AI.

Conclusion

In short, we’re going to be fine (or at least, the status quo will not be radically changed). This is not complacency. This is just reality. For those who argue otherwise, I would simply ask them the following question: go through the cases that have been prosecuted before international criminal courts and tribunals and that concerned the conduct of hostilities. Change the facts to introduce the use of an AI-enabled weapons system or a decision support system. Would, in this thought experiment, the outcome of these cases be any different? In a great majority of cases, my sense is that the outcomes would broadly be the same — despite the AI-specific challenges (‘black box’, ‘many hands’ etc). I am, of course, willing to be persuaded otherwise, but to do that we need to look at those kinds of conduct hostilities cases which international criminal justice has dealt with and is meant to deal with.

The same goes for the facilitation of international crimes by AI means, which I extensively discuss in my paper. The kinds of cases that are likely to be prosecuted (successfully) are those in which an accomplice provides their assistance to the perpetrator repeatedly, knowing exactly what would happen because there is a pattern of similar conduct, thus enabling the inference of the required degree of mens rea. Take, for example, a corporate executive who keeps providing an AI system to a state, which is then repeatedly used, over months or years, to systematically surveil the civilian population in a broader campaign of persecution on ethnic or religious grounds — that’s the kind of case that can be effectively prosecuted internationally.

Isolated one-offs are simply not what these courts are designed to do. Where AI will be much more of a game changer for international prosecutors and judges is in how it is used to gather and analyze evidence, even in those cases in which the commission of the crime has nothing to do with AI. When it comes to military uses of AI, however, I just don’t see how things will be radically different when compared to where we stand today — at least until the advent of AGI.

Again, this is not to deny the reality of accountability gaps, nor to deny the enormous impact that military uses of AI can have on the application of, and compliance with, IHL. I am here talking solely about international criminal prosecutions, especially in the context of the conduct of hostilities. These international prosecutions are only a tiny element of the kind of accountability framework that is needed to ensure effective compliance with IHL.

It is horrible that the mistakes of military officers cause the deaths of dozens or hundreds of children (and remember, when it comes to Iran the whole war is already illegal as a violation of the UN Charter). It may even be morally warranted to criminally punish some of these individuals, like those who, through their negligence, caused the deaths of so many children in Minab. But that accountability gap can only be dealt with domestically (and even that is highly unlikely as things stand). To plug that gap at the international level, we would need new law. We would need to have a clear basis for prosecuting individuals on the basis of negligence. The relevant offence could not be a war crime that requires intent, and even recklessness could cover only a small subset of additional cases.

If, however, one thinks that it is desirable to prosecute soldiers who negligently cause the deaths of civilians, the same standard has to apply across the board, regardless of whether AI is being used. Remember — we still don’t know whether AI was in fact used to inform the target decisions in the Minab school strike. I fail to see what exactly would change for the personal legal or moral responsibility of those who ordered that strike, regardless of whether AI was used or not. I am, however, pretty sure that there is simply no political appetite at the international level to change the current framework to accommodate negligence-based prosecutions, AI or no AI.`;

async function setup() {
  img = await loadImage("backgrounds.png");

  cnv = createCanvas(1024, 512);
  let cnx = (windowWidth - width) / 2;
  let cny = (windowHeight - height) / 2;
  cnv.position(cnx, cny);
  cnv.style("position", "absolute");
  cnv.style("z-index", "2"); // canvas above the text layer
  cnv.style("box-shadow", "0 0 0 1px #000"); // optional: thin border

  resolutionX = 20;
  resolutionY = 40;

  initGrid();

  // Restart button (above the text layer too)
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
  restartBtn.style("position", "absolute");
  restartBtn.style("z-index", "3"); // above the canvas
  restartBtn.mousePressed(restartSimulation);
  //restartBtn.style("opacity", "0");
  restartBtn.style("transition", "opacity 0.4s ease");
  //restartBtn.style("background", "transparent");
  restartBtn.style("border", "1px solid #fff");
  restartBtn.style("color", "#0e0404");

  restartBtn.mouseOver(() => restartBtn.style("opacity", "1"));
  restartBtn.mouseOut(() => restartBtn.style("opacity", "0"));

  // -----------------------------------------------------------------
  // Full-page background + scrolling text layer
  // -----------------------------------------------------------------
  // Wrapper: fills the whole viewport, clips overflow, z-index below canvas.
  pageBg = createDiv();
  pageBg.style("position", "fixed");
  pageBg.style("inset", "0"); // top/right/bottom/left = 0
  pageBg.style("background", "#ffffff");
  pageBg.style("overflow", "hidden");
  pageBg.style("z-index", "0");

  // The moving paragraph block
  scrollingText = createDiv("");
  scrollingText.parent(pageBg);
  scrollingText.style("position", "absolute");
  scrollingText.style("left", "0");
  scrollingText.style("right", "0");
  scrollingText.style("padding", "80px 10vw 80px 10vw");
  scrollingText.style("box-sizing", "border-box");
  scrollingText.style("white-space", "normal");
  scrollingText.style("font-family", "Georgia, 'Times New Roman', serif");
  scrollingText.style("font-size", "22px");
  scrollingText.style("line-height", "1.6");
  scrollingText.style("color", "#000");
  scrollingText.style("text-align", "justify");
  scrollingText.style("will-change", "transform");
  scrollingText.html(escapeForDiv(ESSAY));

  // Start fully below the viewport so the first line enters from the bottom
  textY = windowHeight + 40;
  scrollingText.style("transform", `translateY(${textY}px)`);

  // Begin smooth upward drift
  startScroller();

  frameRate(4); // Life simulation speed only
}

function initGrid() {
  grid = make2DArray(cols, rows);
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) grid[i][j] = 0;
  stampGlider(2, 1, 0);
}

function restartSimulation() {
  initGrid();
  gen = 0;
  paused = false;
}

function draw() {
  // 1. Draw the parking-lot image (the background of the canvas)
  image(img, 0, 0, width, height);

  // 2. Draw living cells
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * resolutionX + 150;
      let y = j * resolutionY + resolutionY;
      if (grid[i][j] == 1) {
        fill(0, 200);
        noStroke();
        rect(x, y, resolutionX - 2, resolutionY - 2);
      }
    }
  }

  // 3. Advance the Game of Life
  if (!paused) {
    let next = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let state = grid[i][j];
        let n = countNeighbors(grid, i, j);
        if (state == 0 && n == 3) next[i][j] = 1;
        else if (state == 1 && (n < 2 || n > 3)) next[i][j] = 0;
        else next[i][j] = state;
      }
    }
    grid = next;
    gen++;
  }

  // 4. Overlays
  fill(255);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  text("gen: " + gen, 10, 10);

  let alive = 0;
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++) if (grid[i][j] == 1) alive++;
  text("alive: " + alive, 10, 30);

  if (paused) {
    textAlign(RIGHT, TOP);
    text("PAUSED — press space to resume", width - 10, 10);
  }
}

// -----------------------------------------------------------------
// Smooth upward scroll of the full essay text.
// Runs on requestAnimationFrame so it's independent of frameRate(4).
// -----------------------------------------------------------------
function startScroller() {
  function tick() {
    let h = scrollingText.elt.offsetHeight || 1;

    textY -= scrollSpeed;
    scrollingText.style("transform", `translateY(${textY}px)`);

    // Once the whole block has scrolled above the top of the screen,
    // jump it back to just below the bottom to loop forever.
    if (textY + h < 0) {
      textY = windowHeight + 40;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Convert newlines to <br><br> and escape HTML entities
function escapeForDiv(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br><br>");
}

// -----------------------------------------------------------------
// Glider stamping + input
// -----------------------------------------------------------------
function stampGlider(cx, cy, rot) {
  const base = [
    [1, 0],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ];
  rot = ((rot % 4) + 4) % 4;
  for (const [ox, oy] of base) {
    let rx, ry;
    switch (rot) {
      case 0:
        rx = ox;
        ry = oy;
        break;
      case 1:
        rx = 2 - oy;
        ry = ox;
        break;
      case 2:
        rx = 2 - ox;
        ry = 2 - oy;
        break;
      case 3:
        rx = oy;
        ry = 2 - ox;
        break;
    }
    let i = (((cx + rx) % cols) + cols) % cols;
    let j = (((cy + ry) % rows) + rows) % rows;
    grid[i][j] = 1;
  }
}

function spawnGliderAt(mx, my) {
  let i = floor((mx - 120) / resolutionX) - 1;
  let j = floor(my / resolutionY) - 1;
  if (i < -1 || i > cols || j < -1 || j > rows) return;
  stampGlider(i, j, floor(random(4)));
}

function mousePressed() {
  spawnGliderAt(mouseX, mouseY);
}
function touchStarted() {
  for (let t of touches) spawnGliderAt(t.x, t.y);
  return false;
}
function keyPressed() {
  if (key === " ") paused = !paused;
}

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) arr[i] = new Array(rows);
  return arr;
}

function countNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (i == 0 && j == 0) continue;
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  return sum;
}
