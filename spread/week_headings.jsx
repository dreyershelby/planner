/* spread/week_headings.jsx
 * bea dreyer
 *
 * this script adds headings for a week review spread to each of the
 * spread's pages. in this case, this spread is the active/selected spread.
 * there are two headings for each page:
 * - in the corner next to the binding of the planner, "week #", where # is
 *   the week number according to the ISO-8601 standard 
 * - in the opposite corner, a date range from the sunday of the above week
 *   to its saturday is given in the format of
 *     <date_sun>-<date_sat> <month> <year>
 *   if the month that sunday is in is different from the month that
 *   saturday is in, then the format becomes
 *     <date_sun> <month_sun> - <date_sat> <month_sat> <year>
 * the spread in particular is the active/selected spread
 *
 * depends on:
 *   doc/layers.jsx
 *   doc/object_styles.jsx
 */

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

/* a way to translate the Date objects' number representation of months to
 * strings of my chosen format that state the month name
 * precondition: from_num is a number between or including 0-11
 */
function month(from_num) {
  const MONTHS = [ "jan", "feb", "mar", "apr", "may", "jun",
                   "jul", "aug", "sep", "oct", "nov", "dec" ];
  return MONTHS[from_num];
}

/* returns, as a string, a date range from the sunday of the above week
 * to its saturday is given in the format of
 *   <date_sun>-<date_sat> <month> <year>
 * if the month that sunday is in is different from the month that saturday
 * is in, then the format becomes
 *   <date_sun> <month_sun> - <date_sat> <month_sat> <year>
 */
function week_dates() {
  var sun = new Date();
  sun.setDate(sun.getDate() - sun.getDay());
  var sat = new Date(sun);
  sat.setDate(sat.getDate() + 6);

  var str = "";
  if (sun.getMonth() == sat.getMonth()) {
    str = sun.getDate() + "-" + sat.getDate()
        + " " + month(sun.getMonth()) + " " + sun.getFullYear();
  } else if (sun.getFullYear() == sat.getFullYear()) {
    str = sun.getDate() + " " + month(sun.getMonth()) + " - "
        + sat.getDate() + " " + month(sat.getMonth())
        + " " + sun.getFullYear();
  } else {
    str = sun.getDate() + " dec " + sun.getFullYear() + " - "
        + sat.getDate() + " jan " + sat.getFullYear();
  }

  return str;
}

/* this function adds the respective week headings to a page
 * week_num goes on the binding side, so on left pages it is in the right
 * corner & on right/single sided pages its on the left side
 * date_range goes on the nonbinding side, so on left pages it is in the
 * left corner & on right/single sided pages its in the right corner
 * preconditions:
 * - pg is a valid page object
 * - on_doc is a valid document object with
 *   - layers
 *     - marginals
 *   - object styles
 *     - week_num
 *     - date_range
 */
function add_to(pg, on_doc) {
  const txt_box_height = 1; // 1p0

  const week_str = "week " + week_num_in_year();
  var week_box = (pg.textFrames.itemByName("week_num") == null)
                    ? pg.textFrames.add()
                    : pg.textFrames.itemByName("week_num");
  week_box.properties = {
    name               : "week_num",
    itemLayer          : on_doc.layers.itemByName("marginals"),
    appliedObjectStyle : on_doc.objectStyles.itemByName("week_num"),
    contents           : week_str
  };

  const date_range_str = week_dates();
  var date_range_box = (pg.textFrames.itemByName("date_range") == null)
                          ? pg.textFrames.add()
                          : pg.textFrames.itemByName("date_range");
  date_range_box.properties = {
    name               : "date_range",
    itemLayer          : on_doc.layers.itemByName("marginals"),
    appliedObjectStyle : on_doc.objectStyles.itemByName("date_range"),
    contents           : date_range_str,
  };

  const left_box  = [ pg.bounds[0],                       // y1
                      pg.bounds[1],                       // x1
                      pg.bounds[0] + txt_box_height,      // y2
                     (pg.bounds[3] + pg.bounds[1]) / 2 ]; // x2
  const right_box = [ pg.bounds[0],                       // y1
                     (pg.bounds[3] + pg.bounds[1]) / 2,   // x1
                      pg.bounds[0] + txt_box_height,      // y2
                      pg.bounds[3] ];                     // x2
  if (pg.side == PageSideOptions.LEFT_HAND) {
    week_box.geometricBounds       = right_box;
    date_range_box.geometricBounds = left_box;
  } else {
    date_range_box.geometricBounds = right_box;
    week_box.geometricBounds       = left_box;
  }
}

var doc    = app.activeDocument;
var spread = app.layoutWindows.item(0).activeSpread;
var page   = null;

for (var pg_index = 0; pg_index < spread.pages.length; pg_index++) {
  page = spread.pages.item(pg_index);
  add_to(page, doc);
}
