
import type { Issue, User } from './types';

// This file now acts as a mock database.
// The API routes will use these arrays as their data source.

let users: User[] = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@civic.gov',
    role: 'Super Admin',
    avatarUrl: 'https://i.pravatar.cc/150?u=admin@civic.gov',
  },
  {
    id: 'user-2',
    name: 'Sanitation Head',
    email: 'sanitation.head@civic.gov',
    role: 'Department Head',
    avatarUrl: 'https://i.pravatar.cc/150?u=sanitation.head@civic.gov',
    department: 'Sanitation Dept.'
  },
  {
    id: 'user-3',
    name: 'PWD Staff',
    email: 'pwd.staff@civic.gov',
    role: 'Staff',
    avatarUrl: 'https://i.pravatar.cc/150?u=pwd.staff@civic.gov',
    department: 'Public Works Dept.'
  },
];

let issues: Issue[] = [
  {
    id: 'CIV-001',
    category: 'Pothole',
    description: 'Large pothole at the entrance of the main market, causing traffic issues.',
    location: { address: 'Sitabuldi Main Rd, Nagpur', lat: 21.1463, lng: 79.0822 },
    status: 'Pending',
    priority: 'High',
    reportedAt: '2024-07-20T09:00:00Z',
    citizen: { name: 'John Doe', contact: 'john.d@email.com' },
    imageUrl: 'https://picsum.photos/seed/pothole1/800/600',
    imageHint: 'pothole road',
  },
  {
    id: 'CIV-002',
    category: 'Garbage',
    description: 'Garbage bin overflowing for three days near the park.',
    location: { address: 'Dharampeth, Nagpur', lat: 21.1434, lng: 79.0622 },
    status: 'Assigned',
    priority: 'Medium',
    reportedAt: '2024-07-19T14:30:00Z',
    assignedTo: 'Sanitation Dept.',
    citizen: { name: 'Jane Smith', contact: 'jane.s@email.com' },
    imageUrl: 'https://picsum.photos/seed/garbage1/800/600',
    imageHint: 'garbage overflow',
  },
  {
    id: 'CIV-003',
    category: 'Water Leakage',
    description: 'Clean water pipe leakage on the sidewalk.',
    location: { address: 'Koregaon Park, Pune', lat: 18.5362, lng: 73.8939 },
    status: 'Resolved',
    priority: 'High',
    reportedAt: '2024-07-18T11:00:00Z',
    resolvedAt: '2024-07-19T17:00:00Z',
    assignedTo: 'Water Dept.',
    citizen: { name: 'Sam Wilson', contact: 'sam.w@email.com' },
    imageUrl: 'https://picsum.photos/seed/water1/800/600',
    imageHint: 'water leak',
    proofUrl: 'https://picsum.photos/seed/proof1/800/600',
    proofHint: 'pipe repaired',
  },
  {
    id: 'CIV-004',
    category: 'Streetlight Outage',
    description: 'Streetlight not working for a week, causing safety concerns at night.',
    location: { address: 'Bandra West, Mumbai', lat: 19.0544, lng: 72.8400 },
    status: 'Approved',
    priority: 'Medium',
    reportedAt: '2024-07-21T08:00:00Z',
    citizen: { name: 'Emily Carter', contact: 'emily.c@email.com' },
    imageUrl: 'https://picsum.photos/seed/light1/800/600',
    imageHint: 'street light',
  },
    {
    id: 'CIV-005',
    category: 'Pothole',
    description: 'Multiple small potholes on the highway exit ramp.',
    location: { address: 'Mumbai-Pune Expressway, Navi Mumbai', lat: 19.0330, lng: 73.0297 },
    status: 'Pending',
    priority: 'Medium',
    reportedAt: '2024-07-22T10:15:00Z',
    citizen: { name: 'Michael Brown', contact: 'michael.b@email.com' },
    imageUrl: 'https://picsum.photos/seed/pothole2/800/600',
    imageHint: 'pothole highway',
  },
  {
    id: 'CIV-006',
    category: 'Garbage',
    description: 'Construction debris dumped illegally by the river bank.',
    location: { address: 'Ramdaspeth, Nagpur', lat: 21.1352, lng: 79.0645 },
    status: 'Assigned',
    priority: 'High',
    reportedAt: '2024-07-21T18:45:00Z',
    assignedTo: 'Sanitation Dept.',
    citizen: { name: 'Jessica White', contact: 'jessica.w@email.com' },
    imageUrl: 'https://picsum.photos/seed/garbage2/800/600',
    imageHint: 'debris dumped',
  },
];

// Functions to interact with the mock database
export const _getIssues = () => issues;

export const _getUsers = () => users;
