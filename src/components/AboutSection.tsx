import { motion } from "framer-motion";
import { Briefcase, Database, BarChart3, Users } from "lucide-react";

const skills = [
  {
    icon: Briefcase,
    title: "Product Management",
    desc: "Roadmaps, Backlog, Agile (Scrum/Kanban), PRDs",
  },
  {
    icon: Database,
    title: "Technical Domain",
    desc: "Data & AI Platforms, MySQL, APIs, Sysadmin",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    desc: "KPIs, Data-driven decisions, NPS Expert",
  },
  {
    icon: Users,
    title: "Soft Skills",
    desc: "Stakeholder Management, Equipos multiculturales",
  },
];

const AboutSection = () => {
  return (
    <section id="sobre-mi" className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <p className="text-primary font-display font-medium tracking-widest uppercase text-sm mb-4">
            Sobre mí
          </p>
          <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6">
            +8 años liderando{" "}
            <span className="text-gradient">proyectos digitales</span>
          </h2>
          <p className="text-lg text-muted-foreground font-body leading-relaxed">
            Project Manager con amplia experiencia en ciclos de vida de software end-to-end y 
            sólido conocimiento en Product Management. Experto en conectar necesidades de negocio 
            con ejecución técnica en entornos de Data, AI y Localización. Track record probado 
            gestionando equipos multiculturales y entregando productos escalables, con total 
            autonomía en la ejecución de proyectos con IA.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass rounded-xl p-6 hover:border-primary/30 transition-colors group"
            >
              <skill.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-display font-semibold text-lg mb-2">{skill.title}</h3>
              <p className="text-muted-foreground text-sm">{skill.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
