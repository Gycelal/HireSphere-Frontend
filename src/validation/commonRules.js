

export const validateEmail = (email) => {
    if(!email) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


export const validatePassword = (password) =>{
    if(!password) return "Password is required.";
    if(password.length < 8) return "Password must be at least 8 characters long.";
    if(!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if(!/[0-9]/.test(password)) return "Password must contain at least one number.";
    return true;
}