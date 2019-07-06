/* page/week-routines.jsx
 * bea dreyer
 *
 * this script adds a list of all routines done in a week given by the
 * ROUTINES constant.
 */

var doc = app.activeDocument;
var pg  = app.layoutWindows[0].activePage;

const WEEK_REF = new Date();

// planner sets up routines & trackers, leaving room for handwritten todos
// can you fucking believe indesign won't let u use fucking CLASSES
// THE ABSOLUTE GALL
// anyways routine set up is modeled after habitica.com's dailies
const routine_UNIT = { DAILY: 0, WEEKLY: 1, MONTHLY: 2, YEARLY: 3 }
const routine_DAY = { SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
                                 THURSDAY: 4, FRIDAY: 5, SATURDAY: 6 }
const routine_MONTHS = {
  JANUARY:   0, FEBRUARY: 1, MARCH:     2, APRIL:     3,
  MAY:       4, JUNE:     5, JULY:      6, AUGUST:    7,
  SEPTEMBER: 8, OCTOBER:  9, NOVEMBER: 10, DECEMBER: 11
}

              // string, int,  Date,   int, int[], int,   int
function Routine(title, unit, start, count, days, week, month) {
  this.title = title;

  // does this routine happen daily (0), weekly (1), monthly (2), or
  // yearly (3)? aka this var is a number determines if variable count
  // counts number of days, weeks, months, or years between days,
  // weeks, months, or years this routine is active
  this.unit = unit;

  if (start != null)    // start is a Date object
    this.start = start; // start date of pattern if there is one
  else this.start = WEEK_REF;

  if (count != null && count > 0) this.count = count;
  else this.count = 1; // default value, pretty much just hit every one

  // iff unit == 1 (weekly), then days is an array of sorted, unique
  // numbers (0-6) representing a day of the week on which this routine is
  // used
  if (days != null) {
    this.days = days;

    this.days.sort(function(left, right) { return left - right; });

    var last_day = null;
    for (var i = 0; i < this.days.length; i++) {
      if (this.day < 0 || this.day > 6
          || (last_day != null && this.days[i] == last_day))
        this.days = this.days.splice(i, 1);
      last_day = this.days[i];
    }
  } else this.days = [ routine_DAY.SUNDAY,
      /* default  */   routine_DAY.MONDAY,
      /* value =  */   routine_DAY.TUESDAY,
      /* everyday */   routine_DAY.WEDNESDAY,
                       routine_DAY.THURSDAY,
                       routine_DAY.FRIDAY,
                       routine_DAY.SATURDAY ];

  // if unit == 2 (monthly) or 3 (yearly) then this number gives the week
  // number for the active week else it means nothing for example, if
  // unit == 2, days == [ 6 ], & week == 4, then this routine is used on
  // the 4th saturday of every month if unit == 3 & week == 2, this does
  // not mean automatically that the routine is active every year in its
  // 2nd week. if month is set, then the routine is active in the 2nd week
  // of that month!
  // however, if it is not, then the former situation applies
  if (week != null) this.week = week;

  // if unit == 3 (yearly), then month should be a number from 0-11 to
  // represent the month in which this routine is active else it means
  // nothing if this is valid, this affects the meaning of week
  if (month != null) this.month = month;
}

// preconditions:
// - count > 0
function is_active(routine, date) {
  if (routine.unit == routine_UNIT.DAILY) {
    if (routine.count == 1)
      // we repeat the routine everyday, aka the routine is active
      return true;

    else if (Math.floor((date.getTime() - routine.start.getTime())
              / (1000 * 60 * 60 * 24)) % routine.count == 0) {
      // if a day is active, that means it is some multiple of count
      // away from the start of this routine's pattern
      return true;

    } else return false;

  } else if (routine.unit == routine_UNIT.WEEKLY) {
    if (routine.count == 1 ||        // if the week is active
        Math.floor((date.getTime() - routine.start.getTime())
          / (1000 * 60 * 60 * 24 * 7)) % routine.count == 0) {
      for (var routine_day = 0; routine_day < routine.days.length;
           routine_day++) {
        if (routine_day == date.getDay()) return true;
      }
      return false;

    } else return false;

  } else if (routine.unit == routine_UNIT.MONTHLY) {
    if (routine.count == 1 ||        // if the month is active
        (date.getMonth() - routine.start.getMonth()) % routine.count == 0) {
      if (Math.floor(date.getDate() / 7) == routine.week) {
        for (var routine_day = 0; routine_day < routine.days.length;
             routine_day++) {
          if (routine_day == date.getDay()) return true;
        }
        return false;
      } else return false;
    } else return false;

  } else if (routine.unit == routine_UNIT.YEARLY) {
    // TODO
    return false;

  } else {
    $.writeln("error is_active(routine, date): not a valid Routine.unit");
    return false;
  }
}

