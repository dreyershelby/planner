/* page/calendar.jsx
 * bea dreyer
 *
 * this script adds a calendar to the active/selected page for the month
 * given by the date variable ref. the week ref resides in is highlighted.
 *
 * depends on:
 *   doc/layers.jsx
 *   doc/colors.jsx
 *   doc/paragraph_styles.jsx
 *   doc/object_styles.jsx
 *   function in spread/week_headings.jsx
 *     month(from_num)
 */

/* this function calculates the number of partial/whole weeks spanned by the
 * time between the 1st of the month ref resides in & ref
 * for example, say ref's date is the 30th, & its month started on a
 * saturday. then, this       S  M  T  W  T  F  S   number of weeks returned
 * function would return 6,   -  -  -  -  -  -  1              1
 * even though 30/7 = 4 2/7,  2  3  4  5  6  7  8              2
 * because we're counting     9 10 11 12 13 14 15              3
 * the number of weeks       16 17 18 19 20 21 22              4
 * "touched" by this span of 23 24 25 26 27 28 29              5
 * dates.                    30 31  -  -  -  -  -              6
 *
 * precondition: ref is a valid Date object
 */
function week_span_in_month(ref) {
  // if no argument was given, our reference date is today
  if (ref == null) ref = new Date();

  // week 1 WILL contain the 1st of the given month of the given year
  var week_1 = new Date(ref.getFullYear(), ref.getMonth(), 1);
  // get the sunday of that week
  week_1.setDate(week_1.getDate() - week_1.getDay());

  // will give the number of whole weeks, plus some days/hours/etc, between
  // the sunday of week 1 and today, so return with added 1 to get the
  // 1-based week count
  const ELAPSED_TIME = ref - week_1;
                                    /* millisec -> weeks */
  return Math.floor(ELAPSED_TIME / (1000 * 60 * 60 * 24 * 7)) + 1;
} /* 1-based counting */

/* a way to translate the Date objects' number representation of months to
 * strings of my chosen format that state the month name
 * precondition: from_num is a number between or including 0-11
 */
function month(from_num) {
  const MONTHS = [ "january",   "february", "march",    "april",
                   "may",       "june",     "july",     "august",
                   "september", "october",  "november", "december" ];
  return MONTHS[from_num];
}

/* a way to translate the Date objects' number representation of days to
 * strings of my chosen format that state the day initial
 * precondition: from_num is a number between or including 0-6
 */
function day(from_num) {
  const DAYS = [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ];
  return DAYS[from_num];
}

/* deletes the text frame and all next frames linked to it
 * precondition: frame is a valid text frame */
function rm_linked_txt(frame) {
  if (frame.nextTextFrame != null) rm_linked_txt(frame.nextTextFrame);
  frame.remove();
}

var doc = app.activeDocument;
var pg = app.layoutWindows[0].activePage; // parameter

const TODAY = new Date();
const REF /* for the week we'll highlight */ = TODAY;

var first_date = new Date(REF.getFullYear(), REF.getMonth(), 1);
// the last day of the month could be any date from the 28th - 31st,
// so calculate it by getting the 1st of the NEXT month, and subtracting 1
var last_date = new Date(REF.getFullYear(), REF.getMonth() + 1, 1);
last_date.setDate(last_date.getDate() - 1);

// we'll be highlighting this week on the calendar later
const THIS_WEEK = week_span_in_month(REF);
const NUM_WEEKS = week_span_in_month(last_date);

const TXT_BOX_DIMENSIONS = 1; // 1p0
const STROKE_WEIGHT_UNIT = 0.5 / 6; // 0p0.5, there are 6 points in a pica
const FRAME_WEIGHT = STROKE_WEIGHT_UNIT *
  doc.objectStyles.itemByName("outer_frame").strokeWeight;

// there is a header right above this calendar that we want to lock the
// calendar to
// since TXT_BOX_DIMENSIONS is a frequently used ""global"" in this project,
// im not going to get the actual header object & will instead use this
// global
// probably bad programming practice but also adobe sucks and their
// libraries do not work as i would like so im using this as a (senseless)
// excuse
const MARGINAL_HEIGHT = TXT_BOX_DIMENSIONS;
// another global i like for spacing between different objects
const OBJ_SPACING     = 0.5 * TXT_BOX_DIMENSIONS;

// bounds of the calendar, not including the frame
// top of calendar gives a little visual space between the above header
// (which is right up against the top of the page) n it
const CALENDAR_Y1 = pg.bounds[0] + MARGINAL_HEIGHT + OBJ_SPACING
                  + FRAME_WEIGHT;
const CALENDAR_Y2 = CALENDAR_Y1 + (2 + NUM_WEEKS) * TXT_BOX_DIMENSIONS;
// calendar is right up against the right side of the page, so the left
// bound is 7 text boxes (for each day in a week) away from that
const CALENDAR_X2 = pg.bounds[3] - FRAME_WEIGHT;
const CALENDAR_X1 = CALENDAR_X2 - 7 * TXT_BOX_DIMENSIONS;

// heading text box stating the month

// bounds
var y1 = CALENDAR_Y1;
var y2 = y1 + TXT_BOX_DIMENSIONS;
var x1 = CALENDAR_X1;
var x2 = CALENDAR_X2; // spans the entire width of the calendar

