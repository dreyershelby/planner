const TXT_BOX_DIMENSIONS = 1; // 1p0
const TXT_BOX_HEIGHT = TXT_BOX_DIMENSIONS;

const STROKE_WEIGHT_UNIT = 0.5 / 6; // 0p0.5, there are 6 points in a pica

const OBJ_SPACING = 0.5 * TXT_BOX_DIMENSIONS;

var doc = app.activeDocument;

// planner sets up routines & trackers, leaving room for handwritten todos
// can you fucking believe indesign won't let u use fucking CLASSES
// THE ABSOLUTE GALL
// anyways routine set up is modeled after habitica.com's dailies
const routine_UNIT = { DAILY: 0, WEEKLY: 1, MONTHLY: 2, YEARLY: 3 }
const routine_DAY = { SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
                                 THURSDAY: 4, FRIDAY: 5, SATURDAY: 6 }
const routine_MONTHS = {
  JANUARY:   0, FEBRUARY: 1, MARCH:     2, APRIL:     3,
  MAY:       4, JUNE:     5, JULY:      6, AUGUST:    7,
  SEPTEMBER: 8, OCTOBER:  9, NOVEMBER: 10, DECEMBER: 11
}

              // string, int,  Date,   int, int[], int,   int
function Routine(title, unit, start, count, days, week, month) {
  this.title = title;

  // does this routine happen daily (0), weekly (1), monthly (2), or
  // yearly (3)? aka this var is a number determines if variable count
  // counts number of days, weeks, months, or years between days,
  // weeks, months, or years this routine is active
  this.unit = unit;

  if (start != null)    // start is a Date object
    this.start = start; // start date of pattern if there is one
  else this.start = Date();

  if (count != null && count > 0) this.count = count;
  else this.count = 1; // default value, pretty much just hit every one

  // iff unit == 1 (weekly), then days is an array of sorted, unique
  // numbers (0-6) representing a day of the week on which this routine is
  // used
  if (days != null) {
    this.days = days;

    this.days.sort(function(left, right) { return left - right; });

    var last_day = null;
    for (var i = 0; i < this.days.length; i++) {
      if (this.day < 0 || this.day > 6
          || (last_day != null && this.days[i] == last_day))
        this.days = this.days.splice(i, 1);
      last_day = this.days[i];
    }
  } else this.days = [ routine_DAY.SUNDAY,
      /* default  */   routine_DAY.MONDAY,
      /* value =  */   routine_DAY.TUESDAY,
      /* everyday */   routine_DAY.WEDNESDAY,
                       routine_DAY.THURSDAY,
                       routine_DAY.FRIDAY,
                       routine_DAY.SATURDAY ];

  // if unit == 2 (monthly) or 3 (yearly) then this number gives the week
  // number for the active week else it means nothing for example, if
  // unit == 2, days == [ 6 ], & week == 4, then this routine is used on
  // the 4th saturday of every month if unit == 3 & week == 2, this does
  // not mean automatically that the routine is active every year in its
  // 2nd week. if month is set, then the routine is active in the 2nd week
  // of that month!
  // however, if it is not, then the former situation applies
  if (week != null) this.week = week;

  // if unit == 3 (yearly), then month should be a number from 0-11 to
  // represent the month in which this routine is active else it means
  // nothing if this is valid, this affects the meaning of week
  if (month != null) this.month = month;
}

// preconditions:
// - count > 0
function is_active(routine, date) {
  if (routine.unit == routine_UNIT.DAILY) {
    if (routine.count == 1)
      // we repeat the routine everyday, aka the routine is active
      return true;

    else if (Math.floor((date.getTime() - routine.start.getTime())
              / (1000 * 60 * 60 * 24)) % routine.count == 0) {
      // if a day is active, that means it is some multiple of count
      // away from the start of this routine's pattern
      return true;

    } else return false;

  } else if (routine.unit == routine_UNIT.WEEKLY) {
    if (routine.count == 1 ||        // if the week is active
        Math.floor((date.getTime() - routine.start.getTime())
          / (1000 * 60 * 60 * 24 * 7)) % routine.count == 0) {
      return (routine.days.find(date.getDay()) != null) ? true : false;

    } else return false;

  } else if (routine.unit == routine_UNIT.MONTHLY) {
    if (routine.count == 1 ||        // if the month is active
        (date.getMonth() - routine.start.getMonth()) % routine.count == 0) {
      if (Math.floor(date.getDate() / 7) == routine.week)
        return (routine.days.find(date.getDay()) != null) ? true : false;
      else return false;
    } else return false;

  } else if (routine.unit == routine_UNIT.YEARLY) {
    // TODO
    return false;

  } else {
    $.writeln("error is_active(routine, date): not a valid Routine.unit");
    return false;
  }
}

const MORNING_ROUTINES =
  [ new Routine("make bed", routine_UNIT.DAILY),
    new Routine("take meds", routine_UNIT.DAILY),
    new Routine("drink 4 bottles of water", routine_UNIT.DAILY),
    new Routine("cook breakfast", routine_UNIT.DAILY),
    new Routine("feed pets", routine_UNIT.DAILY),
    new Routine("brush teeth", routine_UNIT.DAILY),
    new Routine("rinse face", routine_UNIT.DAILY) ]
const DAY_ROUTINES =
  [ new Routine("ask a friend how they're doing", routine_UNIT.DAILY),
    new Routine("clean litterbox", routine_UNIT.WEEKLY, WEEK_REF, 1,
                [ routine_DAY.THURSDAY ]),
    new Routine("take out trash", routine_UNIT.WEEKLY, WEEK_REF, 1,
                [ routine_DAY.THURSDAY ]) ]
const NIGHT_ROUTINES =
  [ new Routine("take a shower", routine_UNIT.DAILY, WEEK_REF, 2),
    new Routine("play with ascii", routine_UNIT.DAILY),
    new Routine("feed pets", routine_UNIT.DAILY),
    new Routine("brush teeth", routine_UNIT.DAILY),
    new Routine("wash face", routine_UNIT.DAILY),
    new Routine("take meds", routine_UNIT.DAILY) ];