/* a way to translate the Date objects' number representation of days to
 * strings of my chosen format that state the day initial
 * precondition: from_num is a number between or including 0-6
 */
function day(from_num) {
  const DAYS = [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ];
  return DAYS[from_num];
}

const MORNING_ROUTINES =
  [ new Routine("make bed", routine_UNIT.DAILY),
    new Routine("take meds", routine_UNIT.DAILY),
    new Routine("drink 4 bottles of water", routine_UNIT.DAILY),
    new Routine("cook breakfast", routine_UNIT.DAILY),
    new Routine("feed pets", routine_UNIT.DAILY),
    new Routine("brush teeth", routine_UNIT.DAILY),
    new Routine("rinse face", routine_UNIT.DAILY) ]
const DAY_ROUTINES =
  [ new Routine("ask a friend how they're doing", routine_UNIT.DAILY),
    new Routine("clean litterbox", routine_UNIT.WEEKLY, WEEK_REF, 1,
                [ routine_DAY.THURSDAY ]),
    new Routine("take out trash", routine_UNIT.WEEKLY, WEEK_REF, 1,
                [ routine_DAY.THURSDAY ]) ]
const NIGHT_ROUTINES =
  [ new Routine("take a shower", routine_UNIT.DAILY, WEEK_REF, 2),
    new Routine("play with ascii", routine_UNIT.DAILY),
    new Routine("feed pets", routine_UNIT.DAILY),
    new Routine("brush teeth", routine_UNIT.DAILY),
    new Routine("wash face", routine_UNIT.DAILY),
    new Routine("take meds", routine_UNIT.DAILY) ];

const TXT_BOX_DIMENSIONS = 1; // 1p0

// below the routines are the margins, & that's it
const MARGINAL_HEIGHT = TXT_BOX_DIMENSIONS;       // the margin itself
const OBJ_SPACING     = 0.5 * TXT_BOX_DIMENSIONS; // space btwn margin&this

// to the left of the routines are the holes
//                  inches * 6 picas/inch
const HOLES_DIAMETER = 0.2 * 6; // the left width is the width of a hole
const HOLES_XMARGIN  = 0.2 * 6; // & two widths of this margin

// we need the below so that we can translate Indesign's stroke weight units
// to picas, which are used for determining location/dimensions
const STROKE_WEIGHT_UNIT = 0.5 / 6; // 0p0.5, there are 6 points in a pica
const FRAME_WEIGHT = STROKE_WEIGHT_UNIT * // width of a frame line, outside
  doc.objectStyles.itemByName("outer_frame").strokeWeight; // of element
const ACCENT_WEIGHT = STROKE_WEIGHT_UNIT * // width of an accent line,
  doc.objectStyles.itemByName("accent_100").strokeWeight; // inside of element

// bounds for the entire layout, including frames
const X1 = pg.bounds[1] + 2 * HOLES_XMARGIN + HOLES_DIAMETER;
const X2 = pg.bounds[3]; // element, w its frames, extends to right edge
const Y2 = pg.bounds[2] - (MARGINAL_HEIGHT + OBJ_SPACING);

// EACH ROUTINE, SET UP IN SECTIONS OF MORNING, DAY, & NIGHT

// for calculating bounds of inner elements
var y2 = Y2 - FRAME_WEIGHT; // keeping track of where we are in building

var highlight = true; // rows of routines will alternate between pink/white

