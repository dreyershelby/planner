$.writeln("page/holes.jsx depends on\r",
          "- doc/colors.jsx\r",
          "- doc/layers.jsx");

// parameters
var doc = app.activeDocument;
var pg  = app.layoutWindows.item(0).activePage;

// constants
// magic numbers in terms of inches * 6 picas/inch
const hole_diameter = 0.2 * 6; // quarter of an inch
const distance_btwn_hole_cntrs /* in a subgroup of 3 */ = 0.75 * 6;
const distance_btwn_hole_grps_cntrs /* in a subgroup of 2 subgroups */
                                    = 2.75 * 6;
const holes_xmargin = 0.2 * 6;

  /* half of 2 edge holes + 2 sets of 2 gaps between 3 holes */
const holes_len = hole_diameter + 2 * 2 * distance_btwn_hole_cntrs
                             /* + 1 big gap between 2 hole groups */
                                + distance_btwn_hole_grps_cntrs;

                                  /* middle y - 1/2 length of the holes */
const holes_y1 = (pg.bounds[0] + pg.bounds[2] - holes_len) / 2;
const holes_y2 = holes_y1 + holes_len;

const top_hole = (pg.side == PageSideOptions.LEFT_HAND) ?
   [ holes_y1,                                         // y1
     pg.bounds[3] - (holes_xmargin + hole_diameter),   // x1
     holes_y1 + hole_diameter,                         // y2
     pg.bounds[3] - holes_xmargin ]                  : // x2
   [ holes_y1,                                         // y1
     pg.bounds[1] + holes_xmargin,                     // x1
     holes_y1 + hole_diameter,                         // y2
     pg.bounds[1] + (holes_xmargin + hole_diameter) ]; // x2

var hole = pg.ovals.add({
  itemLayer       : doc.layers.itemByName("holes"),
  geometricBounds : top_hole,
  strokeColor     : doc.colors.itemByName("smoky_black"),
  strokeTint      : 15,
  strokeWeight    : 1,
  fillColor       : doc.colors.itemByName("melon_pink"),
  fillTint        : 15,
  name            : "hole"
});

hole = hole.duplicate(pg, [ 0, distance_btwn_hole_cntrs ]);
hole = hole.duplicate(pg, [ 0, distance_btwn_hole_cntrs ]);
hole = hole.duplicate(pg, [ 0, distance_btwn_hole_grps_cntrs ]);
hole = hole.duplicate(pg, [ 0, distance_btwn_hole_cntrs ]);
hole = hole.duplicate(pg, [ 0, distance_btwn_hole_cntrs ]);
