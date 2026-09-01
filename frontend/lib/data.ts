export const Roles = [
  { value: "6", optionName: '工程師' },
  { value: "5", optionName: '測試人員' },
  { value: "4", optionName: '唯讀帳號' },
  { value: "3", optionName: '客服/營運人員' },
  { value: "2", optionName: '營運主管' },
  { value: "1", optionName: '管理員' },
  { value: "All", optionName: 'All' },
]

export const Status = [
  {
    value: 'Active',
    optionName: 'Active',
  },
  {
    value: 'Inactive',
    optionName: 'Inactive',
  },
  {
    value: 'All',
    optionName: 'All',
  },
]

export const orderStatusList = [
  {
    value: 'pending',
    optionName: '待處理'
  },
  {
    value: 'processing',
    optionName: '訂單處理中'
  },
  {
    value: 'completed',
    optionName: '訂單完成'
  },
  {
    value: 'cancelled',
    optionName: '訂單取消'
  }
]

export const paymentStatusList = [
  {
    value:'unpaid',
    optionName:'未付款'
  },
  {
    value:'paid',
    optionName:'已付款'
  },
  {
    value:'failed',
    optionName:'付款失敗'
  },
  {
    value:'refunded',
    optionName:'已退款'
  },
]

export const Headers = [
  {
    headerName: 'User ID',
    style: "w-80"
  },
  {
    headerName: 'Name',
    style: "w-45"
  },
  {
    headerName: 'Email',
    style: "w-60"
  },
  {
    headerName: 'Role',
    style: "w-40"
  },
  {
    headerName: 'Status',
    style: "w-30"
  },
  {
    headerName: 'Created At',
    style: "w-50"
  },
  {
    headerName: 'Updated At',
    style: "w-50"
  },
  {
    headerName: 'Last Login At',
    style: "w-40"
  },
  {
    headerName: 'Actions',
    style: "w-10"
  }
]

