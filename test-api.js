// Test API connectivity from browser console
// Copy and paste this in browser console to test API

console.log("🧪 Testing API connectivity...");

// Test 1: Check if API is reachable
fetch('/api/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email: 'admin@admin.com',
        password: 'admin123'
    })
})
.then(response => {
    console.log("📡 Response Status:", response.status);
    console.log("📡 Response OK:", response.ok);
    return response.json();
})
.then(data => {
    console.log("✅ API Response Data:", data);
    
    if (data.success && data.data && data.data.token) {
        console.log("🎉 TOKEN GENERATED SUCCESSFULLY!");
        console.log("🔑 Token Preview:", data.data.token.substring(0, 50) + "...");
        console.log("👤 User:", data.data.user);
    } else {
        console.warn("⚠️ No token in response or login failed");
    }
})
.catch(error => {
    console.error("❌ API Error:", error);
});