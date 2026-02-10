import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const experiences = [
  {
    role: "Technical Project Manager",
    company: "Secture",
    period: "Nov 2021 – Presente",
    highlights: [
      "Desarrollo end-to-end de productos digitales de alto impacto",
      "Soluciones AI: recomendadores inteligentes, motores de marketing automatizado (MachinePoint)",
    ],
    expandedHighlights: [
      "Productos en gaming y entretenimiento: LaLiga Fantasy, Tabletop Creator, AliWood",
      "Liderazgo de productos innovadores: Eleve, WhatsDrop, BottleApp",
      "Análisis post-mortem y mejora continua del rendimiento",
      "Puente principal entre ingeniería y stakeholders",
    ],
  },
  {
    role: "Responsable de Operaciones",
    company: "Lapizka Catering",
    period: "Oct 2020 – Nov 2021",
    highlights: [
      "Visión estratégica logística: planificación y coordinación para superar objetivos",
      "Definición de procesos operativos en planta de producción",
    ],
    expandedHighlights: [
      "Control integral de trazabilidad de producto",
      "Implantación de sistema de transporte propio y externo, gestión de transportistas",
      "Control del etiquetado del producto",
      "I+D en soluciones para optimizar operativas de fabricación",
    ],
  },
  {
    role: "Operations & Logistics Manager (COO)",
    company: "Endado",
    period: "Jul 2016 – Sep 2020",
    highlights: [
      "Escalado a +300.000 referencias de producto",
      "#165 en FT 1000 empresas de más rápido crecimiento en Europa",
    ],
    expandedHighlights: [
      "NPS 80+ con procesos eficientes y orientados a calidad",
      "Miembro del equipo directivo: planificación estratégica y mitigación de riesgos",
      "Diseño de procesos cost-efficient orientados a calidad",
    ],
  },
  {
    role: "Product Owner & Project Manager",
    company: "Singularu",
    period: "Ene 2016 – May 2016",
    highlights: [
      "Product Owner bajo SCRUM y Lean Startup",
    ],
    expandedHighlights: [
      "Definición y seguimiento de KPIs estratégicos a nivel de empresa",
      "Mejora de outcomes estratégicos mediante metodologías ágiles",
    ],
  },
  {
    role: "Operations & Customer Service Manager (COO)",
    company: "EsLife",
    period: "Feb 2014 – Dic 2015",
    highlights: [
      "Dashboards avanzados y automatización con MySQL y Excel",
    ],
    expandedHighlights: [
      "Optimización de operaciones y atención al cliente",
      "Reporting avanzado para toma de decisiones",
    ],
  },
  {
    role: "Director Área Soporte y Atención al Cliente",
    company: "OZONGO.com",
    period: "Abr 2010 – Feb 2014",
    highlights: [
      "Dirección de equipos de Soporte Técnico y Call Center (+10.000 clientes)",
      "Estrategias y planes de acción ante crisis (SLA)",
    ],
    expandedHighlights: [
      "Control de métricas, Dashboards y KPIs y análisis de resultados",
      "Herramientas: Zendesk, Excel, MySQL",
      "Apoyo al equipo de Desarrollo en resolución de incidencias",
      "Apoyo al equipo de Sistemas en mantenimiento de servidores",
      "Gestión del Departamento de Microinformática",
      "Elaboración de Scripts y Queries en MySQL para agilizar procesos",
    ],
  },
  {
    role: "Administrador en Sistemas Telemáticos",
    company: "Demini",
    period: "Ago 2009 – Abr 2010",
    highlights: [
      "Administración y mantenimiento de sistemas informáticos",
    ],
    expandedHighlights: [
      "Soporte técnico N1 y N2",
      "Monitorización con Nagios y MRTG",
      "Configuración de servicios de backup con Acronis",
      "Microinformática interna y de redes en clientes",
    ],
  },
];

const ExperienceCard = ({ exp, i }: { exp: typeof experiences[0]; i: number }) => {
  const [expanded, setExpanded] = useState(false);

  return (
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
          {expanded && exp.expandedHighlights.map((h, j) => (
            <motion.li
              key={`exp-${j}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-muted-foreground text-sm font-body flex items-start gap-2"
            >
              <span className="text-primary mt-1.5 flex-shrink-0">•</span>
              {h}
            </motion.li>
          ))}
        </ul>
        {exp.expandedHighlights.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 flex items-center gap-1.5 text-xs font-display font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {expanded ? "Ver menos" : "Ver más"}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>
    </motion.div>
  );
};

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
          <div className="absolute left-0 lg:left-8 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <ExperienceCard key={exp.company + exp.role} exp={exp} i={i} />
            ))}
          </div>
        </div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 pt-12 border-t border-border"
        >
          <p className="text-primary font-display font-medium tracking-widest uppercase text-sm mb-4">
            Formación
          </p>
          <div className="glass rounded-xl p-6 lg:p-8">
            <h3 className="font-display font-bold text-lg">
              Grado Superior en Administración de Sistemas Informáticos
            </h3>
            <p className="text-primary font-display font-medium">IES Abastos</p>
            <p className="text-muted-foreground text-sm font-body">2007 – 2009</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;
