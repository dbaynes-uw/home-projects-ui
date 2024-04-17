import moment from "moment-timezone";
moment.tz.setDefault("America/Los_Angeles");
import dayjs from 'dayjs'
export default {
  formatDatejs(action_date) {
    if (action_date) {
      action_date =  dayjs(action_date).format('MM-DD-YY')
      return action_date;
    } 
  },
  formatStandardDatejs(action_date) {
    // MM/DD/YY
    if (action_date) {
      action_date = dayjs(action_date).format("MM/DD/YY");
      return action_date;
    }
  },
  formatStandardDateTimejs(date_time) {
    if (date_time) {
      date_time = dayjs(date_time).format("M/DD/YY h:MMa");
      return date_time;
    }
  },
  formatYearDatejs(action_date) {
    // MM/DD/YY
    if (action_date) {
      action_date = dayjs(action_date).format("MM-DD-YY");
      return action_date;
    }
  },
  datePastDuejs(action_date, frequency) {
    let start = dayjs(new Date());
    let end = dayjs(action_date);
    let duration = end.diff(start, "days") + frequency;
    if (duration >= 0) {
      return false;
    } else {
      return true;
    }
  },
  formatFullYearDatejs(action_date) {
    // MM/DD/YYYY
    if (action_date) {
      action_date = dayjs(action_date).format("MM-DD-YYYY");
      return action_date;
    }
  },
  formatFullYearFirstjs(action_date) {
    // MM/DD/YYYY
    if (action_date) {
      action_date = dayjs(action_date).format("YYYY-MM-DD");
      return action_date;
    }
  },
  formatSystemDatejs(action_date) {
    if (action_date) {
      action_date =
        dayjs(action_date).format("MM/DD/YY") +
        " at " +
        dayjs(action_date).format("h:mma");
      return action_date;
    }
  },
  formatYearOnlyjs(action_date) {
    // MM/DD/YY
    if (action_date) {
      action_date = dayjs(action_date).format("YYYY");
      return action_date;
    }
  },
  calculateDuejs(action_date, frequency) {
    let returnMessage = "";
    let start = dayjs(new Date());
    let end = dayjs(action_date);
    console.log("Start Date: ", start)
    console.log("Action Date: ", action_date)
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
  calculateDateDuejs(action_date, frequency) {
    let returnMessage = "";
    let dateCompleted = dayjs(action_date);
    let dueDate = dayjs(dateCompleted).add(frequency, "days");
    console.log("Due Date: ", dueDate)
    returnMessage = `${dayjs(dueDate).format("MM-DD-YY")}`;
    return returnMessage;
  },
};
