var doc = app.activeDocument;
var spread = app.layoutWindows.item(0).activeSpread;
var pg  = app.layoutWindows[0].activePage;

const REF_DATE = new Date();

const TXT_BOX_DIMENSIONS = 1; // 1p0

const MARGINAL_HEIGHT = TXT_BOX_DIMENSIONS;       // the margin itself
const OBJ_SPACING     = 0.5 * TXT_BOX_DIMENSIONS; // space btwn margin&this

const STROKE_WEIGHT_UNIT = 0.5 / 6; // 0p0.5, there are 6 points in a pica

//                  inches * 6 picas/inch
const HOLES_DIAMETER = 0.2 * 6;
const HOLES_XMARGIN  = 0.2 * 6;

// we need the below so that we can translate Indesign's stroke weight units
// to picas, which are used for determining location/dimensions
const STROKE_WEIGHT_UNIT = 0.5 / 6; // 0p0.5, there are 6 points in a pica
const FRAME_WEIGHT = STROKE_WEIGHT_UNIT * // width of a frame line, outside
  doc.objectStyles.itemByName("outer_frame").strokeWeight; // of element
const ACCENT_WEIGHT = STROKE_WEIGHT_UNIT * // width of an accent line,
  doc.objectStyles.itemByName("accent1").strokeWeight; // inside of element

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

              // string, int,  Date,   int, int[], int[], int[]
function Routine(title, unit, start, frequency, days, weeks, months) {
  this.title = title;

  // does this routine happen daily (0), weekly (1), monthly (2), or
  // yearly (3)? aka this var is a number determines if variable count
  // counts number of days, weeks, months, or years between days,
  // weeks, months, or years this routine is active
  this.unit = unit;

  if (start != null)    // start is a Date object
    this.start = start; // start date of pattern if there is one
  else this.start = REF_DATE;

  if (frequency != null && frequency > 0) this.frequency = frequency;
  else this.frequency = 1; // default value, pretty much just hit every one

  // iff unit == 1 (weekly), then days is an array of sorted, unique
  // numbers (0-6) representing a day of the week on which this routine is
  // used
  if (days != null) {
    this.days = days;

    // make sure the day numbers are in the right order of 0 to 6
    this.days.sort(function(left, right) { return left - right; });

    var last_day = null;
    for (var i = 0; i < this.days.length; i++) {
      // get rid of number outside of 0 & 6...
      if (this.days[i] < 0 || this.days[i] > 6 
          || (last_day != null && this.days[i] == last_day)) // & repeats
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

  // if unit == 2 (monthly) or 3 (yearly) then these numbers give the week
  // number for the active week
  // else it means nothing
  // for example, if unit == 2, days == [ 6 ], & week == 4, then this
  // routine is used on the 4th saturday of every month
  // if unit == 3 & week == 2, this does not mean automatically that the
  // routine is active every year in its 2nd week.
  // if month is set, then the routine is active in the 2nd week of that
  // month!
  // however, if it is not, then the former situation applies
  if (weeks != null) {
    this.weeks = weeks;

    // make sure the week numbers are in the right order (increasing)
    this.weeks.sort(function(left, right) { return left - right; });

    var last_week = null;
    for (var i = 0; i < this.weeks.length; i++) {
      // get rid of number outside of 0 & 4...
      if (this.weeks[i] < 0 || this.weeks[i] > 4
          || (last_week != null && this.weeks[i] == last_week)) // & repeats
        this.weeks = this.weeks.splice(i, 1);
      last_week = this.weeks[i];
    }
  } else this.weeks = { 0, 1, 2, 3, 4 };

  // if unit == 3 (yearly), then month should be a number from 0-11 to
  // represent the month in which this routine is active else it means
  // nothing if this is valid, this affects the meaning of week
  if (months != null) {
    this.months = months;

    // make sure the month numbers are in the right order (increasing)
    this.months.sort(function(left, right) { return left - right; });

    var last_month = null;
    for (var i = 0; i < this.months.length; i++) {
      // get rid of number outside of 0 & 11 & repeats
      if (this.months[i] < 0 || this.months[i] > 11
          || (last_month != null && this.months[i] == last_month))
        this.months = this.months.splice(i, 1);
      last_month = this.months[i];
    }
  } else this.months = { routine_MONTH.JANUARY,
                         routine_MONTH.FEBRUARY,
                         routine_MONTH.MARCH,
                         routine_MONTH.APRIL,
                         routine_MONTH.MAY,
                         routine_MONTH.JUNE,
                         routine_MONTH.JULY,
                         routine_MONTH.AUGUST,
                         routine_MONTH.SEPTEMBER,
                         routine_MONTH.OCTOBER,
                         routine_MONTH.NOVEMBER,
                         routine_MONTH.DECEMBER }
}

// converts milliseconds to days, rounding down to whole numbers
function int_days(start_time, end_time) {
  return Math.floor( (end_time - start_time) / (1000 * 60 * 60 * 24) );
}

// converts milliseconds to weeks, rounding down to whole numbers
function int_weeks(start_time, end_time) {
  return Math.floor( (end_time - start_time) / (1000 * 60 * 60 * 24 * 7) );
}

function does_arr_include(element, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == element) return true;
  }
  return false;
}

