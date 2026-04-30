import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  let content = null

  if (selectedCountry) {
    content = (
      <div>
        <h2>{selectedCountry.name.common}</h2>
        <p>Capital: {selectedCountry.capital}</p>
        <p>Area: {selectedCountry.area}</p>

        <h3>Languages:</h3>
        <ul>
          {Object.values(selectedCountry.languages).map(lang => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>

        <img src={selectedCountry.flags.png} alt="flag" width="150" />

        <button onClick={() => setSelectedCountry(null)}>
          back
        </button>
      </div>
    )
  } else if (search === '') {
    content = null
  } else if (filteredCountries.length > 10) {
    content = <p>Too many matches, specify another filter.</p>
  } else if (filteredCountries.length > 1) {
    content = (
      <ul>
        {filteredCountries.map(country => (
          <li key={country.cca3}>
            {country.name.common}
            <button onClick={() => setSelectedCountry(country)}>
              show
            </button>
          </li>
        ))}
      </ul>
    )
  } else if (filteredCountries.length === 1) {
    const country = filteredCountries[0]

    content = (
      <div>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>

        <h3>Languages:</h3>
        <ul>
          {Object.values(country.languages).map(lang => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>

        <img src={country.flags.png} alt="flag" width="150" />

        <button onClick={() => setSelectedCountry(null)}>
          back
        </button>
      </div>
    )
  } else {
    content = <p>No matches found</p>
  }

  return (
    <div>
      <h2>Country Search</h2>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {content}
    </div>
  )
}

export default App