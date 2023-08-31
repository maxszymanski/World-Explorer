import { useEffect, useState } from 'react'

const useFetchCountry = (search: string, key: string) => {
	const [countries, setCountries] = useState<[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState('')

	useEffect(
		function () {
			const controller = new AbortController()

			async function countriesFetch() {
				if (search.length < 3) {
					setCountries([])
					setError('')
					return
				}
				if (search === 'Search by Region') {
					setCountries([])
					return
				}
				setIsLoading(true)
				setError('')

				try {
					const res = await fetch(
						`https://restcountries.com/v3.1/${key}/${search}?fields=name,capital,flags,region,population`,
						{ signal: controller.signal }
					)
					if (!res.ok) throw new Error('Country not found...')

					const data = await res.json()
					setCountries(data)
				} catch (err) {
					if ((err as Error).name !== 'AbortError') setError((err as Error).message)
				} finally {
					setIsLoading(false)
				}
			}

			countriesFetch()

			return function () {
				controller.abort()
			}
		},
		[search, key]
	)
	return { countries, isLoading, error }
}
export default useFetchCountry