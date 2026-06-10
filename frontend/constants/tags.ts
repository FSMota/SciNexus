export const DICIONARIO_TAGS = {
  tecnologia: [
    "inteligência artificial",
    "algoritmos genéticos",
    "computação evolutiva",
    "xai",
    "next.js",
    "fastapi",
    "react",
    "docker",
    "python"
  ],
  saude: [
    "bioinformática",
    "métodos numéricos",
    "biomarcadores",
    "genética",
    "oncologia computacional",
    "alto desempenho"
  ],
  engenharia: [
    "arquitetura de software",
    "microserviços",
    "clean code",
    "design patterns",
    "sistemas distribuídos"
  ],
  direito: [
    "legaltech",
    "automação de relatórios",
    "gestão de honorários",
    "dashboards inteligentes",
    "sistemas de gestão"
  ],
  educacao: [
    "metodologias ágeis",
    "ensino a distância",
    "gamificação",
    "gestão de produtos",
    "scrum"
  ]
};

// Uma lista plana caso você precise validar algo de forma global depois
export const TODAS_AS_TAGS = Object.values(DICIONARIO_TAGS).flat();