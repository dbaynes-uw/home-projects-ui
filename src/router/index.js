import { createRouter, createWebHistory } from "vue-router";
import About from "../views/About.vue";
import BookCreate from "@/views/books/BookCreate.vue";
import BookDetails from "@/views/books/BookDetails.vue";
import BookEdit from "@/views/books/BookEdit.vue";
import BookList from "../views/books/BookList.vue";
import FilmCreate from "@/views/films/FilmCreate.vue";
import FilmDetails from "@/views/films/FilmDetails.vue";
import FilmEdit from "@/views/films/FilmEdit.vue";
import FilmList from "../views/films/FilmList.vue";
import EventCreate from "@/views/events/EventCreate.vue";
import EventsAssigned from "@/views/events/EventsAssigned.vue";
import EventShow from "@/views/events/EventShow.vue";
import EventEdit from "@/views/events/EventEdit.vue";
import EventList from "../views/events/EventList.vue";
import EventStatistics from "@/views/events/EventStatistics.vue";
import EventStatisticDetail from "../views/events/EventStatisticDetail.vue";
import ForgotPassword from "../components/ForgotPassword.vue";
import ResetPassword from "../components/ResetPassword.vue";
import GolfCreate from "../views/golfs/GolfCreate.vue";
import GolfDetails from "@/views/golfs/GolfDetails.vue";
import GolfEdit from "@/views/golfs/GolfEdit.vue"
import GolfList from "../views/golfs/GolfList.vue";
import MedCreate from "@/views/meds/MedCreate.vue";
import MedDetails from "@/views/meds/MedDetails.vue";
import MedEdit from "@/views/meds/MedEdit.vue";
import MedList from "../views/meds/MedList.vue";
import GardenCreate from "@/views/gardens/GardenCreate.vue";
import GardenDetails from "@/views/gardens/GardenDetails.vue";
import GardenEdit from "@/views/gardens/GardenEdit.vue";
import GardenStart from "../views/gardens/GardenStart.vue";
import PlantCreate from "@/views/plants/PlantCreate.vue";
import PlantDetails from "@/views/plants/PlantDetails.vue";
import PlantEdit from "@/views/plants/PlantEdit.vue";
import ProductEdit from "../views/products/ProductEdit.vue";
import OutletDetails from "@/views/waterings/OutletDetails.vue";
import GardenList from "../views/gardens/GardenList.vue";
import ProductsLocationList from "../views/products/ProductsLocationList.vue";
import ProductLocationsList from "../views/products/ProductLocationsList.vue";
import ProductsVendorList from "../views/products/ProductsVendorList.vue";
import ProductList from "../views/products/ProductList.vue";
import ProductVendorCreate from "../views/products/ProductVendorCreate.vue";
import VendorEdit from "../views/vendors/VendorEdit.vue";
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
import WateringCreate from "@/views/waterings/WateringCreate.vue";
import OutletCreate from "@/views/waterings/OutletCreate.vue";
import OutletDetailsByName from "@/views/waterings/OutletDetailsByName.vue";
import WateringEdit from "@/views/waterings/WateringEdit.vue";
import OutletEdit from "@/views/waterings/OutletEdit.vue";
import WateringDisplay from "../views/waterings/WateringDisplay.vue";
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Logout from '../views/Logout.vue'
import Register from '../views/Register.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    //?props: true,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/forgot_password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/password_resets/:token',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: "/about",
    name: "About",
    component: About,
    //meta: { requiresAuth: true}
  },
  {
    path: "/book/:id",
    name: "BookEdit",
    props: true,
    component: BookEdit,
    meta: { requiresAuth: true}
  },
  {
    path: "/book/create",
    name: "BookCreate",
    component: BookCreate,
    meta: { requiresAuth: true}
  },
  {
    path: "/books",
    name: "BookList",
    component: BookList,
    meta: { requiresAuth: true}
  },
  {
    path: "/books/:id",
    name: "BookDetails",
    props: true,
    component: BookDetails,
    meta: { requiresAuth: true}
  },
  {
    path: "/book/:id",
    name: "BookEdit",
    props: true,
    component: BookEdit,
    meta: { requiresAuth: true}
  },
  {
    path: "/events",
    name: "EventList",
    component: EventList,
    meta: { requiresAuth: true}
  },
  //{
  //  path: "/events/notification_events_due/",
  //  name: "EventList",
  //  props: true,
  //  component: EventList,
  //  meta: { requiresAuth: true}
  //},
  {
    path: "/events/statistic_detail/:statistic",
    name: "EventStatisticDetail",
    props: true,
    component: EventStatisticDetail,
    meta: { requiresAuth: true}
  },
  {
    path: "/events/:id",
    name: "EventShow",
    props: true,
    component: EventShow,
    meta: { requiresAuth: true}
  },
  {
    path: "/event/:id",
    name: "EventEdit",
    props: true,
    component: EventEdit,
    meta: { requiresAuth: true}
  },
  {
    path: "/event/create",
    name: "EventCreate",
    component: EventCreate,
    meta: { requiresAuth: true}
  },
  {
    path: "/event_statistics",
    name: "EventStatistics",
    component: EventStatistics,
    meta: { requiresAuth: true}
  },
  {
    path: "/events_assigned/:assigned",
    props: true,
    name: "EventsAssigned",
    component: EventsAssigned,
    meta: { requiresAuth: true}
  },
  {
    path: "/film/create",
    name: "FilmCreate",
    component: FilmCreate,
    meta: { requiresAuth: true}
  },
  {
    path: "/films",
    name: "FilmList",
    component: FilmList,
    meta: { requiresAuth: true}
  },
  {
    path: "/films/:id",
    name: "FilmDetails",
    props: true,
    component: FilmDetails,
    meta: { requiresAuth: true}
  },
  {
    path: "/film/:id",
    name: "FilmEdit",
    props: true,
    component: FilmEdit,
    meta: { requiresAuth: true}
  },

  {
    path: "/golf/create",
    name: "GolfCreate",
    component: GolfCreate,
    meta: { requiresAuth: true}
  },
  {
    path: "/golfs",
    name: "GolfList",
    component: GolfList,
    meta: { requiresAuth: true}
  },
  {
    path: "/golfs/:id",
    name: "GolfDetails",
    props: true,
    component: GolfDetails,
    meta: { requiresAuth: true}
  },
  {
    path: "/golf/:id",
    name: "GolfEdit",
    props: true,
    component: GolfEdit,
    meta: { requiresAuth: true}
  },
  {
    path: "/med/create",
    name: "MedCreate",
    component: MedCreate,
    meta: { requiresAuth: true}
  },
  {
    path: "/meds",
    name: "MedList",
    component: MedList,
    meta: { requiresAuth: true}
  },
  {
    path: "/meds/:id",
    name: "MedDetails",
    props: true,
    component: MedDetails,
    meta: { requiresAuth: true}
  },
  {
    path: "/meds/:id",
    name: "MedEdit",
    props: true,
    component: MedEdit,
    meta: { requiresAuth: true}
  },
  {
    path: "/garden/:id",
    name: "GardenEdit",
    props: true,
    component: GardenEdit,
    meta: { requiresAuth: true}
  },
  {
    path: "/gardens",
    name: "GardenList",
    props: true,
    component: GardenList,
    meta: { requiresAuth: true}
  },
  {
    path: "/garden/create",
    name: "GardenCreate",
    component: GardenCreate,
    meta: { requiresAuth: true}
  },
  {
    path: "/gardens/start",
    name: "GardenStart",
    component: GardenStart,
    meta: { requiresAuth: true}
  },
  {
    path: "/gardens/:id",
    name: "GardenDetails",
    props: true,
    component: GardenDetails,
    meta: { requiresAuth: true}
  },
  {
    path: "/outlets/:id",
    name: "OutletDetails",
    props: true,
    component: OutletDetails,
    meta: { requiresAuth: true}
  },
  {
    path: "/outlets/:outlet_name",
    name: "OutletDetailsByName",
    props: true,
    component: OutletDetailsByName,
    meta: { requiresAuth: true}
  },
  {
    path: "/plants/:id",
    name: "PlantDetails",
    props: true,
    component: PlantDetails,
    meta: { requiresAuth: true}
  },
  {
    path: "/plant/edit/:id",
    name: "PlantEdit",
    props: true,
    component: PlantEdit,
    meta: { requiresAuth: true}
  },
  {
    path: "/plant/create",
    name: "PlantCreate",
    component: PlantCreate,
    meta: { requiresAuth: true}
  },
  {
    path: "/products_by_location/:location",
    component: ProductsLocationList,
    props: true,
    name: "ProductsLocationList",
    meta: { requiresAuth: true}
  },
  {
    path: "/get_plant_watering_outlet/:outlet_details_by_name",
    name: "OutletDetailsByName",
    props: true,
    component: OutletDetailsByName,
    meta: { requiresAuth: true}
  },
  {
    path: "/products",
    name: "ProductList",
    component: ProductList,
    meta: { requiresAuth: true}
  },
  {
    path: "/product/:id",
    name: "ProductEdit",
    props: true,
    component: ProductEdit,
    meta: { requiresAuth: true}
  },
  {
    path: "/trail/create",
    name: "TrailCreate",
    component: TrailCreate,
    meta: { requiresAuth: true}
  },
  {
    path: "/trails",
    name: "TrailList",
    component: TrailList,
    meta: { requiresAuth: true}
  },
  {
    path: "/trails/:id",
    name: "TrailDetails",
    props: true,
    component: TrailDetails,
    meta: { requiresAuth: true}
  },
  {
    path: "/trails/:id",
    name: "TrailEdit",
    props: true,
    component: TrailEdit,
    meta: { requiresAuth: true}
  },
  {
    path: "/travel/create",
    name: "TravelCreate",
    component: TravelCreate,
    meta: { requiresAuth: true}
  },
  {
    path: "/travels",
    name: "TravelList",
    component: TravelList,
    meta: { requiresAuth: true}
  },
  {
    path: "/travel/:id",
    name: "TravelDetails",
    props: true,
    component: TravelDetails,
    meta: { requiresAuth: true}
  },
  {
    path: "/travel/:id",
    name: "TravelEdit",
    props: true,
    component: TravelEdit,
    meta: { requiresAuth: true}
  },
  {
    path: "/user/create",
    props: true,
    name: "UserCreate",
    component: UserCreate,
    meta: { requiresAuth: true}
  },
  {
    path: "/users",
    name: "UserList",
    component: UserList,
    meta: { requiresAuth: true}
  },
  {
    path: "/users/:id",
    name: "UserEdit",
    props: true,
    component: UserEdit,
    meta: { requiresAuth: true}
  },
  {
    path: "/vendor/create",
    name: "ProductVendorCreate",
    component: ProductVendorCreate,
    meta: { requiresAuth: true}
  },
  {
    path: "/vendor/:id",
    name: "VendorEdit",
    props: true,
    component: VendorEdit,
    meta: { requiresAuth: true}
  },
  {
    path: "/vendors_products",
    name: "ProductLocationsList",
    props: true,
    component: ProductLocationsList,
    meta: { requiresAuth: true}
  },
  {
    path: "/locations_vendors",
    name: "ProductsVendorList",
    props: true,
    component: ProductsVendorList,
    meta: { requiresAuth: true}
  },
  {
    path: "/watering/:id",
    name: "WateringEdit",
    props: true,
    component: WateringEdit,
    meta: { requiresAuth: true}
  },
  {
    path: "/watering/create",
    name: "WateringCreate",
    component: WateringCreate,
    meta: { requiresAuth: true}
  },
  {
    path: "/watering",
    name: "WateringDisplay",
    component: WateringDisplay,
    meta: { requiresAuth: true}
  },
  {
    path: "/watering_only",
    name: "WateringOnly",
    component: OutletCreate,
    meta: { requiresAuth: true}
  },
  {
    path: "/outlet/create",
    name: "OutletCreate",
    component: OutletCreate,
    meta: { requiresAuth: true}
  },
  {
    path: "/outlets/:id",
    name: "OutletEdit",
    component: OutletEdit,
    meta: { requiresAuth: true}
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('user')
  //console.log("router beforeEach !loggedIn: ", !loggedIn)
  //console.log("Matched?", to.matched.some(record => record.meta.requiresAuth))
  //console.log("Current to: ", to);
  //console.log("Current to.matched: ", to.matched == '/');
  //console.log("Current from: ", from);
  
  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/')
  }
  next()
})
export default router;
