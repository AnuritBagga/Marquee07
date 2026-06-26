import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export const CTAFooter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setEmail("");
  };

  return (
    <section
      id="access"
      data-testid="cta-section"
      className="relative pt-32 md:pt-48 pb-0 overflow-hidden"
    >
      {/* bottom glow */}
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full bg-[#D4AF37]/15 blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] mb-10"
        >
          06 — The Invitation
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="font-serif font-light text-white text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight"
        >
          Ready to face
          <br />
          <span className="italic text-[#D4AF37]">Marquee?</span>
        </motion.h2>

        <p className="mt-10 text-white/55 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Limited cohort access opening this season. Leave your address — we
          send the key, not the noise.
        </p>

        <form
          onSubmit={onSubmit}
          data-testid="access-form"
          className="mt-12 flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-xl mx-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.name@institution.edu"
            data-testid="access-email-input"
            className="flex-1 bg-transparent hairline-strong px-4 sm:px-6 py-3 sm:py-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors duration-500 w-full"
          />
          <button
            type="submit"
            data-testid="access-submit-button"
            className="btn-royal bg-white text-black px-6 sm:px-8 py-3 sm:py-4 text-[11px] uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-colors duration-500 inline-flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto"
          >
            Request Access <ArrowRight size={14} />
          </button>
        </form>

        {submitted && (
          <p
            data-testid="access-confirmation"
            className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-[#D4AF37]"
          >
            ✦ Received. The Marquee will be in touch.
          </p>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-32 md:mt-48 border-t border-white/5 pt-16 pb-12">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-2 h-2 bg-[#D4AF37] rotate-45" />
              <span className="font-serif text-2xl tracking-tight text-white">
                Marquee
              </span>
            </div>
            <p className="text-white/50 text-sm max-w-xs leading-relaxed">
              An AI interviewer that listens, reasons, and rebuts — for the
              campuses, companies, and candidates who care about how thought
              actually happens.
            </p>
          </div>

          {[
            {
              title: "Product",
              links: ["For Campuses", "For Companies", "For Practice", "Pricing"],
            },
            {
              title: "Company",
              links: ["Manifesto", "Careers", "Press", "Contact"],
            },
            {
              title: "Legal",
              links: ["Privacy", "Terms", "Bias Audit", "Security"],
            },
          ].map((col, i) => (
            <div key={i}>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-5">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href={l === "Careers" ? "/careers" : l === "Contact" ? "mailto:marqueesupport@gmail.com" : "#"}
                      data-testid={`footer-link-${l.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm text-white/70 hover:text-[#D4AF37] transition-colors duration-300"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
            © 2026 Marquee · Est. in private rooms
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
            Made for the quietly ambitious
          </p>
        </div>
      </footer>
    </section>
  );
};

export default CTAFooter;
