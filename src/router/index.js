import { createRouter, createWebHistory } from "vue-router";

// ✅ ONLY IMPORT CORE COMPONENTS (Used immediately)
import Home from '../views/Home.vue'
// In router/index.js - ADD THIS BEFORE export default router
const routes = [
  // ✅ CORE ROUTES (EAGER LOADING)
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')  // ✅ Lazy loading
  },
  {
    path: '/register', 
    name: 'register',
    component: () => import('@/views/Register.vue')  // ✅ Lazy loading
  },

  // ✅ ALL OTHER ROUTES (LAZY LOADING)
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('../views/Logout.vue')
  },
  {
    path: '/forgot_password',
    name: 'ForgotPassword',
    component: () => import('../components/ForgotPassword.vue')
  },
  {
    path: '/password_resets/:token',
    name: 'ResetPassword',
    component: () => import('../components/ResetPassword.vue')
  },

  // ✅ ABOUT
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
  },

  // ✅ BOOKS
  {
    path: "/books",
    name: "BookList",
    component: () => import('../views/books/BookList.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/book/create",
    name: "BookCreate",
    component: () => import('@/views/books/BookCreate.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/books/:id",
    name: "BookDetails",
    props: true,
    component: () => import('@/views/books/BookDetails.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/book/:id",
    name: "BookEdit",
    props: true,
    component: () => import('@/views/books/BookEdit.vue'),
    meta: { requiresAuth: true}
  },

  // ✅ EVENTS
  {
    path: "/events",
    name: "EventList",
    component: () => import('../views/events/EventList.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/events/statistic_detail/:statistic",
    name: "EventStatisticDetail",
    props: true,
    component: () => import('../views/events/EventStatisticDetail.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/events/:id",
    name: "EventShow",
    props: true,
    component: () => import('@/views/events/EventShow.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/event/:id",
    name: "EventEdit",
    props: true,
    component: () => import('@/views/events/EventEdit.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/event/create",
    name: "EventCreate",
    component: () => import('@/views/events/EventCreate.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/event_statistics",
    name: "EventStatistics",
    component: () => import('@/views/events/EventStatistics.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/events_assigned/:assigned",
    props: true,
    name: "EventsAssigned",
    component: () => import('@/views/events/EventsAssigned.vue'),
    meta: { requiresAuth: true}
  },

  // ✅ FILMS
  {
    path: "/films",
    name: "FilmList",
    component: () => import('../views/films/FilmList.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/film/create",
    name: "FilmCreate",
    component: () => import('@/views/films/FilmCreate.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/films/:id",
    name: "FilmDetails",
    props: true,
    component: () => import('@/views/films/FilmDetails.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/film/:id",
    name: "FilmEdit",
    props: true,
    component: () => import('@/views/films/FilmEdit.vue'),
    meta: { requiresAuth: true}
  },

  // ✅ GARDENS
  {
    path: "/gardens/",
    name: "Gardens",
    component: () => import('../views/gardens/Gardens.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/garden/create",
    name: "GardenCreate",
    component: () => import('@/views/gardens/GardenCreate.vue'),
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
    path: "/garden/:id",
    name: "GardenEdit",
    props: true,
    component: () => import('@/views/gardens/GardenEdit.vue'),
    meta: { requiresAuth: true}
  },

  // ✅ GLUCOSE READINGS
  {
    path: "/glucose-readings",
    name: "GlucoseReadings",
    component: () => import('@/views/glucose_readings/GlucoseReadings.vue'),
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
    component: () => import('@/views/glucose_readings/GlucoseReadingCreate.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: "/glucose_reading/:id",
    name: "GlucoseReadingEdit",
    props: true,
    component: () => import('@/views/glucose_readings/GlucoseReadingEdit.vue'),
    meta: { requiresAuth: true },
  },

  // ✅ GOLF
  {
    path: "/golfs",
    name: "GolfList",
    component: () => import('../views/golfs/GolfList.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/golf/create",
    name: "GolfCreate",
    component: () => import('../views/golfs/GolfCreate.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/golfs/:id",
    name: "GolfDetails",
    props: true,
    component: () => import('@/views/golfs/GolfDetails.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/golf/:id",
    name: "GolfEdit",
    props: true,
    component: () => import('@/views/golfs/GolfEdit.vue'),
    meta: { requiresAuth: true}
  },

  // ✅ MEDS - FIXED ROUTES
  {
    path: "/meds",
    name: "MedList",
    component: () => import('@/views/meds/MedList.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/med/create",
    name: "MedCreate",
    component: () => import('@/views/meds/MedCreate.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/meds/:id/details",  // ← FIXED: Different path for details
    name: "MedDetails",
    props: true,
    component: () => import('@/views/meds/MedDetails.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/med/:id",  // ← FIXED: Different path pattern for edit
    name: "MedEdit",
    props: true,
    component: () => import('@/views/meds/MedEdit.vue'),
    meta: { requiresAuth: true}
  },

  // ✅ PLANTS
  {
    path: "/plants",
    name: "Plants",
    component: () => import('../views/plants/Plants.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/plants/create/:gardenId?",
    name: "PlantCreate",
    component: () => import('@/views/plants/PlantCreate.vue'),
    props: true,
    meta: { requiresAuth: true}
  },
  {
    path: "/plants/:id",
    name: "PlantDetails",
    props: true,
    component: () => import('@/components/plants/PlantDetails.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/plant/:id",
    name: "PlantEdit",
    props: true,
    component: () => import('@/views/plants/PlantEdit.vue'),
    meta: { requiresAuth: true}
  },

  // ✅ PRODUCTS
  {
    path: "/products",
    name: "ProductList",
    component: () => import('../views/products/ProductList.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/products_by_locations",
    name: "ProductsByLocations",
    props: true,
    component: () => import('../views/products/ProductsByLocations.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/products_by_vendors",
    name: "ProductsByVendors",
    props: true,
    component: () => import('../views/products/ProductsByVendors.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/products_by_location/:location",
    component: () => import('../views/products/ProductsLocationList.vue'),
    name: "ProductsLocationList",
    meta: { requiresAuth: true}
  },
  {
    path: "/product/:id",
    name: "ProductEdit",
    props: true,
    component: () => import('../views/products/ProductEdit.vue'),
    meta: { requiresAuth: true}
  },

  // ✅ TRAILS
  {
    path: "/trails",
    name: "TrailList",
    component: () => import('../views/trails/TrailList.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/trail/create",
    name: "TrailCreate",
    component: () => import('@/views/trails/TrailCreate.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/trails/:id/details", // ← FIXED: Different path for details
    name: "TrailDetails",
    props: true,
    component: () => import('@/views/trails/TrailDetails.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/trail/:id", // ← Different pattern for edit
    name: "TrailEdit",
    props: true,
    component: () => import('@/views/trails/TrailEdit.vue'),
    meta: { requiresAuth: true}
  },

  // ✅ TRAVELS
  {
    path: "/travels",
    name: "TravelList",
    component: () => import('../views/travels/TravelList.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/travel/create",
    name: "TravelCreate",
    component: () => import('@/views/travels/TravelCreate.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/travels/:id",
    name: "TravelDetails",
    props: true,
    component: () => import('@/views/travels/TravelDetails.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/travel/:id",
    name: "TravelEdit",
    props: true,
    component: () => import('@/views/travels/TravelEdit.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/travels/create_travel_event/:id",
    name: "TravelEventCreate",
    component: () => import('@/views/travel_events/TravelEventCreate.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/travel_event/:id",
    name: "TravelEventEdit",
    props: true,
    component: () => import('@/views/travel_events/TravelEventEdit.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/travel_events/:id",
    name: "TravelEventDetails",
    props: true,
    component: () => import('@/views/travel_events/TravelEventDetails.vue'),
    meta: { requiresAuth: true}
  },

  // ✅ USERS
  {
    path: "/users",
    name: "UserList",
    component: () => import('../views/users/UserList.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/user/create",
    props: true,
    name: "UserCreate",
    component: () => import('@/views/users/UserCreate.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/users/:id",
    name: "UserEdit",
    props: true,
    component: () => import('@/views/users/UserEdit.vue'),
    meta: { requiresAuth: true}
  },

  // ✅ VENDORS
  {
    path: "/vendor/create",
    name: "ProductVendorCreate",
    component: () => import('../views/products/ProductVendorCreate.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/vendor/:id",
    name: "VendorEdit",
    props: true,
    component: () => import('../views/vendors/VendorEdit.vue'),
    meta: { requiresAuth: true}
  },

  // ✅ WATERINGS
  {
    path: "/waterings",
    name: "Waterings",
    component: () => import('../views/waterings/Waterings.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/watering/create/:gardenId?",
    name: "WateringCreate",
    component: () => import('@/views/waterings/WateringCreate.vue'),
    props: true,
    meta: { requiresAuth: true}
  },
  {
    path: "/waterings/:id",
    name: "WateringDetails",
    props: true,
    component: () => import('@/components/waterings/WateringDetails.vue'),
    meta: { requiresAuth: true}
  },
  {
    path: "/watering/:id",
    name: "WateringEdit",
    props: true,
    component: () => import('@/views/waterings/WateringEdit.vue'),
    meta: { requiresAuth: true}
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log('🔍 Router navigating to:', to.name, to.path)
  console.log('🔍 Available routes:', routes.map(r => r.path))

  const loggedIn = localStorage.getItem('user')
  
  // ✅ MEMORY CLEANUP ON ROUTE CHANGE
  if (from.name && from.name !== to.name) {
    // Clear large datasets when changing routes
    const store = router.app?.$store;
    if (store && store.dispatch) {
      try {
        store.dispatch('clearLargeDatasets');
        console.log('🧹 Route cleanup:', from.name, '→', to.name);
      } catch (error) {
        console.warn('⚠️ Cleanup failed:', error.message);
      }
    }
  }
  
  // ✅ AUTH CHECK
  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/')
  } else {
    next()
  }
});

// ✅ CLEANUP ON UNLOAD
window.addEventListener('beforeunload', () => {
  const store = router.app?.$store;
  if (store && store.dispatch) {
    try {
      store.dispatch('forceCleanup');
    } catch (error) {
      console.warn('⚠️ Unload cleanup failed:', error.message);
    }
  }
});

export default router;