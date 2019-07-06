/* page/day_headings.jsx
 * bea dreyer
 *
 * this script adds headings for a day to a page. in this case, this page is
 * the active/selected page
 * there are two headings for each page:
 * - in the corner next to the binding of the planner, "week #", where # is
 *   the week number according to the ISO-8601 standard 
 * - in the opposite corner, the date is given in the format of
 *     <day>, <date> <month> <year>
 *
 * depends on:
 *   doc/layers.jsx
 *   doc/object_styles.jsx
 */

var doc = app.activeDocument;
var pg  = app.layoutWindows[0].activePage;

const TXT_BOX_DIMENSIONS = 1; // 1p0
const DATE_REF = new Date();

/* this function calculates the number of weeks between the 1st of the year
 * in which ref resides and the Date ref.
 * precondition: ref is a valid Date object
 */
function week_num_in_year(ref) {
  // if no argument was given, our reference date is today
  if (ref == null) ref = new Date();
  // week 1 may contain jan 1 of this current year
  var week_1 = new Date(ref.getFullYear(), 0);

  // if jan 1 is or is between sunday-thursday, then we'll subtract however
  // many days are between jan 1 and the sunday of its containing week
  // else, jan 1 is friday or saturday, and week 1 starts the upcoming
  // sunday, and so we add the number of days that are between friday (2)/
  // saturday (1) and sunday to get the sunday of week 1
  var week_1_date = (week_1.getDay() < 5) ?    (-week_1.getDay())
                                          : (7 - week_1.getDay());
  week_1.setDate(week_1.getDate() + week_1_date);

  // will give the number of whole weeks, plus some days/hours/etc, between
  // the sunday of week 1 and today, so return with added 1 to get the
  // 1-based week count
  var ELAPSED_TIME = ref - week_1;
                                    /* millisec -> weeks */
  return Math.floor(ELAPSED_TIME / (1000 * 60 * 60 * 24 * 7)) + 1;
} /* 1-based counting */

/* a way to translate the Date objects' number representation of days to
 * strings of my chosen format that state the day initial
 * precondition: from_num is a number between or including 0-6
 */
function day(from_num) {
  const DAYS = [ "sun", "mon", "tue", "wed", "thu", "fri", "sat" ];
  return DAYS[from_num];
}

/* a way to translate the Date objects' number representation of months to
 * strings of my chosen format that state the month name
 * precondition: from_num is a number between or including 0-11
 */
function month(from_num) {
  const MONTHS = [ "jan", "feb", "mar", "apr", "may", "jun",
                   "jul", "aug", "sep", "oct", "nov", "dec" ];
  return MONTHS[from_num];
}

/* returns, as a string, the date in the format of
 *   <day>, <date> <month> <year>
 */
function date_string(date) {
  var str = day(date.getDay()) + ", " + date.getDate() + " " +
            month(date.getMonth()) + " " + date.getFullYear();
  return str;
}

var week_str = "week " + week_num_in_year();
var week_box = (pg.textFrames.itemByName("week_num") == null)
                  ? pg.textFrames.add()
                  : pg.textFrames.itemByName("week_num");
week_box.properties = {
  name               : "week_num",
  itemLayer          : doc.layers.itemByName("marginals"),
  appliedObjectStyle : doc.objectStyles.itemByName("top_bind_margin"),
  contents           : week_str
};

var date_str = date_string(DATE_REF);
var date_box = (pg.textFrames.itemByName("date") == null)
                  ? pg.textFrames.add({ name : "date" })
                  : pg.textFrames.itemByName("date");
date_box.properties = {
  itemLayer          : doc.layers.itemByName("marginals"),
  appliedObjectStyle : doc.objectStyles.itemByName("top_nobind_margin"),
  contents           : date_str
};

const left_box  = [ pg.bounds[0],                       // y1
                    pg.bounds[1],                       // x1
                    pg.bounds[0] + TXT_BOX_DIMENSIONS,  // y2
                   (pg.bounds[3] + pg.bounds[1]) / 2 ]; // x2
const right_box = [ pg.bounds[0],                       // y1
                   (pg.bounds[3] + pg.bounds[1]) / 2,   // x1
                    pg.bounds[0] + TXT_BOX_DIMENSIONS,  // y2
                    pg.bounds[3] ];                     // x2
if (pg.side == PageSideOptions.LEFT_HAND) {
  week_box.geometricBounds = right_box;
  date_box.geometricBounds = left_box;
} else {
  date_box.geometricBounds = right_box;
  week_box.geometricBounds = left_box;
}
