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
      <v-card v-if="showDebug" class="mt-4" variant="outlined">
        <v-card-title>Debug Info</v-card-title>
        <v-card-text>
          <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
        </v-card-text>
      </v-card>
      
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

// Cookie management functions
const setUserCookie = (userData) => {
  const cookie = useCookie('user-session', {
    default: () => ({}),
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })
  
  cookie.value = {
    email: userData.email,
    roles: userData.roles,
    loginTime: new Date().toISOString(),
    isAuthenticated: true
  }
}

const setRoleCookie = (roles) => {
  const roleCookie = useCookie('user-roles', {
    default: () => ({}),
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })
  
  roleCookie.value = roles
}

// Get selected role for easier access
const getSelectedRole = () => {
  return Object.keys(formData.roles).find(role => formData.roles[role]) || 'student'
}

// Login handler
const handleLogin = async () => {
  try {
    isLoading.value = true
    
    // Validate form
    if (!formData.email || !formData.password) {
      throw new Error('Please fill in all required fields')
    }
    
    // Check if at least one role is selected
    const hasSelectedRole = Object.values(formData.roles).some(selected => selected)
    if (!hasSelectedRole) {
      throw new Error('Please select at least one role')
    }
    
    // Here you would typically make an API call to authenticate
    // For now, we'll simulate a successful login
    const loginData = {
      email: formData.email,
      roles: formData.roles,
      selectedRole: getSelectedRole()
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Store in cookies
    setUserCookie(loginData)
    setRoleCookie(formData.roles)
    
    // Additional tracking cookie for analytics
    const trackingCookie = useCookie('user-tracking', {
      default: () => ({}),
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })
    
    trackingCookie.value = {
      userId: generateUserId(formData.email),
      lastLogin: new Date().toISOString(),
      loginCount: (trackingCookie.value.loginCount || 0) + 1,
      primaryRole: getSelectedRole()
    }
    
    // Show success message (you can use a toast library here)
    console.log('Login successful!', loginData)
    
    // Redirect based on selected role
    await navigateBasedOnRole(getSelectedRole())
    
  } catch (error) {
    console.error('Login failed:', error.message)
    // Handle error (show toast, etc.)
  } finally {
    isLoading.value = false
  }
}

// Generate a simple user ID based on email
const generateUserId = (email) => {
  return btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 12)
}

// Navigate based on selected role
const navigateBasedOnRole = async (role) => {
  const roleRoutes = {
    admin: '/',
    teacher: '/',
    student: '/',
    securityGuard: '/'
  }
  
  const route = roleRoutes[role] || '/'
  await navigateTo(route)
}

// Function to retrieve user data from cookies (utility function)
const getUserFromCookies = () => {
  const userCookie = useCookie('user-session')
  const roleCookie = useCookie('user-roles')
  const trackingCookie = useCookie('user-tracking')
  
  return {
    user: userCookie.value,
    roles: roleCookie.value,
    tracking: trackingCookie.value
  }
}

// Function to clear all cookies (for logout)
const clearUserCookies = () => {
  const userCookie = useCookie('user-session')
  const roleCookie = useCookie('user-roles')
  const trackingCookie = useCookie('user-tracking')
  
  userCookie.value = null
  roleCookie.value = null
  trackingCookie.value = null
}

// Expose utility functions globally if needed
provide('userUtils', {
  getUserFromCookies,
  clearUserCookies,
  getSelectedRole
})
</script>