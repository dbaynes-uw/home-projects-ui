import { createRouter, createWebHistory } from "vue-router";
import store from '@/vuex/store';

// ✅ ONLY IMPORT CORE COMPONENTS (Used imoobiately)
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

  {
    path: '/password_resets/:token',
    name: 'PasswordReset',
    component: () => import('@/views/PasswordReset.vue'),
    props: true
  },
  {
    path: '/password_resets/:token/edit',  // ✅ HANDLE /edit SUFFIX
    name: 'PasswordResetEdit',
    component: () => import('@/views/PasswordReset.vue'),
    props: true
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
  // ❌ TEMPORARILY DISABLED - High memory usage
  // ✅ FILMS
  /*
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
  */

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

  // ❌ TEMPORARILY DISABLED - High memory usage

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
  {
    path: "/golf/:id/live",
    name: "GolfLiveScore",
    props: true,
    component: () => import('@/views/golfs/GolfLiveScore.vue'),
    meta: { requiresAuth: true}
  },

  // ========================================
  // HEALTH DASHBOARD
  // ========================================
  {
    path: '/health',
    name: 'HealthDashboard',
    component: () => import('@/views/health/HealthDashboard.vue'),  // ✅ UPDATED
    meta: { requiresAuth: true }
  },

  // ========================================
  // HEALTH MARKERS
  // ========================================
  {
    path: '/health/markers',
    name: 'HealthMarkers',
    component: () => import('@/views/health/healthMarkers/HealthMarkers.vue'),  // ✅ UPDATED
    meta: { requiresAuth: true }
  },
  {
    path: '/health/markers/create',
    name: 'HealthMarkerCreate',
    component: () => import('@/views/health/healthMarkers/HealthMarkerCreate.vue'),  // ✅ UPDATED
    meta: { requiresAuth: true }
  },
  {
    path: '/health/markers/:id/edit',
    name: 'HealthMarkerEdit',
    component: () => import('@/views/health/healthMarkers/HealthMarkerEdit.vue'),  // ✅ UPDATED
    meta: { requiresAuth: true }
  },
  {
    path: '/health/markers/:id',
    name: 'HealthMarkerDetails',
    component: () => import('@/views/health/healthMarkers/HealthMarkerDetailsWrapper.vue'),  // ✅ UPDATED
    meta: { requiresAuth: true }
  },
  {
    path: '/health/markers/by-category',
    name: 'HealthMarkersByCategory',
    component: () => import('@/views/health/healthMarkers/HealthMarkersByCategory.vue'),  // ✅ UPDATED
    meta: { requiresAuth: true }
  },
  {
    path: '/health/markers/status/:status',
    name: 'HealthMarkersFiltered',
    component: () => import('@/views/health/healthMarkers/HealthMarkersFiltered.vue'),
    meta: { requiresAuth: true }
  },

  // ========================================
  // HEALTH MARKER PANELS
  // ========================================
  {
    path: '/health/panels/create',
    name: 'HealthMarkerPanelCreate',
    component: () => import('@/views/health/healthMarkers/HealthMarkerPanelEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/health/panels/:id/edit',
    name: 'HealthMarkerPanelEdit',
    component: () => import('@/views/health/healthMarkers/HealthMarkerPanelEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/health/panels/:id',
    name: 'HealthMarkerPanelDetails',
    component: () => import('@/views/health/healthMarkers/HealthMarkerPanelDetails.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/health/marker-definitions',
    name: 'MarkerDefinitions',
    component: () => import('@/views/health/healthMarkers/MarkerDefinitions.vue'),
    meta: { requiresAuth: true }
  },

  // ========================================
  // GLUCOSE READINGS
  // ========================================
  {
    path: '/health/glucose',
    name: 'GlucoseReadings',
    component: () => import('@/views/health/glucoseReadings/GlucoseReadings.vue'),  // ✅ UPDATED
    meta: { requiresAuth: true }
  },
  {
    path: '/health/glucose/create',
    name: 'GlucoseReadingCreate',
    component: () => import('@/views/health/glucoseReadings/GlucoseReadingCreate.vue'),  // ✅ UPDATED
    meta: { requiresAuth: true }
  },
  {
    path: '/health/glucose/:id/edit',
    name: 'GlucoseReadingEdit',
    component: () => import('@/views/health/glucoseReadings/GlucoseReadingEdit.vue'),  // ✅ UPDATED
    meta: { requiresAuth: true }
  },
  //{
  //  path: '/health/glucose/:id',
  //  name: 'GlucoseReadingDetails',
  //  component: () => import('@/views/health/glucoseReadings/GlucoseReadingDetails.vue'),  // ✅ UPDATED
  //  meta: { requiresAuth: true }
  //},

  // ========================================
  // SLEEP MARKERS
  // ========================================
  {
    path: '/health/sleep',
    name: 'SleepMarkers',
    component: () => import('@/views/health/sleepMarkers/SleepMarkers.vue'),  // ✅ UPDATED
    meta: { requiresAuth: true }
  },
  //{
  //  path: '/health/sleepMarkers/create',
  //  name: 'SleepMarkerCreate',
  //  component: () => import('@/views/health/sleepMarkers/SleepMarkerCreate.vue'),  // ✅ UPDATED
  //  meta: { requiresAuth: true }
  //},
  {
    path: '/health/sleepMarkers/:id/edit',
    name: 'SleepMarkerEdit',
    component: () => import('@/views/health/sleepMarkers/SleepMarkerEdit.vue'),  // ✅ UPDATED
    meta: { requiresAuth: true }
  },
  //?{
  //?  path: '/health/sleepMarkers/:id',
  //?  name: 'SleepMarkerDetails',
  //?  component: () => import('@/views/health/sleepMarkers/SleepMarkerDetails.vue'),  // ✅ UPDATED
  //?  meta: { requiresAuth: true }
  //?},

  // ========================================
  // OOBS
  // ========================================
  {
    path: '/health/oobs',
    name: 'Oobs',
    component: () => import('@/views/health/oobs/Oobs.vue'),  // ✅ UPDATED
    meta: { requiresAuth: true }
  },
  {
    path: '/health/oobs/create',
    name: 'OobCreate',
    component: () => import('@/views/health/oobs/OobCreate.vue'),  // ✅ UPDATED
    meta: { requiresAuth: true }
  },
  {
    path: '/health/oobs/:id/edit',
    name: 'OobEdit',
    component: () => import('@/views/health/oobs/OobEdit.vue'),  // ✅ UPDATED
    meta: { requiresAuth: true }
  },
  {
    path: '/health/oobs/:id',
    name: 'OobDetails',
    component: () => import('@/views/health/oobs/OobDetails.vue'),  // ✅ UPDATED
    meta: { requiresAuth: true }
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
    path: "/products/:id",
    name: "ProductEdit",
    props: true,
    component: () => import('../views/products/ProductEdit.vue'),
    meta: { requiresAuth: true}
  },
  // ❌ TEMPORARILY DISABLED - High memory usage
  // ✅ TRAILS
  /*
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
  */
  // ❌ TEMPORARILY DISABLED - High memory usage
  // ✅ TRAVELS
  {
    path: "/travels",
    name: "Travels",
    component: () => import('../views/travels/Travels.vue'),
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
// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.state.loggedIn
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'HealthMarkers' }) // Or your preferred default route
  } else {
    next()
  }
})
router.onError((error) => {
  console.error('Router error:', error);
  
  if (error.message.includes('Loading CSS chunk') || 
      error.message.includes('ChunkLoadError')) {
    console.log('🔄 Router chunk load failed - reloading...');
    window.location.reload(true);
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