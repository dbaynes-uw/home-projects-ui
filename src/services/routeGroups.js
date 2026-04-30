/**
 * ROUTE GROUPS
 * ─────────────────────────────────────────────────────────────
 * Single source of truth that maps a feature key (stored in the
 * user's `allowed_routes` array in the DB) to the Vue Router
 * route names that belong to that feature.
 *
 * Rules:
 *  • Admin always bypasses all checks — no group needed.
 *  • Routes NOT listed in any group are freely accessible to all
 *    approved users (About, dashboard, profile pages, etc.).
 *  • To add a new route to a feature, just append its name here —
 *    no DB migration required.
 */

export const ROUTE_GROUPS = {
  books: {
    label: '📚 Books',
    routes: ['BookList', 'BookCreate', 'BookDetails', 'BookEdit'],
  },
  events: {
    label: '📅 Events',
    routes: [
      'EventList', 'EventShow', 'EventEdit', 'EventCreate',
      'EventStatistics', 'EventStatisticDetail', 'EventsAssigned',
    ],
  },
  gardens: {
    label: '🌿 Gardens',
    routes: ['Gardens', 'GardenCreate', 'GardenDetails', 'GardenEdit'],
  },
  golf: {
    label: '⛳ Golf',
    routes: [
      'GolfList', 'GolfCreate', 'GolfDetails', 'GolfEdit',
      'GolfLiveScore', 'GolfGroupScorecard', 'GolfPlayers',
    ],
  },
  health: {
    label: '🏥 Health',
    routes: [
      'HealthDashboard',
      'HealthMarkers', 'HealthMarkerCreate', 'HealthMarkerEdit',
      'HealthMarkerDetails', 'HealthMarkersByCategory', 'HealthMarkersFiltered',
      'HealthMarkerPanelCreate', 'HealthMarkerPanelEdit', 'HealthMarkerPanelDetails',
      'MarkerDefinitions',
      'GlucoseReadings', 'GlucoseReadingCreate', 'GlucoseReadingEdit',
      'Oobs', 'OobCreate', 'OobEdit', 'OobDetails',
      'SleepMarkers', 'SleepMarkerEdit',
    ],
  },
  plants: {
    label: '🌱 Plants',
    routes: ['Plants', 'PlantCreate', 'PlantDetails', 'PlantEdit'],
  },
  products: {
    label: '🛒 Products',
    routes: [
      'ProductList', 'ProductsByLocations', 'ProductsByVendors',
      'ProductEdit', 'ProductVendorCreate', 'VendorEdit',
    ],
  },
  travels: {
    label: '✈️ Travels',
    routes: [
      'Travels', 'TravelDetails',
      'TravelEventCreate', 'TravelEventEdit', 'TravelEventDetails',
    ],
  },
  waterings: {
    label: '💧 Waterings',
    routes: ['Waterings', 'WateringCreate', 'WateringDetails', 'WateringEdit'],
  },
}

/** Flat set of every route name that belongs to a group (for O(1) lookups). */
export const GROUPED_ROUTE_NAMES = new Set(
  Object.values(ROUTE_GROUPS).flatMap(g => g.routes)
)

/**
 * Returns true if the given route name is accessible given the user's
 * allowed group keys.  Always returns true for routes not in any group.
 *
 * @param {string}   routeName     — Vue Router route name
 * @param {string[]} allowedGroups — e.g. ['books', 'golf']
 * @returns {boolean}
 */
export function canAccessRoute(routeName, allowedGroups) {
  if (!GROUPED_ROUTE_NAMES.has(routeName)) return true          // not a feature route
  return allowedGroups.some(key =>
    ROUTE_GROUPS[key]?.routes.includes(routeName)
  )
}
