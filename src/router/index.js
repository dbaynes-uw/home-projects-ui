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
import Gardens from "../views/gardens/Gardens.vue";
import GardenCreate from "@/views/gardens/GardenCreate.vue";
import GardenEdit from "@/views/gardens/GardenEdit.vue";
import GlucoseReadings from "@/views/glucose_readings/GlucoseReadings.vue";
import GlucoseReadingCreate from "@/views/glucose_readings/GlucoseReadingCreate.vue";
import GlucoseReadingEdit from "@/views/glucose_readings/GlucoseReadingEdit.vue";
import GolfCreate from "../views/golfs/GolfCreate.vue";
import GolfDetails from "@/views/golfs/GolfDetails.vue";
import GolfEdit from "@/views/golfs/GolfEdit.vue"
import GolfList from "../views/golfs/GolfList.vue";
import MedCreate from "@/views/meds/MedCreate.vue";
import MedDetails from "@/views/meds/MedDetails.vue";
import MedEdit from "@/views/meds/MedEdit.vue";
import MedList from "../views/meds/MedList.vue";
import Plants from "../views/plants/Plants.vue";
import PlantCreate from "@/views/plants/PlantCreate.vue";
import PlantDetails from "@/components/plants/PlantDetails.vue";
import PlantEdit from "@/views/plants/PlantEdit.vue";
import ProductEdit from "../views/products/ProductEdit.vue";
import ProductsLocationList from "../views/products/ProductsLocationList.vue";
import ProductsByLocations from "../views/products/ProductsByLocations.vue";
import ProductsByVendors from "../views/products/ProductsByVendors.vue";
import ProductList from "../views/products/ProductList.vue";
import ProductVendorCreate from "../views/products/ProductVendorCreate.vue";
import VendorEdit from "../views/vendors/VendorEdit.vue";
import TrailCreate from "@/views/trails/TrailCreate.vue";
import TrailDetails from "@/views/trails/TrailDetails.vue";
import TrailEdit from "@/views/trails/TrailEdit.vue";
import TrailList from "../views/trails/TrailList.vue";
import TravelCreate from "@/views/travels/TravelCreate.vue";
import TravelDetails from "@/views/travels/TravelDetails.vue";
import TravelList from "../views/travels/TravelList.vue";
import TravelEdit from "@/views/travels/TravelEdit.vue";
import TravelEventCreate from "@/views/travel_events/TravelEventCreate.vue";
import TravelEventEdit from "@/views/travel_events/TravelEventEdit.vue";
import TravelEventDetails from "@/views/travel_events/TravelEventDetails.vue";
import UserCreate from "@/views/users/UserCreate.vue";
import UserEdit from "@/views/users/UserEdit.vue";
import UserList from "../views/users/UserList.vue";
import WateringCreate from "@/views/waterings/WateringCreate.vue";
import Waterings from "../views/waterings/Waterings.vue";
import WateringEdit from "@/views/waterings/WateringEdit.vue";
import WateringDetails from "@/components/waterings/WateringDetails.vue";
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Logout from '../views/Logout.vue'
import Register from '../views/Register.vue'

const routes = [
  {
  path: '/glucose-readings',
  name: 'GlucoseReadings',
  component: () => import('@/views/glucose_readings/GlucoseReadings.vue')
},
  {
    path: '/',
    name: 'home',
    component: Home,
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
    path: "/garden/:id",
    name: "GardenEdit",
    props: true,
    component: GardenEdit,
    meta: { requiresAuth: true}
  },
    {
    path: "/gardens/",
    name: "Gardens",
    component: Gardens,
    meta: { requiresAuth: true}
  },
  {
    path: "/gardens/:id",
    name: "GardenDetails",
    props: true,
    component: () => import('@/components/gardens/GardenDetails.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/garden/create",
    name: "GardenCreate",
    component: GardenCreate,
    meta: { requiresAuth: true}
  },
  {
    path: "/glucose-readings",
    name: "GlucoseReadings",
    component: GlucoseReadings,
    meta: { requiresAuth: true },
  },
  {
    path: "/glucose_readings/:id?",
    name: "GlucoseReadingDetails",
    props: true,
    component: () => import('@/components/glucose_readings/GlucoseReadingDetails.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: "/glucose_reading/create",
    name: "GlucoseReadingCreate",
    component: GlucoseReadingCreate,
    meta: { requiresAuth: true },
  },
  {
    path: "/glucose_reading/:id",
    name: "GlucoseReadingEdit",
    props: true,
    component: GlucoseReadingEdit,
    meta: { requiresAuth: true },
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
    path: "/products_by_location/:location",
    component: ProductsLocationList,
    props: true,
    name: "ProductsLocationList",
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
    path: "/travels/create_travel_event/:id",
    name: "TravelEventCreate",
    component: TravelEventCreate,
    meta: { requiresAuth: true}
  },
  {
    path: "/travels",
    name: "TravelList",
    component: TravelList,
    meta: { requiresAuth: true}
  },
  {
    path: "/travels/:id",
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
    path: "/travel_event/:id",
    name: "TravelEventEdit",
    props: true,
    component: TravelEventEdit,
    meta: { requiresAuth: true}
  },
  {
    path: "/travel_events/:id",
    name: "TravelEventDetails",
    props: true,
    component: TravelEventDetails,
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
    path: "/products_by_locations",
    name: "ProductsByLocations",
    props: true,
    component: ProductsByLocations,
    meta: { requiresAuth: true}
  },
  {
    path: "/products_by_vendors",
    name: "ProductsByVendors",
    props: true,
    component: ProductsByVendors,
    meta: { requiresAuth: true}
  },
  {
    path: "/plants",
    name: "Plants",
    component: Plants,
    meta: { requiresAuth: true}
  },
  {
    path: "/plants/create/:gardenId?", // Make gardenId optional",
    name: "PlantCreate",
    component: PlantCreate,
    props: true, // This passes gardenId as a prop
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
    path: "/plant/:id",
    name: "PlantEdit",
    props: true,
    component: PlantEdit,
    meta: { requiresAuth: true}
  },
  {
    path: "/waterings",
    name: "Waterings",
    component: Waterings, // Use the imported component
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
    path: "/waterings/:id", // <-- Add ? to make id optional
    name: "WateringDetails",
    props: true,
    component: WateringDetails,
    meta: { requiresAuth: true}
  },
  {
    path: "/watering/create/:gardenId?", // Make gardenId optional
    name: "WateringCreate",
    component: WateringCreate,
    props: true, // This passes gardenId as a prop
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
