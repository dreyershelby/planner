/* page/day_prompts.jsx
 * bea dreyer
 */

var doc = app.activeDocument;
var pg  = app.layoutWindows[0].activePage;

const TXT_BOX_DIMENSIONS = 1; // 1p0

// above the day's body text are the margins
const MARGINAL_HEIGHT = TXT_BOX_DIMENSIONS;
const OBJ_SPACING     = 0.5 * TXT_BOX_DIMENSIONS;

// to the right are the hole punches
//                  inches * 6 picas/inch
const HOLES_DIAMETER = 0.2 * 6;
const HOLES_XMARGIN  = 0.2 * 6;

const Y1 = pg.bounds[0] + MARGINAL_HEIGHT + OBJ_SPACING;
const X1 = pg.bounds[1];
const Y2 = pg.bounds[2] - MARGINAL_HEIGHT - OBJ_SPACING;
const X2 = pg.bounds[3] - (2 * HOLES_XMARGIN + HOLES_DIAMETER);

const PROMPT =
  "what word or phrase will describe my day today?\n\n" +
  "the things on my mind that i want to do/be are...\n\n\n\n\n\n" +
  "my intentions for today are...\r" +
  "      1.\n\n      2.\n\n      3.\n\r" +
  "my goals for today are...\r" +
  "      1.\n\n      2.\n\n      3.\n\r" +
  "1 physical, material thing i will do that will improve my life " +
  "conditions per day\n\n\n" +
  "how am i feeling?";

// if this text box doesn't exist, add it
var prompt_box = (pg.textFrames.itemByName("prompt_box") != null) 
  ? pg.textFrames.itemByName("prompt_box")
  : pg.textFrames.add({ name : "prompt_box" });
// update the box's properties
prompt_box.properties = {
  itemLayer          : doc.layers.itemByName("body"),
  appliedObjectStyle : doc.objectStyles.itemByName("body"),
  geometricBounds    : [ Y1, X1, Y2, X2 ],
  contents           : PROMPT
}
prompt_box.paragraphs[1].fillTint = prompt_box.paragraphs[3].fillTint = 50;
