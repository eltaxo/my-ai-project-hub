import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contacto" className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-primary font-display font-medium tracking-widest uppercase text-sm mb-4">
            Contacto
          </p>
          <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6">
            ¿Hablamos?
          </h2>
          <p className="text-muted-foreground text-lg font-body mb-12">
            Si tienes un proyecto en mente o quieres colaborar, estaré encantado de escucharte.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <a
              href="mailto:eltaxo@gmail.com"
              className="glass rounded-xl p-5 flex items-center gap-4 hover:border-primary/40 transition-colors group"
            >
              <Mail className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-sm font-body text-muted-foreground group-hover:text-foreground transition-colors">
                eltaxo@gmail.com
              </span>
            </a>

            <a
              href="tel:+34625187200"
              className="glass rounded-xl p-5 flex items-center gap-4 hover:border-primary/40 transition-colors group"
            >
              <Phone className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-sm font-body text-muted-foreground group-hover:text-foreground transition-colors">
                +34 625 187 200
              </span>
            </a>

            <div className="glass rounded-xl p-5 flex items-center gap-4">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-sm font-body text-muted-foreground">
                San Sebastián de los Reyes, Madrid
              </span>
            </div>

            <a
              href="https://linkedin.com/in/albertoaznar"
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-xl p-5 flex items-center gap-4 hover:border-primary/40 transition-colors group"
            >
              <Linkedin className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-sm font-body text-muted-foreground group-hover:text-foreground transition-colors">
                LinkedIn
              </span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="border-t border-border mt-12">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-muted-foreground text-sm font-body">
            © {new Date().getFullYear()} Alberto Aznar. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
