$.writeln("page/calendar.jsx depends on\r",
            "- doc/colors.jsx\r",
            "- doc/layers.jsx\r",
            "- doc/object_styles.jsx\r",
            "- doc/paragraph_styles.jsx\r",
            "- spread/week_headings.jsx's function week_num_in_year(ref)\r",
            "- spread/week_headings.jsx's function month(from_num)");

function week_num_in_year(ref) {
  if (ref == null) ref = new Date();
  var week_1 = new Date(ref.getFullYear(), 0);
  var week_1_day_0_adj = (week_1.getDay() < 5) ? (-week_1.getDay())
                                               : (7 - week_1.getDay());
  week_1.setDate(week_1.getDate() + week_1_day_0_adj);
  const elapsed_time = ref - week_1;
                                    /* millisec -> weeks */
  return Math.floor(elapsed_time / (1000 * 60 * 60 * 24 * 7));
} /* 0-based counting */

function week_num_in_month(ref) {
  if (ref == null) ref = new Date();
  var week_1 = new Date(ref.getFullYear(), ref.getMonth(), 1);
  var week_1_day_0_adj = (week_1.getDay() < 5) ? (-week_1.getDay())
                                               : (7 - week_1.getDay());
  week_1.setDate(week_1.getDate() + week_1_day_0_adj);
  const elapsed_time = ref - week_1;
                                    /* millisec -> weeks */
  return Math.floor(elapsed_time / (1000 * 60 * 60 * 24 * 7));
} /* 0-based counting */

function month(from_num) {
  const months = [ "january",   "february", "march",    "april",
                   "may",       "june",     "july",     "august",
                   "september", "october",  "november", "december" ];
  return months[from_num];
}

var doc = app.activeDocument;
var pg = app.layoutWindows[0].activePage; // parameter

const today = new Date();
const ref /* for this week */ = today;

var last_date = new Date(ref.getFullYear(), ref.getMonth() + 1, 1);
last_date.setDate(last_date.getDate() - 1);

const this_week = week_num_in_month();
const num_weeks = week_num_in_month(last_date) + 1; // + 1 to offset 0-based
                                                    // counting
const txt_box_dimensions     = 1; // 1p0
const marginal_height        = txt_box_dimensions;
const spacing_up_to_marginal = 0.5 * txt_box_dimensions;

const calendar_y1 = pg.bounds[0] + marginal_height + spacing_up_to_marginal;
const calendar_x1 = pg.bounds[3] - 7 * txt_box_dimensions;
const calendar_y2 = calendar_y1 + (2 + num_weeks) * txt_box_dimensions;
const calendar_x2 = pg.bounds[3];

if (/* TODO calendar doesn't exist */ true) {
  var y1 = calendar_y1;
  var y2 = y1 + txt_box_dimensions;
  var x1 = calendar_x1;
  var x2 = calendar_x2;

  var heading_box = pg.textFrames.add({
    itemLayer          : doc.layers.itemByName("calendar"),
    appliedObjectStyle : doc.objectStyles.itemByName("calendar_heading"),
    geometricBounds    : [ y1, x1, y2, x2 ],
    contents           : month(ref.getMonth())
  });

  y1 += txt_box_dimensions;
  y2 += txt_box_dimensions;

  // x1 = calendar_x1; // already true
  x2 = x1 + txt_box_dimensions;

  const days = [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ];
  var day_box = null;
  for (var day = 0; day < 7; day++) {
    day_box = pg.textFrames.add({
      itemLayer          : doc.layers.itemByName("calendar"),
      appliedObjectStyle : doc.objectStyles.itemByName("calendar_heading"),
      geometricBounds    : [y1, x1, y2, x2],
      contents           : days[day]
    });

    x1 += txt_box_dimensions;
    x2 += txt_box_dimensions;
  }

  y1 += txt_box_dimensions;
  y2 += txt_box_dimensions;

  var date_box = null;
  var prev_box = null;
  for (var week = 0; week < num_weeks; week++) {
    x1 = calendar_x1;
    x2 = x1 + txt_box_dimensions;

    for (var day = 0; day < 7; day++) {
      // if we haven't created the first txt box in our series of linked
      // txt boxes, create it
      date_box = pg.textFrames.add({
        itemLayer          : doc.layers.itemByName("calendar"),
        appliedObjectStyle : doc.objectStyles.itemByName("calendar"),
        geometricBounds    : [y1, x1, y2, x2],
        name               : "date"
      });
      if (week == this_week)
        date_box.fillColor = doc.colors.itemByName("melon_pink");

      x1 += txt_box_dimensions;
      x2 += txt_box_dimensions;

      if (prev_box != null) prev_box.nextTextFrame = date_box;
      prev_box = date_box;
    }

    y1 += txt_box_dimensions;
    y2 += txt_box_dimensions;
  }
}

var dates_txt = "";
var week_1 = new Date(ref.getFullYear(), ref.getMonth(), 1);
var week_1_day_0_adj = (week_1.getDay() < 5) ? (-week_1.getDay())
                                             : (7 - week_1.getDay());
for (var count = 0; count < -week_1_day_0_adj; count++)
  dates_txt += '\n';
for (var date = 1; date < last_date.getDate(); date++)
  dates_txt += date + '\n';
$.writeln("num of \\n: ",week_1_day_0_adj,"dates: ",dates_txt);
date_box.startTextFrame.contents = dates_txt;
