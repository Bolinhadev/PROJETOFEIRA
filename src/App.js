import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Image,
  Container,
  SimpleGrid,
  Flex,
  HStack,
  IconButton,
  extendTheme,
  Grid,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

// Constantes
const SWISS_SCHOOL_LOGO = "https://swisscam.com.br/wp-content/uploads/sites/44/2019/06/logo-colegio-suico-1.jpg";

// Tema
const theme = extendTheme({
  fonts: {
    heading: 'Montserrat, sans-serif',
    body: 'Poppins, sans-serif',
  },
  colors: {
    brand: { 500: '#E30613' },
  },
});

// Traduções fixas
const translations = {
  pt: {
    title: 'Semana de Estudos',
    subtitle: 'Foz do Iguaçu',
    year: '9º ano 2024',
    projects: 'Nossos Projetos',
    testimonials: 'Depoimentos',
    why: 'Por que a Semana de Estudos foi importante?',
    learnMore: 'Saiba mais',
    loading: 'Traduzindo conteúdo...'
  },
  en: {
    title: 'Study Week',
    subtitle: 'Foz do Iguacu',
    year: '9th Grade 2024',
    projects: 'Our Projects',
    testimonials: 'Testimonials',
    why: 'Why was Study Week important?',
    learnMore: 'Learn more',
    loading: 'Translating content...'
  },
  de: {
    title: 'Studienwoche',
    subtitle: 'Foz do Iguacu',
    year: '9. Klasse 2024',
    projects: 'Unsere Projekte',
    testimonials: 'Erfahrungsberichte',
    why: 'Warum war die Studienwoche wichtig?',
    learnMore: 'Mehr erfahren',
    loading: 'Inhalte übersetzen...'
  },
  fr: {
    title: 'Semaine d\'Études',
    subtitle: 'Foz do Iguacu',
    year: '9ème année 2024',
    projects: 'Nos Projets',
    testimonials: 'Témoignages',
    why: 'Pourquoi la Semaine d\'Études était-elle importante?',
    learnMore: 'En savoir plus',
    loading: 'Traduction du contenu...'
  }
};


// PROJETOS PUTA QUE PARIU QUE GAMBIARRA

