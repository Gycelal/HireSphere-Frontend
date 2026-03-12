export const NAV = {
    candidate: {
    main: [
      { label:"Overview",        icon:"dashboard",           href:"/dashboard" },
      { label:"Find Jobs",       icon:"work_outline",        href:"/dashboard/jobs" },
      { label:"Find Recruiters", icon:"group_search",        href:"/dashboard/recruiters" },
      { label:"Applications",    icon:"description",         href:"/dashboard/applications" },
      { label:"Interviews",      icon:"video_call",          href:"/dashboard/interviews" },
      { label:"Messages",        icon:"chat_bubble_outline", href:"/dashboard/messages" },
    ],
    bottom: [{ label:"Settings", icon:"settings", href:"/dashboard/settings" }],
  },
  recruiter: {
    main: [
      { label:"Overview",    icon:"dashboard",           href:"/dashboard" },
      { label:"Job Postings", icon:"post_add",            href:"/dashboard/postings" },
      { label:"Candidates",   icon:"people_outline",      href:"/dashboard/candidates" },
      { label:"Interviews",   icon:"event_note",          href:"/dashboard/interviews" },
      { label:"Analytics",    icon:"bar_chart",           href:"/dashboard/analytics" },
      { label:"Messages",     icon:"chat_bubble_outline", href:"/dashboard/messages" },
    ],
    bottom: [{ label:"Settings", icon:"settings", href:"/dashboard/settings" }],
  },
  admin: {
    main: [
      { label:"Dashboard",     icon:"dashboard",             href:"/dashboard" },
      { label:"Users",        icon:"manage_accounts",       href:"/dashboard/users" },
      { label:"Job Listings", icon:"work_outline",          href:"/dashboard/listings" },
      { label:"Reports",      icon:"assessment",            href:"/dashboard/reports" },
      { label:"Audit Logs",   icon:"history",               href:"/dashboard/logs" },
    ],
    bottom: [{ label:"System Settings", icon:"admin_panel_settings", href:"/dashboard/settings" }],
  },
}