import bcrypt from "bcryptjs"

// Mock user database - replace with your actual database
const users = [
  {
    id: "1",
    email: "user@example.com",
    password: "$2a$10$rOzJqZxnTkGKs8bZqXqoUeX8VqF4nF4nF4nF4nF4nF4nF4nF4nF4n", // "password123"
    name: "John Doe",
  },
]

export interface User {
  id: string
  email: string
  name: string
}

export async function verifyCredentials(email: string, password: string): Promise<User | null> {
  // In a real app, query your database here
  const user = users.find((u) => u.email === email)

  if (!user) {
    return null
  }

  const isValidPassword = await bcrypt.compare(password, user.password)

  if (!isValidPassword) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}
