const mockData = {
  totalOrder: 1245,
  totalUser: 80,
  totalProduct: 864,
  TestRuns: 128,
  ActiveTests: 32,
  RecentActive: [
    {
      id: 1,
      group: 'orders',
      description: 'order#12345 was created by user1',
    },
    {
      id: 2,
      group: 'users',
      description: 'new user Jason wang has registered',
    },
    {
      id: 3,
      group: 'products',
      description: 'product "mouse" was added',
    },
    {
      id: 4,
      group: 'test-center',
      description: 'test case "login test" was passed',
    },
  ],
  SystemNotifications: [
    {
      id: 1,
      group: 'test-center',
      notification: '2 test failed',
    },
    {
      id: 2,
      group: 'orders',
      notification: '3 order are pending',
    },
    {
      id: 3,
      group: 'users',
      notification: '1 user account inactive',
    },
  ],
  RecentOrders: [
    {
      orderId: '1',
      customer: 'John Doe',
      status: 'Processing',
      paymentStatus: 'Paid',
      amount: '$1234.00',
      date: 'May 12,2024 10:30 AM',
    },
    {
      orderId: '2',
      customer: 'Jane Smith',
      status: 'Shipped',
      paymentStatus: 'Paid',
      amount: '$12.00',
      date: 'May 12,2024 12:30 AM',
    },
  ],
}
