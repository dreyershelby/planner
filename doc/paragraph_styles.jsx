$.writeln("doc/paragraph_styles.jsx depends on\r",
          "- doc/colors.jsx");

font = app.fonts[647]; // San Francisco Text  Regular
var doc = app.activeDocument;

var to_clear = null;
var properties = null;

var body = ( doc.paragraphStyles.itemByName("body")
             || doc.paragraphStyles.add() );
body.properties = {
  name          : "body",
  appliedFont   : font,
  fillColor     : doc.colors.itemByName("smoky-black"),
  justification : Justification.LEFT_ALIGN,
  pointSize     : 9,
  tracking      : -30
};

var obj = ( doc.paragraphStyles.itemByName("obj")
            || doc.paragraphStyles.add() );
obj.properties = {
  name          : "obj",
  basedOn       : body,
  justification : Justification.CENTER_ALIGN,
  pointSize     : 8
};

var body-heading = ( doc.paragraphStyles.itemByName("body-heading")
                     || doc.paragraphStyles.add() );
body-heading.properties = {
  name      : "body-heading",
  basedOn   : body,
  fontStyle : "Semibold"
};

var obj-heading = ( doc.paragraphStyles.itemByName("obj-heading")
                    || doc.paragraphStyles.add() );
obj-heading.properties = {
  name      : "obj-heading",
  basedOn   : obj,
  fontStyle : "Semibold"
};

var marginals = ( doc.paragraphStyles.itemByName("marginals")
                  || doc.paragraphStyles.add() );
marginals.properties = {
  name      : "marginals",
  basedOn   : body,
  fillTint  : 15,
  pointSize : 8
};

var marginal-bind = ( doc.paragraphStyles.itemByName("marginal-bind")
                      || doc.paragraphStyles.add() );
marginal-bind.properties = {
  name          : "marginal-bind",
  basedOn       : marginals,
  justification : Justification.TO_BINDING_SIDE
};

var marginal-nobind = ( doc.paragraphStyles.itemByName("marginal-nobind")
                        || doc.paragraphStyles.add() );
marginal-nobind.properties = {
  name          : "marginal-nobind",
  basedOn       : marginals,
  justification : Justification.AWAY_FROM_BINDING_SIDE
};
