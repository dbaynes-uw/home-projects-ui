
<template>
  <div class="about-page">
    <div class="about-container">
      <div class="about-row about-row-center">
        <div class="about-col about-col-12 about-col-md-8">
          <section class="about-panel mx-auto mt-5">
            <header class="about-panel-header text-center">
              <h1>✅ Welcome to Home Projects!</h1>
            </header>
            
            <div class="about-panel-body">
              <div v-if="$store.state.user && $store.state.loggedIn" class="text-center">
                <h2 class="mb-4">Hello, {{ userName }}! 👋</h2>
                
                <BaseAlert variant="success" class="mb-4">
                  <i class="fas fa-check-circle mr-2"></i>
                  You are successfully logged in!
                </BaseAlert>
                
                <div class="user-info mb-4">
                  <BaseChip variant="primary" class="mr-2 mb-2">
                    <i class="fas fa-user mr-2"></i>
                    ID: {{ $store.state.user.id }}
                  </BaseChip>
                  
                  <BaseChip variant="success" class="mr-2 mb-2">
                    <i class="fas fa-envelope mr-2"></i>
                    {{ $store.state.user.email }}
                  </BaseChip>
                  
                  <BaseChip variant="info" class="mr-2 mb-2">
                    <i class="fas fa-key mr-2"></i>
                    Authenticated
                  </BaseChip>
                  
                  <BaseChip variant="warning" class="mb-2">
                    <i class="fas fa-clock mr-2"></i>
                    Expires: {{ formatExpiration }}
                  </BaseChip>
                </div>
                
                <div class="navigation-section">
                  <h3 class="mb-3">🚀 What would you like to do?</h3>
                  
                  <div class="about-row">
                    <div class="about-col about-col-12 about-col-sm-6 about-col-md-4" v-for="link in navigationLinks" :key="link.name">
                      <button type="button" class="nav-card" @click="navigateTo(link.url)">
                        <div class="nav-card-body text-center">
                          <i :class="link.icon" class="nav-icon mb-2"></i>
                          <h4>{{ link.title }}</h4>
                          <p class="text-caption">{{ link.description }}</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="text-center">
                <h2>❌ Not Logged In</h2>
                <p>Please log in to access your projects.</p>
                <BaseButton @click="$router.push('/login')" variant="primary" size="large">
                  <i class="fas fa-sign-in-alt mr-2"></i>
                  Go to Login
                </BaseButton>
              </div>
            </div>
            
            <footer class="about-panel-footer justify-center">
              <BaseButton @click="logout" variant="danger">
                <i class="fas fa-sign-out-alt mr-2"></i>
                Logout
              </BaseButton>
            </footer>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseChip from '@/components/ui/BaseChip.vue';

export default {
  components: {
    BaseAlert,
    BaseButton,
    BaseChip
  },
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
          name: 'health',
          title: 'Health Dashboard',
          description: 'Track your health history',
          icon: 'fas fa-heartbeat',
          url: '/health'
        },
        {
          name: 'golf',
          title: 'Golf',
          description: 'Track rounds & scorecards',
          icon: 'fas fa-golf-ball',
          url: '/golfs'
        },
        {
          name: 'golf-players',
          title: 'Golf Players',
          description: 'Player profiles & stats',
          icon: 'fas fa-user-group',
          url: '/golf/players'
        },
        {
          name: 'shopping',
          title: 'Shopping',
          description: 'Manage shopping lists',
          icon: 'fas fa-shopping-cart',
          url: '/products'
        },
        {
          name: 'travels',
          title: 'Travels',
          description: 'Log your travel adventures',
          icon: 'fas fa-plane',
          url: '/travels'
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

.about-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  box-sizing: border-box;
}

.about-row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -8px;
}

.about-row-center {
  justify-content: center;
}

.about-col {
  box-sizing: border-box;
  padding: 8px;
}

.about-col-12 {
  flex: 0 0 100%;
  max-width: 100%;
}

.about-col-sm-6 {
  flex: 0 0 100%;
  max-width: 100%;
}

.about-col-md-8 {
  flex: 0 0 100%;
  max-width: 100%;
}

.about-col-md-4 {
  flex: 0 0 100%;
  max-width: 100%;
}

.about-panel {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
}

.about-panel-header {
  padding: 1rem 1.25rem 0.5rem;
}

.about-panel-body {
  padding: 0.5rem 1.25rem 1rem;
}

.about-panel-footer {
  padding: 0.75rem 1.25rem 1rem;
  display: flex;
  justify-content: center;
}

.nav-card {
  border: 1px solid #e5e7eb;
  background: #ffffff;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 120px;
  display: flex;
  align-items: center;
  border-radius: 0.75rem;
}

.nav-card-body {
  width: 100%;
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

@media (min-width: 600px) {
  .about-col-sm-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (min-width: 960px) {
  .about-col-md-8 {
    flex: 0 0 66.6667%;
    max-width: 66.6667%;
  }

  .about-col-md-4 {
    flex: 0 0 33.3333%;
    max-width: 33.3333%;
  }
}
</style>