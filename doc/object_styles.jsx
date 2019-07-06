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
 *   bottom_nobind_margin
 *   top_bind_margin
 *   top_nobind_margin
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
  : doc.objectStyles.add({ name : "base" });
// update the object style's properties
// the basedOn property does not work for object styles, so we make do with
// base_prop
var base_prop = base.properties = {
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
  : doc.objectStyles.add({ name : "body" });
// body.basedOn = base
body.properties = base_prop;
body.properties = {
  appliedParagraphStyle : doc.paragraphStyles.itemByName("body"),
  textFramePreferences  : {
    verticalJustification : VerticalJustification.TOP_ALIGN
  }
};

var bottom_nobind_margin =
  (doc.objectStyles.itemByName("bottom_nobind_margin") != null)
    ? doc.objectStyles.itemByName("bottom_nobind_margin")
    : doc.objectStyles.add({ name : "bottom_nobind_margin" });
// bottom_nobind_margin.basedOn = base
bottom_nobind_margin.properties = base_prop;
bottom_nobind_margin.properties = {
  appliedParagraphStyle : doc.paragraphStyles.itemByName("marginal_nobind"),
  textFramePreferences  : {
    verticalJustification : VerticalJustification.BOTTOM_ALIGN
  }
};

var top_bind_margin =
  (doc.objectStyles.itemByName("top_bind_margin") != null)
    ? doc.objectStyles.itemByName("top_bind_margin")
    : doc.objectStyles.add({ name : "top_bind_margin" });
// top_bind_margin.basedOn = base
top_bind_margin.properties = base_prop;
top_bind_margin.properties = {
  appliedParagraphStyle : doc.paragraphStyles.itemByName("marginal_bind"),
  textFramePreferences  : {
    verticalJustification : VerticalJustification.TOP_ALIGN
  }
};

var top_nobind_margin =
  (doc.objectStyles.itemByName("top_nobind_margin") != null)
    ? doc.objectStyles.itemByName("top_nobind_margin")
    : doc.objectStyles.add({ name : "top_nobind_margin" });
// top_nobind_margin.basedOn = base
top_nobind_margin.properties = base_prop;
top_nobind_margin.properties = {
  appliedParagraphStyle : doc.paragraphStyles.itemByName("marginal_nobind"),
  textFramePreferences  : {
    verticalJustification : VerticalJustification.TOP_ALIGN
  }
};

var obj_head_top = (doc.objectStyles.itemByName("obj_head_top") != null)
  ? doc.objectStyles.itemByName("obj_head_top")
  : doc.objectStyles.add({ name : "obj_head_top" });
// obj_head_top.basedOn = base
obj_head_top.properties = base_prop;
obj_head_top.properties = {
  appliedParagraphStyle : doc.paragraphStyles.itemByName("obj_heading"),
  textFramePreferences  : {
    verticalJustification : VerticalJustification.TOP_ALIGN,
    insetSpacing : 0.12 * TXT_BOX_DIMENSIONS
  }
};

var obj_head_bottom =
  (doc.objectStyles.itemByName("obj_head_bottom") != null)
    ? doc.objectStyles.itemByName("obj_head_bottom")
    : doc.objectStyles.add({ name : "obj_head_bottom" });
// obj_head_bottom.basedOn = base
obj_head_bottom.properties = base_prop;
obj_head_bottom.properties = {
  appliedParagraphStyle : doc.paragraphStyles.itemByName("obj_heading"),
  textFramePreferences  : {
    verticalJustification : VerticalJustification.BOTTOM_ALIGN,
    insetSpacing : 0.12 * TXT_BOX_DIMENSIONS
  }
};

var obj_head_center =
  (doc.objectStyles.itemByName("obj_head_center") != null)
    ? doc.objectStyles.itemByName("obj_head_center")
    : doc.objectStyles.add({ name : "obj_head_center" });
// obj_head_center.basedOn = base
obj_head_center.properties = base_prop;
obj_head_center.properties = {
  appliedParagraphStyle : doc.paragraphStyles.itemByName("obj_heading"),
  textFramePreferences  : {
    verticalJustification : VerticalJustification.CENTER_ALIGN,
    insetSpacing : 0.12 * TXT_BOX_DIMENSIONS
  }
};

var obj = (doc.objectStyles.itemByName("obj") != null)
  ? doc.objectStyles.itemByName("obj")
  : doc.objectStyles.add({ name : "obj" });
// obj.basedOn = base
obj.properties = base_prop;
obj.properties = {
  appliedParagraphStyle : doc.paragraphStyles.itemByName("obj"),
  textFramePreferences  : {
    verticalJustification : VerticalJustification.CENTER_ALIGN,
    insetSpacign : 0.12 * TXT_BOX_DIMENSIONS
  }
};

// rectangles

var frame = (doc.objectStyles.itemByName("frame") != null)
  ? doc.objectStyles.itemByName("frame")
  : doc.objectStyles.add({ name : "frame" });
var frame_prop = frame.properties = {
  fillColor    : doc.swatches.item("None"),
  strokeColor  : doc.colors.itemByName("toledo_purple")
};

var outer_frame = (doc.objectStyles.itemByName("outer_frame") != null)
  ? doc.objectStyles.itemByName("outer_frame")
  : doc.objectStyles.add({ name : "outer_frame" });
// outer_frame.basedOn = frame
outer_frame.properties = frame_prop;
outer_frame.properties = {
  strokeWeight : 2
};

var accent_100 = (doc.objectStyles.itemByName("accent_100") != null)
  ? doc.objectStyles.itemByName("accent_100")
  : doc.objectStyles.add({ name : "accent_100" });
var accent_100_prop = accent_100.properties = {
  strokeColor  : doc.colors.itemByName("toledo_purple"),
  strokeWeight : 1
};

var accent_25 = (doc.objectStyles.itemByName("accent_25") != null)
  ? doc.objectStyles.itemByName("accent_25")
  : doc.objectStyles.add({ name : "accent_25" });
// accent_25.basedOn = accent_100;
accent_25.properties = accent_100_prop;
accent_25.properties = {
  strokeTint   : 25
};
