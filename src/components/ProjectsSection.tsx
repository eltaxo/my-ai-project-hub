import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import logoVicelec from "@/assets/logo-vicelec.ico";
import logoEducanax from "@/assets/logo-educanax.png";
import logoNumeroPerdido from "@/assets/logo-numeroperdido.png";
import logoOnesuscribe from "@/assets/logo-onesuscribe.png";

const projects = [
  {
    title: "Vicelec",
    description:
      "Web corporativa para empresa de electricidad. Diseño profesional con foco en conversión y presencia digital.",
    url: "https://vicelec.eltaxo.com",
    tags: ["Web Corporativa", "Diseño", "SEO"],
    logo: logoVicelec,
  },
  {
    title: "Educanax",
    description:
      "Plataforma de gestión de documentación educativa para colegios. Automatización y organización de procesos académicos.",
    url: "https://educanax.eltaxo.com",
    tags: ["EdTech", "SaaS", "Gestión"],
    logo: logoEducanax,
  },
  {
    title: "Número Perdido",
    description:
      "Juego mobile basado en mi propio juego de mesa. Experiencia lúdica digital con mecánicas originales.",
    url: "https://app.numeroperdido.com",
    tags: ["Gaming", "Mobile", "Juego de Mesa"],
    logo: logoNumeroPerdido,
  },
  {
    title: "OneSuscribe",
    description:
      "WebApp de optimización de plataformas de streaming. Ahorra dinero gestionando y compartiendo tus suscripciones.",
    url: "https://onesuscribe.eltaxo.com",
    tags: ["Streaming", "Optimización", "WebApp"],
    logo: logoOnesuscribe,
  },
];

const ProjectsSection = () => {
  return (
    <section id="proyectos" className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-primary font-display font-medium tracking-widest uppercase text-sm mb-4">
            Proyectos
          </p>
          <h2 className="text-3xl lg:text-5xl font-display font-bold">
            Lo que he <span className="text-gradient">construido</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group glass rounded-xl p-8 hover:border-primary/40 transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={project.logo}
                      alt={`${project.title} logo`}
                      className="w-12 h-12 rounded-lg object-contain bg-secondary/50 p-1"
                    />
                    <h3 className="text-2xl font-display font-bold group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </div>

                <p className="text-muted-foreground font-body mb-6 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-display font-medium rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
