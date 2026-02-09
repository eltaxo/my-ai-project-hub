import { motion } from "framer-motion";

const experiences = [
  {
    role: "Technical Project Manager",
    company: "Secture",
    period: "Nov 2021 – Presente",
    highlights: [
      "Desarrollo end-to-end de productos digitales de alto impacto",
      "Soluciones AI: recomendadores inteligentes, motores de marketing automatizado",
      "Productos en gaming y entretenimiento: LaLiga Fantasy, Tabletop Creator, AliWood",
    ],
  },
  {
    role: "Operations & Logistics Manager (COO)",
    company: "Endado",
    period: "Jul 2016 – Sep 2020",
    highlights: [
      "Escalado a +300.000 referencias de producto",
      "#165 en FT 1000 empresas de más rápido crecimiento en Europa",
      "NPS 80+ con procesos eficientes y orientados a calidad",
    ],
  },
  {
    role: "Product Owner & Project Manager",
    company: "Singularu",
    period: "Ene 2016 – May 2016",
    highlights: [
      "Product Owner bajo SCRUM y Lean Startup",
      "Definición y seguimiento de KPIs estratégicos",
    ],
  },
  {
    role: "Operations & Customer Service Manager (COO)",
    company: "EsLife",
    period: "Feb 2014 – Dic 2015",
    highlights: [
      "Dashboards avanzados y automatización con MySQL y Excel",
    ],
  },
];

const ExperienceSection = () => {
  return (
    <section id="experiencia" className="py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-primary font-display font-medium tracking-widest uppercase text-sm mb-4">
            Experiencia
          </p>
          <h2 className="text-3xl lg:text-5xl font-display font-bold">
            Mi <span className="text-gradient">trayectoria</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 lg:left-8 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative pl-8 lg:pl-20"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 lg:left-8 top-2 w-2 h-2 rounded-full bg-primary -translate-x-[3.5px]" />

                <div className="glass rounded-xl p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3 gap-2">
                    <div>
                      <h3 className="font-display font-bold text-xl">{exp.role}</h3>
                      <p className="text-primary font-display font-medium">{exp.company}</p>
                    </div>
                    <span className="text-muted-foreground text-sm font-body whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {exp.highlights.map((h, j) => (
                      <li key={j} className="text-muted-foreground text-sm font-body flex items-start gap-2">
                        <span className="text-primary mt-1.5 flex-shrink-0">•</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
