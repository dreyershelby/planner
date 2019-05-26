var doc = app.activeDocument;

var to_clear = null;

if ((to_clear = doc.colors.itemByName("romance-white")) != null) {
  to_clear.remove();
}
if ((to_clear = doc.colors.itemByName("melon-pink"))    != null) {
  to_clear.remove();
}
if ((to_clear = doc.colors.itemByName("sunglo-pink"))   != null) {
  to_clear.remove();
}
if ((to_clear = doc.colors.itemByName("solid-pink"))    != null) {
  to_clear.remove();
}
if ((to_clear = doc.colors.itemByName("toledo-purple")) != null) {
  to_clear.remove();
}
if ((to_clear = doc.colors.itemByName("smoky-black"))   != null) {
  to_clear.remove();
}

doc.colors.add({
  colorValue : [0, 0, 0, 0],
  name       : "romance-white"
});

doc.colors.add({
  colorValue : [0, 35, 15, 0],
  name       : "melon-pink"
});

doc.colors.add({
  colorValue : [15, 70, 57, 4],
  name       : "sunglo-pink"
});

doc.colors.add({
  colorValue : [31, 64, 55, 38],
  name       : "solid-pink"
});

doc.colors.add({
  colorValue : [53, 63, 42, 68],
  name       : "toledo-purple"
});

doc.colors.add({
  colorValue : [53, 63, 42, 80],
  name       : "smoky-black"
});
