import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does ida protect my idea ownership?",
    answer:
      "Every idea submitted to ida receives a SHA-256 hash with timestamp, serving as cryptographic proof of ownership. This creates an immutable record that proves you created the idea at a specific time, protecting your intellectual property.",
  },
  {
    question: "What makes an idea eligible for the marketplace?",
    answer:
      "Ideas must pass our AI validation system, which scores them on uniqueness, market potential, clarity, and execution readiness. Ideas scoring above 70% on our uniqueness scale are eligible for listing. We also manually review submissions to ensure quality.",
  },
  {
    question: "How much can I earn selling ideas?",
    answer:
      "Sellers set their own prices, typically ranging from $50 to $5,000+ depending on complexity and market demand. ida takes a 15% platform fee on successful sales. Top sellers on our platform earn over $10,000/month.",
  },
  {
    question: "What happens after I buy an idea?",
    answer:
      "You receive immediate access to the full idea documentation, including frameworks, roadmaps, and any attachments. You also receive the SHA-256 ownership proof transferred to your account, giving you legal rights to implement the idea.",
  },
  {
    question: "Can I sell the same idea I bought?",
    answer:
      "No, purchased ideas are for personal or business implementation only. Reselling purchased ideas violates our terms of service. However, you can sell derivative ideas that build upon purchased frameworks if they're substantially different.",
  },
  {
    question: "How does the AI validation work?",
    answer:
      "Our AI analyzes your idea across multiple dimensions: originality (comparing against our database and public sources), market potential (analyzing market trends and demand), clarity (evaluating how well-explained the concept is), and execution readiness (assessing if the roadmap is actionable).",
  },
];

const FAQ = () => {
  return (
    <section className="py-20 md:py-32 bg-card/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-outfit font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about buying and selling ideas on ida.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card rounded-xl px-6 border-none"
              >
                <AccordionTrigger className="text-left font-outfit font-medium text-foreground hover:text-primary py-5 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
