$.writeln("doc/object_styles.jsx depends on\r",
          "- doc/paragraph_styles.jsx");

var doc = app.activeDocument;

const txt_box_dimensions = 1; // 1p0

var to_clear   = null;
var properties = null;

if ((to_clear = doc.objectStyles.itemByName("base")) != null)
  to_clear.remove();

properties = {
  name : "base",

  enableFill                    : true,
  enableParagraphStyle          : true,
  enableStroke                  : true,
  enableStrokeAndCornerOptions  : true,
  enableTextFrameGeneralOptions : true,

  bottomLeftCornerOption  : CornerOptions.NONE,
  bottomRightCornerOption : CornerOptions.NONE,
  fillColor    : doc.swatches.item("None"),
  strokeColor  : doc.swatches.item("None"),
  strokeWeight : 0,
  topLeftCornerOption  : CornerOptions.NONE,
  topRightCornerOption : CornerOptions.NONE
};
var base = doc.objectStyles.add(properties);

if ((to_clear = doc.objectStyles.itemByName("pg-num")) != null)
  to_clear.remove();

properties = {
  name : "pg-num",
  basedOn : base,
  appliedParagraphStyle : doc.paragraphStyles.itemByName("marginal-nobind"),
  textFramePreferences : {
    verticalJustification : VerticalJustification.BOTTOM_ALIGN
  }
};
var pg_num = doc.objectStyles.add(properties);

if ((to_clear = doc.objectStyles.itemByName("week-num")) != null)
  to_clear.remove();

properties = {
  name : "week-num",
  basedOn : base,
  appliedParagraphStyle : doc.paragraphStyles.itemByName("marginal-bind"),
  textFramePreferences : {
    verticalJustification : VerticalJustification.TOP_ALIGN
  }
};
var week_num = doc.objectStyles.add(properties);

if ((to_clear = doc.objectStyles.itemByName("date-range")) != null)
  to_clear.remove();

properties = {
  name : "date-range",
  basedOn : base,
  appliedParagraphStyle : doc.paragraphStyles.itemByName("marginal-nobind"),
  textFramePreferences : {
    verticalJustification : VerticalJustification.TOP_ALIGN
  }
};
var date_range = doc.objectStyles.add(properties);

if ((to_clear = doc.objectStyles.itemByName("calendar-heading")) != null)
  to_clear.remove();

properties = {
  name : "calendar-heading",
  basedOn : base,
  appliedParagraphStyle : doc.paragraphStyles.itemByName("obj-heading"),
  textFramePreferences : {
    verticalJustification : VerticalJustification.BOTTOM_ALIGN,
    insetSpacing : 0.05 * txt_box_dimensions
  }
}
var calendar_heading = doc.objectStyles.add(properties);
