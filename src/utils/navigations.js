export const navigateBasedOnRole = (role, navigate) => {
  if (role === "candidate") return navigate("/candidate/home")
  if (role === "recruiter") return navigate("/recruiter/overview")
  if (role === "admin") return navigate("/admin/dashboard")

  return navigate("/")
}