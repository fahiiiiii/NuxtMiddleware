<!-- pages/login.vue -->
<template>
  <div>
    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>
      <v-text-field
        v-model="formData.email"
        density="compact"
        placeholder="Email address"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        :rules="emailRules"
      ></v-text-field>
      
      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Password
        <a
          class="text-caption text-decoration-none text-blue"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          Forgot login password?
        </a>
      </div>
      
      <v-text-field
        v-model="formData.password"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        :rules="passwordRules"
        @click:append-inner="visible = !visible"
      ></v-text-field>
      
      <!-- Pass selectedRoles as prop and listen for updates -->
      <LoginCheckbox 
        :selected-roles="formData.roles"
        @update:selected-roles="handleRoleUpdate"
      />
      
      <v-card
        class="mb-12"
        color="surface-variant"
        variant="tonal"
      >
        <v-card-text class="text-medium-emphasis text-caption">
          Warning: After 3 consecutive failed login attempts, your account will be temporarily locked for three hours. If you must login now, you can also click "Forgot login password?" below to reset the login password.
        </v-card-text>
      </v-card>
      
      <v-btn
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        block
        :loading="isLoading"
        @click="handleLogin"
      >
        Log In
      </v-btn>
      
      <!-- Debug info (remove in production) -->
      <!-- <v-card v-if="showDebug" class="mt-4" variant="outlined">
        <v-card-title>Debug Info</v-card-title>
        <v-card-text>
          <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
        </v-card-text>
      </v-card> -->
      
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Form data structure
const formData = reactive({
  email: '',
  password: '',
  roles: {
    admin: false,
    student: true, // default selection
    teacher: false,
    securityGuard: false
  }
})

// UI state
const visible = ref(false)
const isLoading = ref(false)
const showDebug = ref(process.dev) // Only show in development

// Validation rules
const emailRules = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 6 || 'Password must be at least 6 characters'
]

// Handle role updates from LoginCheckbox component
const handleRoleUpdate = (updatedRoles) => {
  formData.roles = updatedRoles
}

// Login handler - simply save formData to cookies
const handleLogin = async () => {
  try {
    isLoading.value = true
    
    // Basic validation
    if (!formData.email || !formData.password) {
      throw new Error('Please fill in all required fields')
    }
    
    // Check if at least one role is selected
    const hasSelectedRole = Object.values(formData.roles).some(selected => selected)
    if (!hasSelectedRole) {
      throw new Error('Please select at least one role')
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simply save the entire formData to cookies
    const userCookie = useCookie('userData', {
      default: () => ({}),
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    userCookie.value = formData
    
    console.log('Login successful! FormData saved to cookies:', formData)
    
    // Redirect to dashboard
    await navigateTo('/')
    
  } catch (error) {
    console.error('Login failed:', error.message)
  } finally {
    isLoading.value = false
  }
}
</script>