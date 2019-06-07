/* doc/object_styles.jsx
 * bea dreyer
 *
 * this script creates object styles, like styles for text frames, to be
 * used to create this planner in Adobe Indesign CS5.5
 * so far, in this file, they can control:
 *   border color/weight
 *   fill color
 *   paragraph style for text
 *   spacing between text and border
 *   vertical justification
 * available object styles:
 *   base (default/no style)
 *   pg num
 *   week num
 *   date range
 *   calendar heading
 *   calendar (body)
 *
 * depends on:
 *   doc/paragraph_styles.jsx
 */

var doc = app.activeDocument;

const TXT_BOX_DIMENSIONS = 1; // 1p0

// if the object style doesn't exist, add it
var base = (doc.objectStyles.itemByName("base") != null)
              ? doc.objectStyles.itemByName("base")
              : doc.objectStyles.add();
// update the object style's properties
// the basedOn property does not work for object styles, so we make do with
// base_prop
var base_prop = base.properties = {
  name : "base",

  enableFill                    : true,
  enableParagraphStyle          : true,
  enableStrokeAndCornerOptions  : true,
  enableTextFrameGeneralOptions : true,

  // make sure this is a blank slate for our purposes
  bottomLeftCornerOption  : CornerOptions.NONE,
  bottomRightCornerOption : CornerOptions.NONE,
  fillColor    : doc.swatches.item("None"),
  strokeColor  : doc.swatches.item("None"),
  strokeWeight : 0,
  topLeftCornerOption  : CornerOptions.NONE,
  topRightCornerOption : CornerOptions.NONE
};

var pg_num = (doc.objectStyles.itemByName("pg_num") != null)
                ? doc.objectStyles.itemByName("pg_num")
                : doc.objectStyles.add();
// pg_num.basedOn = base
pg_num.properties = base_prop;
pg_num.properties = {
  name                  : "pg_num",
  appliedParagraphStyle : doc.paragraphStyles.itemByName("marginal_nobind"),
  textFramePreferences  : {
    verticalJustification : VerticalJustification.BOTTOM_ALIGN
  }
};

var week_num = (doc.objectStyles.itemByName("week_num") != null)
                  ? doc.objectStyles.itemByName("week_num")
                  : doc.objectStyles.add();
// week_num.basedOn = base
week_num.properties = base_prop;
week_num.properties = {
  name                  : "week_num",
  appliedParagraphStyle : doc.paragraphStyles.itemByName("marginal_bind"),
  textFramePreferences  : {
    verticalJustification : VerticalJustification.TOP_ALIGN
  }
};

var date_range = (doc.objectStyles.itemByName("date_range") != null)
                    ? doc.objectStyles.itemByName("date_range")
                    : doc.objectStyles.add();
// date_range.basedOn = base
date_range.properties = base_prop;
date_range.properties = {
  name                  : "date_range",
  appliedParagraphStyle : doc.paragraphStyles.itemByName("marginal_nobind"),
  textFramePreferences  : {
    verticalJustification : VerticalJustification.TOP_ALIGN
  }
};

var calendar_heading =
    (doc.objectStyles.itemByName("calendar_heading") != null)
       ? doc.objectStyles.itemByName("calendar_heading")
       : doc.objectStyles.add();
// calendar_heading.basedOn = base
calendar_heading.properties = base_prop;
calendar_heading.properties = {
  name                  : "calendar_heading",
  appliedParagraphStyle : doc.paragraphStyles.itemByName("obj_heading"),
  textFramePreferences  : {
    verticalJustification : VerticalJustification.BOTTOM_ALIGN,
    insetSpacing : 0.15 * TXT_BOX_DIMENSIONS
  }
}

var calendar = (doc.objectStyles.itemByName("calendar") != null)
                  ? doc.objectStyles.itemByName("calendar")
                  : doc.objectStyles.add();
// calendar.basedOn = base
calendar.properties = base_prop;
calendar.properties = {
  name                  : "calendar",
  appliedParagraphStyle : doc.paragraphStyles.itemByName("obj"),
  textFramePreferences  : {
    verticalJustification : VerticalJustification.CENTER_ALIGN,
    insetSpacign : 0.15 * TXT_BOX_DIMENSIONS
  }
};
