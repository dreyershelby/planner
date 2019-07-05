/* doc/object_styles.jsx
 * bea dreyer
 *
 * this script creates object styles, like styles for text frames or
 * rectangles, to be * used to create this planner in Adobe Indesign CS5.5
 * so far, in this file, they can control:
 *   border color/weight
 *   fill color
 *   paragraph style for text
 *   spacing between text and border
 *   vertical justification of text
 * available text object styles:
 *   base (default/no style)
 *   body
 *   pg num
 *   week num
 *   date range
 *   obj heading
 *   obj (body)
 *
 * depends on:
 *   doc/paragraph_styles.jsx
 */

var doc = app.activeDocument;

const TXT_BOX_DIMENSIONS = 1; // 1p0

// text frames

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

var body = (doc.objectStyles.itemByName("body") != null)
              ? doc.objectStyles.itemByName("body")
              : doc.objectStyles.add();
// body.basedOn = base
body.properties = base_prop;
body.properties = {
  name                  : "body",
  appliedParagraphStyle : doc.paragraphStyles.itemByName("body"),
  textFramePreferences  : {
    verticalJustification : VerticalJustification.TOP_ALIGN
  }
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

var obj_heading1 = (doc.objectStyles.itemByName("obj_heading1") != null)
                     ? doc.objectStyles.itemByName("obj_heading1")
                     : doc.objectStyles.add();
// obj_heading1.basedOn = base
obj_heading1.properties = base_prop;
obj_heading1.properties = {
  name                  : "obj_heading1",
  appliedParagraphStyle : doc.paragraphStyles.itemByName("obj_heading"),
  textFramePreferences  : {
    verticalJustification : VerticalJustification.BOTTOM_ALIGN,
    insetSpacing : 0.12 * TXT_BOX_DIMENSIONS
  }
}

var obj_heading2 = (doc.objectStyles.itemByName("obj_heading2") != null)
                     ? doc.objectStyles.itemByName("obj_heading2")
                     : doc.objectStyles.add();
// obj_heading2.basedOn = base
obj_heading2.properties = base_prop;
obj_heading2.properties = {
  name                  : "obj_heading2",
  appliedParagraphStyle : doc.paragraphStyles.itemByName("obj_heading"),
  textFramePreferences  : {
    verticalJustification : VerticalJustification.TOP_ALIGN,
    insetSpacing : 0.12 * TXT_BOX_DIMENSIONS
  }
}

var obj = (doc.objectStyles.itemByName("obj") != null)
             ? doc.objectStyles.itemByName("obj")
             : doc.objectStyles.add();
// obj.basedOn = base
obj.properties = base_prop;
obj.properties = {
  name                  : "obj",
  appliedParagraphStyle : doc.paragraphStyles.itemByName("obj"),
  textFramePreferences  : {
    verticalJustification : VerticalJustification.CENTER_ALIGN,
    insetSpacign : 0.12 * TXT_BOX_DIMENSIONS
  }
};

// rectangles

var frame = (doc.objectStyles.itemByName("frame") != null)
              ? doc.objectStyles.itemByName("frame")
              : doc.objectStyles.add();
var frame_prop = frame.properties = {
  name         : "frame",
  fillColor    : doc.swatches.item("None"),
  strokeColor  : doc.colors.itemByName("toledo_purple")
}

var outer_frame = (doc.objectStyles.itemByName("outer_frame") != null)
                    ? doc.objectStyles.itemByName("outer_frame")
                    : doc.objectStyles.add();
// outer_frame.basedOn = frame
outer_frame.properties = frame_prop;
outer_frame.properties = {
  name         : "outer_frame",
  strokeWeight : 2
}

var accent1 = (doc.objectStyles.itemByName("accent1") != null)
                ? doc.objectStyles.itemByName("accent1")
                : doc.objectStyles.add();
var accent1_prop = accent1.properties = {
  name         : "accent1",
  strokeColor  : doc.colors.itemByName("toledo_purple"),
  strokeWeight : 1
}

var accent2 = (doc.objectStyles.itemByName("accent2") != null)
                ? doc.objectStyles.itemByName("accent2")
                : doc.objectStyles.add();
// accent2.basedOn = accent1;
accent2.properties = accent1_prop;
accent2.properties = {
  name         : "accent2",
  strokeTint   : 25
}
