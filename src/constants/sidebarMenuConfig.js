export const sidebarMenuConfig = {
  candidate: [
    { label: 'Dashboard', icon: '📊' },
    { label: 'Messages', icon: '💬' },
    { label: 'My Applications', icon: '📄' },
    { label: 'Browse Companies', icon: '🏢' },
    { label: 'My Public Profile', icon: '👤' },
  ],
  company: [
    { label: 'Dashboard', icon: '📊' },
    { label: 'Messages', icon: '💬' },
    { label: 'Company Profile', icon: '🏢' },
    { label: 'All Applications', icon: '📄' },
    { label: 'Job Listing', icon: '🗂️' },
    { label: 'My Schedule', icon: '📅' },
  ],
  admin: [
    { label: 'Dashboard', icon: '📊' },
    {
      label: 'Company Management',
      icon: '🏢',
      children: [
        { label: 'All Companies' },
        { label: 'All Approvals' },
      ],
    },
    {
      label: 'User Management',
      icon: '👥',
      children: [{ label: 'All Users' }],
    },
    {
      label: 'Job Management',
      icon: '💼',
      children: [{ label: 'All Jobs' }],
    },
  ],
};
