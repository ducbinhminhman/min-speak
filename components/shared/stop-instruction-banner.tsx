interface StopInstructionBannerProps {
  maxWidth?: "md" | "2xl"
}

export function StopInstructionBanner({ maxWidth = "md" }: StopInstructionBannerProps) {
  return (
    <div className="px-6 pt-2 pb-2">
      <div className={`mx-auto ${maxWidth === "2xl" ? "max-w-2xl" : "max-w-md"}`}>
        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur-sm text-white text-center shadow-lg">
          <p className="text-sm md:text-lg font-bold">
            To end conversation, say: &quot;Stop the chat&quot;
          </p>
        </div>
      </div>
    </div>
  )
}
