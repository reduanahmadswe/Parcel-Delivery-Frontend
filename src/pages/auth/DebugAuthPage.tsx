import { useState, useEffect } from 'react';
import { TokenManager } from '../../services/TokenManager';
import api from '../../services/ApiConfiguration';
import { Button } from '../../components/ui/button';

export function DebugAuthPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testResult, setTestResult] = useState<string>('');

  const checkAuthStatus = () => {
    const accessToken = TokenManager.getAccessToken();
    const refreshToken = TokenManager.getRefreshToken();
    
    const info = {
      hasAccessToken: !!accessToken,
      accessTokenPreview: accessToken ? `${accessToken.substring(0, 30)}...` : 'None',
      hasRefreshToken: !!refreshToken,
      refreshTokenPreview: refreshToken ? `${refreshToken.substring(0, 30)}...` : 'None',
      localStorage: {
        accessToken: localStorage.getItem('accessToken') ? 'Exists' : 'Missing',
        refreshToken: localStorage.getItem('refreshToken') ? 'Exists' : 'Missing',
        userData: localStorage.getItem('userData') ? 'Exists' : 'Missing',
      },
      timestamp: new Date().toISOString(),
    };
    
    setDebugInfo(info);
  };

  const testLogin = async () => {
    try {
      setTestResult('Testing login...');
      const response = await api.post('/auth/login', {
        email: 'admin@parceldelivery.com',
        password: 'Admin123!'
      });

      if (response.data?.data?.accessToken) {
        const { accessToken, refreshToken, user } = response.data.data;

        TokenManager.setTokens(accessToken, refreshToken);

        await new Promise(resolve => setTimeout(resolve, 300));

        const storedToken = TokenManager.getAccessToken();
        
        const result = storedToken ? '✅ Login Success & Token Stored!' : '❌ Login Success but Token NOT Stored!';
        setTestResult(result);
        checkAuthStatus();
      } else {
        setTestResult('❌ No token in response');
        console.error('❌ Response structure:', response.data);
      }
    } catch (error: any) {
      console.error('❌ Login Error:', error);
      setTestResult(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const testAuthenticatedRequest = async () => {
    try {
      setTestResult('Testing authenticated request...');
      const response = await api.get('/auth/me');
      setTestResult(`✅ Authenticated request successful: ${response.data.data?.email}`);
    } catch (error: any) {
      console.error('❌ Auth Request Error:', error);
      setTestResult(`❌ Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
  };

  const clearAllTokens = () => {
    TokenManager.clearTokens();
    setTestResult('🗑️ All tokens cleared');
    checkAuthStatus();
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">🔍 Authentication Debugging</h1>
        
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Auth Status</h2>
          <pre className="bg-muted p-4 rounded overflow-auto text-sm">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
          <Button onClick={checkAuthStatus} className="w-full">
            🔄 Refresh Status
          </Button>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Test Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={testLogin} className="w-full" variant="default">
              🔑 Test Login
            </Button>
            
            <Button onClick={testAuthenticatedRequest} className="w-full" variant="secondary">
              📡 Test Auth Request
            </Button>
            
            <Button onClick={clearAllTokens} className="w-full" variant="destructive">
              🗑️ Clear Tokens
            </Button>
          </div>

          {testResult && (
            <div className="mt-4 p-4 bg-muted rounded">
              <p className="font-mono text-sm">{testResult}</p>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">📋 Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click "🔑 Test Login" to test login with admin credentials</li>
            <li>Check Browser Console (F12) for detailed logs</li>
            <li>Check "Auth Status" to see if tokens are stored</li>
            <li>Click "📡 Test Auth Request" to verify token is being sent</li>
            <li>If tokens are stored but requests fail, it's a backend CORS issue</li>
            <li>If tokens are NOT stored, it's a frontend storage issue</li>
          </ol>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">🐛 Common Issues</h2>
          <div className="space-y-2 text-sm">
            <div className="p-3 bg-red-50 dark:bg-red-950 rounded">
              <strong>❌ Token not stored:</strong> Check TokenManager.setTokens() implementation
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded">
              <strong>⚠️ 401 Unauthorized:</strong> Token is not being sent or backend is rejecting it
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
              <strong>🔵 CORS Error:</strong> Backend needs to allow credentials from frontend origin
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DebugAuthPage;
