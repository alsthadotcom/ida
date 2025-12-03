import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-outfit font-bold text-foreground mb-8">
              Cookie Policy
            </h1>
            
            <div className="glass-card p-8 space-y-6 text-muted-foreground">
              <p className="text-sm">Last updated: December 3, 2024</p>
              
              <section>
                <h2 className="text-xl font-outfit font-semibold text-foreground mb-3">
                  What Are Cookies
                </h2>
                <p>
                  Cookies are small text files stored on your device when you visit our website. 
                  They help us provide you with a better experience by remembering your preferences 
                  and understanding how you use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-outfit font-semibold text-foreground mb-3">
                  Types of Cookies We Use
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-foreground">Essential Cookies:</strong> Required for the 
                    platform to function properly, including authentication and security.
                  </li>
                  <li>
                    <strong className="text-foreground">Analytics Cookies:</strong> Help us understand 
                    how visitors interact with our website to improve user experience.
                  </li>
                  <li>
                    <strong className="text-foreground">Preference Cookies:</strong> Remember your 
                    settings and preferences for future visits.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-outfit font-semibold text-foreground mb-3">
                  Managing Cookies
                </h2>
                <p>
                  You can control and manage cookies through your browser settings. Note that 
                  disabling certain cookies may affect the functionality of our platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-outfit font-semibold text-foreground mb-3">
                  Third-Party Cookies
                </h2>
                <p>
                  We may use third-party services that set their own cookies for analytics and 
                  payment processing. These are governed by the respective third-party privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-outfit font-semibold text-foreground mb-3">
                  Contact Us
                </h2>
                <p>
                  If you have questions about our use of cookies, please contact us at 
                  privacy@ida.app.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cookies;
