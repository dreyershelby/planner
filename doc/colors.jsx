/* doc/colors.jsx
 * bea dreyer
 *
 * this script creates a color scheme to be used in Adobe Indesign CS5.5
 * current color scheme:
 *   romance white
 *   melon pink
 *   sunglo pink
 *   solid pink
 *   toledo purple
 *   smoky black
 */

var doc = app.activeDocument;

// if the color doesn't exist, add it
var romance_white = (doc.colors.itemByName("romance_white") == null)
  ? doc.colors.add({ name : "romance_white" })
  : doc.colors.itemByName("romance_white");
// update the color's properties
romance_white.properties = {
  colorValue : [0, 0, 0, 0],
}

var melon_pink = (doc.colors.itemByName("melon_pink") == null)
  ? doc.colors.add({ name : "melon_pink" })
  : doc.colors.itemByName("melon_pink");
melon_pink.properties = {
  colorValue : [0, 35, 15, 0],
}

var sunglo_pink = (doc.colors.itemByName("sunglo_pink") == null)
  ? doc.colors.add({ name : "sunglo_pink" })
  : doc.colors.itemByName("sunglo_pink");
sunglo_pink.properties = {
  colorValue : [15, 70, 57, 4],
}

var solid_pink = (doc.colors.itemByName("solid_pink") == null)
  ? doc.colors.add({ name : "solid_pink" })
  : doc.colors.itemByName("solid_pink");
solid_pink.properties = {
  colorValue : [31, 64, 55, 38],
}

var toledo_purple = (doc.colors.itemByName("toledo_purple") == null)
  ? doc.colors.add({ name : "toledo_purple" })
  : doc.colors.itemByName("toledo_purple");
toledo_purple.properties = {
  colorValue : [53, 63, 42, 68],
}

var smoky_black = (doc.colors.itemByName("smoky_black") == null)
  ? doc.colors.add({ name : "smoky_black" })
  : doc.colors.itemByName("smoky_black");
smoky_black.properties = {
  colorValue : [53, 63, 42, 68],
}