// rows are constructed from bottom to top, right to left
// function for constructing each row
// section is a string denoting whether this routine is a morning, day, or
// night routine
function routine_row(section, routine_title, Y2) {
  const Y1 = Y2 - TXT_BOX_DIMENSIONS; // its a row, we're not moving up/down
  var x2 = X2 - FRAME_WEIGHT; // determines based on what we've added
  var x1 = x2 - (7 * TXT_BOX_DIMENSIONS + 6 * ACCENT_WEIGHT);

  // make one big box for all of the check boxes because theyll be
  // "separated" by accent lines
  var check_title = section + " " + routine_title + " check";
  var check_boxes = (pg.textFrames.itemByName(check_title) == null)
                       ? pg.textFrames.add({ name : check_title })
                       : pg.textFrames.itemByName(check_title);
  check_boxes.properties = {
    itemLayer          : doc.layers.itemByName("routines"),
    appliedObjectStyle : doc.objectStyles.itemByName("base"),
    geometricBounds    : [ Y1, x1, Y2, x2 ]
  }
  if (highlight)
    check_boxes.fillColor = doc.colors.itemByName("melon_pink");

  x2 = x1 - ACCENT_WEIGHT; // move past the check boxes
  x1 = X1 + FRAME_WEIGHT;  // all the space for the whole element to the
                           // left of the check boxes is for the routine

  var routine_search = section + " " + routine_title;
  var routine_box = (pg.textFrames.itemByName(routine_search) == null)
                       ? pg.textFrames.add({ name : routine_search })
                       : pg.textFrames.itemByName(routine_search);
  routine_box.properties = {
    itemLayer          : doc.layers.itemByName("routines"),
    appliedObjectStyle : doc.objectStyles.itemByName("obj"),
    geometricBounds    : [ Y1, x1, Y2, x2 ],
    contents           : routine_title
  }

  highlight = !highlight;
  return Y1; // so that we can continue where we left off from bottom 2 top
}

// starting at the bottom of the night routines
for (var routine_i = NIGHT_ROUTINES.length - 1; routine_i >= 0;
     routine_i--) {
  var active = false; // if a routine is not active that week its not listed
  var check_date = new Date(WEEK_REF); // get beginning of week
  check_date.setDate(check_date.getDate() - check_date.getDay());

  // if a routine is active even one day in the week its listed
  for (var day_i = 0; day_i < 7; day_i++) { // day_i is rly just symbolic
    if (is_active(NIGHT_ROUTINES[routine_i], check_date)) {
      active = true;
      break;
    } else check_date.setDate(check_date.getDate() + 1);
  }

  if (active) {
    y2 = routine_row("night", NIGHT_ROUTINES[routine_i].title, y2)
         - ACCENT_WEIGHT / 2; // theres an accent line above each routine

    // horizontal tinted accent if there are still more of these routines
    // else its made at the top of the section
    if (routine_i != 0) {
      var accent_search = "night routine horizontal accent " + routine_i;
      var accent_line = (pg.graphicLines.itemByName(accent_search) == null)
                           ? pg.graphicLines.add({ name : accent_search })
                           : pg.graphicLines.itemByName(accent_search);
      accent_line.properties = {
        itemLayer          : doc.layers.itemByName("frames"),
        appliedObjectStyle : doc.objectStyles.itemByName("accent_25"),
        geometricBounds    : [ y2, X1 + FRAME_WEIGHT,
                               y2, X2 - FRAME_WEIGHT ]
      }

      y2 -= ACCENT_WEIGHT / 2;
    }
  }
}

var accent_search = "night routine horizontal accent";
var accent_line = (pg.graphicLines.itemByName(accent_search) == null)
                     ? pg.graphicLines.add({ name : accent_search })
                     : pg.graphicLines.itemByName(accent_search);
accent_line.properties = {
  itemLayer          : doc.layers.itemByName("frames"),
  appliedObjectStyle : doc.objectStyles.itemByName("accent_100"),
  geometricBounds    : [ y2, X1 + FRAME_WEIGHT,
                         y2, X2 - FRAME_WEIGHT ]
}

y2 -= ACCENT_WEIGHT / 2;