const initialProjectsData = [
  {
    id: 1,
    title: {
      pt: "Hidrelétrica de Itaipu",
      en: "Itaipu Hydroelectric Plant",
      de: "Itaipu-Wasserkraftwerk",
      fr: "Centrale Hydroélectrique d'Itaipu"
    },
    shortDescription: {
      pt: "A maior usina hidrelétrica da América Latina",
      en: "The largest hydroelectric plant in Latin America",
      de: "Das größte Wasserkraftwerk Lateinamerikas",
      fr: "La plus grande centrale hydroélectrique d'Amérique Latine"
    },
    fullDescription: {
      pt: `INFORMAÇÕES GERAIS:
      A ITAIPU é uma das maiores geradoras de energia, localizada na fronteira entre o Brasil e Paraguai, no Rio Paraná. É a Hidrelétrica Binacional (Brasil e Paraguai) e foi inaugurada em 1984. Tem produção de energia de 14.000 Megawatts, que é suficiente para abastecer o Paraguai e parte do Brasil.
      
      OBJETIVO:
      O objetivo da nossa visita foi aprender e entender como funciona a produção de energia na maior hidrelétrica da América Latina.
      
      PRINCIPAIS DESCOBERTAS/RESULTADOS:
      • A Usina Hidrelétrica de Itaipu é líder mundial de energia limpa e renovável
      • Produção anual de energia estável e consistente
      • Exemplo de desenvolvimento sustentável e tecnologia avançada`,
      en: `GENERAL INFORMATION:
      ITAIPU is one of the largest energy producers, located on the border between Brazil and Paraguay, on the Paraná River. It is a Binational Hydroelectric Plant (Brazil and Paraguay) and was inaugurated in 1984. It has an energy production of 14,000 Megawatts, which is enough to supply Paraguay and part of Brazil.
      
      OBJECTIVE:
      The objective of our visit was to learn and understand how energy production works at the largest hydroelectric plant in Latin America.
      
      MAIN DISCOVERIES/RESULTS:
      • Itaipu Hydroelectric Plant is the world leader in clean and renewable energy
      • Stable and consistent annual energy production
      • Example of sustainable development and advanced technology`,
      de: `ALLGEMEINE INFORMATIONEN:
      ITAIPU ist einer der größten Energieerzeuger und befindet sich an der Grenze zwischen Brasilien und Paraguay, am Paraná-Fluss. Es ist ein binationales Wasserkraftwerk (Brasilien und Paraguay) und wurde 1984 eingeweiht. Es hat eine Energieproduktion von 14.000 Megawatt, was ausreicht, um Paraguay und einen Teil Brasiliens zu versorgen.
      
      ZIEL:
      Das Ziel unseres Besuchs war es, zu lernen und zu verstehen, wie die Energieproduktion im größten Wasserkraftwerk Lateinamerikas funktioniert.
      
      WICHTIGSTE ENTDECKUNGEN/ERGEBNISSE:
      • Das Itaipu-Wasserkraftwerk ist weltweit führend in sauberer und erneuerbarer Energie
      • Stabile und konsistente jährliche Energieproduktion
      • Beispiel für nachhaltige Entwicklung und fortschrittliche Technologie`,
      fr: `INFORMATIONS GÉNÉRALES:
      ITAIPU est l'un des plus grands producteurs d'énergie, situé à la frontière entre le Brésil et le Paraguay, sur le fleuve Paraná. Il s'agit d'une centrale hydroélectrique binationale (Brésil et Paraguay), inaugurée en 1984. Sa production énergétique atteint 14 000 mégawatts, suffisante pour approvisionner le Paraguay et une partie du Brésil.
      
      OBJECTIF:
      L'objectif de notre visite était d'apprendre et de comprendre le fonctionnement de la production d'énergie dans la plus grande centrale hydroélectrique d'Amérique latine.
      
      PRINCIPALES DÉCOUVERTES/RÉSULTATS:
      • La centrale hydroélectrique d'Itaipu est leader mondial de l'énergie propre et renouvelable
      • Production énergétique annuelle stable et constante
      • Exemple de développement durable et de technologie avancée`
    },
    authors: {
      pt: "Henrique, Davi, Gustavo S, Caetano, João Marcelo, Matheus D, Miguel",
      en: "Henrique, Davi, Gustavo S, Caetano, João Marcelo, Matheus D, Miguel",
      de: "Henrique, Davi, Gustavo S, Caetano, João Marcelo, Matheus D, Miguel",
      fr: "Henrique, Davi, Gustavo S, Caetano, João Marcelo, Matheus D, Miguel"
    },
    imageUrl: 'https://i.pinimg.com/736x/20/94/f9/2094f934478f5cbe49e67c89694919ed.jpg'
  },
  {
    id: 2,
    title: {
      pt: "Parque Nacional do Iguaçu",
      en: "Iguaçu National Park",
      de: "Iguaçu-Nationalpark",
      fr: "Parc National d'Iguaçu"
    },
    shortDescription: {
      pt: "Patrimônio Natural da Humanidade",
      en: "Natural World Heritage Site",
      de: "Weltnaturerbe",
      fr: "Patrimoine Naturel Mondial"
    },
    fullDescription: {
      pt: `INTRODUÇÃO:
      • Fronteira entre Brasil e Argentina
      • Patrimônio Natural da Humanidade (UNESCO)
      • 2,7 km de extensão
      • + de 270 quedas de água, de até 80 metros de altura
      • Queda do Diabo
      
      PRINCIPAIS DESCOBERTAS/RESULTADOS:
      • 150 milhões de anos (erupções vulcânicas e deslocamentos de placas)
      • Biodiversidade
      • 1500 - 12.000 metros cúbicos por segundo
      • 80% lado argentino
      • Rio Paraná`,
      en: `INTRODUCTION:
      • Border between Brazil and Argentina
      • Natural World Heritage Site (UNESCO)
      • 2.7 km in length
      • Over 270 waterfalls, up to 80 meters high
      • Devil's Throat
      
      MAIN DISCOVERIES/RESULTS:
      • 150 million years old (volcanic eruptions and plate shifts)
      • Biodiversity
      • 1500 - 12,000 cubic meters per second
      • 80% on the Argentine side
      • Paraná River`,
      de: `EINFÜHRUNG:
      • Grenze zwischen Brasilien und Argentinien
      • Weltnaturerbe (UNESCO)
      • 2,7 km Länge
      • Über 270 Wasserfälle, bis zu 80 Meter hoch
      • Teufelsschlund
      
      WICHTIGSTE ENTDECKUNGEN/ERGEBNISSE:
      • 150 Millionen Jahre alt (vulkanische Eruptionen und Plattenverschiebungen)
      • Biodiversität
      • 1500 - 12.000 Kubikmeter pro Sekunde
      • 80% auf der argentinischen Seite
      • Paraná-Fluss`,
      fr: `INTRODUCTION:
      • Frontière entre le Brésil et l'Argentine
      • Site du patrimoine mondial naturel (UNESCO)
      • 2,7 km de longueur
      • Plus de 270 chutes d'eau, allant jusqu'à 80 mètres de haut
      • Gorges du Diable
      
      PRINCIPALES DÉCOUVERTES/RÉSULTATS:
      • 150 millions d'années (éruptions volcaniques et déplacements de plaques)
      • Biodiversité
      • 1500 - 12 000 mètres cubes par seconde
      • 80% du côté argentin
      • Fleuve Paraná`
    },
    authors: {
      pt: "Maele, Alana, Nicole, Francisco, Maria Fernanda e Larry",
      en: "Maele, Alana, Nicole, Francisco, Maria Fernanda, and Larry",
      de: "Maele, Alana, Nicole, Francisco, Maria Fernanda und Larry",
      fr: "Maele, Alana, Nicole, Francisco, Maria Fernanda et Larry"
    },
    imageUrl: 'https://www.icmbio.gov.br/parnaiguacu/images/Galeria_de_imagens/10.jpg'
  },
  {
    id: 3,
    title: {
      pt: "Patrimônio Social e Cultural de Foz do Iguaçu",
      en: "Social and Cultural Heritage of Foz do Iguaçu",
      de: "Soziales und Kulturelles Erbe von Foz do Iguaçu",
      fr: "Patrimoine Social et Culturel de Foz do Iguaçu"
    },
    shortDescription: {
      pt: "Templo Budista e Marco das Três Fronteiras",
      en: "Buddhist Temple and Triple Frontier Landmark",
      de: "Buddhistischer Tempel und Dreiländereck",
      fr: "Temple Bouddhiste et Repère des Trois Frontières"
    },
    fullDescription: {
      pt: `INTRODUÇÃO:
      O foco do nosso trabalho será o patrimônio social e cultural da cidade de Foz do Iguaçu, o qual está totalmente relacionado tanto com o Templo Budista quanto com Marco das Três Fronteiras, dois pontos turísticos muito importantes para a cidade.
      
      PRINCIPAIS DESCOBERTAS/RESULTADOS:
      • A história e a importância da migração chinesa para o Brasil e a tríplice fronteira
      • Correlação entre a migração e propagação da crença e costumes budistas na cidade
      • História diplomática por trás do Marco das 3 Fronteiras`,
      en: `INTRODUCTION:
      Our work focuses on the social and cultural heritage of the city of Foz do Iguaçu, which is closely related to both the Buddhist Temple and the Triple Frontier Landmark, two very important tourist spots for the city.
      
      MAIN DISCOVERIES/RESULTS:
      • The history and importance of Chinese migration to Brazil and the Triple Frontier
      • Correlation between migration and the spread of Buddhist beliefs and customs in the city
      • Diplomatic history behind the Triple Frontier Landmark`,
      de: `EINFÜHRUNG:
      Unsere Arbeit konzentriert sich auf das soziale und kulturelle Erbe der Stadt Foz do Iguaçu, das eng mit dem buddhistischen Tempel und dem Dreiländereck verbunden ist, zwei sehr wichtigen Touristenattraktionen der Stadt.
      
      WICHTIGSTE ENTDECKUNGEN/ERGEBNISSE:
      • Die Geschichte und Bedeutung der chinesischen Migration nach Brasilien und ins Dreiländereck
      • Korrelation zwischen Migration und der Verbreitung buddhistischer Glaubensrichtungen und Bräuche in der Stadt
      • Diplomatische Geschichte hinter dem Dreiländereck`,
      fr: `INTRODUCTION:
      Notre travail se concentre sur le patrimoine social et culturel de la ville de Foz do Iguaçu, qui est étroitement lié à la fois au Temple Bouddhiste et au Repère des Trois Frontières, deux points touristiques très importants pour la ville.
      
      PRINCIPALES DÉCOUVERTES/RÉSULTATS:
      • L'histoire et l'importance de la migration chinoise au Brésil et à la triple frontière
      • Corrélation entre la migration et la propagation des croyances et coutumes bouddhistes dans la ville
      • Histoire diplomatique derrière le Repère des Trois Frontières`
    },
    authors: {
      pt: "Arthur Esser, Gabriela Böhler, Joaquim Martins, Lucca Buono e Sophia Priebe",
      en: "Arthur Esser, Gabriela Böhler, Joaquim Martins, Lucca Buono, and Sophia Priebe",
      de: "Arthur Esser, Gabriela Böhler, Joaquim Martins, Lucca Buono und Sophia Priebe",
      fr: "Arthur Esser, Gabriela Böhler, Joaquim Martins, Lucca Buono et Sophia Priebe"
    },
    imageUrl: 'https://www.visitefoz.com.br/wp-content/uploads/2012/09/foto_templobudista_1.jpg' // Path da imagem enviada
  },
  {
    id: 4,
    title: {
      pt: "Parque das Aves",
      en: "Bird Park",
      de: "Vogelpark",
      fr: "Parc des Oiseaux"
    },
    shortDescription: {
      pt: "Preservação de espécies em extinção",
      en: "Preservation of endangered species",
      de: "Erhaltung bedrohter Arten",
      fr: "Préservation des espèces en voie de disparition"
    },
    fullDescription: {
      pt: `INTRODUÇÃO:
      No Parque das Aves é possível encontrar diversas espécies de aves e alguns répteis. O parque é focado na preservação de animais resgatados da mata atlântica.
      
      OBJETIVO:
      Apresentar as espécies que estão em risco de extinção e compreender seu habitat natural.
      
      PRINCIPAIS DESCOBERTAS/RESULTADOS:
      • Diversas aves e répteis, como papagaios e flamingos, que são recuperados.
      • Importância da reprodução assistida através do uso de espelhos para flamingos.`,
      en: `INTRODUCTION:
      In the Bird Park, it is possible to find various species of birds and some reptiles. The park is focused on preserving animals rescued from the Atlantic Forest.
      
      OBJECTIVE:
      To present species that are at risk of extinction and understand their natural habitat.
      
      MAIN DISCOVERIES/RESULTS:
      • Various birds and reptiles, such as parrots and flamingos, are recovered.
      • Importance of assisted reproduction through the use of mirrors for flamingos.`,
      de: `EINFÜHRUNG:
      Im Vogelpark kann man verschiedene Vogelarten und einige Reptilien finden. Der Park konzentriert sich auf die Erhaltung von Tieren, die aus dem Atlantischen Regenwald gerettet wurden.
      
      ZIEL:
      Präsentation von Arten, die vom Aussterben bedroht sind, und Verständnis ihres natürlichen Lebensraums.
      
      WICHTIGSTE ENTDECKUNGEN/ERGEBNISSE:
      • Verschiedene Vögel und Reptilien, wie Papageien und Flamingos, werden gerettet.
      • Bedeutung der assistierten Fortpflanzung durch den Einsatz von Spiegeln für Flamingos.`,
      fr: `INTRODUCTION:
      Dans le Parc des Oiseaux, il est possible de trouver diverses espèces d'oiseaux et quelques reptiles. Le parc est axé sur la préservation des animaux sauvés de la forêt atlantique.
      
      OBJECTIF:
      Présenter des espèces menacées d'extinction et comprendre leur habitat naturel.
      
      PRINCIPALES DÉCOUVERTES/RÉSULTATS:
      • Divers oiseaux et reptiles, tels que les perroquets et les flamants roses, sont récupérés.
      • Importance de la reproduction assistée à travers l'utilisation de miroirs pour les flamants roses.`
    },
    authors: {
      pt: "Amanda, Eduardo Dyck, Egon Rocha, Milena e Théo Bicudo",
      en: "Amanda, Eduardo Dyck, Egon Rocha, Milena, and Théo Bicudo",
      de: "Amanda, Eduardo Dyck, Egon Rocha, Milena und Théo Bicudo",
      fr: "Amanda, Eduardo Dyck, Egon Rocha, Milena et Théo Bicudo"
    },
    imageUrl: 'https://f.i.uol.com.br/fotografia/2022/09/13/16631010466320e8762bca4_1663101046_3x2_md.jpg' // Path da imagem enviada
  },
  {
    id: 5,
    title: {
      pt: "Marco das Três Fronteiras",
      en: "Three Borders Landmark",
      de: "Dreiländereck",
      fr: "Repère des Trois Frontières"
    },
    shortDescription: {
      pt: "Símbolo das três nações: Brasil, Argentina, Paraguai",
      en: "Symbol of the three nations: Brazil, Argentina, Paraguay",
      de: "Symbol der drei Nationen: Brasilien, Argentinien, Paraguay",
      fr: "Symbole des trois nations : Brésil, Argentine, Paraguay"
    },
    fullDescription: {
      pt: `INTRODUÇÃO:
      O Marco das Três Fronteiras é um ponto turístico histórico que marca a junção entre Brasil, Argentina e Paraguai. Cada país tem um monumento que simboliza sua parte desta fronteira tripla.
      
      OBJETIVO:
      Entender o significado histórico e cultural deste marco, que conecta três nações.
      
      PRINCIPAIS DESCOBERTAS/RESULTADOS:
      • História da fundação do Marco das Três Fronteiras.
      • A importância do turismo cultural e geopolítico para as três nações.`,
      en: `INTRODUCTION:
      The Three Borders Landmark is a historic tourist point that marks the junction between Brazil, Argentina, and Paraguay. Each country has a monument symbolizing its part of this triple frontier.
      
      OBJECTIVE:
      Understand the historical and cultural significance of this landmark that connects three nations.
      
      MAIN DISCOVERIES/RESULTS:
      • History of the foundation of the Three Borders Landmark.
      • The importance of cultural and geopolitical tourism for the three nations.`,
      de: `EINFÜHRUNG:
      Das Dreiländereck ist ein historischer Touristenpunkt, der die Verbindung zwischen Brasilien, Argentinien und Paraguay markiert. Jedes Land hat ein Denkmal, das seinen Teil dieser dreifachen Grenze symbolisiert.
      
      ZIEL:
      Verständnis der historischen und kulturellen Bedeutung dieses Landmarks, das drei Nationen verbindet.
      
      WICHTIGSTE ENTDECKUNGEN/ERGEBNISSE:
      • Geschichte der Gründung des Dreiländerecks.
      • Die Bedeutung des kulturellen und geopolitischen Tourismus für die drei Nationen.`,
      fr: `INTRODUCTION:
      Le Repère des Trois Frontières est un point touristique historique qui marque la jonction entre le Brésil, l'Argentine et le Paraguay. Chaque pays a un monument qui symbolise sa partie de cette frontière triple.
      
      OBJECTIF:
      Comprendre la signification historique et culturelle de ce repère qui relie trois nations.
      
      PRINCIPALES DÉCOUVERTES/RÉSULTATS:
      • Histoire de la fondation du Repère des Trois Frontières.
      • L'importance du tourisme culturel et géopolitique pour les trois nations.`
    },
    authors: {
      pt: "Arthur Esser, Gabriela Böhler, Joaquim Martins, Lucca Buono e Sophia Priebe",
      en: "Arthur Esser, Gabriela Böhler, Joaquim Martins, Lucca Buono, and Sophia Priebe",
      de: "Arthur Esser, Gabriela Böhler, Joaquim Martins, Lucca Buono und Sophia Priebe",
      fr: "Arthur Esser, Gabriela Böhler, Joaquim Martins, Lucca Buono et Sophia Priebe"
    },
    imageUrl: 'https://saopauloparacriancas.com.br/wp-content/uploads/2023/09/marco-das-tres-fronteiras.jpg' // Path da imagem enviada
  }
];



























