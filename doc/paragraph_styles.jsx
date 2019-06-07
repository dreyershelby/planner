/* doc/paragraph_styles.jsx
 * bea dreyer
 *
 * this script creates paragraph styles to be used to create this planner in
 * Adobe Indesign CS5.5
 * so far, in this file, they can control:
 *   font & all its styles & shapes
 *   text color & tint
 *   horizontal justification
 * available paragraph styles:
 *   body
 *   obj (-ect body)
 *   body-heading
 *   obj-heading
 *   marginals
 *   marginal-bind (text justification is towards the binding edge)
 *   marginal-nobind
 *
 * depends on:
 *   doc/colors.jsx
 */

font = app.fonts[647]; // San Francisco Text  Regular

var doc = app.activeDocument;

// if the paragraph style doesn't exist, add it
var body = (doc.paragraphStyles.itemByName("body") != null)
              ? doc.paragraphStyles.itemByName("body")
              : doc.paragraphStyles.add();
// update the paragraph style's properties
body.properties = {
  name          : "body",
  appliedFont   : font,
  fillColor     : doc.colors.itemByName("smoky_black"),
  justification : Justification.LEFT_ALIGN,
  pointSize     : 9,
  tracking      : -30
};

var obj = (doc.paragraphStyles.itemByName("obj") != null)
             ? doc.paragraphStyles.itemByName("obj")
             : doc.paragraphStyles.add();
obj.properties = {
  name          : "obj",
  basedOn       : body,
  justification : Justification.CENTER_ALIGN,
  pointSize     : 8
};

var body_heading = (doc.paragraphStyles.itemByName("body_heading") != null)
                      ? doc.paragraphStyles.itemByName("body_heading")
                      : doc.paragraphStyles.add();
body_heading.properties = {
  name      : "body_heading",
  basedOn   : body,
  fontStyle : "Semibold"
};

var obj_heading = (doc.paragraphStyles.itemByName("obj_heading") != null)
                     ? doc.paragraphStyles.itemByName("obj_heading")
                     : doc.paragraphStyles.add();
obj_heading.properties = {
  name      : "obj_heading",
  basedOn   : obj,
  fontStyle : "Semibold"
};

var marginals = (doc.paragraphStyles.itemByName("marginals") != null)
                   ? doc.paragraphStyles.itemByName("marginals")
                   : doc.paragraphStyles.add();
marginals.properties = {
  name      : "marginals",
  basedOn   : body,
  fillTint  : 15,
  pointSize : 8
};

var marginal_bind =
    (doc.paragraphStyles.itemByName("marginal_bind") != null)
       ? doc.paragraphStyles.itemByName("marginal_bind")
       : doc.paragraphStyles.add();
marginal_bind.properties = {
  name          : "marginal_bind",
  basedOn       : marginals,
  justification : Justification.TO_BINDING_SIDE
};

var marginal_nobind =
    (doc.paragraphStyles.itemByName("marginal_nobind") != null)
       ? doc.paragraphStyles.itemByName("marginal_nobind")
       : doc.paragraphStyles.add();
marginal_nobind.properties = {
  name          : "marginal_nobind",
  basedOn       : marginals,
  justification : Justification.AWAY_FROM_BINDING_SIDE
};
