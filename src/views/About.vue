
<template>
  <div class="about-page">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card class="mx-auto mt-5">
            <v-card-title class="text-center">
              <h1>✅ Welcome to Home Projects!</h1>
            </v-card-title>
            
            <v-card-text>
              <div v-if="$store.state.user && $store.state.loggedIn" class="text-center">
                <h2 class="mb-4">Hello, {{ userName }}! 👋</h2>
                
                <v-alert type="success" variant="tonal" class="mb-4">
                  <i class="fas fa-check-circle mr-2"></i>
                  You are successfully logged in!
                </v-alert>
                
                <div class="user-info mb-4">
                  <v-chip color="primary" variant="elevated" class="mr-2 mb-2">
                    <i class="fas fa-user mr-2"></i>
                    ID: {{ $store.state.user.id }}
                  </v-chip>
                  
                  <v-chip color="success" variant="elevated" class="mr-2 mb-2">
                    <i class="fas fa-envelope mr-2"></i>
                    {{ $store.state.user.email }}
                  </v-chip>
                  
                  <v-chip color="info" variant="elevated" class="mr-2 mb-2">
                    <i class="fas fa-key mr-2"></i>
                    Authenticated
                  </v-chip>
                  
                  <v-chip color="warning" variant="elevated" class="mb-2">
                    <i class="fas fa-clock mr-2"></i>
                    Expires: {{ formatExpiration }}
                  </v-chip>
                </div>
                
                <div class="navigation-section">
                  <h3 class="mb-3">🚀 What would you like to do?</h3>
                  
                  <v-row>
                    <v-col cols="12" sm="6" md="4" v-for="link in navigationLinks" :key="link.name">
                      <v-card class="nav-card" @click="navigateTo(link.url)" hover>
                        <v-card-text class="text-center">
                          <i :class="link.icon" class="nav-icon mb-2"></i>
                          <h4>{{ link.title }}</h4>
                          <p class="text-caption">{{ link.description }}</p>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>
              </div>
              
              <div v-else class="text-center">
                <h2>❌ Not Logged In</h2>
                <p>Please log in to access your projects.</p>
                <v-btn @click="$router.push('/login')" color="primary" size="large">
                  <i class="fas fa-sign-in-alt mr-2"></i>
                  Go to Login
                </v-btn>
              </div>
            </v-card-text>
            
            <v-card-actions class="justify-center">
              <v-btn @click="logout" variant="outlined" color="error">
                <i class="fas fa-sign-out-alt mr-2"></i>
                Logout
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  computed: {
    userName() {
      const user = this.$store.state.user;
      
      // ✅ NOW YOU CAN USE DIRECT EMAIL ACCESS (flattened data)
      if (!user || !user.email) {
        return 'Guest';
      }
      
      const emailUser = user.email.split('@')[0];
      const formattedName = emailUser
        .split(/[._-]/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
      
      return formattedName;
    },
    
    formatExpiration() {
      const user = this.$store.state.user;
      if (!user || !user.expires_in) return 'Unknown';
      
      const hours = Math.floor(user.expires_in / 3600);
      const days = Math.floor(hours / 24);
      
      if (days > 0) {
        return `${days} days`;
      } else if (hours > 0) {
        return `${hours} hours`;
      } else {
        return 'Soon';
      }
    },

    navigationLinks() {
      return [
        {
          name: 'events',
          title: 'Events',
          description: 'Manage your home events',
          icon: 'fas fa-calendar-check',
          url: '/events'
        },
        {
          name: 'books',
          title: 'Books',
          description: 'Track your reading list',
          icon: 'fas fa-book-open',
          url: '/books'
        },
        {
          name: 'gardens',
          title: 'Gardens',
          description: 'Manage your garden projects',
          icon: 'fas fa-seedling',
          url: '/gardens'
        },
        {
          name: 'meds_menu',
          title: 'Meds',
          description: 'Track your Medical History',
          icon: 'fas fa-pills',
          url: '/meds_menu'
        },
        {
          name: 'shopping',
          title: 'Shopping',
          description: 'Manage shopping lists',
          icon: 'fas fa-shopping-cart',
          url: '/products'
        },
        {
          name: 'trails',
          title: 'Trails',
          description: 'Explore hiking trails',
          icon: 'fas fa-hiking',
          url: '/trails'
        }
      ]
    }
  },
  
  methods: {
    navigateTo(url) {
      this.$router.push(url)
    },
    
    async logout() {
      try {
        await this.$store.dispatch('logout')
        this.$router.push('/login')
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }
  },
}
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 0;
}

.nav-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 120px;
  display: flex;
  align-items: center;
}

.nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.nav-icon {
  font-size: 2rem;
  color: #1976d2;
}

.user-info {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.navigation-section {
  margin-top: 2rem;
}

@media (max-width: 600px) {
  .nav-icon {
    font-size: 1.5rem;
  }
  
  .nav-card {
    height: 100px;
  }
}
</style>