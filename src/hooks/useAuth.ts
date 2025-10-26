// Compatibility layer to use Redux-based auth with existing useAuth interface
import { useReduxAuth } from "../contexts/ReduxAuthContext";

// Export useReduxAuth as useAuth for compatibility
export const useAuth = useReduxAuth;

// Also export as default for files that use default imports
export default useAuth;

