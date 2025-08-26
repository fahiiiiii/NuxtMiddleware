// middlewares/admin.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Handle server-side rendering
  if (process.server) {
    // On server side, we can't access localStorage, so redirect to login
    // The client-side will handle the actual admin check
    return
  }

  try {
    // Get user ID from localStorage
    const userId = localStorage.getItem('userId')
    
    if (!userId) {
      console.log('No userId found, redirecting to login')
      return navigateTo('/login')
    }

    console.log('Checking admin access for userId:', userId)

    // Get user data from API
    const data: any = await $fetch('/api/get-user', {
      method: 'POST',
      body: { userId: parseFloat(userId) }
    })
    
    if (!data.success) {
      console.log('API call failed, redirecting to login')
      return navigateTo('/login')
    }
    
    const user = data.user
    console.log('User data:', { name: user.name, role: user.role })
    
    // Check if user role is Admin
    if (user.role !== 'Admin') {
      console.log('Access denied - user is not admin')
      
      // Use throw createError instead of throw showError
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied. Admin privileges required.',
        fatal: true
      })
    }
    
    console.log(`Admin access granted for: ${user.name} (${user.email})`)
    
  } catch (error: any) {
    console.error('Error verifying admin access:', error)
    
    // If it's a 403 error, re-throw it to show the error page
    if (error.statusCode === 403) {
      throw error
    }
    
    // For any other error, redirect to login
    console.log('Unexpected error, redirecting to login')
    return navigateTo('/login')
  }
})