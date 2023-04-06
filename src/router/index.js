import { createRouter, createWebHistory } from "vue-router";
import EventList from "../views/EventList.vue";
import EventsPastDue from "../views/EventsPastDue.vue";
import EventStatisticDetail from "../views/EventStatisticDetail.vue";
import EventDetails from "@/views/EventDetails.vue";
import EventEdit from "@/views/EventEdit.vue";
import UserEdit from "@/views/users/UserEdit.vue";
import EventCreate from "@/views/events/EventCreate.vue";
import TrailCreate from "@/views/trails/TrailCreate.vue";
import TrailList from "../views/trails/TrailList.vue";
import TrailDetails from "@/views/trails/TrailDetails.vue";
import TrailEdit from "@/views/trails/TrailEdit.vue";
import UserCreate from "@/views/users/UserCreate.vue";
import UserList from "../views/users/UserList.vue";
import About from "../views/About.vue";
import EventStatistics from "@/views/EventStatistics.vue";
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
  // ???>
  {
    path: "/events_past_due/:statistic",
    name: "EventsPastDue",
    props: true,
    component: EventsPastDue,
  },
  {
    path: "/event_statistic_detail/:statistic",
    name: "EventStatisticDetail",
    props: true,
    component: EventStatisticDetail,
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
    path: "/event_statistics",
    name: "EventStatistics",
    component: EventStatistics,
  },
  {
    path: "/events_assigned/:assigned",
    props: true,
    name: "EventsAssigned",
    component: EventsAssigned,
  },
  {
    path: "/trail/create",
    name: "TrailCreate",
    component: TrailCreate,
  },
  {
    path: "/trails",
    name: "TrailList",
    component: TrailList,
  },
  {
    path: "/trails/:id",
    name: "TrailDetails",
    props: true,
    component: TrailDetails,
  },
  {
    path: "/trails/:id",
    name: "TrailEdit",
    props: true,
    component: TrailEdit,
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
