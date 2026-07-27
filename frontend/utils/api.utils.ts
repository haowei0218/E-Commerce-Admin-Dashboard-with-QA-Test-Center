import { APIPayload } from '@/type/api.payload.type'
import { Response } from '@/type/api.response.type'
import { DocumentNode } from 'graphql'

export async function fetchAPI<T extends keyof APIPayload>(
  apiUrl: string,
  queryString: string,
  variables?: APIPayload[T] | null
): Promise<Response[T]> {
  if (!apiUrl) {
    throw new Error('API URL IS NOt DEFINED')
  }
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const result = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      query: queryString,
      variables: variables,
    }),
  })
  if (!result.ok) {
    throw new Error(result.statusText)
  }

  const json = await result.json()

  if (json.errors) {
    throw new Error(json.errors[0].message)
  }
  return json.data
}
