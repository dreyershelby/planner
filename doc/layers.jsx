/* doc/layers.jsx
 * bea dreyer
 *
 * this script creates layers necessary for organization of elements in
 * this planner, created in Adobe Indesign CS5.5
 * current layers, from front to back:
 *   frames
 *   side_notes
 *     items on this layer are mostly created by hand
 *   calendar
 *   routines
 *   body
 *   marginals (headers/footers)
 *   holes
 */

var doc = app.activeDocument;

// if the layer doesn't exist, add it
// in order of bottom layer to top
if (doc.layers.itemByName("holes") == null)
  doc.layers.add({ name : "holes" });

if (doc.layers.itemByName("marginals") == null)
  doc.layers.add({ name : "marginals" });

if (doc.layers.itemByName("body") == null)
  doc.layers.add({ name : "body" });

if (doc.layers.itemByName("routines") == null)
  doc.layers.add({ name : "routines" });

if (doc.layers.itemByName("calendar") == null)
  doc.layers.add({ name : "calendar" });

if (doc.layers.itemByName("side_notes") == null)
  doc.layers.add({ name : "side_notes" });

if (doc.layers.itemByName("frames") == null)
  doc.layers.add({ name : "frames" });
