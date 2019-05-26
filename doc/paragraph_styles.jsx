$.writeln("doc/paragraph_styles.jsx depends on\r",
          "- doc/colors.jsx");

font = app.fonts[647]; // San Francisco Text  Regular
var doc = app.activeDocument;

var style    = null;
var body     = null;
var to_clear = null;

if ((to_clear = doc.paragraphStyles.itemByName("body")) != null) {
  to_clear.remove();
}

body = doc.paragraphStyles.add({ name : "body" });
body.appliedFont   = font;
body.fillColor     = doc.colors.itemByName("smoky-black");
body.justification = Justification.LEFT_ALIGN;
body.pointSize     = 9;
body.tracking      = -30;

if ((to_clear = doc.paragraphStyles.itemByName("obj"))
    != null) { to_clear.remove(); }

style = doc.paragraphStyles.add({ name : "obj" });
style.basedOn       = body;
style.justification = Justification.CENTER_ALIGN;
style.pointSize     = 8;
base = style; // for obj-heading later on

if ((to_clear = doc.paragraphStyles.itemByName("body-heading"))
    != null) { to_clear.remove(); }

style = doc.paragraphStyles.add({ name : "body-heading" });
style.basedOn   = body;
style.fontStyle = "Semibold";

if ((to_clear = doc.paragraphStyles.itemByName("obj-heading"))
    != null) { to_clear.remove(); }

style = doc.paragraphStyles.add({ name : "obj-heading" });
style.basedOn       = base; // obj
style.fontStyle     = "Semibold";

if ((to_clear = doc.paragraphStyles.itemByName("marginals"))
    != null) { to_clear.remove(); }

style = doc.paragraphStyles.add({ name : "marginals" });
style.basedOn   = body;
style.fillTint  = 15;
style.pointSize = 8;

if ((to_clear = doc.paragraphStyles.itemByName("marginal-bind"))
    != null) { to_clear.remove(); }

base  = style;
style = doc.paragraphStyles.add({ name : "marginal-bind" });
style.basedOn = base; // marginals
style.justification = Justification.TO_BINDING_SIDE;

if ((to_clear = doc.paragraphStyles.itemByName("marginal-nobind"))
    != null) { to_clear.remove(); }

style = doc.paragraphStyles.add({ name : "marginal-nobind" });
style.basedOn = base; // marginals
style.justification = Justification.AWAY_FROM_BINDING_SIDE;
