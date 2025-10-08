'use client'

import { useState, useEffect } from 'react'
import { useSchools, useCities, useStates } from '@/hooks/use-schools'

export default function TestSchoolsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const { schools, loading, error } = useSchools({
    search: searchTerm || undefined,
    state: selectedState || undefined,
    city: selectedCity || undefined,
    limit: 10,
  })

  const { states, loading: statesLoading } = useStates()
  const { cities, loading: citiesLoading } = useCities()

  const filteredCities = selectedState 
    ? cities.filter(city => city.state === selectedState)
    : cities

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Test Schools API</h1>
      
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search schools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value)
            setSelectedCity('')
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg"
          disabled={statesLoading}
        >
          <option value="">All States</option>
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
          disabled={citiesLoading || !selectedState}
        >
          <option value="">All Cities</option>
          {filteredCities.map(city => (
            <option key={`${city.city}-${city.state}`} value={city.city}>
              {city.city}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {loading && <p>Loading schools...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        
        {!loading && !error && (
          <>
            <p className="text-gray-600">
              Found {schools.length} schools
              {searchTerm && ` matching "${searchTerm}"`}
              {selectedState && ` in ${selectedState}`}
              {selectedCity && `, ${selectedCity}`}
            </p>
            
            {schools.map((school) => (
              <div key={school.id} className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-lg">{school.name}</h3>
                <p className="text-gray-600">
                  {school.city && school.state 
                    ? `${school.city}, ${school.state}`
                    : school.address || 'Address not available'
                  }
                </p>
                {school.address && school.city && school.state && (
                  <p className="text-sm text-gray-500">{school.address}</p>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <p>States: {states.length} loaded</p>
        <p>Cities: {cities.length} loaded</p>
        <p>Schools: {schools.length} loaded</p>
        <p>Search: "{searchTerm}"</p>
        <p>State: "{selectedState}"</p>
        <p>City: "{selectedCity}"</p>
      </div>
    </div>
  )
}





