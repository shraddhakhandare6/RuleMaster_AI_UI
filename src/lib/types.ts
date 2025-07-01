
export type RuleCondition = {
  id: string;
  fact: string;
  operator: string;
  value: string;
};

export type RuleAction = {
  id: string;
  description: string;
};

export type Rule = {
  id: string;
  name: string;
  description: string;
  priority: number;
  active: boolean;
  tag: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
  customCode?: string;
};

export type Tenant = {
  id:string;
  name: string;
  realmId: string;
  createdAt: string;
  status: 'active' | 'inactive';
};

export type User = {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: string;
};

export type GroupUser = {
  id: string;
  name: string;
  email: string;
  role: string; // Role within the group, e.g., "HR Manager"
}

export type Group = {
  id: string;
  name: string;
  description: string;
  roles: string[]; // Mapped client roles, e.g., "rule:create"
  users: GroupUser[];
}