const initialTestimonials = [
  {
    quote: {
      pt: "Eu achei a semana de estudos muito legal! Todos os lugares que a gente foi foram muito bem escolhidos pela escola como o Parque das Aves, Refúgio Biológico, Hidrelétrica de Itaipu, e Cataratas do Iguaçu. As comidas também estavam bem boas, lá a gente comeu churrasco, comida japonesa e comida italiana.",
      en: "I found the study week really cool! All the places we went to were very well chosen by the school, like the Bird Park, Biological Refuge, Itaipu Hydroelectric Plant, and Iguaçu Falls. The food was also very good, we had barbecue, Japanese food, and Italian food there.",
      de: "Ich fand die Studienwoche wirklich toll! Alle Orte, die wir besuchten, wurden von der Schule sehr gut ausgewählt, wie der Vogelpark, das Biologische Refugium, das Itaipu-Wasserkraftwerk und die Iguaçu-Wasserfälle. Auch das Essen war sehr gut, wir hatten dort Grillgerichte, japanisches Essen und italienisches Essen.",
      fr: "J'ai trouvé la semaine d'études vraiment cool ! Tous les endroits où nous sommes allés ont été très bien choisis par l'école, comme le Parc des Oiseaux, le Refuge Biologique, la Centrale Hydroélectrique d'Itaipu et les Chutes d'Iguaçu. La nourriture était aussi très bonne, nous avons mangé du barbecue, de la cuisine japonaise et de la cuisine italienne."
    },
    author: {
      pt: "Andrey",
      en: "Andrey",
      de: "Andrey",
      fr: "Andrey"
    },
    role: {
      pt: "Aluno",
      en: "Student",
      de: "Schüler",
      fr: "Étudiant"
    }
  },
  {
    quote: {
      pt: "Fomos para Foz de Iguaçu, eu nunca tinha ido antes. Fiquei muito feliz e animado quando descobri que iríamos para lá.",
      en: "We went to Foz do Iguaçu, I had never been there before. I was very happy and excited when I found out we were going.",
      de: "Wir gingen nach Foz do Iguaçu, ich war noch nie dort gewesen. Ich war sehr glücklich und aufgeregt, als ich erfuhr, dass wir dorthin gehen würden.",
      fr: "Nous sommes allés à Foz do Iguaçu, je n'y étais jamais allé auparavant. J'étais très heureux et excité quand j'ai découvert que nous y allions."
    },
    author: {
      pt: "Martin",
      en: "Martin",
      de: "Martin",
      fr: "Martin"
    },
    role: {
      pt: "Aluno",
      en: "Student",
      de: "Schüler",
      fr: "Étudiant"
    }
  }
];
const initialWhyImportant = [
  {
    title: {
      pt: "Aprendizado Prático",
      en: "Practical Learning",
      de: "Praktisches Lernen",
      fr: "Apprentissage Pratique"
    },
    text: {
      pt: "A Semana de Estudos do Colégio foi uma experiência enriquecedora, proporcionando aos alunos a oportunidade de explorar diversos lugares e aprofundar seu conhecimento fora da sala de aula.",
      en: "The school's Study Week was an enriching experience, providing students the opportunity to explore different places and deepen their knowledge outside the classroom.",
      de: "Die Studienwoche der Schule war eine bereichernde Erfahrung, die den Schülern die Möglichkeit bot, verschiedene Orte zu erkunden und ihr Wissen außerhalb des Klassenzimmers zu vertiefen.",
      fr: "La Semaine d'Études de l'école a été une expérience enrichissante, offrant aux élèves l'opportunité d'explorer différents lieux et d'approfondir leurs connaissances en dehors de la salle de classe."
    }
  },
  {
    title: {
      pt: "Integração Cultural",
      en: "Cultural Integration",
      de: "Kulturelle Integration",
      fr: "Intégration Culturelle"
    },
    text: {
      pt: "Durante a semana, além de aprender sobre a biodiversidade e a importância da preservação ambiental, os alunos também tiveram a chance de apreciar a culinária local, experimentando diferentes culturas gastronômicas.",
      en: "During the week, besides learning about biodiversity and the importance of environmental preservation, students also had the chance to appreciate the local cuisine, experiencing different gastronomic cultures.",
      de: "Während der Woche lernten die Schüler neben der Biodiversität und der Bedeutung des Umweltschutzes auch die lokale Küche kennen und erlebten verschiedene gastronomische Kulturen.",
      fr: "Pendant la semaine, en plus d'apprendre sur la biodiversité et l'importance de la préservation de l'environnement, les élèves ont également eu la chance d'apprécier la cuisine locale, en expérimentant différentes cultures gastronomiques."
    }
  }
];