// if this heading box doesn't exist, add it
var calendar_month = (pg.textFrames.itemByName("calendar_month") == null) 
  ? pg.textFrames.add({ name : "calendar_month" })
  : pg.textFrames.itemByName("calendar_month");
// update the box's properties
calendar_month.properties = {
  itemLayer          : doc.layers.itemByName("calendar"),
  appliedObjectStyle : doc.objectStyles.itemByName("obj_head_bottom"),
  geometricBounds    : [ y1, x1, y2, x2 ],
  contents           : month(REF.getMonth())
}

// *typewriter newline noise*
y1  = y2;
y2 += TXT_BOX_DIMENSIONS;
// x1 = CALENDAR_X1; // already true

// 7 heading text boxes, each containing an initial for a day of the week

x2 = x1 + TXT_BOX_DIMENSIONS;

var day_box  = null;
var day_name = null;
for (var day_num = 0; day_num < 7; day_num++) {
  day_name = day(day_num) + " (" + day_num + ")";

  day_box = (pg.textFrames.itemByName(day_name) == null)
      ? pg.textFrames.add({ name : day_name })
      : pg.textFrames.itemByName(day_name);
  day_box.properties = {
    itemLayer          : doc.layers.itemByName("calendar"),
    appliedObjectStyle : doc.objectStyles.itemByName("obj_head_top"),
    geometricBounds    : [y1, x1, y2, x2],
    contents           : day(day_num)
  };

  x1  = x2;
  x2 += TXT_BOX_DIMENSIONS;
}

y1  = y2;
y2 += TXT_BOX_DIMENSIONS;

// accent under headings
var accent = (pg.graphicLines.itemByName("calendar_accent") == null)
                ? pg.graphicLines.add({ name : "calendar_accent"})
                : pg.graphicLines.itemByName("calendar_accent");
accent.properties = {
  itemLayer          : doc.layers.itemByName("frames"),
  appliedObjectStyle : doc.objectStyles.itemByName("accent_100"),
  geometricBounds    : [y1, CALENDAR_X1, y1, CALENDAR_X2]
}

// the dates of the month
// each text box (for a space in the weeks shown by the calendar) is linked
// to the one previous n the one next in chrono order so that the actual
// text can just be entered into the first box

var date_box = null;
var prev_box = null; // for linking the date text boxes together

// determines the content of each box
// offset to make sure the 1st of the month is on the right day
var date_num  = 1 - first_date.getDay();
for (var week = 1; week <= NUM_WEEKS; week++) { // 1-based counting to match
  x1 = CALENDAR_X1;                             // how we calculated week
  x2 = x1 + TXT_BOX_DIMENSIONS;                 // span

  for (var day = 0; day < 7; day++) { // 0-based counting to match Date()
    // the approach: if we havent started updating/creating date text boxes
    // shown by date_box == null, then we need to pick/add the 1st text box
    // so that we can go through its next links to create the complete
    // list of date boxes
    if (date_box == null) {
      date_box = (pg.textFrames.itemByName("date") == null)
        ? pg.textFrames.add({ name : "date" })
        : pg.textFrames.itemByName("date").startTextFrame;
    // else we already have a box that we're following the links on & we
    // just need to create new boxes if we don't have a next one
    } else {
      date_box = (date_box.nextTextFrame == null)
        ? pg.textFrames.add({ name : "date" })
        : date_box.nextTextFrame;
    }

    date_box.properties = {
      itemLayer          : doc.layers.itemByName("calendar"),
      appliedObjectStyle : doc.objectStyles.itemByName("obj"),
      geometricBounds    : [ y1, x1, y2, x2 ],
    };
    // highlight whichever week ref resides in
    if (week == THIS_WEEK)
      date_box.fillColor = doc.colors.itemByName("melon_pink");
    // put in the date if valid, else put just the new line
    if (date_num < 1 || date_num > last_date.getDate())
      date_box.contents = "\n";
    else date_box.contents = "" + date_num + "\n";

    date_num++;

    x1  = x2;
    x2 += TXT_BOX_DIMENSIONS;

    // add the date box to the linked list of them n move on
    if (prev_box != null && prev_box.nextTextFrame == null)
      prev_box.nextTextFrame = date_box;
    prev_box = date_box;
  }

  y1  = y2;
  y2 += TXT_BOX_DIMENSIONS;
}

// clean up extra date boxes if we have too many for how many weeks we're
// showing on the calendar
if (date_box.nextTextFrame != null) rm_linked_txt(date_box.nextTextFrame);

// outer frame
var frame = (pg.rectangles.itemByName("calendar_frame") == null)
               ? pg.rectangles.add({ name : "calendar_frame" })
               : pg.rectangles.itemByName("calendar_frame");
frame.properties = {
  itemLayer          : doc.layers.itemByName("frames"),
  appliedObjectStyle : doc.objectStyles.itemByName("outer_frame"),
  geometricBounds    : [ CALENDAR_Y1 - FRAME_WEIGHT / 2,  // divide by 2 bc
                         CALENDAR_X1 - FRAME_WEIGHT / 2,  // indesign puts a
                         CALENDAR_Y2 + FRAME_WEIGHT / 2,  // line's coordin-
                         CALENDAR_X2 + FRAME_WEIGHT / 2 ] // -ates at the
}                                                    // center of its stroke
