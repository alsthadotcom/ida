import { motion } from "framer-motion";
import { Star, Quote, CheckCircle } from "lucide-react";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "SaaS Founder",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "I've sold 3 frameworks on Ida. The validation process is strict but it means buyers trust your listing. Made $4.5k in my first month.",
    rating: 5,
    verified: true,
  },
  {
    name: "Sarah Chen",
    role: "Product Manager",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "Ida saved me months of research. I bought a validated GTM strategy for my side project and launched in 2 weeks. The quality is unmatched.",
    rating: 5,
    verified: true,
  },
  {
    name: "James Wilson",
    role: "Serial Entrepreneur",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    content: "Finally, a place where ideas have actual value. The transparency of the marketplace and the secure IP transfer is exactly what this industry needed.",
    rating: 5,
    verified: true,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-card/30 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            <Star className="w-4 h-4 fill-primary" />
            <span>Trusted by Builders</span>
          </motion.div>
          <h2 className="display-lg font-outfit text-foreground mb-4">
            Don't Just Take Our Word For It
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of innovators who have successfully bought and sold intellectual property on Ida.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-3xl relative flex flex-col h-full border-white/5 bg-white/5 hover:bg-white/10 transition-colors duration-300"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-white/10 rotate-180" />

              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />
                ))}
              </div>

              <p className="text-foreground/90 text-lg leading-relaxed mb-8 flex-grow">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border border-white/10"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-foreground">{testimonial.name}</span>
                    {testimonial.verified && (
                      <CheckCircle className="w-3.5 h-3.5 text-primary fill-primary/20" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
