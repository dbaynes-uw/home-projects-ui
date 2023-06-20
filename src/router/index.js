import { createRouter, createWebHistory } from "vue-router";
import About from "../views/About.vue";
import BookCreate from "@/views/books/BookCreate.vue";
import BookDetails from "@/views/books/BookDetails.vue";
import BookEdit from "@/views/books/BookEdit.vue";
import BookList from "../views/books/BookList.vue";
import EventCreate from "@/views/events/EventCreate.vue";
import EventsAssigned from "@/views/events/EventsAssigned.vue";
import EventDetails from "@/views/events/EventDetails.vue";
import EventEdit from "@/views/events/EventEdit.vue";
import EventList from "../views/events/EventList.vue";
import EventsPastDue from "../views/events/EventsPastDue.vue";
import EventStatistics from "@/views/events/EventStatistics.vue";
import EventStatisticDetail from "../views/events/EventStatisticDetail.vue";
import Login from "../views/Login.vue";
import TrailCreate from "@/views/trails/TrailCreate.vue";
import TrailDetails from "@/views/trails/TrailDetails.vue";
import TrailEdit from "@/views/trails/TrailEdit.vue";
import TrailList from "../views/trails/TrailList.vue";
import TravelCreate from "@/views/travels/TravelCreate.vue";
import TravelDetails from "@/views/travels/TravelDetails.vue";
import TravelEdit from "@/views/travels/TravelEdit.vue";
import TravelList from "../views/travels/TravelList.vue";
import UserCreate from "@/views/users/UserCreate.vue";
import UserEdit from "@/views/users/UserEdit.vue";
import UserList from "../views/users/UserList.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/book/create",
    name: "BookCreate",
    component: BookCreate,
  },
  {
    path: "/books",
    name: "BookList",
    component: BookList,
  },
  {
    path: "/books/:id",
    name: "BookDetails",
    props: true,
    component: BookDetails,
  },
  {
    path: "/book/:id",
    name: "BookEdit",
    props: true,
    component: BookEdit,
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
    path: "/travel/create",
    name: "TravelCreate",
    component: TravelCreate,
  },
  {
    path: "/travels",
    name: "TravelList",
    component: TravelList,
  },
  {
    path: "/travel/:id",
    name: "TravelDetails",
    props: true,
    component: TravelDetails,
  },
  {
    path: "/travel/:id",
    name: "TravelEdit",
    props: true,
    component: TravelEdit,
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
