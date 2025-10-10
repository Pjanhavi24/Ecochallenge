import { config } from 'dotenv'
config({ path: '.env.local' })
import { supabase } from '../src/lib/supabaseClient'

async function seedRealSchools() {
  console.log('🏫 Seeding real schools database...')

  // Clear existing schools first
  const { error: deleteError } = await supabase
    .from('schools')
    .delete()
    .neq('id', 0) // Delete all rows

  if (deleteError) {
    console.error('Error clearing schools:', deleteError)
    return
  }
  console.log('🗑️ Cleared existing schools')

  const realSchools = [
    // Mumbai Schools
    {
      name: 'Dhirubhai Ambani International School',
      address: 'Bandra Kurla Complex, Bandra East',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
    },
    {
      name: 'Jamnabai Narsee School',
      address: 'Juhu Tara Road, Juhu',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
    },
    {
      name: 'Cathedral and John Connon School',
      address: '6, P.T. Marg, Fort',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
    },
    {
      name: 'Bombay Scottish School',
      address: 'Powai, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
    },
    {
      name: 'Ryan International School',
      address: 'Malad West',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
    },

    // Delhi Schools
    {
      name: 'Delhi Public School',
      address: 'Mathura Road, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
    },
    {
      name: 'Modern School',
      address: 'Barakhamba Road, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
    },
    {
      name: 'Springdales School',
      address: 'Pusa Road, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
    },
    {
      name: 'The Mother\'s International School',
      address: 'Sri Aurobindo Marg, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
    },
    {
      name: 'Vasant Valley School',
      address: 'Vasant Kunj, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
    },

    // Bangalore Schools
    {
      name: 'Bishop Cotton Boys\' School',
      address: 'Residency Road, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
    },
    {
      name: 'National Public School',
      address: 'Koramangala, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
    },
    {
      name: 'Inventure Academy',
      address: 'Whitefield, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
    },
    {
      name: 'The International School Bangalore',
      address: 'Nagavara, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
    },
    {
      name: 'Delhi Public School Bangalore',
      address: 'Electronic City, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
    },

    // Chennai Schools
    {
      name: 'The School KFI',
      address: 'Adyar, Chennai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
    },
    {
      name: 'PSBB Learning Leadership Academy',
      address: 'T. Nagar, Chennai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
    },
    {
      name: 'Chettinad Vidyashram',
      address: 'R.A. Puram, Chennai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
    },
    {
      name: 'Vidya Mandir Senior Secondary School',
      address: 'Mylapore, Chennai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
    },
    {
      name: 'DAV Senior Secondary School',
      address: 'Gopalapuram, Chennai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
    },

    // Hyderabad Schools
    {
      name: 'Hyderabad Public School',
      address: 'Begumpet, Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
    },
    {
      name: 'Oakridge International School',
      address: 'Gachibowli, Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
    },
    {
      name: 'Chirec International School',
      address: 'Kondapur, Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
    },
    {
      name: 'Delhi Public School Hyderabad',
      address: 'Nacharam, Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
    },
    {
      name: 'Meridian School',
      address: 'Madhapur, Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
    },

    // Pune Schools
    {
      name: 'The Bishop\'s School',
      address: 'Camp, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
    },
    {
      name: 'Vibgyor High School',
      address: 'Magarpatta City, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
    },
    {
      name: 'Delhi Public School Pune',
      address: 'Hinjewadi, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
    },
    {
      name: 'The Lexicon Schools',
      address: 'Kalyani Nagar, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
    },
    {
      name: 'Podar International School',
      address: 'Wakad, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
    },

    // Kolkata Schools
    {
      name: 'La Martiniere for Boys',
      address: '11, Loudon Street, Kolkata',
      city: 'Kolkata',
      state: 'West Bengal',
      country: 'India',
    },
    {
      name: 'South Point High School',
      address: 'Mandeville Gardens, Kolkata',
      city: 'Kolkata',
      state: 'West Bengal',
      country: 'India',
    },
    {
      name: 'Calcutta International School',
      address: 'Salt Lake, Kolkata',
      city: 'Kolkata',
      state: 'West Bengal',
      country: 'India',
    },
    {
      name: 'Delhi Public School Kolkata',
      address: 'New Town, Kolkata',
      city: 'Kolkata',
      state: 'West Bengal',
      country: 'India',
    },
    {
      name: 'The Heritage School',
      address: 'Salt Lake, Kolkata',
      city: 'Kolkata',
      state: 'West Bengal',
      country: 'India',
    },

    // Ahmedabad Schools
    {
      name: 'Ahmedabad International School',
      address: 'Bodakdev, Ahmedabad',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
    },
    {
      name: 'Delhi Public School Ahmedabad',
      address: 'Bopal, Ahmedabad',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
    },
    {
      name: 'Zydus School for Excellence',
      address: 'Sarkhej, Ahmedabad',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
    },
    {
      name: 'Udgam School for Children',
      address: 'Thaltej, Ahmedabad',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
    },
    {
      name: 'Eklavya School',
      address: 'Vastrapur, Ahmedabad',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
    },

    // Jaipur Schools
    {
      name: 'Maharani Gayatri Devi Girls\' School',
      address: 'Civil Lines, Jaipur',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
    },
    {
      name: 'Delhi Public School Jaipur',
      address: 'Vidyadhar Nagar, Jaipur',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
    },
    {
      name: 'Step by Step School',
      address: 'C-Scheme, Jaipur',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
    },
    {
      name: 'Neerja Modi School',
      address: 'C-Scheme, Jaipur',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
    },
    {
      name: 'The Palace School',
      address: 'Civil Lines, Jaipur',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
    },

    // Kochi Schools
    {
      name: 'Chinmaya Vidyalaya',
      address: 'Ernakulam, Kochi',
      city: 'Kochi',
      state: 'Kerala',
      country: 'India',
    },
    {
      name: 'Delhi Public School Kochi',
      address: 'Kakkanad, Kochi',
      city: 'Kochi',
      state: 'Kerala',
      country: 'India',
    },
    {
      name: 'The Choice School',
      address: 'Thripunithura, Kochi',
      city: 'Kochi',
      state: 'Kerala',
      country: 'India',
    },
    {
      name: 'Rajagiri Public School',
      address: 'Kakkanad, Kochi',
      city: 'Kochi',
      state: 'Kerala',
      country: 'India',
    },
    {
      name: 'Bhavans Vidya Mandir',
      address: 'Girinagar, Kochi',
      city: 'Kochi',
      state: 'Kerala',
      country: 'India',
    },

    // Chandigarh Schools
    {
      name: 'St. John\'s High School',
      address: 'Sector 26, Chandigarh',
      city: 'Chandigarh',
      state: 'Chandigarh',
      country: 'India',
    },
    {
      name: 'Delhi Public School Chandigarh',
      address: 'Sector 40, Chandigarh',
      city: 'Chandigarh',
      state: 'Chandigarh',
      country: 'India',
    },
    {
      name: 'Saupin\'s School',
      address: 'Sector 32, Chandigarh',
      city: 'Chandigarh',
      state: 'Chandigarh',
      country: 'India',
    },
    {
      name: 'Gurukul Global School',
      address: 'Sector 4, Chandigarh',
      city: 'Chandigarh',
      state: 'Chandigarh',
      country: 'India',
    },
    {
      name: 'St. Stephen\'s School',
      address: 'Sector 45, Chandigarh',
      city: 'Chandigarh',
      state: 'Chandigarh',
      country: 'India',
    },
  ]

  // Insert real schools
  const { data, error } = await supabase
    .from('schools')
    .insert(realSchools)
    .select()

  if (error) {
    console.error('Error inserting schools:', error)
    return
  }

  console.log(`✅ Created ${data?.length || 0} real schools`)

  // Group by city for summary
  const schoolsByCity = (data || []).reduce((acc, school) => {
    const city = school.city || 'Unknown'
    acc[city] = (acc[city] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  console.log('📊 Schools by city:')
  Object.entries(schoolsByCity).forEach(([city, count]) => {
    console.log(`   ${city}: ${count} schools`)
  })

  console.log('🎉 Real schools database seeded successfully!')
}

seedRealSchools()
  .catch((e) => {
    console.error('❌ Error seeding real schools:', e)
    process.exit(1)
  })
