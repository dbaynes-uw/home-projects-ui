<script setup>
import { useAuth } from '@/composables/useAuth'

const { logout, userName } = useAuth()
</script>

<template>
  <div class="pending-container">
    <div class="pending-card">
      <div class="icon">⏳</div>
      <h1>Account Pending Approval</h1>
      <p>
        Hi <strong>{{ userName }}</strong>, your account has been created successfully
        but is waiting for an administrator to grant access.
      </p>
      <p class="sub">You'll be able to log in and use the app once an admin approves your account.</p>
      <button class="btn-logout" @click="logout">Sign out</button>
    </div>
  </div>
</template>

<style scoped>
.pending-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.pending-card {
  background: white;
  padding: 48px 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 440px;
  text-align: center;
}

.icon {
  font-size: 56px;
  margin-bottom: 16px;
}

h1 {
  margin: 0 0 20px;
  color: #333;
  font-size: 1.5rem;
}

p {
  color: #555;
  line-height: 1.6;
  margin-bottom: 12px;
}

.sub {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 28px;
}

.btn-logout {
  padding: 10px 28px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-logout:hover {
  background: #5568d3;
}
</style>
