import {
  LayoutDashboard,
  MessagesSquare,
  Newspaper,
  Building2,
  User,
  UserPen,
  LayoutList,
  Building,
  CalendarCheck,
  ListChecks,
  Users2,
  Briefcase,
  List,
} from "lucide-react";

export const sidebarMenuConfig = {
  candidate: [
    { label: 'Dashboard', icon: LayoutDashboard,path:'' },
    { label: 'Messages', icon: MessagesSquare,path:''},
    { label: 'My Applications', icon: Newspaper, path:'' },
    { label: 'Browse Companies', icon: Building2, path:'' },
    { label: 'Browse Jobs', icon: LayoutList, path:'' },
    { label: 'My Public Profile', icon: User, path:'' },
  ],
  company_admin: [
    { label: 'Dashboard', icon: LayoutDashboard, path:'' },
    { label: 'Messages', icon: MessagesSquare,path:'' },
    { label: 'Company Profile', icon: Building, path:'' },
    { label: 'All Applications', icon: Newspaper, path:'' },
    { label: 'Job Listing', icon: LayoutList, path:'' },
    { label: 'My Schedule', icon: CalendarCheck, path:'' },
  ],
  admin: [
    { label: 'Dashboard', icon: LayoutDashboard,path:'' },
    {
      label: 'Company Management',
      icon: Building2,
      children: [
        { label: 'All Companies',icon:List, path:'' },
        { label: 'All Approvals',icon:ListChecks,path:'/approvals' },
      ],
    },
    {
      label: 'User Management',
      icon: Users2,
      children: [{ label: 'All Users',icon:List, path:'' }],
    },
    {
      label: 'Job Management',
      icon: Briefcase,
      children: [{ label: 'All Jobs',icon:List, path:''}],
    },
  ],
};
