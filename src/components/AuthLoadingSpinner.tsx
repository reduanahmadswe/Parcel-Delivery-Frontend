interface AuthLoadingProps {
  message?: string;
}

export function AuthLoadingSpinner({
  message = "Loading...",
}: AuthLoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        <p className="text-lg font-medium text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