for (var routine_i = DAY_ROUTINES.length - 1; routine_i >= 0;
     routine_i--) {
  var active = false; // if a routine is not active that week its not listed
  var check_date = new Date(WEEK_REF); // get beginning of week
  check_date.setDate(check_date.getDate() - check_date.getDay());

  // if a routine is active even one day in the week its listed
  for (var day_i = 0; day_i < 7; day_i++) { // day_i is rly just symbolic
    if (is_active(DAY_ROUTINES[routine_i], check_date)) {
      active = true;
      break;
    } else check_date.setDate(day.getDate() + 1);
  }

  if (active) {
    y2 = routine_row("day", DAY_ROUTINES[routine_i].title, y2)
         - ACCENT_WEIGHT / 2; // theres an accent line above each routine

    // horizontal tinted accent if there are still more of these routines
    // else its made at the top of the section
    if (routine_i != 0) {
      var accent_search = "day routine horizontal accent " + routine_i;
      var accent_line = (pg.graphicLines.itemByName(accent_search) == null)
                           ? pg.graphicLines.add({ name : accent_search })
                           : pg.graphicLines.itemByName(accent_search);
      accent_line.properties = {
        itemLayer          : doc.layers.itemByName("frames"),
        appliedObjectStyle : doc.objectStyles.itemByName("accent_25"),
        geometricBounds    : [ y2, X1 + FRAME_WEIGHT,
                               y2, X2 - FRAME_WEIGHT ]
      }

      y2 -= ACCENT_WEIGHT / 2;
    }
  }
}

var accent_search = "day routine horizontal accent";
var accent_line = (pg.graphicLines.itemByName(accent_search) == null)
                     ? pg.graphicLines.add({ name : accent_search })
                     : pg.graphicLines.itemByName(accent_search);
accent_line.properties = {
  itemLayer          : doc.layers.itemByName("frames"),
  appliedObjectStyle : doc.objectStyles.itemByName("accent_100"),
  geometricBounds    : [ y2, X1 + FRAME_WEIGHT,
                         y2, X2 - FRAME_WEIGHT ]
}

y2 -= ACCENT_WEIGHT / 2;

for (var routine_i = MORNING_ROUTINES.length - 1; routine_i >= 0;
     routine_i--) {
  var active = false; // if a routine is not active that week its not listed
  var check_date = new Date(WEEK_REF); // get beginning of week
  check_date.setDate(check_date.getDate() - check_date.getDay());

  // if a routine is active even one day in the week its listed
  for (var day_i = 0; day_i < 7; day_i++) { // day_i is rly just symbolic
    if (is_active(MORNING_ROUTINES[routine_i], check_date)) {
      active = true;
      break;
    } else check_date.setDate(check_date.getDate() + 1);
  }

  if (active) {
    y2 = routine_row("morning", MORNING_ROUTINES[routine_i].title, y2)
         - ACCENT_WEIGHT / 2; // theres an accent line above each routine

    // horizontal tinted accent if there are still more of these routines
    // else its made at the top of the section
    if (routine_i != 0) {
      var accent_search = "morning routine horizontal accent " + routine_i;
      var accent_line = (pg.graphicLines.itemByName(accent_search) == null)
                           ? pg.graphicLines.add({ name : accent_search })
                           : pg.graphicLines.itemByName(accent_search);
      accent_line.properties = {
        itemLayer          : doc.layers.itemByName("frames"),
        appliedObjectStyle : doc.objectStyles.itemByName("accent_25"),
        geometricBounds    : [ y2, X1 + FRAME_WEIGHT,
                               y2, X2 - FRAME_WEIGHT ]
      }

      y2 -= ACCENT_WEIGHT / 2;
    }
  }
}

var accent_search = "morning routine horizontal accent";
var accent_line = (pg.graphicLines.itemByName(accent_search) == null)
                     ? pg.graphicLines.add({ name : accent_search })
                     : pg.graphicLines.itemByName(accent_search);
accent_line.properties = {
  itemLayer          : doc.layers.itemByName("frames"),
  appliedObjectStyle : doc.objectStyles.itemByName("accent_100"),
  geometricBounds    : [ y2, X1 + FRAME_WEIGHT,
                         y2, X2 - FRAME_WEIGHT ]
}

y2 -= ACCENT_WEIGHT / 2;

// ROUTINES HEADINGS

