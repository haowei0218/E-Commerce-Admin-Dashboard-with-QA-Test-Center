import { APIPayload } from '@/type/api.payload.type'
import { Response } from '@/type/api.response.type'
import { DocumentNode } from 'graphql'

export async function fetchAPI<T extends keyof APIPayload>(
  apiUrl: string,
  queryString: string,
  variables: APIPayload[T]
): Promise<Response[T]> {
  if (!apiUrl) {
    throw new Error('API URL IS NOt DEFINED')
  }

  const result = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