function App() {
  const [selectedLang, setSelectedLang] = useState('pt');
  const [isTranslating, setIsTranslating] = useState(false);  // Estado de carregamento
  const [selectedProject, setSelectedProject] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Função para mudar o idioma com simulação de carregamento
  const changeLanguage = (lang) => {
    setIsTranslating(true);  // Ativar o estado de carregamento
    setTimeout(() => {       // Simular tempo de carregamento (por exemplo, 2 segundos)
      setSelectedLang(lang);
      setIsTranslating(false);  // Desativar o estado de carregamento
      toast({
        title: `Idioma alterado para ${lang.toUpperCase()}`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }, 1500);  // Tempo de espera simulado (1.5 segundos)
  };

  // Função para acessar os textos traduzidos com base no idioma selecionado
  const getText = (item, key) => {
    return item[key][selectedLang];
  };

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="gray.50">
        
        {isTranslating && (
          <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="rgba(255, 255, 255, 0.8)"
            zIndex="9999"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <VStack spacing={4}>
              <Spinner size="xl" color="brand.500" />
              <Text fontWeight="bold">{translations[selectedLang].loading}</Text>
            </VStack>
          </Box>
        )}

        {/* Header */}
        <Box bg="white" py={4} shadow="sm" position="sticky" top="0" zIndex="900">
          <Container maxW="container.xl">
            <Flex justify="space-between" align="center">
              <Image
                src={SWISS_SCHOOL_LOGO}
                alt="Colégio Suíço Brasileiro"
                height="50px"
                objectFit="contain"
              />
              <HStack spacing={2}>
                {[
                  { lang: 'pt', flag: 'br', label: 'Português' },
                  { lang: 'en', flag: 'gb', label: 'English' },
                  { lang: 'de', flag: 'de', label: 'Deutsch' },
                  { lang: 'fr', flag: 'fr', label: 'Français' }
                ].map((item) => (
                  <IconButton
                    key={item.lang}
                    aria-label={item.label}
                    icon={<Image src={`https://flagcdn.com/w40/${item.flag}.png`} alt={item.label} w="20px" />}
                    onClick={() => changeLanguage(item.lang)}
                    isActive={selectedLang === item.lang}
                    variant={selectedLang === item.lang ? 'solid' : 'outline'}
                    colorScheme="brand"
                  />
                ))}
              </HStack>
            </Flex>
          </Container>
        </Box>

        {/* Hero Section */}
        <Box py={20} textAlign="center" bgGradient="linear(to-r, brand.500, red.600)" color="white">
          <Container maxW="container.xl">
            <VStack spacing={4}>
              <Text fontSize="xl" fontWeight="bold" bgGradient="linear(to-r, white, gray.300)" bgClip="text">
                {translations[selectedLang].title}
              </Text>
              <Heading size="4xl" fontWeight="black" mb={2}>
                {translations[selectedLang].subtitle}
              </Heading>
              <Text fontSize="xl">
                {translations[selectedLang].year}
              </Text>
            </VStack>
          </Container>
        </Box>

        {/* Projects Section */}
        <Box py={20}>
          <Container maxW="container.xl">
            <Heading textAlign="center" color="brand.500" size="2xl" mb={12}>
              {translations[selectedLang].projects}
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {initialProjectsData.map((project) => (
                <Box
                  key={project.id}
                  bg="white"
                  rounded="xl"
                  shadow="xl"
                  overflow="hidden"
                  cursor="pointer"
                  onClick={() => {
                    setSelectedProject(project);
                    onOpen();
                  }}
                  _hover={{ transform: 'translateY(-5px)', shadow: '2xl' }}
                  transition="all 0.3s"
                >
                  <Image
                    src={project.imageUrl}
                    alt={getText(project, 'title')}
                    h="300px"
                    w="full"
                    objectFit="cover"
                  />
                  <Box p={6}>
                    <Heading size="md" mb={3} color="brand.500">
                      {getText(project, 'title')}
                    </Heading>
                    <Text color="gray.600">
                      {getText(project, 'shortDescription')}
                    </Text>
                    <Text mt={4} fontSize="sm" color="gray.500">
                      {getText(project, 'authors')}
                    </Text>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </Container>
        </Box>

        {/* Testimonials Section */}
        <Box py={20} bg="white">
          <Container maxW="container.xl">
            <Heading textAlign="center" color="brand.500" size="2xl" mb={12}>
              {translations[selectedLang].testimonials}
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              {initialTestimonials.map((testimonial, index) => (
                <Box key={index} bg="gray.50" p={8} borderRadius="lg" shadow="md" _hover={{ transform: 'translateY(-5px)' }} transition="all 0.3s">
                  <Text fontSize="lg" fontStyle="italic" mb={4}>
                    "{getText(testimonial, 'quote')}"
                  </Text>
                  <Text color="brand.500" fontWeight="bold">
                    – {getText(testimonial, 'author')}, {getText(testimonial, 'role')}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Container>
        </Box>

        {/* Why Study Week is Important Section */}
        <Box py={20} bg="gray.50">
          <Container maxW="container.xl">
            <Heading textAlign="center" color="brand.500" size="2xl" mb={12}>
              {translations[selectedLang].why}
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              {initialWhyImportant.map((item, index) => (
                <Box key={index} bg="white" p={6} borderRadius="lg" shadow="md">
                  <Heading size="md" mb={4} color="brand.500">
                    {getText(item, 'title')}
                  </Heading>
                  <Text fontSize="lg" color="gray.700">
                    {getText(item, 'text')}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Container>
        </Box>

        {/* Modal para o projeto selecionado */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="brand.500">
              {selectedProject && getText(selectedProject, 'title')}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedProject && (
                <VStack align="stretch" spacing={6}>
                  <Image
                    src={selectedProject.imageUrl}
                    alt={getText(selectedProject, 'title')}
                    borderRadius="lg"
                    objectFit="cover"
                    maxH="400px"
                    w="full"
                  />
                  <Text whiteSpace="pre-line" color="gray.700">
                    {getText(selectedProject, 'fullDescription')}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {getText(selectedProject, 'authors')}
                  </Text>
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Footer */}
        <Box as="footer" bg="brand.500" color="white" py={6}>
          <Container maxW="container.xl">
            <Text textAlign="center" fontSize="lg" fontWeight="medium">
              © {new Date().getFullYear()} Colégio Suíço Brasileiro
            </Text>
          </Container>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
