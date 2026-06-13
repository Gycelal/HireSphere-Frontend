import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";
import PageHeader from "../../components/common/PageHeader";
import Pagination from "../../components/common/Pagination";
import DataTable from "../../components/table/DataTable";
import TableToolbar from "../../components/table/TableToolBar";
import { SORT_OPTIONS } from "../../config/sortOptions";
import { privateApi } from "../../services/api";

// Status Filter config
const STATUS_FILTERS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
];



const UserManagementPage = () => {
  const [role, setRole] = useState("candidate");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState(SORT_OPTIONS[0]?.value || "");
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // Modals state
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [action, setAction] = useState(null); // "activate" or "suspend"
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users whenever status, search, role, page, or sort changes
  useEffect(() => {
    fetchUsers();
  }, [role, search, status, sort, page]);

  const fetchUsers = async () => {
    try {
      const paramsObj = { page, ordering: sort };

      if (search.trim()) paramsObj.search = search;
      if(role) paramsObj.role = role;
      if (status === "active") paramsObj.is_active = "true";
      if (status === "suspended") paramsObj.is_active = "false";
      const params = new URLSearchParams(paramsObj);
      const res = await privateApi.get(`admin/users/?${params.toString()}`);
      console.log("data:", res.data)
      setData(res.data.results || []);
      setTotalCount(res.data.count || 0);
    } catch (err) {
      console.error(`Error fetching ${role}s:`, err.response?.data || err);
      toast.error(`Failed to fetch ${role}s.`);
    }
  };

  // Action Handlers
  const handleFilter = (filterValue) => {
    setStatus(filterValue);
    setPage(1);
  };
  const handleSort = (sortValue) => {
    setSort(sortValue);
    setPage(1);
  };
  const handleSearch = (searchValue) => {
    setSearch(searchValue);
    setPage(1);
  };

  // Preview details handler
  const handlePreview = (user) => {
    console.log("Preview user:", user);
  };

  // Action status changes
  const handleToggleStatus = (user) => {
    setSelectedUser(user);
    setAction(user.is_active ? "suspend" : "activate");
    setOpenConfirmModal(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedUser) return;
    try {
      const updatedStatus = action === "activate";
      await privateApi.patch(`users/${selectedUser.id}/`, {
        is_active: updatedStatus,
      });

      toast.success(`User successfully ${updatedStatus ? "activated" : "suspended"}!`);
      setOpenConfirmModal(false);
      setSelectedUser(null);
      setAction(null);
      fetchUsers(); // Refresh details list
    } catch (error) {
      console.error("Status update error:", error);
      toast.error(error?.response?.data?.message || `Failed to ${action} user.`);
    }
  };

  // Define Columns dynamically based on the active role
  const columns = useMemo(() => {
    const baseColumns = [
      { key: "id", label: "ID" },
      {
        key: "name",
        label: "Name",
        render: (row) => `${row.first_name || ""} ${row.last_name || ""}`,
      },
      { key: "email", label: "Email" },
      {
        key: "is_active",
        label: "Status",
        render: (row) => (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            row.is_active
              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800"
              : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${row.is_active ? "bg-green-500" : "bg-red-500"}`} />
            {row.is_active ? "Active" : "Suspended"}
          </span>
        ),
      },
      {
        key: "date_joined",
        label: "Joined",
        render: (row) => row.date_joined ? new Date(row.date_joined).toLocaleDateString() : "—",
      },
    ];

    if (role === "recruiter") {
      // Insert company column for recruiters
      baseColumns.splice(2, 0, {
        key: "company_name",
        label: "Company",
        render: (row) => row?.company_or_brand_name || "—",
      });
    }

    return baseColumns;
  }, [role]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Role Toggle Wrapper */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="User Management"
          description="Manage user accounts and permissions"
        />

        {/* Responsive Role Toggle */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-full sm:w-auto self-start sm:self-center">
          <button
            onClick={() => { setRole("candidate"); setPage(1); }}
            className={`flex-1 sm:flex-initial text-center px-6 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              role === "candidate"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Candidates
          </button>
          <button
            onClick={() => { setRole("recruiter"); setPage(1); }}
            className={`flex-1 sm:flex-initial text-center px-6 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              role === "recruiter"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Recruiters
          </button>
        </div>
      </div>

      {/* Table Toolbar */}
      <TableToolbar
        searchValue={search}
        onSearchChange={handleSearch}
        searchPlaceholder="Search by name or email..."
        filters={STATUS_FILTERS}
        selectedFilter={status}
        onFilterChange={handleFilter}
        sortOptions={SORT_OPTIONS}
        selectedSort={sort}
        onSortChange={handleSort}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data || []}
        emptyMessage={`No ${role}s found...`}
        renderActions={(row) => (
          <div className="flex items-center justify-end gap-1.5">
            {/* Preview details */}
            <button
              onClick={() => handlePreview(row)}
              title="Preview Details"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-150"
            >
              <span className="material-symbols-outlined text-[1.1rem]">visibility</span>
            </button>

            {/* Suspend/Activate Switch */}
            <button
              onClick={() => handleToggleStatus(row)}
              title={row.is_active ? "Suspend User" : "Activate User"}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-150 ${
                row.is_active
                  ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                  : "text-green-500 hover:bg-green-50 dark:hover:bg-green-950/40"
              }`}
            >
              <span className="material-symbols-outlined text-[1.1rem]">
                {row.is_active ? "block" : "check_circle"}
              </span>
            </button>
          </div>
        )}
      />

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={Math.ceil(totalCount / 8)}
        onPageChange={setPage}
        pageSize={8}
        totalItems={totalCount}
      />

      {/* Action Confirmation Modal */}
      <ConfirmModal
        open={openConfirmModal}
        title={action === "activate" ? "Activate User?" : "Suspend User?"}
        message={`Are you sure you want to ${action} this user's account?`}
        confirmText={action === "activate" ? "Activate" : "Suspend"}
        variant={action === "activate" ? "success" : "danger"}
        onCancel={() => {
          setOpenConfirmModal(false);
          setSelectedUser(null);
          setAction(null);
        }}
        onConfirm={handleConfirmStatusChange}
      />
    </div>
  );
};

export default UserManagementPage;
