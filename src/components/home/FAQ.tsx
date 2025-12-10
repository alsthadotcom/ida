import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How does Ida protect my idea ownership?",
    answer:
      "Every idea submitted to Ida receives a SHA-256 hash with a timestamp, creating an immutable record of your intellectual property. This serves as cryptographic proof that you possessed this specific idea at a specific time.",
  },
  {
    question: "What makes an idea eligible for the marketplace?",
    answer:
      "Ideas must pass our AI validation system, which scores them on uniqueness, market potential, clarity, and execution readiness. We require a uniqueness score of at least 70% to ensure high-quality listings.",
  },
  {
    question: "How much can I earn selling ideas?",
    answer:
      "Sellers set their own prices. Frameworks typically sell for $500 - $5,000, while simple concepts might sell for $50 - $200. You keep 85% of the sale price, with Ida taking a 15% platform fee.",
  },
  {
    question: "What happens after I buy an idea?",
    answer:
      "You receive the full IP transfer, including all documentation, frameworks, and any attached assets. You also get the cryptographic ownership proof transferred to your account.",
  },
  {
    question: "Can I resell an idea I bought?",
    answer:
      "No. When you buy an idea, it is for your own execution and implementation. Reselling the raw idea on the marketplace is prohibited to protect the ecosystem's integrity.",
  },
  {
    question: "How does the AI validation work?",
    answer:
      "Our multi-agent AI system analyzes your submission against millions of data points to evaluate its originality, feasibility, and market demand, providing a detailed scoring report.",
  },
];

const FAQ = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </motion.div>
          <h2 className="display-lg font-outfit text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about buying, selling, and protecting your ideas.
          </p>
        </div>

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
                className="group border border-white/5 bg-white/5 rounded-2xl px-6 data-[state=open]:bg-white/10 data-[state=open]:border-primary/20 transition-all duration-300"
              >
                <AccordionTrigger className="text-left font-outfit font-semibold text-lg text-foreground hover:text-primary py-6 hover:no-underline [&[data-state=open]]:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
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
