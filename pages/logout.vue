<!-- pages/logout.vue -->
<template>
  <div class="d-flex justify-center align-center" style="height: 100vh;">
    <v-card class="pa-8 text-center" max-width="400">
      <v-icon size="64" color="blue" class="mb-4">mdi-logout</v-icon>
      <h2 class="mb-4">Logged Out Successfully</h2>
      <p class="text-medium-emphasis mb-4">You have been logged out of your account.</p>
      <v-btn color="blue" variant="tonal" @click="$router.push('/login')">
        Login Again
      </v-btn>
    </v-card>
  </div>
</template>

<script setup>
// Clear all cookies on component mount
const userCookie = useCookie('userData')

userCookie.value = null

</script>