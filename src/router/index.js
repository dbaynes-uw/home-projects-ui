import { createRouter, createWebHistory } from "vue-router";
import EventList from "../views/EventList.vue";
import EventDetails from "@/views/EventDetails.vue";
import EventEdit from "@/views/EventEdit.vue";
import EventCreate from "@/views/EventCreate.vue";
import About from "../views/About.vue";

const routes = [
  {
    path: "/",
    name: "EventList",
    component: EventList,
  },
  {
    path: "/:id",
    name: "EventDetails",
    props: true,
    component: EventDetails,
  },
  {
    path: "/event/:id",
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
    path: "/about",
    name: "About",
    component: About,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
