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

// Dados iniciais
const initialProjectsData = [
  {
    id: 1,
    title: "Hidrelétrica de Itaipu",
    shortDescription: "A maior usina hidrelétrica da América Latina",
    fullDescription: `INFORMAÇÕES GERAIS:
    A ITAIPU é uma das maiores geradoras de energia, localizada na fronteira entre o Brasil e Paraguai, no Rio Paraná. É a Hidrelétrica Binacional (Brasil e Paraguai) e foi inaugurada em 1984. Tem produção de energia de 14.000 Megawatts, que é suficiente para abastecer o Paraguai e parte do Brasil.

    OBJETIVO:
    O objetivo da nossa visita foi aprender e entender como funciona a produção de energia na maior hidrelétrica da América Latina.

    PRINCIPAIS DESCOBERTAS/RESULTADOS:
    • A Usina Hidrelétrica de Itaipu é líder mundial de energia limpa e renovável
    • Produção anual de energia estável e consistente
    • Exemplo de desenvolvimento sustentável e tecnologia avançada`,
    imageUrl: 'https://source.unsplash.com/random/800x600/?itaipu-dam',
    authors: "Henrique, Davi, Gustavo S, Caetano, João Marcelo, Matheus D, Miguel"
  },
  {
    id: 2,
    title: "Parque Nacional do Iguaçu",
    shortDescription: "Patrimônio Natural da Humanidade",
    fullDescription: `INTRODUÇÃO:
    • Fronteira entre Brasil e Argentina
    • Patrimônio Natural da Humanidade (UNESCO)
    • 2,7 km de extensão
    • + de 270 quedas de água, de até 80 metros de altura
    • Queda do Diabo (U)

    TEORIA - GUARANIS:
    • Mito dos povos Guaranis
    • Índio prefere de Tarobá
    • Naipi e Tarobá sofrem de barco
    • M'Bói faz uma fenda no rio

    PRINCIPAIS DESCOBERTAS/RESULTADOS:
    • 150 milhões de anos (erupções vulcânicas e deslocamentos de placas)
    • Biodiversidade
    • 1500 - 12.000 metros por segundo
    • 80% lado argentino
    • Rio Paraná`,
    imageUrl: 'https://source.unsplash.com/random/800x600/?iguazu-falls',
    authors: "Maele, Alana, Nicole, Francisco, Maria Fernanda e Larry"
  }
];

// Dados dos depoimentos e motivos
const initialTestimonials = [
  {
    quote: "Eu achei a semana de estudos muito legal! Todos os lugares que a gente foi foram muito bem escolhidos pela escola como O Parque das Aves, Refúgio Biológico, Hidrelétrica de Itaipu, e Cataratas do Iguaçu. As comidas também estavam bem boas, lá a gente comeu churrasco, comida japonesa e comida italiana.",
    author: "Andrey",
    role: "Aluno"
  },
  {
    quote: "Ver os alunos tão envolvidos com a ciência e inovação foi muito gratificante. A semana superou todas as expectativas!",
    author: "Professora Raissa",
    role: "Professora"
  }
];

const initialWhyImportant = [
  {
    title: "Aprendizado Prático",
    text: "A Semana de Estudos do Colégio foi uma experiência enriquecedora, proporcionando aos alunos a oportunidade de explorar diversos lugares e aprofundar seu conhecimento fora da sala de aula."
  },
  {
    title: "Integração Cultural",
    text: "Durante a semana, além de aprender sobre a biodiversidade e a importância da preservação ambiental, os alunos também tiveram a chance de apreciar a culinária local, experimentando diferentes culturas gastronômicas."
  }
];







// VAI PORRA


