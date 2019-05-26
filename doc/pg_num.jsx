$.writeln("doc/pg_num.jsx depends on\r",
          "- doc/paragraph_styles.jsx\r",
          "- spread/pg_num.jsx\r",
          "- page/pg_num.jsx");

function add_to_page(pg) {
  var doc = app.activeDocument;

  const txt_box_height = 1; // 1p0

  // create the textbox for the page number at the very bottom of the page,
  // taking up its width, with a height of txt_box_height
  var pg_num_box = pg.textFrames.add({
    appliedObjectStyle : doc.objectStyles.itemByName("pg-num"),
    itemLayer          : doc.layers.itemByName("marginals"),
    geometricBounds    : [ pg.bounds[2] - txt_box_height, // y1
                           pg.bounds[1],                  // x1
                           pg.bounds[2],                  // y2
                           pg.bounds[3] ],                // x2
    contents           : SpecialCharacters.autoPageNumber
  });
}

function add_to_spread(spread) {
  var page = null;

  for (var pg_index = 0; pg_index < spread.pages.length; pg_index++) {
    page = spread.pages.item(pg_index);

    if (page.textFrames.itemByName("pg-num-box") == null) add_to_page(page);
  }
}

var doc = app.activeDocument;
var spread = null;

for (var spread_index = 0; spread_index < doc.spreads.length;
     spread_index++) {
  spread = doc.spreads.item(spread_index);
  add_to_spread(spread);
}
