import axiosPrivate from './axiosPrivate'



export const getPendingCompanies = ()=>{
    return axiosPrivate.get('api/adminpanel/pending-companies')
}

export const updateCompanyRegRequest = (companyId, status)=>{
    return axiosPrivate.patch(`api/adminpanel/company/${companyId}/update-status/`,status)
}