// return to the right edge of entire element, we're going right to left
var x2 = X2 - FRAME_WEIGHT;
var y1 = y2 - TXT_BOX_DIMENSIONS; // prepare to add a row of text boxes
var x1;

// headings for each day of the week's check boxes

var day_search_prefix = "routine day ";
var day_search = null;
var day_box = null;
for (var day_i = 6; day_i >= 0; day_i--) {
  x1 = x2 - TXT_BOX_DIMENSIONS; // prepare to add

  day_search = day_search_prefix + day_i;
  day_box = (pg.textFrames.itemByName(day_search) == null)
               ? pg.textFrames.add({ name : day_search })
               : pg.textFrames.itemByName(day_search);
  day_box.properties = {
    itemLayer          : doc.layers.itemByName("routines"),
    appliedObjectStyle : doc.objectStyles.itemByName("obj_head_bottom"),
    geometricBounds    : [ y1, x1, y2, x2 ],
    contents           : day(day_i)
  }

  x2 = x1 - ACCENT_WEIGHT; // update location
}

// title for entire element

x1 = X1 + FRAME_WEIGHT; // take up the entire left space

var routines_box = (pg.textFrames.itemByName("routines") == null)
                      ? pg.textFrames.add({ name : "routines" })
                      : pg.textFrames.itemByName("routines");
routines_box.properties = {
  itemLayer          : doc.layers.itemByName("routines"),
  appliedObjectStyle : doc.objectStyles.itemByName("obj_head_bottom"),
  geometricBounds    : [ y1, x1, y2, x2 ],
  contents           : "routines"
}

// (REMAINING) ACCENTS
// verticals

// we just did the title, so x2 is placed right where we have an accent line
// for sunday (day 0), we just need to center the line
x2 += ACCENT_WEIGHT / 2;
// as well, y1 is placed where the tinted line starts! we just need then y2
y2 = Y2 - FRAME_WEIGHT;

// first tho we need to make the smaller accent line btwn each routine & its
// check boxes
var accent_search = "routine vertical small accent";
var accent_line = (pg.graphicLines.itemByName(accent_search) == null)
                     ? pg.graphicLines.add({ name : accent_search })
                     : pg.graphicLines.itemByName(accent_search);
accent_line.properties = {
  itemLayer          : doc.layers.itemByName("frames"),
  appliedObjectStyle : doc.objectStyles.itemByName("accent_100"),
  geometricBounds    : [ y1 + TXT_BOX_DIMENSIONS, x2,
                         y2,                      x2 ]
}

for (var day_i = 0; day_i < 7; day_i++) {
  var accent_search = "routine vertical accent " + day_i;
  var accent_line = (pg.graphicLines.itemByName(accent_search) == null)
                       ? pg.graphicLines.add({ name : accent_search })
                       : pg.graphicLines.itemByName(accent_search);
  accent_line.properties = {
    itemLayer          : doc.layers.itemByName("frames"),
    appliedObjectStyle : doc.objectStyles.itemByName("accent_25"),
    geometricBounds    : [ y1, x2, y2, x2 ]
  }

  x2 += TXT_BOX_DIMENSIONS + ACCENT_WEIGHT;
}

// adjust layering so that the bold accents are on top of the tinted accents
pg.graphicLines.itemByName("morning routine horizontal accent")
               .bringToFront();
pg.graphicLines.itemByName("day routine horizontal accent").bringToFront();
pg.graphicLines.itemByName("night routine horizontal accent")
               .bringToFront();
pg.graphicLines.itemByName("routine vertical small accent").bringToFront();

// FRAME
var frame = (pg.rectangles.itemByName("routines frame") == null)
               ? pg.rectangles.add({ name : "routines frame" })
               : pg.rectangles.itemByName("routines frame");
frame.properties = {
  itemLayer          : doc.layers.itemByName("frames"),
  appliedObjectStyle : doc.objectStyles.itemByName("outer_frame"),
  geometricBounds    : [ y1 - FRAME_WEIGHT / 2, X1 + FRAME_WEIGHT / 2,
                         Y2 - FRAME_WEIGHT / 2, X2 - FRAME_WEIGHT / 2 ]
}
