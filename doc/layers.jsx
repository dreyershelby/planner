/* doc/layers.jsx
 * bea dreyer
 *
 * this script creates layers necessary for organization of elements in
 * this planner, created in Adobe Indesign CS5.5
 * current layers:
 *   holes
 *   marginals (headers/footers)
 *   calendar
 */

var doc = app.activeDocument;

// if the layer doesn't exist, add it
if (doc.layers.itemByName("holes") == null)
  doc.layers.add({ name : "holes" });

if (doc.layers.itemByName("marginals") == null)
  doc.layers.add({ name : "marginals" });

if (doc.layers.itemByName("calendar") == null)
  doc.layers.add({ name : "calendar" });
