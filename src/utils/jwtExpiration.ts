import { jwtDecode } from 'jwt-decode'

export function tokenIsValid() {
  const token = localStorage.getItem('access_token')
  if (token) {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000
    if (decoded.exp) {
      return !(decoded.exp < currentTime)
    }
  }
  return false
}