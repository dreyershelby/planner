var doc = app.activeDocument;

var to_clear = null;

if ((to_clear = doc.colors.itemByName("romance_white")) != null) {
  to_clear.remove();
}
if ((to_clear = doc.colors.itemByName("melon_pink"))    != null) {
  to_clear.remove();
}
if ((to_clear = doc.colors.itemByName("sunglo_pink"))   != null) {
  to_clear.remove();
}
if ((to_clear = doc.colors.itemByName("solid_pink"))    != null) {
  to_clear.remove();
}
if ((to_clear = doc.colors.itemByName("toledo_purple")) != null) {
  to_clear.remove();
}
if ((to_clear = doc.colors.itemByName("smoky_black"))   != null) {
  to_clear.remove();
}

doc.colors.add({
  colorValue : [0, 0, 0, 0],
  name       : "romance_white"
});

doc.colors.add({
  colorValue : [0, 35, 15, 0],
  name       : "melon_pink"
});

doc.colors.add({
  colorValue : [15, 70, 57, 4],
  name       : "sunglo_pink"
});

doc.colors.add({
  colorValue : [31, 64, 55, 38],
  name       : "solid_pink"
});

doc.colors.add({
  colorValue : [53, 63, 42, 68],
  name       : "toledo_purple"
});

doc.colors.add({
  colorValue : [53, 63, 42, 80],
  name       : "smoky_black"
});
