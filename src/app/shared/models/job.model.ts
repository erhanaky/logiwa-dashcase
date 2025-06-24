export interface Job {
  id: string;
  sku: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  assignedUser: string;
  createdDate: string;
}