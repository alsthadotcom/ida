import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import FeaturedIdeas from "@/components/home/FeaturedIdeas";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import FAQ from "@/components/home/FAQ";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>ida – Buy & Sell Business Ideas</title>
        <meta
          name="description"
          content="The world’s first marketplace for unique business ideas, frameworks, and roadmaps. Turn your thinking into income."
        />
        <meta property="og:title" content="ida – Buy & Sell Business Ideas" />
        <meta
          property="og:description"
          content="The world’s first marketplace for unique business ideas, frameworks, and roadmaps."
        />
        <meta property="og:image" content="/og.png" />
        <meta property="og:url" content="https://ida.market" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ida – Buy & Sell Business Ideas" />
        <meta
          name="twitter:description"
          content="The world’s first marketplace for unique business ideas, frameworks, and roadmaps."
        />
        <meta name="twitter:image" content="/og.png" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "ida",
            "url": "https://ida.market",
            "logo": "/og.png",
            "sameAs": [
              "https://twitter.com/ida_market",
              "https://github.com/ida-market"
            ]
          }
        `}</script>
      </Helmet>

      <div className="min-h-screen bg-background font-sans anti-aliased overflow-x-hidden">
        <Navbar />
        <main className="flex flex-col">
          <Hero />
          <Stats />
          <FeaturedIdeas />
          <HowItWorks />
          <Testimonials />
          <FAQ />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
