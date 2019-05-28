$.writeln("spread/week_headings.jsx depends on\r",
            "- doc/layers.jsx\r",
            "- doc/object_styles.jsx\r");

function week_num_in_year(ref) {
  if (ref == null) ref = new Date();
  var week_1 = new Date(ref.getFullYear(), 0);
  var week_1_date = (week_1.getDay() < 5) ?    (-week_1.getDay())
                                          : (7 - week_1.getDay());
  week_1.setDate(week_1.getDate() + week_1_date);
  const elapsed_time = ref - week_1;
                                   /* millisec -> weeks */
  return Math.ceil(elapsed_time / (1000 * 60 * 60 * 24 * 7));
} /* 1-based counting */

function month(from_num) {
  const months = [ "jan", "feb", "mar", "apr", "may", "jun",
                   "jul", "aug", "sep", "oct", "nov", "dec" ];
  return months[from_num];
}

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

function add_to(pg, on_doc) {
  const txt_box_height = 1; // 1p0

  const week_str = "week " + week_num_in_year();
  var week_box = pg.textFrames.add({
    itemLayer          : on_doc.layers.itemByName("marginals"),
    appliedObjectStyle : on_doc.objectStyles.itemByName("week_num"),
    contents           : week_str
  })

  const date_range_str = week_dates();
  var date_range_box = pg.textFrames.add({
    itemLayer          : on_doc.layers.itemByName("marginals"),
    appliedObjectStyle : on_doc.objectStyles.itemByName("date_range"),
    contents           : date_range_str,
  })

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
