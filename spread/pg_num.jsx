$.writeln("spread/pg_num.jsx depends on\r",
          "- doc/paragraph_styles.jsx\r",
          "- page/pg_num.jsx");

function add_to(pg) {
  var doc = app.activeDocument;

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
}

var spread = app.layoutWindows.item(0).activeSpread; // parameter
var page = null;

for (var pg_index = 0; pg_index < spread.pages.length; pg_index++) {
  page = spread.pages.item(pg_index);

  if (page.textFrames.itemByName("pg_num_box") == null) add_to(page);
}
