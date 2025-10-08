import { useState, useEffect } from 'react'

export interface School {
  id: number
  name: string
  address?: string
  city?: string
  state?: string
  country: string
  created_at: string
  updated_at: string
}

export interface SchoolsResponse {
  schools: School[]
  total: number
  filters: {
    city?: string
    state?: string
    search?: string
    limit?: number
  }
}

export interface City {
  city: string
  state: string
}

export function useSchools(options?: {
  city?: string
  state?: string
  search?: string
  limit?: number
}) {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (options?.city) params.append('city', options.city)
        if (options?.state) params.append('state', options.state)
        if (options?.search) params.append('search', options.search)
        if (options?.limit) params.append('limit', options.limit.toString())

        const response = await fetch(`/api/schools?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch schools')
        }

        const data: SchoolsResponse = await response.json()
        setSchools(data.schools)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchSchools()
  }, [options?.city, options?.state, options?.search, options?.limit])

  return { schools, loading, error }
}

export function useCities() {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/schools/cities')
        
        if (!response.ok) {
          throw new Error('Failed to fetch cities')
        }

        const data = await response.json()
        setCities(data.cities)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchCities()
  }, [])

  return { cities, loading, error }
}

export function useStates() {
  const [states, setStates] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/schools/states')
        
        if (!response.ok) {
          throw new Error('Failed to fetch states')
        }

        const data = await response.json()
        setStates(data.states)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchStates()
  }, [])

  return { states, loading, error }
}