// preconditions:
// - frequency > 0
function is_active(routine, date) {
  if (routine.unit == routine_UNIT.DAILY) {
    // if we repeat the routine everyday, the routine is active
    if (routine.frequency == 1)
      return true;
    else
      // iff a day is active, that means it is some multiple of frequency
      // away from the start of this routine's pattern
      return int_days(routine.start.getTime(), date.getTime())
             % routine.frequency == 0;

    } else return false;

  } else if (routine.unit == routine_UNIT.WEEKLY) {
    if (routine.frequency == 1 // if the week is active every week
        || (int_weeks(routine.start.getTime(), date.getTime()) // OR
            % routine.frequency == 0)) { // if the week fits the active freq
      return does_arr_include(date.getDay(), routine.days);

    } else return false;

  } else if (routine.unit == routine_UNIT.MONTHLY) {
    if (routine.frequency == 1 // if the month fits the frequency
        || ((date.getMonth() - routine.start.getMonth())
            % routine.frequency == 0)) {
      if (does_arr_include(Math.floor(date.getDate() / 7), routine.weeks)) {
        return does_arr_include(date.getDay(), routine.days);
      } else return false;
    } else return false;

  } else if (routine.unit == routine_UNIT.YEARLY) {
    if (routine.frequency == 1 || // if the year fits the frequency
        (date.getFullYear() - routine.start.getFullYear()) %
          routine.frequency == 0) {
      return (does_arr_include(date.getMonth(), routine.months)
           && does_arr_include(Math.floor(date.getDate() / 7),
                                                routine.weeks)
           && does_arr_include(date.getDay(),   routine.days));
    } else return false;

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
  [ new Routine("meditate", routine_UNIT.DAILY),
    new Routine("ask a friend how they're doing", routine_UNIT.DAILY),
    new Routine("clean litterbox", routine_UNIT.WEEKLY, REF_DATE, 1,
                [ routine_DAY.THURSDAY ]),
    new Routine("take out trash", routine_UNIT.WEEKLY, REF_DATE, 1,
                [ routine_DAY.THURSDAY ]) ]
const NIGHT_ROUTINES =
  [ new Routine("take a shower", routine_UNIT.DAILY, REF_DATE, 2),
    new Routine("play with ascii", routine_UNIT.DAILY),
    new Routine("feed pets", routine_UNIT.DAILY),
    new Routine("brush teeth", routine_UNIT.DAILY),
    new Routine("wash face", routine_UNIT.DAILY),
    new Routine("take meds", routine_UNIT.DAILY) ];
