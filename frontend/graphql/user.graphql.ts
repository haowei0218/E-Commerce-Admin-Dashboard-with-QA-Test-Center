export const USER_LOGIN = /* GraphQL */`
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
export const ADMIN_USER_LOGOUT = /* GraphQL */`
  mutation AdminUserLogout {
    AdminUserLogout {
      success
      message
    }
  }
`
export const GET_ADMIN_USER_BY_PROPERTIES = /* GraphQL */`
query GetAdminUserByProperties($status: String, $roleId: Int, $keyword: String) {
  GetAdminUserByProperties(status: $status, role_id: $roleId, keyword: $keyword) {
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

export const CREATE_ADMIN_USER = /* GraphQL */`
mutation CreateAdminUser($name: String!, $status: String!, $email: String, $passwordHash: String, $roleId: Int) {
  CreateAdminUser(name: $name, status: $status, email: $email, password_hash: $passwordHash, role_id: $roleId) {
    userInfo {
      id
      name
      email
      role_id
      status
      create_at
    }
  }
}
`