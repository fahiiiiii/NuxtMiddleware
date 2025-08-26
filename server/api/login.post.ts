// server/api/login.post.ts
import { promises as fs } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    const body = await readBody(event)
    
    // Validate required fields
    const { name, email, password, role, loginTime } = body
    
    if (!name || !email || !password || !role) {
      throw createError({
        statusCode: 400,
        statusMessage: 'All fields (name, email, password, role) are required'
      })
    }

    // Additional validation
    if (name.trim().length < 2) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name must be at least 2 characters long'
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Please provide a valid email address'
      })
    }

    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 6 characters long'
      })
    }

    const validRoles = ['Student', 'Teacher', 'Admin', 'Security Guard']
    if (!validRoles.includes(role)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid role selected'
      })
    }

    // Define the path to the JSON file
    const dataDir = join(process.cwd(), 'data')
    const filePath = join(dataDir, 'users.json')
    
    // Ensure the data directory exists
    try {
      await fs.mkdir(dataDir, { recursive: true })
    } catch (error) {
      console.log('Data directory already exists or creation failed:', error)
    }

    let users: any[] = []
    
    // Try to read existing data
    try {
      const existingData = await fs.readFile(filePath, 'utf8')
      users = JSON.parse(existingData)
      
      // Ensure users is an array
      if (!Array.isArray(users)) {
        users = []
      }
    } catch (error) {
      // File doesn't exist or is corrupted, start with empty array
      console.log('Creating new users file...')
      users = []
    }

    // Check if user with same email already exists (optional)
    const existingUser = users.find(user => user.email.toLowerCase() === email.trim().toLowerCase())
    if (existingUser) {
      console.log(`User with email ${email} logged in again at ${new Date().toISOString()}`)
    }

    // Create new user object
    const newUser = {
      id: Date.now() + Math.random(), // More unique ID generation
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password, // In production, you should hash passwords using bcrypt or similar
      role,
      loginTime: loginTime || new Date().toISOString(),
      createdAt: new Date().toISOString()
    }

    // Add new user to the array
    users.push(newUser)

    // Save updated data back to file with proper formatting
    await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8')

    console.log(`New login recorded for ${newUser.name} (${newUser.email}) as ${newUser.role}`)

    // Return success response (don't send back password)
    return {
      success: true,
      message: 'User login data saved successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        loginTime: newUser.loginTime
      },
      totalUsers: users.length
    }

  } catch (error: any) {
    console.error('Error saving user data:', error)
    
    // If it's already a createError, rethrow it
    if (error.statusCode) {
      throw error
    }
    
    // For any other unexpected errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error - Unable to save user data'
    })
  }
})