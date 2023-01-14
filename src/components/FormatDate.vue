<script>
import moment from "moment-timezone";
moment.tz.setDefault("America/Los_Angeles");
export default {
  name: "FormatDate",
  props: {
    event: Object,
  },
  methods: {
    formatDate(value) {
      if (value) {
        console.log("EVENT SERVICE Format Date: ", value);
        value = moment(value).format("MM/DD/YY");
        return value;
      }
    },
  },
};
</script>
