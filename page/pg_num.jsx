$.writeln("page/pg_num.jsx depends on\r",
          "- doc/object_styles.jsx");

var doc = app.activeDocument;
var pg = app.layoutWindows.item(0).activePage; // parameter

const txt_box_height = 1; // 1p0

// create the textbox for the page number at the very bottom of the page,
// taking up its width, with a height of txt_box_height
var pg_num_box = pg.textFrames.add({
  appliedObjectStyle : doc.objectStyles.itemByName("pg_num"),
  itemLayer          : doc.layers.itemByName("marginals"),
  geometricBounds    : [ pg.bounds[2] - txt_box_height, // y1
                         pg.bounds[1],                  // x1
                         pg.bounds[2],                  // y2
                         pg.bounds[3] ],                // x2
  contents           : SpecialCharacters.autoPageNumber
});
