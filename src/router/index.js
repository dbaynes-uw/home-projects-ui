import { createRouter, createWebHistory } from "vue-router";
import EventList from "../views/EventList.vue";
import EventsPastDue from "../views/EventsPastDue.vue";
import EventDetails from "@/views/EventDetails.vue";
import EventEdit from "@/views/EventEdit.vue";
import UserEdit from "@/views/users/UserEdit.vue";
import EventCreate from "@/components/events/EventCreate.vue";
import UserCreate from "@/views/users/UserCreate.vue";
import UserList from "../views/users/UserList.vue";
import About from "../views/About.vue";
import EventStats from "@/views/EventStats.vue";
import EventsAssigned from "@/views/EventsAssigned.vue";

const routes = [
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/",
    name: "EventList",
    props: true,
    component: EventList,
  },
  {
    path: "/events_past_due/:statistic",
    name: "EventsPastDue",
    props: true,
    component: EventsPastDue,
  },
  {
    path: "/:id",
    name: "EventDetails",
    props: true,
    component: EventDetails,
  },
  {
    path: "/:id",
    name: "EventEdit",
    props: true,
    component: EventEdit,
  },
  {
    path: "/event/create",
    name: "EventCreate",
    component: EventCreate,
  },
  {
    path: "/event_stats",
    name: "EventStats",
    component: EventStats,
  },
  {
    path: "/event_stats_detail",
    name: "EventStatsDetail",
    prop: true,
    component: EventStats,
  },
  {
    path: "/events_assigned/:assigned",
    props: true,
    name: "EventsAssigned",
    component: EventsAssigned,
  },
  {
    path: "/user/create",
    props: true,
    name: "UserCreate",
    component: UserCreate,
  },
  {
    path: "/users",
    name: "UserList",
    component: UserList,
  },
  {
    path: "/users/:id",
    name: "UserEdit",
    props: true,
    component: UserEdit,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
