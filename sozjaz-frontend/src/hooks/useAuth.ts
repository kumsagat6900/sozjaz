'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

type JwtPayload = {
  sub: string
  role: 'STUDENT' | 'TEACHER'
  exp: number
}

export function useAuth() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<'STUDENT' | 'TEACHER' | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) {
      router.push('/login')
      return
    }

    try {
      const decoded = jwtDecode<JwtPayload>(storedToken)
      if (decoded.exp * 1000 < Date.now()) {
        router.push('/login')
        return
      }

      setToken(storedToken)
      setRole(decoded.role)
    } catch (err) {
      router.push('/login')
    } finally {
      setLoaded(true)
    }
  }, [router])

  return { loaded, token, role }
}
