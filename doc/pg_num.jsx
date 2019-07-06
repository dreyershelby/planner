/* doc/pg_num.jsx
 * bea dreyer
 *
 * this script adds page numbers (just the number) to every page in the
 * document. in this case, this document is the active/selected document.
 *
 * depends on:
 *   function in page/pg_num.jsx
 *     add_to(pg, on_doc)
 *   function in spread/pg_num.jsx
 *     add_to_spread(spread, on_doc)
 *   doc/object_styles.jsx
 */

function add_to(pg, on_doc) {
  // calculating constants
  const TXT_BOX_HEIGHT = 1; // 1p0, this is kinda just everywhere

  // create the textbox for the page number at the very bottom of the page,
  // taking up its width, with a height of TXT_BOX_HEIGHT
  var txtbox = (pg.textFrames.itemByName("pg_num") != null)
    ? pg.textFrames.itemByName("pg_num")
    : pg.textFrames.add({ name : "pg_num" });
  txtbox.properties = {
    appliedObjectStyle :
      doc.objectStyles.itemByName("bottom_nobind_margin"),
    itemLayer          : on_doc.layers.itemByName("marginals"),
    geometricBounds // : [ y1, x1, y2, x2 ]
                    // : [ TXT_BOX_HEIGHT above the bottom of the page,
                       : [ pg.bounds[2] - TXT_BOX_HEIGHT,
                    // :   left side of page
                           pg.bounds[1],                  // x1
                    // :   bottom of page
                           pg.bounds[2],                  // y2
                    // :   right side of page
                    //     so this takes up the entire width of the page
                           pg.bounds[3] ],                // x2
    contents           : SpecialCharacters.autoPageNumber
  }
}

function add_to_spread(spread, on_doc) {
  // for all of the pages of the spread
  for (var pg_index = 0; pg_index < spread.pages.length; pg_index++)
    add_to(spread.pages.item(pg_index), on_doc);
}

// parameters
var doc = app.activeDocument; // needed to access doc customizations
var spread = null;

// for all of the spread in the document
for (var spread_index = 0; spread_index < doc.spreads.length;
     spread_index++)
  add_to_spread(doc.spreads.item(spread_index), doc);