// Funções de tradução
const splitTextIntoChunks = (text, maxLength = 450) => {
  const chunks = [];
  let currentChunk = '';
  
  const paragraphs = text.split('\n');

  for (let paragraph of paragraphs) {
    if (paragraph.length > maxLength) {
      const sentences = paragraph.split('. ');
      let currentSentenceChunk = '';

      for (let sentence of sentences) {
        if ((currentSentenceChunk + sentence).length > maxLength) {
          if (currentSentenceChunk) {
            chunks.push(currentSentenceChunk.trim());
          }
          currentSentenceChunk = sentence + '. ';
        } else {
          currentSentenceChunk += sentence + '. ';
        }
      }
      
      if (currentSentenceChunk) {
        chunks.push(currentSentenceChunk.trim());
      }
    } else {
      if ((currentChunk + paragraph).length > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = paragraph + '\n';
      } else {
        currentChunk += paragraph + '\n';
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};

// Componente principal
function App() {
  const [selectedLang, setSelectedLang] = useState('pt');
  const [isTranslating, setIsTranslating] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectsData, setProjectsData] = useState(initialProjectsData);
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [whyImportant, setWhyImportant] = useState(initialWhyImportant);

  const translateLongText = async (text, targetLang) => {
    if (targetLang === 'pt') return text;
    
    try {
      const chunks = splitTextIntoChunks(text);
      
      const translatedChunks = await Promise.all(
        chunks.map(async (chunk) => {
          try {
            const response = await axios.get(
              `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=pt|${targetLang}`
            );
            return response.data.responseData.translatedText;
          } catch (error) {
            console.error('Erro na tradução de chunk:', error);
            return chunk;
          }
        })
      );
      
      return translatedChunks.join('\n');
    } catch (error) {
      console.error('Erro na tradução:', error);
      return text;
    }
  };

  const handleLanguageChange = async (lang) => {
    setSelectedLang(lang);
    if (lang === 'pt') {
      setProjectsData(initialProjectsData);
      setTestimonials(initialTestimonials);
      setWhyImportant(initialWhyImportant);
      return;
    }

    setIsTranslating(true);

    try {
      // Traduz projetos
      const updatedProjects = await Promise.all(
        projectsData.map(async (project) => ({
          ...project,
          title: await translateLongText(project.title, lang),
          shortDescription: await translateLongText(project.shortDescription, lang),
          fullDescription: await translateLongText(project.fullDescription, lang)
        }))
      );
      setProjectsData(updatedProjects);

      // Traduz depoimentos
      const updatedTestimonials = await Promise.all(
        testimonials.map(async (testimonial) => ({
          ...testimonial,
          quote: await translateLongText(testimonial.quote, lang),
          role: await translateLongText(testimonial.role, lang)
        }))
      );
      setTestimonials(updatedTestimonials);

      // Traduz motivos
      const updatedWhyImportant = await Promise.all(
        whyImportant.map(async (item) => ({
          ...item,
          title: await translateLongText(item.title, lang),
          text: await translateLongText(item.text, lang)
        }))
      );
      setWhyImportant(updatedWhyImportant);

    } catch (error) {
      console.error('Erro na tradução:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const getText = (key) => translations[selectedLang]?.[key] || translations.pt[key];

  const LoadingOverlay = () => (
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
        <Text fontWeight="bold">{getText('loading')}</Text>
      </VStack>
    </Box>
  );

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="gray.50">
        {isTranslating && <LoadingOverlay />}
        
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
                  { lang: 'pt', flag: 'br', label: 'Brasil' },
                  { lang: 'en', flag: 'gb', label: 'English' },
                  { lang: 'de', flag: 'ch', label: 'Deutsch' },
                  { lang: 'fr', flag: 'fr', label: 'Français' }
                ].map((item) => (
                  <IconButton
                    key={item.lang}
                    aria-label={item.label}
                    icon={<Image src={`https://flagcdn.com/w40/${item.flag}.png`} alt={item.label} w="20px" />}
                    onClick={() => handleLanguageChange(item.lang)}
                    isActive={selectedLang === item.lang}
                    variant={selectedLang === item.lang ? 'solid' : 'outline'}
                    colorScheme="brand"
                  />
                ))}
              </HStack>
            </Flex>
          </Container>
        </Box>

        {/* Hero */}
        <Box py={20} textAlign="center" bgGradient="linear(to-r, brand.500, red.600)" color="white">
          <Container maxW="container.xl">
            <VStack spacing={4}>
              <Text
                fontSize="xl"
                fontWeight="bold"
                bgGradient="linear(to-r, white, gray.300)"
                bgClip="text"
              >
                {getText('title')}
              </Text>
              <Heading size="4xl" fontWeight="black" mb={2}>
                {getText('subtitle')}
              </Heading>
              <Text fontSize="xl">
                {getText('year')}
              </Text>
            </VStack>
          </Container>
        </Box>

        {/* Projetos */}
        <Box py={20}>
          <Container maxW="container.xl">
            <Heading textAlign="center" color="brand.500" size="2xl" mb={12}>
              {getText('projects')}
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {projectsData.map((project) => (
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
                    alt={project.title}
                    h="300px"
                    w="full"
                    objectFit="cover"
                  />
                  <Box p={6}>
                    <Heading size="md" mb={3} color="brand.500">
                      {project.title}
                    </Heading>
                    <Text color="gray.600">
                      {project.shortDescription}
                    </Text>
                    <Text mt={4} fontSize="sm" color="gray.500">
                      {project.authors}
                    </Text>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </Container>
        </Box>

        {/* Depoimentos */}
        <Box py={20} bg="white">
          <Container maxW="container.xl">
            <Heading textAlign="center" color="brand.500" mb={12}>
              {getText('testimonials')}
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              {testimonials.map((testimonial, index) => (
                <Box
                  key={index}
                  bg="gray.50"
                  p={8}
                  borderRadius="lg"
                  shadow="md"
                  _hover={{ transform: 'translateY(-5px)' }}
                  transition="all 0.3s"
                >
                  <Text fontSize="lg" fontStyle="italic" mb={4}>
                    "{testimonial.quote}"
                  </Text>
                  <Text color="brand.500" fontWeight="bold">
                    – {testimonial.author}, {testimonial.role}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Container>
        </Box>

        {/* Por que foi importante */}
        <Box py={20} bg="gray.50">
          <Container maxW="container.xl">
            <Heading textAlign="center" color="brand.500" mb={12}>
              {getText('why')}
            </Heading>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={10}>
              {whyImportant.map((item, index) => (
                <Box key={index}>
                  <Heading size="md" mb={4} color="brand.500">
                    {item.title}
                  </Heading>
                  <Text fontSize="lg" color="gray.700">
                    {item.text}
                  </Text>
                </Box>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="brand.500">
              {selectedProject?.title}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedProject && (
                <VStack align="stretch" spacing={6}>
                  <Image
                    src={selectedProject.imageUrl}
                    alt={selectedProject.title}
                    borderRadius="lg"
                    objectFit="cover"
                    maxH="400px"
                    w="full"
                  />
                  <Text whiteSpace="pre-line" color="gray.700">
                    {selectedProject.fullDescription}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {selectedProject.authors}
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