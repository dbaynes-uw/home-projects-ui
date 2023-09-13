import moment from "moment-timezone";
moment.tz.setDefault("America/Los_Angeles");

export default {
  formatStandardDate(action_date) {
    //console.log("Format Date SERVICE Format Standard Date: ", action_date);
    // MM/DD/YY
    if (action_date) {
      action_date = moment(action_date).format("MM/DD/YY");
      return action_date;
    }
  },
  formatYearDate(action_date) {
    //console.log("Format Date SERVICE Format Standard Date: ", action_date);
    // MM/DD/YY
    if (action_date) {
      action_date = moment(action_date).format("MM-DD-YY");
      return action_date;
    }
  },
  formatFullYearDate(action_date) {
    //console.log("Format Date SERVICE Format Standard Date: ", action_date);
    // MM/DD/YYYY
    if (action_date) {
      action_date = moment(action_date).format("MM-DD-YYYY");
      return action_date;
    }
  },
  formatStandardDateTime(date_time) {
    if (date_time) {
      date_time = moment(date_time).format("M/DD/YY h:MMa");
      return date_time;
    }
  },
  formatSystemDate(action_date) {
    if (action_date) {
      action_date =
        moment(action_date).format("MM/DD/YY") +
        " at " +
        moment(action_date).format("h:mma");
      return action_date;
    }
  },
  datePastDue(action_date, frequency) {
    let start = moment(new Date());
    let end = moment(action_date);
    let duration = end.diff(start, "days") + frequency;
    if (duration >= 0) {
      return false;
    } else {
      return true;
    }
  },
  calculateDue(action_date, frequency) {
    let returnMessage = "";
    let start = moment(new Date());
    let end = moment(action_date);
    let duration = end.diff(start, "days") + frequency;
    // duration is days over due date so + is good, - is over due
    if (duration >= 0) {
      returnMessage = " " + duration + " Days on ";
    } else {
      duration = duration * -1;
      returnMessage = "PastDue - " + duration + " Days on ";
    }
    return returnMessage;
  },
  calculateDateDue(action_date, frequency) {
    let returnMessage = "";
    let dateCompleted = moment(action_date);
    let dueDate = moment(dateCompleted).add(frequency, "days");
    returnMessage = `${moment(dueDate).format("MM-DD-YY")}`;
    return returnMessage;
  },
};
