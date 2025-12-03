import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Terms = () => {
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
              Terms of Service
            </h1>
            
            <div className="glass-card p-8 space-y-6 text-muted-foreground">
              <p className="text-sm">Last updated: December 3, 2024</p>
              
              <section>
                <h2 className="text-xl font-outfit font-semibold text-foreground mb-3">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing or using ida, you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-outfit font-semibold text-foreground mb-3">
                  2. User Accounts
                </h2>
                <p>
                  You must create an account to submit or purchase ideas. You are responsible 
                  for maintaining the confidentiality of your account credentials and for all 
                  activities under your account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-outfit font-semibold text-foreground mb-3">
                  3. Idea Submissions
                </h2>
                <p>
                  By submitting an idea, you represent that you have the right to share it and 
                  that it does not infringe on any third-party rights. All ideas undergo AI 
                  validation for uniqueness and quality.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-outfit font-semibold text-foreground mb-3">
                  4. Ownership and Rights
                </h2>
                <p>
                  You retain ownership of your ideas until they are sold. Upon sale, ownership 
                  rights transfer to the buyer as specified in the transaction. Our SHA-256 
                  timestamping provides proof of original submission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-outfit font-semibold text-foreground mb-3">
                  5. Payments and Fees
                </h2>
                <p>
                  Sellers set their own prices. ida charges a platform fee on successful 
                  transactions. All payments are processed securely through our payment partners.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-outfit font-semibold text-foreground mb-3">
                  6. Prohibited Content
                </h2>
                <p>
                  You may not submit ideas that are illegal, infringe on intellectual property, 
                  contain harmful content, or violate any applicable laws or regulations.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-outfit font-semibold text-foreground mb-3">
                  7. Limitation of Liability
                </h2>
                <p>
                  ida is provided "as is" without warranties. We are not liable for any indirect, 
                  incidental, or consequential damages arising from your use of the platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-outfit font-semibold text-foreground mb-3">
                  8. Contact
                </h2>
                <p>
                  For questions about these Terms, please contact us at legal@ida.app.
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

export default Terms;
