import { cn } from "@/lib/utils/cn"

interface ConnectionStatusBadgeProps {
  status: "connected" | "connecting" | "disconnected"
  label?: string
}

export function ConnectionStatusBadge({ 
  status, 
  label 
}: ConnectionStatusBadgeProps) {
  const isConnected = status === "connected"
  
  const statusLabel = label || (isConnected ? "Connected" : "Disconnected")
  
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm",
        isConnected
          ? "bg-green-500/20 text-white"
          : "bg-gray-500/20 text-white"
      )}
    >
      <div
        className={cn(
          "w-2 h-2 rounded-full",
          isConnected ? "bg-green-500" : "bg-gray-500"
        )}
      />
      {statusLabel}
    </div>
  )
}
