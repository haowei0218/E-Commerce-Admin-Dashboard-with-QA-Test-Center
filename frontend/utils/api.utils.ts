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

  const response = await fetch(apiUrl, {
    method: 'POST',
    // 讓瀏覽器自動攜帶 HttpOnly Cookie
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: queryString,
      variables: variables ?? null,
    }),
  })
  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const result = await response.json()

  if (result.errors) {
    throw new Error(result.errors[0].message)
  }
  return result.data
}
