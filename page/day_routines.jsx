var doc = app.activeDocument;
var pg  = app.layoutWindows[0].activePage;

const REF_DATE = new Date();

const TXT_BOX_DIMENSIONS = 1; // 1p0

const MARGINAL_HEIGHT = TXT_BOX_DIMENSIONS;       // the margin itself
const OBJ_SPACING     = 0.5 * TXT_BOX_DIMENSIONS; // space btwn margin&this

// to the right of the routines are the holes
//                  inches * 6 picas/inch
const HOLES_DIAMETER = 0.2 * 6; // the left width is the width of a hole
const HOLES_XMARGIN  = 0.2 * 6; // & two widths of this margin

// we need the below so that we can translate Indesign's stroke weight units
// to picas, which are used for determining location/dimensions
const STROKE_WEIGHT_UNIT = 0.5 / 6; // 0p0.5, there are 6 points in a pica
const FRAME_WEIGHT = STROKE_WEIGHT_UNIT * // width of a frame line, outside
  doc.objectStyles.itemByName("outer_frame").strokeWeight; // of element
const ACCENT_WEIGHT = STROKE_WEIGHT_UNIT * // width of an accent line,
  doc.objectStyles.itemByName("accent_100").strokeWeight; // inside element

const DAY_INITIAL = day(REF_DATE.getDay());

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

              // string, int,  Date,      int, int[], int[],  int[]
function Routine(title, unit, start, frequency, days, weeks, months) {
  this.title = title;

  // does this routine happen daily (0), weekly (1), monthly (2), or
  // yearly (3)? aka this var is a number determines if variable count
  // counts number of days, weeks, months, or years between days,
  // weeks, months, or years this routine is active
  this.unit = unit;

  if (start != null)    // start is a Date object
    this.start = start; // start date of pattern if there is one
  else this.start = REF_DATE;

  if (frequency != null && frequency > 0) this.frequency = frequency;
  else this.frequency = 1; // default value, pretty much just hit every one

  // iff unit == 1 (weekly), then days is an array of sorted, unique
  // numbers (0-6) representing a day of the week on which this routine is
  // used
  if (days != null) {
    this.days = days;

    // make sure the day numbers are in the right order of 0 to 6
    this.days.sort(function(left, right) { return left - right; });

    var last_day = null;
    for (var i = 0; i < this.days.length; i++) {
      // get rid of number outside of 0 & 6...
      if (this.days[i] < 0 || this.days[i] > 6 
          || (last_day != null && this.days[i] == last_day)) // & repeats
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

  // if unit == 2 (monthly) or 3 (yearly) then these numbers give the week
  // number for the active week
  // else it means nothing
  // for example, if unit == 2, days == [ 6 ], & week == 4, then this
  // routine is used on the 4th saturday of every month
  // if unit == 3 & week == 2, this does not mean automatically that the
  // routine is active every year in its 2nd week.
  // if month is set, then the routine is active in the 2nd week of that
  // month!
  // however, if it is not, then the former situation applies
  if (weeks != null) {
    this.weeks = weeks;

    // make sure the week numbers are in the right order (increasing)
    this.weeks.sort(function(left, right) { return left - right; });

    var last_week = null;
    for (var i = 0; i < this.weeks.length; i++) {
      // get rid of number outside of 0 & 4...
      if (this.weeks[i] < 0 || this.weeks[i] > 4
          || (last_week != null && this.weeks[i] == last_week)) // & repeats
        this.weeks = this.weeks.splice(i, 1);
      last_week = this.weeks[i];
    }
  } else this.weeks = [ 0, 1, 2, 3, 4 ];

  // if unit == 3 (yearly), then month should be a number from 0-11 to
  // represent the month in which this routine is active else it means
  // nothing if this is valid, this affects the meaning of week
  if (months != null) {
    this.months = months;

    // make sure the month numbers are in the right order (increasing)
    this.months.sort(function(left, right) { return left - right; });

    var last_month = null;
    for (var i = 0; i < this.months.length; i++) {
      // get rid of number outside of 0 & 11 & repeats
      if (this.months[i] < 0 || this.months[i] > 11
          || (last_month != null && this.months[i] == last_month))
        this.months = this.months.splice(i, 1);
      last_month = this.months[i];
    }
  } else this.months = [ routine_MONTHS.JANUARY,
                         routine_MONTHS.FEBRUARY,
                         routine_MONTHS.MARCH,
                         routine_MONTHS.APRIL,
                         routine_MONTHS.MAY,
                         routine_MONTHS.JUNE,
                         routine_MONTHS.JULY,
                         routine_MONTHS.AUGUST,
                         routine_MONTHS.SEPTEMBER,
                         routine_MONTHS.OCTOBER,
                         routine_MONTHS.NOVEMBER,
                         routine_MONTHS.DECEMBER ];
}

// converts milliseconds to days, rounding down to whole numbers
function int_days(start_time, end_time) {
  return Math.floor( (end_time - start_time) / (1000 * 60 * 60 * 24) );
}

// converts milliseconds to weeks, rounding down to whole numbers
function int_weeks(start_time, end_time) {
  return Math.floor( (end_time - start_time) / (1000 * 60 * 60 * 24 * 7) );
}

function does_arr_include(element, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == element) return true;
  }
  return false;
}

