$.writeln("doc/object_styles.jsx depends on\r",
          "- doc/paragraph_styles.jsx");

var doc = app.activeDocument;

const txt_box_dimensions = 1; // 1p0

var base = ( doc.objectStyles.itemByName("base")
             || doc.objectStyles.add() );
base.properties = {
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

var pg_num = ( doc.objectStyles.itemByName("pg_num")
               || doc.objectStyles.add() );
pg_num.properties = {
  name : "pg-num",
  basedOn : base,
  appliedParagraphStyle : doc.paragraphStyles.itemByName("marginal-nobind"),
  textFramePreferences : {
    verticalJustification : VerticalJustification.BOTTOM_ALIGN
  }
};

var week_num = ( doc.objectStyles.itemByName("week_num")
                 || doc.objectStyles.add() );
week_num.properties = {
  name : "week-num",
  basedOn : base,
  appliedParagraphStyle : doc.paragraphStyles.itemByName("marginal-bind"),
  textFramePreferences : {
    verticalJustification : VerticalJustification.TOP_ALIGN
  }
};

var date_range = ( doc.objectStyles.itemByName("date_range")
                   || doc.objectStyles.add() );
date_range.properties = {
  name : "date-range",
  basedOn : base,
  appliedParagraphStyle : doc.paragraphStyles.itemByName("marginal-nobind"),
  textFramePreferences : {
    verticalJustification : VerticalJustification.TOP_ALIGN
  }
};

var calendar_heading = ( doc.objectStyles.itemByName("calendar_heading")
                         || doc.objectStyles.add() );
calendar_heading.properties = {
  name : "calendar-heading",
  basedOn : base,
  appliedParagraphStyle : doc.paragraphStyles.itemByName("obj-heading"),
  textFramePreferences : {
    verticalJustification : VerticalJustification.BOTTOM_ALIGN,
    insetSpacing : 0.05 * txt_box_dimensions
  }
}
