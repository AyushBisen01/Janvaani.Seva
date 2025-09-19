
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
    location: { address: '123 Market St, Pune', lat: 18.5204, lng: 73.8567 },
    status: 'Pending',
    priority: 'High',
    reportedAt: '2024-07-20T09:00:00Z',
    citizen: { name: 'John Doe', contact: 'john.d@email.com' },
    imageUrl: 'https://picsum.photos/seed/pothole1/800/600',
    imageHint: 'pothole road'
  },
  {
    id: 'CIV-002',
    category: 'Garbage',
    description: 'Garbage bin overflowing for three days near the park.',
    location: { address: '456 Park Ave, Mumbai', lat: 19.0760, lng: 72.8777 },
    status: 'Assigned',
    priority: 'Medium',
    reportedAt: '2024-07-19T14:30:00Z',
    assignedTo: 'Sanitation Dept.',
    citizen: { name: 'Jane Smith', contact: 'jane.s@email.com' },
    imageUrl: 'https://picsum.photos/seed/garbage1/800/600',
    imageHint: 'garbage overflow'
  },
  {
    id: 'CIV-003',
    category: 'Water Leakage',
    description: 'Clean water pipe leakage on the sidewalk.',
    location: { address: '789 Water Way, Nagpur', lat: 21.1458, lng: 79.0882 },
    status: 'Resolved',
    priority: 'High',
    reportedAt: '2024-07-18T11:00:00Z',
    resolvedAt: '2024-07-19T17:00:00Z',
    assignedTo: 'Water Dept.',
    citizen: { name: 'Sam Wilson', contact: 'sam.w@email.com' },
    imageUrl: 'https://picsum.photos/seed/water1/800/600',
    imageHint: 'water leak',
    proofUrl: 'https://picsum.photos/seed/proof1/800/600',
    proofHint: 'pipe repaired'
  },
  {
    id: 'CIV-004',
    category: 'Streetlight Outage',
    description: 'Streetlight not working for a week, causing safety concerns at night.',
    location: { address: '101 Lantern Ln, Nashik', lat: 20.0112, lng: 73.7909 },
    status: 'Approved',
    priority: 'Medium',
    reportedAt: '2024-07-21T08:00:00Z',
    citizen: { name: 'Emily Carter', contact: 'emily.c@email.com' },
    imageUrl: 'https://picsum.photos/seed/light1/800/600',
    imageHint: 'street light'
  },
    {
    id: 'CIV-005',
    category: 'Pothole',
    description: 'Multiple small potholes on the highway exit ramp.',
    location: { address: '234 Highway Exit, Thane', lat: 19.2183, lng: 72.9781 },
    status: 'Pending',
    priority: 'Medium',
    reportedAt: '2024-07-22T10:15:00Z',
    citizen: { name: 'Michael Brown', contact: 'michael.b@email.com' },
    imageUrl: 'https://picsum.photos/seed/pothole2/800/600',
    imageHint: 'pothole highway'
  },
  {
    id: 'CIV-006',
    category: 'Garbage',
    description: 'Construction debris dumped illegally by the river bank.',
    location: { address: '567 River Rd, Aurangabad', lat: 19.8762, lng: 75.3433 },
    status: 'Assigned',
    priority: 'High',
    reportedAt: '2024-07-21T18:45:00Z',
    assignedTo: 'Sanitation Dept.',
    citizen: { name: 'Jessica White', contact: 'jessica.w@email.com' },
    imageUrl: 'https://picsum.photos/seed/garbage2/800/600',
    imageHint: 'debris dumped'
  },
  {
    id: 'CIV-007',
    category: 'Broken Signage',
    description: 'Stop sign at the intersection is broken and lying on the ground.',
    location: { address: '890 Crossroads, Solapur', lat: 17.6599, lng: 75.9064 },
    status: 'Pending',
    priority: 'High',
    reportedAt: '2024-07-23T11:00:00Z',
    citizen: { name: 'David Garcia', contact: 'david.g@email.com' },
    imageUrl: 'https://picsum.photos/seed/sign1/800/600',
    imageHint: 'stop sign broken'
  },
  {
    id: 'CIV-008',
    category: 'Fallen Tree',
    description: 'A large tree has fallen and is blocking a residential street.',
    location: { address: '112 Oak St, Amravati', lat: 20.9374, lng: 77.7796 },
    status: 'Approved',
    priority: 'High',
    reportedAt: '2024-07-22T20:00:00Z',
    citizen: { name: 'Maria Rodriguez', contact: 'maria.r@email.com' },
    imageUrl: 'https://picsum.photos/seed/tree1/800/600',
    imageHint: 'tree fallen road'
  },
  {
    id: 'CIV-009',
    category: 'Public Nuisance',
    description: 'Loud music from a commercial establishment late at night.',
    location: { address: '333 Party Ln, Kolhapur', lat: 16.7050, lng: 74.2433 },
    status: 'Rejected',
    priority: 'Low',
    reportedAt: '2024-07-20T23:30:00Z',
    citizen: { name: 'Chris Lee', contact: 'chris.l@email.com' },
    imageUrl: 'https://picsum.photos/seed/nuisance1/800/600',
    imageHint: 'loud music'
  },
  {
    id: 'CIV-010',
    category: 'Water Stagnation',
    description: 'Stagnant water in an open drain, potential mosquito breeding ground.',
    location: { address: '444 Drain Rd, Latur', lat: 18.4088, lng: 76.5604 },
    status: 'Assigned',
    priority: 'Medium',
    reportedAt: '2024-07-23T09:20:00Z',
    assignedTo: 'Public Works Dept.',
    citizen: { name: 'Sarah Miller', contact: 'sarah.m@email.com' },
    imageUrl: 'https://picsum.photos/seed/water2/800/600',
    imageHint: 'stagnant water'
  }
];

// Functions to interact with the mock database
export const getIssues = () => issues;

export const getUsers = () => users;

export const updateIssue = (id: string, updates: Partial<Issue>) => {
    const issueIndex = issues.findIndex(i => i.id === id);
    if (issueIndex !== -1) {
        issues[issueIndex] = { ...issues[issueIndex], ...updates };
        return issues[issueIndex];
    }
    return null;
}

export const updateMultipleIssues = (updates: (Partial<Issue> & {id: string})[]) => {
    updates.forEach(update => {
        const issueIndex = issues.findIndex(i => i.id === update.id);
        if (issueIndex !== -1) {
            issues[issueIndex] = { ...issues[issueIndex], ...update };
        }
    });
    return issues;
}
