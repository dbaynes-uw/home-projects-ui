import moment from "moment-timezone";
moment.tz.setDefault("America/Los_Angeles");
//moment.tz.setDefault("Central European Summer Time");
//UTC OFFSET:
  //moment.tz.setDefault("UTC");
import dayjs from 'dayjs'
//import customParseFormat from "dayjs/plugin/customParseFormat";
export default {
  formatDayOfWeekjs(action_date) {
    if (action_date) {
      action_date =  dayjs(action_date).format('dddd')
      return action_date;
    } 
  },
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
  formatDateTimejs(date_time) {
    if (date_time) {
      //UTC OFFSET:
        //var utc = require("dayjs/plugin/utc");
        //dayjs().utcOffset()
        //dayjs.extend(utc)
        //date_time = dayjs.utc(date_time).utcOffset(-7).format("MM-DD-YY H:mma")
        date_time = dayjs(date_time).format("MM-DD-YY H:mma")
      //06-12-25 20:49pm
      return date_time;
    }
  },
  formatStandardDateTimejs(date_time) {
    if (date_time) {
      //UTC OFFSET:
        //var utc = require("dayjs/plugin/utc");
        //dayjs().utcOffset()
        //dayjs.extend(utc)
        //date_time = dayjs.utc(date_time).utcOffset(-7).format("M/DD/YY H:mma") 
      date_time = dayjs(date_time).format("MM/DD/YY hh:mma");
      return date_time;
    }
  },
  formatTimejs(action_time) {
    if (action_time) {
      //dayjs.extend(customParseFormat)
      if (action_time.length < 8) {
        action_time = "2000-01-01T" + action_time
      }
      action_time =  dayjs(action_time).format('hh:mma')
      return action_time;
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
    returnMessage = `${dayjs(dueDate).format("MM-DD-YY")}`;
    return returnMessage;
  },
};
