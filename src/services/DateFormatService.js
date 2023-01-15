import moment from "moment-timezone";
moment.tz.setDefault("America/Los_Angeles");

export default {
  formatStandardDate(action_date) {
    console.log("EVENT SERVICE Format Standard Date: ", action_date);
    if (action_date) {
      action_date = moment(action_date).format("MM/DD/YY");
      return action_date;
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
  calculateDue(action_date, frequency) {
    let returnMessage = "";
    let start = moment(new Date());
    let end = moment(action_date);
    let duration = end.diff(start, "days") + frequency;

    if (duration >= 0) {
      returnMessage = "Due: " + duration + " Days on ";
    } else {
      duration = duration * -1;
      returnMessage = "OverDue:" + duration + " Days on ";
    }
    return returnMessage;
  },
  calculateDateDue(action_date, frequency) {
    let returnMessage = "";
    let dateCompleted = moment(action_date);
    let dueDate = moment(dateCompleted).add(frequency, "days");
    returnMessage = `${moment(dueDate).format("MM/DD/YY")}`;
    return returnMessage;
  },
};
