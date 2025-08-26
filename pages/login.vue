<!-- pages/login.vue -->
<template>
  <v-container fluid class="fill-height pa-0">
    <v-row no-gutters class="fill-height">
      <!-- Right Side - Login Form -->
      <v-col cols="12" md="5">
        <div
          class="d-flex flex-column justify-center align-center fill-height pa-8"
          style="min-height: 100vh"
        >
          <v-card class="w-100 pa-8 elevation-8" max-width="480" rounded="xl">
            <!-- Header -->
            <div class="text-center mb-8">
              <h2 class="text-h4 font-weight-bold text-primary mb-2">Login</h2>
              <p class="text-body-1 text-grey-darken-1">
                Enter your credentials to continue
              </p>
            </div>

            <v-form ref="form" v-model="valid" @submit.prevent="handleLogin">
              <!-- Name Field -->
              <v-text-field
                v-model="formData.name"
                label="Full Name"
                :rules="nameRules"
                variant="outlined"
                prepend-inner-icon="mdi-account"
                class="mb-4"
                color="primary"
                required
                clearable
              />

              <!-- Email Field -->
              <v-text-field
                v-model="formData.email"
                label="Email Address"
                :rules="emailRules"
                variant="outlined"
                prepend-inner-icon="mdi-email"
                type="email"
                class="mb-4"
                color="primary"
                required
                clearable
              />

              <!-- Password Field -->
              <v-text-field
                v-model="formData.password"
                label="Password"
                :rules="passwordRules"
                variant="outlined"
                prepend-inner-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                class="mb-4"
                color="primary"
                required
                clearable
              />

              <!-- Role Selection -->
              <v-select
                v-model="formData.role"
                label="Select Your Role"
                :items="roleItems"
                :rules="roleRules"
                variant="outlined"
                prepend-inner-icon="mdi-account-group"
                class="mb-6"
                color="primary"
                required
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :prepend-icon="getRoleIcon(item.raw.value)"
                    :title="item.raw.title"
                  />
                </template>
              </v-select>

              <!-- Submit Button -->
              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                class="mb-4 text-none font-weight-bold"
                :loading="loading"
                :disabled="!valid"
                elevation="2"
                rounded="lg"
              >
                <v-icon start>mdi-login</v-icon>
                Sign In
              </v-btn>

              <!-- Additional Info -->
              <div class="text-center mt-4">
                <v-chip size="small" color="success" variant="outlined">
                  <v-icon start size="16">mdi-shield-check</v-icon>
                  Secure Login
                </v-chip>
              </div>
            </v-form>
          </v-card>

          <!-- Alert -->
          <v-alert
            v-if="alert.show"
            :type="alert.type"
            :text="alert.message"
            class="mt-4 w-100"
            max-width="480"
            closable
            @click:close="alert.show = false"
            elevation="2"
            rounded="lg"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive } from "vue";

// Page meta
definePageMeta({
  title: "Login",
  layout: false,
});

// Reactive data
const form = ref(null);
const valid = ref(false);
const loading = ref(false);
const showPassword = ref(false);

const formData = reactive({
  name: "",
  email: "",
  password: "",
  role: "",
});

const alert = reactive({
  show: false,
  type: "success",
  message: "",
});

// Role options
const roleItems = [
  { title: "🎓 Student", value: "Student" },
  { title: "👨‍🏫 Teacher", value: "Teacher" },
  { title: "👨‍💼 Admin", value: "Admin" },
  { title: "🛡️ Security Guard", value: "Security Guard" },
];

// Get role icon
const getRoleIcon = (role) => {
  const icons = {
    Student: "mdi-school",
    Teacher: "mdi-account-tie",
    Admin: "mdi-shield-crown",
    "Security Guard": "mdi-security",
  };
  return icons[role] || "mdi-account";
};

// Validation rules
const nameRules = [
  (v) => !!v || "Name is required",
  (v) => (v && v.length >= 2) || "Name must be at least 2 characters",
];

const emailRules = [
  (v) => !!v || "Email is required",
  (v) => /.+@.+\..+/.test(v) || "Enter a valid email address",
];

const passwordRules = [
  (v) => !!v || "Password is required",
  (v) => (v && v.length >= 6) || "Password must be at least 6 characters",
];

const roleRules = [(v) => !!v || "Please select your role"];

// Show alert
const showAlert = (type, message) => {
  alert.type = type;
  alert.message = message;
  alert.show = true;
};

// Handle login
const handleLogin = async () => {
  if (!valid.value) return;

  loading.value = true;

  try {
    // Call the API endpoint
    const data = await $fetch('/api/login', {
      method: 'POST',
      body: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        loginTime: new Date().toISOString(),
      }
    });

    // Store user data in localStorage
    localStorage.setItem('userId', data.user.id);

    // Show success message
    showAlert("success", `Welcome ${formData.name}! Login data saved successfully.`);
    navigateTo("/");

    // Reset form after success
    setTimeout(() => {
      form.value?.reset();
      Object.assign(formData, {
        name: "",
        email: "",
        password: "",
        role: "",
      });
    }, 2000);
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.statusCode === 400) {
      showAlert("error", error.statusMessage || "Please fill in all required fields.");
    } else if (error.statusCode === 500) {
      showAlert("error", "Server error occurred. Please try again later.");
    } else {
      showAlert("error", "Login failed. Please try again.");
    }
  } finally {
    loading.value = false;
  }
};

</script>