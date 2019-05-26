var doc = app.activeDocument;

if (doc.layers.itemByName("holes") == null)
  doc.layers.add({ name : "holes" });

if (doc.layers.itemByName("marginals") == null)
  doc.layers.add({ name : "marginals" });

if (doc.layers.itemByName("calendar") == null)
  doc.layers.add({ name : "calendar" });
