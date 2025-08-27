<template>
  <v-app>
    <v-app-bar 
      color="grey-darken-3" 
      app 
      elevation="2"
    >
      <v-app-bar-nav-icon 
        variant="text" 
        @click.stop="drawer = !drawer"
        class="d-lg-none"
      />
      
      <v-toolbar-title class="text-h5 font-weight-bold ml-2">
        ACADEMIA
      </v-toolbar-title>

      <v-spacer />

      <!-- Desktop Navigation -->
      <template v-if="$vuetify.display.lgAndUp">
        <v-btn 
          variant="text" 
          prepend-icon="mdi-clipboard-check"
          @click="$router.push('/attendance')"
          class="mx-1"
        >
          Attendance
        </v-btn>
        
        <v-btn 
          variant="text" 
          prepend-icon="mdi-chart-line"
          @click="$router.push('/result')"
          class="mx-1"
        >
          Result
        </v-btn>
        
        <v-btn 
          variant="text" 
          prepend-icon="mdi-book-open-variant"
          @click="$router.push('/course')"
          class="mx-1"
        >
          Course Management
        </v-btn>

        <v-divider vertical class="mx-3" />
        
        <v-btn 
          variant="outlined" 
          prepend-icon="mdi-login"
          @click="$router.push('/login')"
          class="mx-1"
        >
          Login
        </v-btn>
        
        <v-btn 
          variant="tonal" 
          prepend-icon="mdi-logout"
          @click="$router.push('/logout')"
          class="mx-1"
        >
          Logout
        </v-btn>
      </template>

      <!-- Mobile menu button -->
      <v-btn 
        icon="mdi-dots-vertical" 
        variant="text"
        class="d-lg-none"
      />
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :location="$vuetify.display.mobile ? 'bottom' : undefined"
      temporary
      width="280"
    >
      <v-list nav density="comfortable">
        <v-list-item
          prepend-icon="mdi-clipboard-check"
          title="Attendance"
          @click="navigateAndClose('/attendance')"
        />
        <v-list-item
          prepend-icon="mdi-chart-line"
          title="Result"
          @click="navigateAndClose('/result')"
        />
        <v-list-item
          prepend-icon="mdi-book-open-variant"
          title="Course Management"
          @click="navigateAndClose('/course')"
        />
        
        <v-divider class="my-2" />
        
        <v-list-item
          prepend-icon="mdi-login"
          title="Login"
          @click="navigateAndClose('/login')"
        />
        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          @click="navigateAndClose('/logout')"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(false)

const navigateAndClose = (route) => {
  // Navigate to route (assuming router is available)
  // $router.push(route)
  drawer.value = false
}
</script>