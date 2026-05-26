export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(91,150,255,0.18),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(15,27,61,0.2),_transparent_40%)]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.92)_100%)]" />
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  )
}
