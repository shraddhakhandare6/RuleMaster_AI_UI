
import type { Rule, Tenant, User, Group } from './types';

export const mockUsers: User[] = [
  { id: 'user-1', tenantId: 'tenant-1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', createdAt: '2023-10-01' },
  { id: 'user-2', tenantId: 'tenant-1', name: 'Bob Williams', email: 'bob@example.com', role: 'editor', createdAt: '2023-10-05' },
  { id: 'user-3', tenantId: 'tenant-2', name: 'Charlie Brown', email: 'charlie@example.com', role: 'viewer', createdAt: '2023-10-10' },
  { id: 'user-4', tenantId: 'tenant-2', name: 'Diana Prince', email: 'diana@example.com', role: 'editor', createdAt: '2023-10-12' },
  { id: 'user-5', tenantId: 'tenant-2', name: 'Ethan Hunt', email: 'ethan@example.com', role: 'admin', createdAt: '2023-10-15' },
  { id: 'user-6', tenantId: 'tenant-3', name: 'Fiona Glenanne', email: 'fiona@example.com', role: 'viewer', createdAt: '2023-10-18' },
  { id: 'user-7', tenantId: 'tenant-3', name: 'George Costanza', email: 'george@example.com', role: 'editor', createdAt: '2023-10-20' },
  { id: 'user-8', tenantId: 'tenant-1', name: 'Anisha Patel', email: 'anisha@example.com', role: 'editor', createdAt: '2023-10-21' },
];

export const mockTenants: Tenant[] = [
  { id: 'tenant-1', name: 'Innovate Corp', realmId: 'innovate-corp-realm', createdAt: '2023-09-15', status: 'active' },
  { id: 'tenant-2', name: 'Synergy Solutions', realmId: 'synergy-solutions-realm', createdAt: '2023-09-20', status: 'active' },
  { id: 'tenant-3', name: 'QuantumLeap Inc.', realmId: 'quantumleap-inc-realm', createdAt: '2023-09-25', status: 'inactive' },
];

export const mockRules: Rule[] = [
  {
    id: 'rule-1',
    name: 'Standard Commission',
    description: 'Calculates a 5% commission for sales over $1000.',
    priority: 1,
    active: true,
    conditions: [{ id: 'c1', fact: 'totalSales', operator: '>', value: '1000' }],
    actions: [{ id: 'a1', description: 'apply 5% commission' }],
  },
  {
    id: 'rule-2',
    name: 'High-Value Content Moderation',
    description: 'Flags content containing "crypto" for manual review.',
    priority: 10,
    active: true,
    conditions: [{ id: 'c1', fact: 'content', operator: 'contains', value: 'crypto' }],
    actions: [{ id: 'a1', description: 'flag for manual review' }],
  },
  {
    id: 'rule-3',
    name: 'VIP User Discount',
    description: 'Applies a 15% discount for users in the "VIP" tier.',
    priority: 5,
    active: false,
    conditions: [{ id: 'c1', fact: 'userTier', operator: '==', value: 'VIP' }],
    actions: [{ id: 'a1', description: 'apply 15% discount' }],
    customCode: `// Custom logic to verify VIP status against an external service\nasync function verifyVipStatus(userId) {\n  // ... implementation\n  return true;\n}`
  },
  {
    id: 'rule-4',
    name: 'New User Onboarding Email',
    description: 'Sends a welcome email to users signed up in the last 24 hours.',
    priority: 2,
    active: true,
    conditions: [{ id: 'c1', fact: 'signupAgeInHours', operator: '<=', value: '24' }],
    actions: [{ id: 'a1', description: 'send welcome_email_template' }],
  },
];


export const mockGroups: Group[] = [
    {
        id: 'group-1',
        name: 'Tenant Admins',
        description: 'Key personnel responsible for the administration and overall configuration of RuleWise for their specific organization.',
        roles: ['rule:create', 'rule:read', 'rule:update', 'rule:delete', 'rule:activate-deactivate', 'rule:apply', 'custom-function:manage', 'user:manage', 'tenant:monitor'],
        users: [
            { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Lead Administrator' },
            { id: 'user-5', name: 'Ethan Hunt', email: 'ethan@example.com', role: 'System Administrator' },
        ]
    },
    {
        id: 'group-2',
        name: 'HR Department',
        description: 'Business users who manage rules related to Human Resources (e.g., bonuses, policies, leave).',
        roles: ['rule:create', 'rule:read', 'rule:update', 'rule:delete', 'rule:activate-deactivate', 'rule:apply'],
        users: [
            { id: 'user-8', name: 'Anisha Patel', email: 'anisha@example.com', role: 'HR Manager' },
        ]
    },
    {
        id: 'group-3',
        name: 'Sales Department',
        description: 'Business users who manage rules related to Sales operations (e.g., commissions, lead scoring, quotas).',
        roles: ['rule:create', 'rule:read', 'rule:update', 'rule:delete', 'rule:activate-deactivate', 'rule:apply'],
        users: [
            { id: 'user-2', name: 'Bob Williams', email: 'bob@example.com', role: 'Sales Lead' },
            { id: 'user-7', name: 'George Costanza', email: 'george@example.com', role: 'Sales Associate' },
        ]
    },
    {
        id: 'group-4',
        name: 'Marketing Department',
        description: 'Business users who manage rules related to Marketing activities (e.g., content moderation, campaign automation).',
        roles: ['rule:create', 'rule:read', 'rule:update', 'rule:delete', 'rule:activate-deactivate', 'rule:apply'],
        users: [
             { id: 'user-4', name: 'Diana Prince', email: 'diana@example.com', role: 'Marketing Head' },
        ]
    },
    {
        id: 'group-5',
        name: 'Developers',
        description: 'Technical users involved in extending the platform, creating custom functions, or debugging.',
        roles: ['custom-function:manage', 'rule:read', 'tenant:monitor'],
        users: []
    },
    {
        id: 'group-6',
        name: 'Basic Business Users',
        description: 'General business users who primarily consume rule outcomes or apply existing rules without needing to define new ones.',
        roles: ['rule:read', 'rule:apply'],
        users: [
             { id: 'user-3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Analyst' },
             { id: 'user-6', name: 'Fiona Glenanne', email: 'fiona@example.com', role: 'Operator' },
        ]
    },
]
