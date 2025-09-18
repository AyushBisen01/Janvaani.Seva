export type IssueStatus = "Pending" | "Approved" | "Assigned" | "Resolved" | "Rejected";
export type IssuePriority = "High" | "Medium" | "Low";

export interface Issue {
  id: string;
  category: string;
  description: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  status: IssueStatus;
  priority: IssuePriority;
  reportedAt: Date;
  resolvedAt?: Date;
  assignedTo?: string; // Department name or staff ID
  citizen: {
    name: string;
    contact: string;
  };
  imageUrl: string;
  imageHint: string;
  proofUrl?: string;
  proofHint?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Department Head" | "Staff";
  avatarUrl: string;
}

export interface Department {
  id: string;
  name: string;
  head: string; // User ID
}
