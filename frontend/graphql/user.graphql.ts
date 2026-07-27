export const USER_LOGIN = `
  query UserLogin($account: String, $password: String) {
    UserLogin(account: $account, password: $password) {
      userProfile {
        id
        name
        email
        role_id
        status
      }
      token
    }
  }
`

export const GET_USERS = /* GraphQL */ `
  query GetAdminUsers {
    GetAdminUsers {
      getUsers {
        id
        name
        email
        code
        status
        create_at
      }
    }
  }
`
