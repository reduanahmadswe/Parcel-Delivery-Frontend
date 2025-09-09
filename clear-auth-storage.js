// Run this script in the browser console to clear all authentication data
// This will help remove any existing cached authentication data

console.log("Clearing all authentication data...");

// Clear localStorage
if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    console.log("✓ Cleared localStorage");
}

// Clear sessionStorage
if (typeof sessionStorage !== 'undefined') {
    sessionStorage.clear();
    console.log("✓ Cleared sessionStorage");
}

// Clear cookies (if js-cookie is available)
if (typeof Cookies !== 'undefined') {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    console.log("✓ Cleared cookies");
}

// Also clear all cookies manually
document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});

console.log("✅ All authentication data cleared!");
console.log("Refresh the page to see the logged-out state.");
