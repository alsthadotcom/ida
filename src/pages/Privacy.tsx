import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Privacy = () => {
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
              Privacy Policy
            </h1>
            
            <div className="glass-card p-8 space-y-6 text-muted-foreground">
              <p className="text-sm">Last updated: December 3, 2024</p>
              
              <section>
                <h2 className="text-xl font-outfit font-semibold text-foreground mb-3">
                  1. Information We Collect
                </h2>
                <p>
                  We collect information you provide directly, including your name, email address, 
                  and any ideas or content you submit to our platform. We also automatically collect 
                  certain information about your device and usage patterns.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-outfit font-semibold text-foreground mb-3">
                  2. How We Use Your Information
                </h2>
                <p>
                  We use your information to provide and improve our services, process transactions, 
                  communicate with you, and ensure the security of our platform. Your ideas are 
                  protected and only shared as you authorize.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-outfit font-semibold text-foreground mb-3">
                  3. Information Sharing
                </h2>
                <p>
                  We do not sell your personal information. We may share information with service 
                  providers who assist in our operations, or as required by law. Your submitted 
                  ideas are displayed according to your privacy settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-outfit font-semibold text-foreground mb-3">
                  4. Data Security
                </h2>
                <p>
                  We implement industry-standard security measures to protect your data. All idea 
                  submissions are timestamped and hashed to provide proof of ownership and protect 
                  your intellectual property.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-outfit font-semibold text-foreground mb-3">
                  5. Your Rights
                </h2>
                <p>
                  You have the right to access, correct, or delete your personal information. 
                  You can manage your account settings or contact us to exercise these rights.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-outfit font-semibold text-foreground mb-3">
                  6. Contact Us
                </h2>
                <p>
                  If you have questions about this Privacy Policy, please contact us at 
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

export default Privacy;
