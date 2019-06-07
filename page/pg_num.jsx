/* page/pg_num.jsx
 * bea dreyer
 *
 * this script add a page number (just the number) to a page.
 * in this case, this page is the active/selected page.
 *
 * depends on:
 *   doc/object_styles.jsx
 */

function add_to(pg, on_doc) {
  // calculating constants
  const TXT_BOX_HEIGHT = 1; // 1p0, this is kinda just everywhere

  // create the textbox for the page number at the very bottom of the page,
  // taking up its width, with a height of TXT_BOX_HEIGHT
  var txtbox = (pg.textFrames.itemByName("pg_num") == null)
    ? pg.textFrames.add({ name : "pg_num" })
    : pg.textFrames.itemByName("pg_num");
  txtbox.properties = {
    appliedObjectStyle : doc.objectStyles.itemByName("pg_num"),
    itemLayer          : doc.layers.itemByName("marginals"),
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

// parameters
var doc = app.activeDocument; // needed to access doc customizations
var pg  = app.layoutWindows.item(0).activePage;

add_to(pg, doc);
