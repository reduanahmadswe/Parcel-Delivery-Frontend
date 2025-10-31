import { useEffect, useState } from "react";

export default function APITestPage() {
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setTestResult("🧪 Testing API connectivity...\n");
    
    try {

      const response = await fetch('https://parcel-delivery-api.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@parceldelivery.com',
          password: 'Admin123!'
        })
      });

      setTestResult(prev => prev + `📡 Response Status: ${response.status}\n`);
      setTestResult(prev => prev + `📡 Response OK: ${response.ok}\n`);
      
      const data = await response.json();
      setTestResult(prev => prev + `📋 Response Data: ${JSON.stringify(data, null, 2)}\n`);
      
      if (data.success && data.data && data.data.token) {
        setTestResult(prev => prev + "🎉 TOKEN GENERATED SUCCESSFULLY!\n");
        setTestResult(prev => prev + `🔑 Token Preview: ${data.data.token.substring(0, 50)}...\n`);
        setTestResult(prev => prev + `👤 User: ${data.data.user.email} (${data.data.user.role})\n`);
      } else {
        setTestResult(prev => prev + "⚠️ No token in response or login failed\n");
      }
      
    } catch (error) {
      setTestResult(prev => prev + `❌ API Error: ${error}\n`);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    
    testAPI();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Connectivity Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Test Results</h2>
            <button
              onClick={testAPI}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Testing..." : "Retry Test"}
            </button>
          </div>
          
          <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-auto max-h-96">
            {testResult || "Loading test results..."}
          </pre>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Test Information:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Testing login endpoint: <code>https://parcel-delivery-api.onrender.com/api/auth/login</code></li>
            <li>• Using admin credentials: admin@parceldelivery.com / Admin123!</li>
            <li>• This will show if backend is responding and generating tokens</li>
            <li>• Check browser Network tab for detailed request/response info</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
