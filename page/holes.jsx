/* page/holes.jsx
 * bea dreyer
 *
 * this script adds 2 symmetrical (mirrored across the center horizontal
 * axis of the page) sets of 3 holes (for hole-punching) to a page.
 * in this case, this page is the active/selected page.
 *
 * depends on:
 *   doc/layers.jsx
 *   doc/colors.jsx
 */

function add_to(pg, on_doc) {
  // magic numbers in the format of
  //                    inches * 6 picas/inch
  const DIAMETER        = 0.2  * 6; // quarter of an inch
  // distance is measured from center of hole to center of another hole
  const SUBGRP_DISTANCE = 0.75 * 6; // subgroup: group of 3 holes
  // center of closest hole in 1 group to center of closest hole in another
  const GRP_DISTANCE    = 2.75 * 6; // group: group of 2 subgroups
  const XMARGIN         = 0.2  * 6;

  // total distance covered by group of 6 holes, including edges of holes
  const GRP_LEN = DIAMETER // half of 2 edge holes = 2 * radius = diameter
                + 2 * 2 * SUBGRP_DISTANCE // 2 sets of 2 gaps btwn 3 holes
                + GRP_DISTANCE;           // 1 big gap between 2 hole groups

                                  /* middle y - 1/2 length of the holes */
  const GRP_Y1 = (pg.bounds[0] + pg.bounds[2] - GRP_LEN) / 2;

  // plan of attack: create topmost hole & duplicate down

  // bounds of our topmost hole in [ y1, x1, y2, x2 ] format, since
  // where we place the holes x-wise depends on where the binding is
  const TOP_BOUNDS = (pg.side == PageSideOptions.LEFT_HAND)
                        ? [ GRP_Y1, // binding side is on the right
                            pg.bounds[3] - (XMARGIN + DIAMETER),
                            GRP_Y1 + DIAMETER,
                            pg.bounds[3] - XMARGIN ]
                        : [ GRP_Y1, // binding side is on the left
                            pg.bounds[1] + XMARGIN,
                            GRP_Y1 + DIAMETER,
                            pg.bounds[1] + (XMARGIN + DIAMETER) ];

  // 1st subgroup
  var hole = pg.ovals.add({
    itemLayer       : on_doc.layers.itemByName("holes"),
    geometricBounds : TOP_BOUNDS,
    strokeColor     : on_doc.colors.itemByName("smoky_black"),
    strokeTint      : 15,
    strokeWeight    : 1,
    fillColor       : on_doc.colors.itemByName("melon_pink"),
    fillTint        : 15,
    name            : "hole"
  });
  hole = hole.duplicate(pg, [ 0, SUBGRP_DISTANCE ]);
  hole = hole.duplicate(pg, [ 0, SUBGRP_DISTANCE ]);
  // 2nd subgroup
  hole = hole.duplicate(pg, [ 0, GRP_DISTANCE ]);
  hole = hole.duplicate(pg, [ 0, SUBGRP_DISTANCE ]);
  hole = hole.duplicate(pg, [ 0, SUBGRP_DISTANCE ]);
}

// parameters
var doc = app.activeDocument; // to access doc customizations
var pg  = app.layoutWindows.item(0).activePage; // to place the holes

add_to(pg, doc);