// preconditions:
// - frequency > 0
function is_active(routine, date) {
  if (routine.unit == routine_UNIT.DAILY) {
    // if we repeat the routine everyday, the routine is active
    if (routine.frequency == 1)
      return true;
    else
      // iff a day is active, that means it is some multiple of frequency
      // away from the start of this routine's pattern
      return int_days(routine.start.getTime(), date.getTime())
             % routine.frequency == 0;

  } else if (routine.unit == routine_UNIT.WEEKLY) {
    if (routine.frequency == 1 // if the week is active every week
        || (int_weeks(routine.start.getTime(), date.getTime()) // OR
            % routine.frequency == 0)) { // if the week fits the active freq
      return does_arr_include(date.getDay(), routine.days);

    } else return false;

  } else if (routine.unit == routine_UNIT.MONTHLY) {
    if (routine.frequency == 1 // if the month fits the frequency
        || ((date.getMonth() - routine.start.getMonth())
            % routine.frequency == 0)) {
      if (does_arr_include(Math.floor(date.getDate() / 7), routine.weeks)) {
        return does_arr_include(date.getDay(), routine.days);
      } else return false;
    } else return false;

  } else if (routine.unit == routine_UNIT.YEARLY) {
    if (routine.frequency == 1 || // if the year fits the frequency
        (date.getFullYear() - routine.start.getFullYear()) %
          routine.frequency == 0) {
      return (does_arr_include(date.getMonth(), routine.months)
           && does_arr_include(Math.floor(date.getDate() / 7),
                                                routine.weeks)
           && does_arr_include(date.getDay(),   routine.days));
    } else return false;

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

/* finds the longest string from text and all of the routines' titles
 * then calculates how much space would be needed for that text, using
 * the paragraph style obj */
function longest_width(text, routines) {
  var longest_str = text;

  for (var routine_i = 0; routine_i < routines.length; routine_i++) {
    if (routines[routine_i].title.length > longest_str.length)
      longest_str = routines[routine_i].title;
  }

  var temp_box = pg.textFrames.add({ name : "TEMP" });
  temp_box.properties = {
    appliedObjectStyle : doc.objectStyles.itemByName("obj"),
    geometricBounds    : pg.bounds,
    contents           : longest_str
  }

  var temp_txt = temp_box.characters;
  var start = temp_txt[0].horizontalOffset;
  var end   = temp_txt[temp_txt.length - 1].horizontalOffset;
  
  temp_box.remove();

  return end - start + TXT_BOX_DIMENSIONS; // length + buffer
}

var highlight = true;
// add routine, starting from the top right corner
function add_routine(section, routine_title, bounds) {
  var x2 = bounds[3];
  var x1 = x2 - TXT_BOX_DIMENSIONS;

  // check box
  var check_title = section + " " + routine_title + " check";
  var check_box = (pg.textFrames.itemByName(check_title) == null)
    ? pg.textFrames.add({ name : check_title })
    : pg.textFrames.itemByName(check_title);
  check_box.properties = {
    itemLayer          : doc.layers.itemByName("routines"),
    appliedObjectStyle : doc.objectStyles.itemByName("base"),
    geometricBounds    : [ bounds[0], x1, bounds[2], x2 ]
  }
  if (highlight)
    check_box.fillColor = doc.colors.itemByName("melon_pink");

  x2 = x1 - ACCENT_WEIGHT; // accent btwn check box & routine title
  x1 = bounds[1]; // prepare for routine title box

  // routine title box
  var routine_search = section + " " + routine_title;
  var routine_box = (pg.textFrames.itemByName(routine_search) == null)
                       ? pg.textFrames.add({ name : routine_search })
                       : pg.textFrames.itemByName(routine_search);
  routine_box.properties = {
    itemLayer          : doc.layers.itemByName("routines"),
    appliedObjectStyle : doc.objectStyles.itemByName("obj"),
    geometricBounds    : [ bounds[0], x1, bounds[2], x2 ],
    contents           : routine_title
  }

  highlight = !highlight;
  // so that we can continue where we left off from top 2 bottom
  return bounds[2];
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
    new Routine("clean litterbox", routine_UNIT.WEEKLY, REF_DATE, 1,
                [ routine_DAY.THURSDAY ]),
    new Routine("take out trash", routine_UNIT.WEEKLY, REF_DATE, 1,
                [ routine_DAY.THURSDAY ]) ]
const NIGHT_ROUTINES =
  [ new Routine("take a shower", routine_UNIT.DAILY, REF_DATE, 2),
    new Routine("play with ascii", routine_UNIT.DAILY),
    new Routine("feed pets", routine_UNIT.DAILY),
    new Routine("brush teeth", routine_UNIT.DAILY),
    new Routine("wash face", routine_UNIT.DAILY),
    new Routine("take meds", routine_UNIT.DAILY) ];
const ALL_ROUTINES = [ MORNING_ROUTINES, DAY_ROUTINES, NIGHT_ROUTINES ];
const ALL_ROUTINES_TXT =
                  [ "morning routines", "day routines", "night routines" ];

// we don't know how large these elements will be until we have made all the
// routines
// y2 will depend on how many routines we have, & x1 will depend on the
// longest routine name in its specific section
// however, y1 & x2 are independent of the routines: y1 is under the top
// margin, x2 is to the left of the holes
// therefore, we will be moving right to left, top to bottom
const Y1 = pg.bounds[0] + MARGINAL_HEIGHT + OBJ_SPACING;
const X2 = pg.bounds[3] - (2 * HOLES_XMARGIN + HOLES_DIAMETER);

// bounds that move as we add inner elements
var y1 = Y1 + FRAME_WEIGHT;
var x2 = X2 - FRAME_WEIGHT;
var x1 = x2; // will be subtracting as we go
var y2 = y1; // will be adding as we go

// moving right to left, top to bottom
for (var section = 0; section < ALL_ROUTINES.length; section++) {
  var set_y1 = y1 - FRAME_WEIGHT;
  var routine_width =
    longest_width(ALL_ROUTINES_TXT[section], ALL_ROUTINES[section]);

  x1 = x2;
  y2 = y1;

  // HEADINGS

  // starting right to left, we have the day's initial

  // prepare for addition
  x1 -= TXT_BOX_DIMENSIONS;
  y2 += TXT_BOX_DIMENSIONS;

  var day_search = ALL_ROUTINES_TXT[section] + " day";
  var day_box = (pg.textFrames.itemByName(day_search) != null)
    ? pg.textFrames.itemByName(day_search)
    : pg.textFrames.add({ name : day_search });
  day_box.properties = {
    itemLayer          : doc.layers.itemByName("routines"),
    appliedObjectStyle : doc.objectStyles.itemByName("obj_head_center"),
    geometricBounds    : [ y1, x1, y2, x2 ],
    contents           : DAY_INITIAL
  }

  // staying on the same row, just moving to the left
  x2 = x1 - ACCENT_WEIGHT;

  // prepare for addition
  x1 = x2 - routine_width;

  var heading_box =
    (pg.textFrames.itemByName(ALL_ROUTINES_TXT[section]) != null)
      ? pg.textFrames.itemByName(ALL_ROUTINES_TXT[section])
      : pg.textFrames.add({ name : ALL_ROUTINES_TXT[section] });
  heading_box.properties = {
    itemLayer          : doc.layers.itemByName("routines"),
    appliedObjectStyle : doc.objectStyles.itemByName("obj_head_center"),
    geometricBounds    : [ y1, x1, y2, x2 ],
    contents           : ALL_ROUTINES_TXT[section]
  }

  // HORIZONTAL ACCENT

  x2  = X2 - FRAME_WEIGHT;
  y2 += ACCENT_WEIGHT / 2;

  var accent_search = ALL_ROUTINES_TXT[section]
                      + " horizontal accent";
  var accent_line = (pg.graphicLines.itemByName(accent_search) != null)
    ? pg.graphicLines.itemByName(accent_search)
    : pg.graphicLines.add({ name : accent_search });
  accent_line.properties = {
    itemLayer          : doc.layers.itemByName("frames"),
    appliedObjectStyle : doc.objectStyles.itemByName("accent_100"),
    geometricBounds    : [ y2, x1, y2, x2 ]
  }

  y1 = y2 + ACCENT_WEIGHT / 2;

  // ROUTINE ITEMS, starting from the top, moving right to left

  for (var routine_i = 0; routine_i < ALL_ROUTINES[section].length;
       routine_i++) {
    if (is_active(ALL_ROUTINES[section][routine_i], REF_DATE)) {
      y2 = y1 + TXT_BOX_DIMENSIONS; // prepare for addition

      y1 = add_routine(ALL_ROUTINES_TXT[section],
                       ALL_ROUTINES[section][routine_i].title,
                       [ y1, x1, y2, x2 ]);
    }
  }

  y2 = y1;

  // (REMAINING) ACCENTS

  y1 = set_y1 + FRAME_WEIGHT;
  x2 = X2 - (FRAME_WEIGHT + TXT_BOX_DIMENSIONS);

  accent_search = ALL_ROUTINES_TXT[section] + " vertical tinted accent";
  accent_line = (pg.graphicLines.itemByName(accent_search) != null)
    ? pg.graphicLines.itemByName(accent_search)
    : pg.graphicLines.add({ name : accent_search });
  accent_line.properties = {
    itemLayer          : doc.layers.itemByName("frames"),
    appliedObjectStyle : doc.objectStyles.itemByName("accent_25"),
    geometricBounds    : [ y1, x2 - ACCENT_WEIGHT / 2,
                           y2, x2 - ACCENT_WEIGHT / 2 ]
  }

  y1 += TXT_BOX_DIMENSIONS;

  accent_search = ALL_ROUTINES_TXT[section] + " vertical small accent";
  accent_line = (pg.graphicLines.itemByName(accent_search) != null)
    ? pg.graphicLines.itemByName(accent_search)
    : pg.graphicLines.add({ name : accent_search });
  accent_line.properties = {
    itemLayer          : doc.layers.itemByName("frames"),
    appliedObjectStyle : doc.objectStyles.itemByName("accent_100"),
    geometricBounds    : [ y1, x2 - ACCENT_WEIGHT / 2,
                           y2, x2 - ACCENT_WEIGHT / 2 ]
  }

  // FRAME

  y1 -= TXT_BOX_DIMENSIONS;

  var frame_search = ALL_ROUTINES_TXT[section] + " frame";
  var frame = (pg.rectangles.itemByName(frame_search) != null)
                 ? pg.rectangles.itemByName(frame_search)
                 : pg.rectangles.add({ name : frame_search });
  frame.properties = {
    itemLayer          : doc.layers.itemByName("frames"),
    appliedObjectStyle : doc.objectStyles.itemByName("outer_frame"),
    geometricBounds    : [ y1 - FRAME_WEIGHT / 2, x1 - FRAME_WEIGHT / 2,
                           y2 + FRAME_WEIGHT / 2, X2 - FRAME_WEIGHT / 2 ]
  }

  y1 = y2 + 2 * FRAME_WEIGHT + OBJ_SPACING;
  x2 = X2 - FRAME_WEIGHT;
}
