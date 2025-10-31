
export const debugPersist = () => {
    if (typeof window === 'undefined') return;

    console.group('🔍 Redux Persist Debug Info');

    const authPersist = localStorage.getItem('persist:auth');
    const apiPersist = localStorage.getItem('persist:api');
    
    console.log('Auth Persist:', authPersist ? '✅ EXISTS' : '❌ MISSING');
    console.log('API Persist:', apiPersist ? '✅ EXISTS' : '❌ MISSING');
    
    if (authPersist) {
        try {
            const parsed = JSON.parse(authPersist);
            console.log('Auth Data Keys:', Object.keys(parsed));
        } catch (e) {
            console.error('Error parsing auth persist:', e);
        }
    }
    
    if (apiPersist) {
        try {
            const parsed = JSON.parse(apiPersist);
            console.log('API Data Keys:', Object.keys(parsed));
            
            if (parsed.queries) {
                const queries = JSON.parse(parsed.queries);
                console.log('Cached Queries:', Object.keys(queries).length);
                console.log('Query Keys:', Object.keys(queries));
            }
        } catch (e) {
            console.error('Error parsing API persist:', e);
        }
    }

    let totalSize = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            totalSize += localStorage[key].length + key.length;
        }
    }
    console.log(`Total localStorage size: ${(totalSize / 1024).toFixed(2)} KB`);
    
    console.groupEnd();
};

if (typeof window !== 'undefined') {
    (window as any).debugPersist = debugPersist;
}

export default debugPersist;
