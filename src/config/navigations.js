export const NAV = {
  candidate: {
    main: [
      { label: "Overview", icon: "dashboard", href: "/candidate/overview" },
      {
        label: "Applications",
        icon: "description",
        href: "/candidate/applications",
      },
      {
        label: "Interviews",
        icon: "video_call",
        href: "/candidate/interviews",
      },
      {
        label: "Messages",
        icon: "chat_bubble_outline",
        href: "/candidate/messages",
      },
    ],
    bottom: [
      { label: "Settings", icon: "settings", href: "/candidate/settings" },
    ],
  },
  recruiter: {
    main: [
      { label: "Overview", icon: "dashboard", href: "/recruiter/overview" },
      {
        label: "My Job Posts",
        icon: "post_add",
        href: "/recruiter/my-job-posts",
      },
      {
        label: "View Applications",
        icon: "description",
        href: "/recruiter/applications",
      },
      {
        label: "Interviews",
        icon: "event_note",
        href: "/recruiter/interviews",
      },
      { label: "Analytics", icon: "bar_chart", href: "/recruiter/analytics" },
      {
        label: "Messages",
        icon: "chat_bubble_outline",
        href: "/recruiter/messages",
      },
    ],
    bottom: [
      { label: "Settings", icon: "settings", href: "/recruiter/settings" },
    ],
  },
  admin: {
    main: [
      { label: "Dashboard", icon: "dashboard", href: "/admin/dashboard" },
      {
        label: "Recruiter Approvals",
        icon: "how_to_reg",
        href: "/admin/recruiter-approvals",
      },
      {
        label: "User Management",
        icon: "manage_accounts",
        href: "/admin/users",
      },
      { label: "Job Listings", icon: "work_outline", href: "/admin/listings" },
      { label: "Reports", icon: "assessment", href: "/admin/reports" },
      { label: "Audit Logs", icon: "history", href: "/admin/logs" },
    ],
    bottom: [
      {
        label: "System Settings",
        icon: "admin_panel_settings",
        href: "/admin/settings",
      },
    ],
  },
};

export const PUBLIC_TOP_NAV = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Find jobs",
    path: "/find-jobs",
  },
  {
    label: "Find Recruiters",
    path: "/find-recruiters",
  },
  {
    label: "About",
    path: "/about",
  },
];

export const CANDIDATE_TOP_NAV = [
  {
    label: "Find jobs",
    path: "/candidate/find-jobs",
  },
  {
    label: "Find Recruiters",
    path: "/candidate/find-recruiters",
  },
  {
    label: "About",
    path: "/candidate/about",
  },
];
