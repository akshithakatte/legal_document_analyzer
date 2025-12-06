import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { UploadSection } from "@/components/upload-section"
import { FeaturesSection } from "@/components/features-section"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <UploadSection />
      <FeaturesSection />
    </main>
  )
}
