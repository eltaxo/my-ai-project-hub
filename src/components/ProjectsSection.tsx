import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronDown } from "lucide-react";
import { useState } from "react";
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

const sectureProjects = [
  {
    title: "LaLiga Fantasy",
    description: "Producto de gaming y entretenimiento para LaLiga.",
    tags: ["Gaming", "Entretenimiento"],
  },
  {
    title: "MachinePoint",
    description: "Motor de marketing automatizado con recomendadores inteligentes basados en IA.",
    tags: ["AI", "Marketing", "Data"],
  },
  {
    title: "Tabletop Creator",
    description: "Plataforma de creación de juegos de mesa digitales.",
    tags: ["Gaming", "Creatividad"],
  },
  {
    title: "AliWood",
    description: "Producto digital en el sector del entretenimiento.",
    tags: ["Entretenimiento", "Digital"],
  },
  {
    title: "Eleve",
    description: "Producto innovador liderado de principio a fin.",
    tags: ["Innovación", "Product"],
  },
  {
    title: "WhatsDrop",
    description: "Herramienta digital innovadora.",
    tags: ["SaaS", "Innovación"],
  },
  {
    title: "BottleApp",
    description: "Aplicación móvil con experiencia social.",
    tags: ["Mobile", "Social"],
  },
];

const SectureProjects = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-16"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-primary font-display font-medium tracking-widest uppercase text-sm mb-2">
            En Secture
          </p>
          <h3 className="text-2xl lg:text-3xl font-display font-bold">
            Proyectos <span className="text-gradient">gestionados</span>
          </h3>
        </div>
        <button
          onClick={() => setShowMore(!showMore)}
          className="flex items-center gap-1.5 text-sm font-display font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {showMore ? "Ver menos" : `Ver los ${sectureProjects.length} proyectos`}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${showMore ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Always show first 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sectureProjects.slice(0, 3).map((project, i) => (
          <div
            key={project.title}
            className="glass rounded-xl p-5 hover:border-primary/30 transition-colors"
          >
            <h4 className="font-display font-bold text-base mb-1">{project.title}</h4>
            <p className="text-muted-foreground text-xs font-body mb-3">{project.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] font-display font-medium rounded-full bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {sectureProjects.slice(3).map((project) => (
                <div
                  key={project.title}
                  className="glass rounded-xl p-5 hover:border-primary/30 transition-colors"
                >
                  <h4 className="font-display font-bold text-base mb-1">{project.title}</h4>
                  <p className="text-muted-foreground text-xs font-body mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[10px] font-display font-medium rounded-full bg-secondary text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

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

        {/* Secture projects collapsible */}
        <SectureProjects />
      </div>
    </section>
  );
};

export default ProjectsSection;
