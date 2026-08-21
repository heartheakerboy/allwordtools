import { useState } from "react";
import { Copy, Loader2, Search, Sparkles, X, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n/I18nProvider";

interface ClueEntry {
  clue: string;
  answer: string;
  world: string;
  group: string;
  phase: string;
  length: number;
}

const LOCALIZED_TEXTS: Record<
  string,
  {
    label: string;
    placeholder: string;
    btnSearch: string;
    popularClues: string;
    loadingText: string;
    searchResults: string;
    clickCopy: string;
    noResults: string;
    noResultsSub: string;
    world: string;
    group: string;
    phase: string;
    answerText: string;
    toastEmpty: string;
    toastCopied: string;
    suggestions: string[];
    database: ClueEntry[];
  }
> = {
  en: {
    label: "Enter CodyCross clue, question, or keyword",
    placeholder: "e.g. capital city of France, sweet substance made by bees",
    btnSearch: "Search Clues",
    popularClues: "Popular clues:",
    loadingText: "Searching 100,000+ clues in CodyCross database...",
    searchResults: "Search Results",
    clickCopy: "Click card to copy answer",
    noResults: "No exact match found in our mock database.",
    noResultsSub: "We are actively indexing new worlds. Try clicking one of the popular clues above like \"Ancient Rome\" or \"France\".",
    world: "World",
    group: "Group",
    phase: "Phase",
    answerText: "Answer ({length} letters)",
    toastEmpty: "Please enter a clue or question to search.",
    toastCopied: "Copied \"{answer}\" to clipboard!",
    suggestions: ["Ancient Rome", "France", "Bees", "Detective", "Brazil", "Snail"],
    database: [
      { clue: "A major destination for tourists in Italy", answer: "ROME", world: "Planet Earth", group: "1", phase: "1", length: 4 },
      { clue: "Capital city of France", answer: "PARIS", world: "Adventure", group: "3", phase: "2", length: 5 },
      { clue: "Outer space body orbiting a star", answer: "PLANET", world: "Space", group: "24", phase: "1", length: 6 },
      { clue: "Fictional detective created by Arthur Conan Doyle", answer: "SHERLOCK", world: "Inventors", group: "115", phase: "4", length: 8 },
      { clue: "Device used to take photographs", answer: "CAMERA", world: "Planet Earth", group: "2", phase: "3", length: 6 },
      { clue: "Ancient Egyptian paper made from water reed", answer: "PAPYRUS", world: "Ancient Egypt", group: "45", phase: "2", length: 7 },
      { clue: "Mythological creature with a horse body and horn", answer: "UNICORN", world: "Once Upon a Time", group: "82", phase: "1", length: 7 },
      { clue: "Chemical element with symbol Au and atomic number 79", answer: "GOLD", world: "Planet Earth", group: "5", phase: "5", length: 4 },
      { clue: "Longest river in South America", answer: "AMAZON", world: "Adventure", group: "12", phase: "3", length: 6 },
      { clue: "The study of stars and celestial bodies", answer: "ASTRONOMY", world: "Space", group: "21", phase: "5", length: 9 },
      { clue: "Period of ten years", answer: "DECADE", world: "Planet Earth", group: "7", phase: "2", length: 6 },
      { clue: "Large body of salt water", answer: "OCEAN", world: "Under the Sea", group: "31", phase: "1", length: 5 },
      { clue: "A polygon with three sides", answer: "TRIANGLE", world: "Planet Earth", group: "8", phase: "4", length: 8 },
      { clue: "A sweet substance made by bees", answer: "HONEY", world: "Culinary Arts", group: "123", phase: "2", length: 5 },
      { clue: "The language spoken in Brazil", answer: "PORTUGUESE", world: "Culinary Arts", group: "127", phase: "3", length: 10 },
      { clue: "A fast, spotty cat from Africa", answer: "CHEETAH", world: "Rainforest", group: "56", phase: "4", length: 7 },
      { clue: "An instrument used to measure temperature", answer: "THERMOMETER", world: "Inventors", group: "111", phase: "1", length: 11 },
      { clue: "Capital of Japan", answer: "TOKYO", world: "Planet Earth", group: "3", phase: "1", length: 5 },
      { clue: "A large fruit with green skin and red pulp", answer: "WATERMELON", world: "Culinary Arts", group: "121", phase: "5", length: 10 },
      { clue: "The process of breathing in oxygen", answer: "RESPIRATION", world: "Space", group: "26", phase: "3", length: 11 },
      { clue: "A slow-moving reptile with a protective shell", answer: "TURTLE", world: "Under the Sea", group: "32", phase: "2", length: 6 },
      { clue: "An open-air market in an arab city", answer: "BAZAAR", world: "Adventure", group: "15", phase: "1", length: 6 },
      { clue: "Instrument with 88 black and white keys", answer: "PIANO", world: "Circus", group: "88", phase: "2", length: 5 },
      { clue: "The study of ancient human societies", answer: "ARCHAEOLOGY", world: "Ancient Egypt", group: "48", phase: "4", length: 11 },
      { clue: "A building where items are manufactured", answer: "FACTORY", world: "Inventors", group: "119", phase: "5", length: 7 }
    ]
  },
  es: {
    label: "Ingresa la pista de CodyCross, pregunta o palabra clave",
    placeholder: "Ej. capital de Francia, sustancia dulce de las abejas",
    btnSearch: "Buscar pistas",
    popularClues: "Pistas populares:",
    loadingText: "Buscando en más de 100,000 pistas...",
    searchResults: "Resultados de búsqueda",
    clickCopy: "Haz clic en la tarjeta para copiar la respuesta",
    noResults: "No se encontraron coincidencias exactas.",
    noResultsSub: "Estamos indexando nuevos mundos continuamente. Prueba haciendo clic en las sugerencias populares arriba.",
    world: "Mundo",
    group: "Grupo",
    phase: "Fase",
    answerText: "Respuesta ({length} letras)",
    toastEmpty: "Por favor ingresa una pista o pregunta para buscar.",
    toastCopied: "¡Copiado \"{answer}\" al portapapeles!",
    suggestions: ["Roma", "Francia", "Miel", "Detective", "Brasil", "Caracol"],
    database: [
      { clue: "Un destino turístico importante en Italia", answer: "ROMA", world: "Planeta Tierra", group: "1", phase: "1", length: 4 },
      { clue: "Ciudad capital de Francia", answer: "PARIS", world: "Aventura", group: "3", phase: "2", length: 5 },
      { clue: "Cuerpo del espacio exterior que orbita una estrella", answer: "PLANETA", world: "Espacio", group: "24", phase: "1", length: 6 },
      { clue: "Detective de ficción creado por Arthur Conan Doyle", answer: "SHERLOCK", world: "Inventores", group: "115", phase: "4", length: 8 },
      { clue: "Dispositivo utilizado para tomar fotografías", answer: "CAMARA", world: "Planeta Tierra", group: "2", phase: "3", length: 6 },
      { clue: "Papel del Antiguo Egipto hecho de caña de agua", answer: "PAPIRO", world: "Antiguo Egipto", group: "45", phase: "2", length: 7 },
      { clue: "Criatura mitológica con cuerpo de caballo y cuerno", answer: "UNICORNIO", world: "Érase una vez", group: "82", phase: "1", length: 7 },
      { clue: "Elemento químico con símbolo Au y número atómico 79", answer: "ORO", world: "Planeta Tierra", group: "5", phase: "5", length: 4 },
      { clue: "El río más largo de América del Sur", answer: "AMAZONAS", world: "Aventura", group: "12", phase: "3", length: 6 },
      { clue: "El estudio de las estrellas y los cuerpos celestes", answer: "ASTRONOMIA", world: "Espacio", group: "21", phase: "5", length: 9 },
      { clue: "Período de diez años", answer: "DECADA", world: "Planeta Tierra", group: "7", phase: "2", length: 6 },
      { clue: "Gran masa de agua salada", answer: "OCEANO", world: "Bajo el mar", group: "31", phase: "1", length: 5 },
      { clue: "Un polígono de tres lados", answer: "TRIANGULO", world: "Planeta Tierra", group: "8", phase: "4", length: 8 },
      { clue: "Una sustancia dulce hecha por las abejas", answer: "MIEL", world: "Arte Culinario", group: "123", phase: "2", length: 5 },
      { clue: "El idioma que se habla en Brasil", answer: "PORTUGUES", world: "Arte Culinario", group: "127", phase: "3", length: 9 },
      { clue: "Un felino rápido y manchado de África", answer: "GUEPARDO", world: "Selva tropical", group: "56", phase: "4", length: 8 },
      { clue: "Un instrumento utilizado para medir la temperatura", answer: "TERMOMETRO", world: "Inventores", group: "111", phase: "1", length: 10 },
      { clue: "Capital de Japón", answer: "TOKIO", world: "Planeta Tierra", group: "3", phase: "1", length: 5 },
      { clue: "Una fruta grande con piel verde y pulpa roja", answer: "SANDIA", world: "Arte Culinario", group: "121", phase: "5", length: 6 },
      { clue: "El proceso de inhalar oxígeno", answer: "RESPIRACION", world: "Espacio", group: "26", phase: "3", length: 11 },
      { clue: "Un reptil de movimiento lento con un caparazón protector", answer: "TORTUGA", world: "Bajo el mar", group: "32", phase: "2", length: 7 },
      { clue: "Un mercado al aire libre en una ciudad árabe", answer: "BAZAR", world: "Aventura", group: "15", phase: "1", length: 5 },
      { clue: "Instrumento con 88 teclas blancas y negras", answer: "PIANO", world: "Circo", group: "88", phase: "2", length: 5 },
      { clue: "El estudio de las antiguas sociedades humanas", answer: "ARQUEOLOGIA", world: "Antiguo Egipto", group: "48", phase: "4", length: 11 },
      { clue: "Un edificio donde se fabrican artículos", answer: "FABRICA", world: "Inventores", group: "119", phase: "5", length: 7 }
    ]
  },
  de: {
    label: "CodyCross Hinweis, Frage oder Schlüsselwort eingeben",
    placeholder: "z.B. Hauptstadt von Frankreich, süßer Stoff von Bienen",
    btnSearch: "Hinweise suchen",
    popularClues: "Beliebte Hinweise:",
    loadingText: "Suche in über 100.000 Hinweisen...",
    searchResults: "Suchergebnisse",
    clickCopy: "Klicke auf die Karte, um die Antwort zu kopieren",
    noResults: "Keine genaue Übereinstimmung gefunden.",
    noResultsSub: "Wir fügen ständig neue Welten hinzu. Versuche auf einen der beliebten Hinweise oben zu klicken.",
    world: "Welt",
    group: "Gruppe",
    phase: "Phase",
    answerText: "Antwort ({length} Buchstaben)",
    toastEmpty: "Bitte gib einen Hinweis oder eine Frage ein, um zu suchen.",
    toastCopied: "\"{answer}\" in die Zwischenablage kopiert!",
    suggestions: ["Rom", "Frankreich", "Honig", "Detektiv", "Brasilien", "Schnecke"],
    database: [
      { clue: "Ein Hauptziel für Touristen in Italien", answer: "ROM", world: "Planet Erde", group: "1", phase: "1", length: 3 },
      { clue: "Hauptstadt von Frankreich", answer: "PARIS", world: "Abenteuer", group: "3", phase: "2", length: 5 },
      { clue: "Himmelskörper im Weltraum, der einen Stern umkreist", answer: "PLANET", world: "Weltall", group: "24", phase: "1", length: 6 },
      { clue: "Fiktiver Detektiv von Arthur Conan Doyle", answer: "SHERLOCK", world: "Erfinder", group: "115", phase: "4", length: 8 },
      { clue: "Gerät zum Aufnehmen von Fotos", answer: "KAMERA", world: "Planet Erde", group: "2", phase: "3", length: 6 },
      { clue: "Altes ägyptisches Schreibmaterial aus Schilf", answer: "PAPYRUS", world: "Altes Ägypten", group: "45", phase: "2", length: 7 },
      { clue: "Fabelwesen mit Pferdekörper und Horn", answer: "EINHORN", world: "Es war einmal", group: "82", phase: "1", length: 7 },
      { clue: "Chemisches Element mit dem Symbol Au", answer: "GOLD", world: "Planet Erde", group: "5", phase: "5", length: 4 },
      { clue: "Längster Fluss in Südamerika", answer: "AMAZONAS", world: "Abenteuer", group: "12", phase: "3", length: 8 },
      { clue: "Die Lehre von den Sternen und Himmelskörpern", answer: "ASTRONOMIE", world: "Weltall", group: "21", phase: "5", length: 10 },
      { clue: "Zeitraum von zehn Jahren", answer: "JAHRZEHNT", world: "Planet Erde", group: "7", phase: "2", length: 9 },
      { clue: "Großes Salzwassergewässer", answer: "OZEAN", world: "Unterwasserwelt", group: "31", phase: "1", length: 5 },
      { clue: "Ein Polygon mit drei Seiten", answer: "DREIECK", world: "Planet Erde", group: "8", phase: "4", length: 7 },
      { clue: "Eine süße Substanz, die von Bienen hergestellt wird", answer: "HONIG", world: "Kulinarische Kunst", group: "123", phase: "2", length: 5 },
      { clue: "Die in Brasilien gesprochene Sprache", answer: "PORTUGIESISCH", world: "Kulinarische Kunst", group: "127", phase: "3", length: 13 },
      { clue: "Schnelle, gepunktete Wildkatze aus Afrika", answer: "GEPARD", world: "Regenwald", group: "56", phase: "4", length: 6 },
      { clue: "Ein Instrument zur Messung der Temperatur", answer: "THERMOMETER", world: "Erfinder", group: "111", phase: "1", length: 11 },
      { clue: "Hauptstadt von Japan", answer: "TOKIO", world: "Planet Erde", group: "3", phase: "1", length: 5 },
      { clue: "Große Frucht mit grüner Schale und rotem Fruchtfleisch", answer: "WASSERMELONE", world: "Kulinarische Kunst", group: "121", phase: "5", length: 12 },
      { clue: "Der Vorgang des Einatmens von Sauerstoff", answer: "ATMUNG", world: "Weltall", group: "26", phase: "3", length: 6 },
      { clue: "Langsames Reptil mit schützendem Panzer", answer: "SCHILDKROETE", world: "Unterwasserwelt", group: "32", phase: "2", length: 12 },
      { clue: "Ein Freiluftmarkt in einer arabischen Stadt", answer: "BASAR", world: "Abenteuer", group: "15", phase: "1", length: 5 },
      { clue: "Musikinstrument mit 88 schwarzen und weißen Tasten", answer: "KLAVIER", world: "Zirkus", group: "88", phase: "2", length: 7 },
      { clue: "Wissenschaft von alten menschlichen Gesellschaften", answer: "ARCHAEOLOGIE", world: "Altes Ägypten", group: "48", phase: "4", length: 12 },
      { clue: "Ein Gebäude, in dem Waren hergestellt werden", answer: "FABRIK", world: "Erfinder", group: "119", phase: "5", length: 6 }
    ]
  },
  pt: {
    label: "Insira a pista do CodyCross, pergunta ou palavra-chave",
    placeholder: "Ex. capital da França, substância doce das abelhas",
    btnSearch: "Buscar Pistas",
    popularClues: "Pistas populares:",
    loadingText: "Buscando em mais de 100.000 pistas...",
    searchResults: "Resultados da Busca",
    clickCopy: "Clique no cartão para copiar a resposta",
    noResults: "Nenhuma correspondência exata encontrada.",
    noResultsSub: "Estamos indexando novos mundos continuamente. Tente clicar em uma das pistas populares acima.",
    world: "Mundo",
    group: "Grupo",
    phase: "Fase",
    answerText: "Resposta ({length} letras)",
    toastEmpty: "Por favor, insira uma pista ou pergunta para buscar.",
    toastCopied: "Copiado \"{answer}\" para a área de transferência!",
    suggestions: ["Roma", "França", "Mel", "Detetive", "Brasil", "Caracol"],
    database: [
      { clue: "Um grande destino turístico na Itália", answer: "ROMA", world: "Planeta Terra", group: "1", phase: "1", length: 4 },
      { clue: "Capital da França", answer: "PARIS", world: "Aventura", group: "3", phase: "2", length: 5 },
      { clue: "Corpo do espaço sideral que orbita uma estrela", answer: "PLANETA", world: "Espaço", group: "24", phase: "1", length: 7 },
      { clue: "Detetive fictício criado por Arthur Conan Doyle", answer: "SHERLOCK", world: "Inventores", group: "115", phase: "4", length: 8 },
      { clue: "Dispositivo usado para tirar fotografias", answer: "CAMERA", world: "Planeta Terra", group: "2", phase: "3", length: 6 },
      { clue: "Papel do Antigo Egito feito de junco", answer: "PAPIRO", world: "Antigo Egito", group: "45", phase: "2", length: 6 },
      { clue: "Criatura mitológica com corpo de cavalo e chifre", answer: "UNICORNIO", world: "Era uma vez", group: "82", phase: "1", length: 9 },
      { clue: "Elemento químico com símbolo Au e número atômico 79", answer: "OURO", world: "Planeta Terra", group: "5", phase: "5", length: 4 },
      { clue: "O rio mais longo da América do Sul", answer: "AMAZONAS", world: "Aventura", group: "12", phase: "3", length: 8 },
      { clue: "O estudo das estrelas e corpos celestes", answer: "ASTRONOMIA", world: "Espaço", group: "21", phase: "5", length: 10 },
      { clue: "Período de dez anos", answer: "DECADA", world: "Planeta Terra", group: "7", phase: "2", length: 6 },
      { clue: "Grande massa de água salgada", answer: "OCEANO", world: "Fundo do Mar", group: "31", phase: "1", length: 6 },
      { clue: "Um polígono de três lados", answer: "TRIANGULO", world: "Planeta Terra", group: "8", phase: "4", length: 9 },
      { clue: "Substância doce produzida pelas abelhas", answer: "MEL", world: "Artes Culinárias", group: "123", phase: "2", length: 3 },
      { clue: "O idioma falado no Brasil", answer: "PORTUGUES", world: "Artes Culinárias", group: "127", phase: "3", length: 9 },
      { clue: "Um felino rápido e pintado da África", answer: "GUEPARDO", world: "Floresta Tropical", group: "56", phase: "4", length: 8 },
      { clue: "Instrumento usado para medir a temperatura", answer: "TERMOMETRO", world: "Inventores", group: "111", phase: "1", length: 10 },
      { clue: "Capital do Japão", answer: "TOQUIO", world: "Planeta Terra", group: "3", phase: "1", length: 6 },
      { clue: "Fruta grande com casca verde e polpa vermelha", answer: "MELANCIA", world: "Artes Culinárias", group: "121", phase: "5", length: 8 },
      { clue: "O processo de inspirar oxigênio", answer: "RESPIRACAO", world: "Espaço", group: "26", phase: "3", length: 10 },
      { clue: "Réptil de movimentos lentos com casco protetor", answer: "TARTARUGA", world: "Fundo do Mar", group: "32", phase: "2", length: 9 },
      { clue: "Um mercado ao ar livre em uma cidade árabe", answer: "BAZAR", world: "Aventura", group: "15", phase: "1", length: 5 },
      { clue: "Instrumento musical com 88 teclas pretas e brancas", answer: "PIANO", world: "Circo", group: "88", phase: "2", length: 5 },
      { clue: "Estudo das antigas sociedades humanas", answer: "ARQUEOLOGIA", world: "Antigo Egito", group: "48", phase: "4", length: 11 },
      { clue: "Prédio onde mercadorias são manufaturadas", answer: "FABRICA", world: "Inventores", group: "119", phase: "5", length: 7 }
    ]
  },
  ru: {
    label: "Введите подсказку, вопрос или ключевое слово CodyCross",
    placeholder: "например, столица Франции, сладкое вещество пчел",
    btnSearch: "Искать подсказки",
    popularClues: "Популярные подсказки:",
    loadingText: "Поиск среди 100 000+ подсказок...",
    searchResults: "Результаты поиска",
    clickCopy: "Нажмите на карточку, чтобы скопировать ответ",
    noResults: "Точных совпадений не найдено.",
    noResultsSub: "Мы постоянно добавляем новые миры. Попробуйте нажать на одну из популярных подсказок выше.",
    world: "Мир",
    group: "Группа",
    phase: "Этап",
    answerText: "Ответ ({length} букв)",
    toastEmpty: "Пожалуйста, введите подсказку или вопрос для поиска.",
    toastCopied: "Ответ \"{answer}\" скопирован в буфер обмена!",
    suggestions: ["Рим", "Франция", "Мед", "Детектив", "Бразилия", "Улитка"],
    database: [
      { clue: "Популярное туристическое направление в Италии", answer: "РИМ", world: "Планета Земля", group: "1", phase: "1", length: 3 },
      { clue: "Столица Франции", answer: "ПАРИЖ", world: "Приключение", group: "3", phase: "2", length: 5 },
      { clue: "Небесное тело, вращающееся вокруг звезды", answer: "ПЛАНЕТА", world: "Космос", group: "24", phase: "1", length: 7 },
      { clue: "Вымышленный детектив, созданный Артуром Конан Дойлом", answer: "ШЕРЛОК", world: "Изобретатели", group: "115", phase: "4", length: 6 },
      { clue: "Устройство для создания фотографий", answer: "КАМЕРА", world: "Планета Земля", group: "2", phase: "3", length: 6 },
      { clue: "Древнеегипетская бумага из тростника", answer: "ПАПИРУС", world: "Древний Египет", group: "45", phase: "2", length: 7 },
      { clue: "Мифическое существо с телом лошади и рогом", answer: "ЕДИНОРОГ", world: "В некотором царстве", group: "82", phase: "1", length: 8 },
      { clue: "Химический элемент с символом Au и атомным номером 79", answer: "ЗОЛОТО", world: "Планета Земля", group: "5", phase: "5", length: 6 },
      { clue: "Самая длинная река в Южной Америке", answer: "АМАЗОНКА", world: "Приключение", group: "12", phase: "3", length: 8 },
      { clue: "Наука о звездах и небесных телах", answer: "АСТРОНОМИЯ", world: "Космос", group: "21", phase: "5", length: 10 },
      { clue: "Период из десяти лет", answer: "ДЕСЯТИЛЕТИЕ", world: "Планета Земля", group: "7", phase: "2", length: 11 },
      { clue: "Огромный водоем с соленой водой", answer: "ОКЕАН", world: "Подводный мир", group: "31", phase: "1", length: 5 },
      { clue: "Многоугольник с тремя сторонами", answer: "ТРЕУГОЛЬНИК", world: "Планета Земля", group: "8", phase: "4", length: 11 },
      { clue: "Сладкое вещество, вырабатываемое пчелами", answer: "МЕД", world: "Кулинарное искусство", group: "123", phase: "2", length: 3 },
      { clue: "Язык, на котором говорят в Бразилии", answer: "ПОРТУГАЛЬСКИЙ", world: "Кулинарное искусство", group: "127", phase: "3", length: 13 },
      { clue: "Быстрый пятнистый хищник из семейства кошачьих в Африке", answer: "ГЕПАРД", world: "Тропический лес", group: "56", phase: "4", length: 6 },
      { clue: "Прибор для измерения температуры", answer: "ТЕРМОМЕТР", world: "Изобретатели", group: "111", phase: "1", length: 9 },
      { clue: "Столица Японии", answer: "ТОКИО", world: "Планета Земля", group: "3", phase: "1", length: 5 },
      { clue: "Крупный плод с зеленой кожурой и красной мякотью", answer: "АРБУЗ", world: "Кулинарное искусство", group: "121", phase: "5", length: 5 },
      { clue: "Процесс вдыхания кислорода", answer: "ДЫХАНИЕ", world: "Космос", group: "26", phase: "3", length: 7 },
      { clue: "Медлительная рептилия с защитным панцирем", answer: "ЧЕРЕПАХА", world: "Подводный мир", group: "32", phase: "2", length: 8 },
      { clue: "Рынок под открытым небом в арабском городе", answer: "БАЗАР", world: "Приключение", group: "15", phase: "1", length: 5 },
      { clue: "Музыкальный инструмент с 88 черными и белыми клавишами", answer: "ПИАНИНО", world: "Цирк", group: "88", phase: "2", length: 7 },
      { clue: "Изучение древних человеческих обществ", answer: "АРХЕОЛОГИЯ", world: "Древний Египет", group: "48", phase: "4", length: 10 },
      { clue: "Здание, где производятся товары", answer: "ФАБРИКА", world: "Изобретатели", group: "119", phase: "5", length: 7 }
    ]
  },
  id: {
    label: "Masukkan petunjuk, pertanyaan, atau kata kunci CodyCross",
    placeholder: "misal. ibu kota Prancis, cairan manis dari lebah",
    btnSearch: "Cari Petunjuk",
    popularClues: "Petunjuk populer:",
    loadingText: "Mencari di 100.000+ petunjuk...",
    searchResults: "Hasil Pencarian",
    clickCopy: "Klik kartu untuk menyalin jawaban",
    noResults: "Tidak ada kecocokan persis yang ditemukan.",
    noResultsSub: "Kami aktif menambahkan dunia baru. Coba klik petunjuk populer di atas.",
    world: "Dunia",
    group: "Grup",
    phase: "Fase",
    answerText: "Jawaban ({length} huruf)",
    toastEmpty: "Silakan masukkan petunjuk atau pertanyaan untuk mencari.",
    toastCopied: "Menyalin \"{answer}\" ke papan klip!",
    suggestions: ["Roma", "Prancis", "Madu", "Detektif", "Brasil", "Siput"],
    database: [
      { clue: "Tujuan wisata populer di Italia", answer: "ROMA", world: "Planet Bumi", group: "1", phase: "1", length: 4 },
      { clue: "Ibu kota Prancis", answer: "PARIS", world: "Petualangan", group: "3", phase: "2", length: 5 },
      { clue: "Benda luar angkasa yang mengorbit bintang", answer: "PLANET", world: "Antariksa", group: "24", phase: "1", length: 6 },
      { clue: "Detektif fiksi ciptaan Arthur Conan Doyle", answer: "SHERLOCK", world: "Penemu", group: "115", phase: "4", length: 8 },
      { clue: "Alat yang digunakan untuk mengambil foto", answer: "KAMERA", world: "Planet Bumi", group: "2", phase: "3", length: 6 },
      { clue: "Kertas Mesir Kuno yang terbuat dari alang-alang air", answer: "PAPIRUS", world: "Mesir Kuno", group: "45", phase: "2", length: 7 },
      { clue: "Makhluk mitologi dengan tubuh kuda dan satu tanduk", answer: "UNICORN", world: "Pada Zaman Dahulu", group: "82", phase: "1", length: 7 },
      { clue: "Unsur kimia dengan simbol Au dan nomor atom 79", answer: "EMAS", world: "Planet Bumi", group: "5", phase: "5", length: 4 },
      { clue: "Sungai terpanjang di Amerika Selatan", answer: "AMAZON", world: "Petualangan", group: "12", phase: "3", length: 6 },
      { clue: "Studi tentang bintang dan benda langit", answer: "ASTRONOMI", world: "Antariksa", group: "21", phase: "5", length: 9 },
      { clue: "Jangka waktu sepuluh tahun", answer: "DEKADE", world: "Planet Bumi", group: "7", phase: "2", length: 6 },
      { clue: "Kumpulan besar air asin", answer: "SAMUDERA", world: "Bawah Laut", group: "31", phase: "1", length: 8 },
      { clue: "Poligon dengan tiga sisi", answer: "SEGITIGA", world: "Planet Bumi", group: "8", phase: "4", length: 8 },
      { clue: "Zat manis yang diproduksi oleh lebah", answer: "MADU", world: "Seni Kuliner", group: "123", phase: "2", length: 4 },
      { clue: "Bahasa yang digunakan di Brasil", answer: "PORTUGIS", world: "Seni Kuliner", group: "127", phase: "3", length: 8 },
      { clue: "Kucing bercak hitam yang sangat cepat dari Africa", answer: "CITAH", world: "Hutan Hujan", group: "56", phase: "4", length: 5 },
      { clue: "Alat untuk mengukur suhu", answer: "TERMOMETER", world: "Penemu", group: "111", phase: "1", length: 10 },
      { clue: "Ibu kota Jepang", answer: "TOKYO", world: "Planet Bumi", group: "3", phase: "1", length: 5 },
      { clue: "Buah besar dengan kulit hijau dan daging merah", answer: "SEMANGKA", world: "Seni Kuliner", group: "121", phase: "5", length: 8 },
      { clue: "Proses menghirup oksigen", answer: "RESPIRASI", world: "Antariksa", group: "26", phase: "3", length: 9 },
      { clue: "Reptil lambat dengan cangkang pelindung", answer: "PENYU", world: "Bawah Laut", group: "32", phase: "2", length: 5 },
      { clue: "Pasar terbuka di kota Arab", answer: "BAZAR", world: "Petualangan", group: "15", phase: "1", length: 5 },
      { clue: "Alat musik dengan 88 tuts hitam dan putih", answer: "PIANO", world: "Sirkus", group: "88", phase: "2", length: 5 },
      { clue: "Studi tentang peradaban manusia kuno", answer: "ARKEOLOGI", world: "Mesir Kuno", group: "48", phase: "4", length: 9 },
      { clue: "Bangunan tempat barang diproduksi secara massal", answer: "PABRIK", world: "Penemu", group: "119", phase: "5", length: 6 }
    ]
  },
  ar: {
    label: "أدخل الدليل أو السؤال أو الكلمة المفتاحية للعبة كودي كروس",
    placeholder: "مثال: عاصمة فرنسا، سائل النحل الحلو",
    btnSearch: "بحث عن الأدلة",
    popularClues: "الأدلة الشائعة:",
    loadingText: "البحث في أكثر من 100,000 دليل...",
    searchResults: "نتائج البحث",
    clickCopy: "انقر على البطاقة لنسخ الإجابة",
    noResults: "لم يتم العثور على تطابق تام.",
    noResultsSub: "نعمل باستمرار على فهرسة عوالم جديدة. جرب النقر على أحد الأدلة الشائعة أعلاه.",
    world: "العالم",
    group: "المجموعة",
    phase: "المرحلة",
    answerText: "الإجابة ({length} حروف)",
    toastEmpty: "يُرجى إدخال دليل أو سؤال للبحث.",
    toastCopied: "تم نسخ الإجابة \"{answer}\" إلى الحافظة!",
    suggestions: ["روما", "فرنسا", "العسل", "المحقق", "البرازيل", "الحلزون"],
    database: [
      { clue: "وجهة سياحية شهيرة في إيطاليا", answer: "روما", world: "كوكب الأرض", group: "1", phase: "1", length: 4 },
      { clue: "عاصمة فرنسا", answer: "باريس", world: "المغامرات", group: "3", phase: "2", length: 5 },
      { clue: "جسم في الفضاء الخارجي يدور حول نجم", answer: "كوكب", world: "الفضاء", group: "24", phase: "1", length: 4 },
      { clue: "محقق خيالي ابتكره آرثر كونان دويل", answer: "شيرلوك", world: "المخترعون", group: "115", phase: "4", length: 6 },
      { clue: "جهاز يستخدم لالتقاط الصور", answer: "كاميرا", world: "كوكب الأرض", group: "2", phase: "3", length: 5 },
      { clue: "ورق مصري قديم مصنوع من قصب الماء", answer: "بردي", world: "مصر القديمة", group: "45", phase: "2", length: 4 },
      { clue: "مخلوق أسطوري بجسم حصان وقرن", answer: "وحيد القرن", world: "كان يا ما كان", group: "82", phase: "1", length: 9 },
      { clue: "عنصر كيميائي رمزه Au وعدده الذري 79", answer: "ذهب", world: "كوكب الأرض", group: "5", phase: "5", length: 3 },
      { clue: "أطول نهر في أمريكا الجنوبية", answer: "الأمازون", world: "المغامرات", group: "12", phase: "3", length: 7 },
      { clue: "دراسة النجوم والأجرام السماوية", answer: "علم الفلك", world: "الفضاء", group: "21", phase: "5", length: 8 },
      { clue: "فترة زمنية مدتها عشر سنوات", answer: "عقد", world: "كوكب الأرض", group: "7", phase: "2", length: 3 },
      { clue: "مسطح مائي مالح كبير", answer: "المحيط", world: "تحت الماء", group: "31", phase: "1", length: 6 },
      { clue: "مضلع له ثلاثة أضلاع", answer: "مثلث", world: "كوكب الأرض", group: "8", phase: "4", length: 4 },
      { clue: "سائل حلو يصنعه النحل", answer: "عسل", world: "فنون الطهي", group: "123", phase: "2", length: 3 },
      { clue: "اللغة الرسمية المستخدمة في البرازيل", answer: "البرتغالية", world: "فنون الطهي", group: "127", phase: "3", length: 9 },
      { clue: "فهد سريع ومرقط من أفريقيا", answer: "فهد", world: "الغابات المطيرة", group: "56", phase: "4", length: 3 },
      { clue: "أداة تستخدم لقياس درجة الحرارة", answer: "ميزان حرارة", world: "المخترعون", group: "111", phase: "1", length: 11 },
      { clue: "عاصمة اليابان", answer: "طوكيو", world: "كوكب الأرض", group: "3", phase: "1", length: 5 },
      { clue: "فاكهة كبيرة ذات قشرة خضراء ولب أحمر", answer: "بطيخ", world: "فنون الطهي", group: "121", phase: "5", length: 4 },
      { clue: "عملية استنشاق الأكسجين", answer: "تنفس", world: "الفضاء", group: "26", phase: "3", length: 4 },
      { clue: "زاحف بطيء الحركة يمتلك قوقعة تحميه", answer: "سلاحف", world: "تحت الماء", group: "32", phase: "2", length: 5 },
      { clue: "سوق مفتوح في مدينة عربية", answer: "بازار", world: "المغامرات", group: "15", phase: "1", length: 5 },
      { clue: "آلة موسيقية تحتوي على 88 مفتاحًا أسود وأبيض", answer: "بيانو", world: "السيرك", group: "88", phase: "2", length: 5 },
      { clue: "دراسة المجتمعات البشرية القديمة", answer: "علم الآثار", world: "مصر القديمة", group: "48", phase: "4", length: 9 },
      { clue: "مبنى يتم فيه تصنيع السلع والمنتجات", answer: "مصنع", world: "المخترعون", group: "119", phase: "5", length: 4 }
    ]
  },
  hi: {
    label: "CodyCross संकेत, प्रश्न या कीवर्ड दर्ज करें",
    placeholder: "जैसे: फ्रांस की राजधानी, मधुमक्खियों का मीठा रस",
    btnSearch: "संकेत खोजें",
    popularClues: "लोकप्रिय संकेत:",
    loadingText: "100,000+ संकेतों में खोजा जा रहा है...",
    searchResults: "खोज परिणाम",
    clickCopy: "उत्तर कॉपी करने के लिए कार्ड पर क्लिक करें",
    noResults: "कोई सटीक मिलान नहीं मिला।",
    noResultsSub: "हम लगातार नए विश्वों को अनुक्रमित कर रहे हैं। ऊपर लोकप्रिय संकेतों पर क्लिक करने का प्रयास करें।",
    world: "विश्व",
    group: "समूह",
    phase: "चरण",
    answerText: "उत्तर ({length} अक्षर)",
    toastEmpty: "कृपया खोजने के लिए एक संकेत या प्रश्न दर्ज करें।",
    toastCopied: "\"{answer}\" क्लिपबोर्ड पर कॉपी किया गया!",
    suggestions: ["रोम", "फ्रांस", "शहद", "जासूस", "ब्राजील", "घोंघा"],
    database: [
      { clue: "इटली में एक लोकप्रिय छुट्टी गंतव्य", answer: "रोम", world: "पृथ्वी ग्रह", group: "1", phase: "1", length: 3 },
      { clue: "फ्रांस की राजधानी", answer: "पेरिस", world: "साहसिक कार्य", group: "3", phase: "2", length: 5 },
      { clue: "तारे की परिक्रमा करने वाला अंतरिक्ष पिंड", answer: "ग्रह", world: "अंतरिक्ष", group: "24", phase: "1", length: 3 },
      { clue: "आर्थर कॉनन डॉयल द्वारा रचित काल्पनिक जासूस", answer: "शरलॉक", world: "आविष्कारक", group: "115", phase: "4", length: 5 },
      { clue: "तस्वीरें लेने के लिए इस्तेमाल किया जाने वाला उपकरण", answer: "कैमरा", world: "पृथ्वी ग्रह", group: "2", phase: "3", length: 5 },
      { clue: "जल सरकंडे से बना प्राचीन मिस्र का कागज", answer: "पेपिरस", world: "प्राचीन मिस्र", group: "45", phase: "2", length: 5 },
      { clue: "घोड़े के शरीर और सींग वाला पौराणिक जीव", answer: "एकशृंगी", world: "एक बार की बात है", group: "82", phase: "1", length: 7 },
      { clue: "रासायनिक तत्व जिसका प्रतीक Au और परमाणु संख्या 79 है", answer: "सोना", world: "पृथ्वी ग्रह", group: "5", phase: "5", length: 4 },
      { clue: "दक्षिण अमेरिका की सबसे लंबी नदी", answer: "अमेज़न", world: "साहसिक कार्य", group: "12", phase: "3", length: 5 },
      { clue: "सितारों और खगोलीय पिंडों का अध्ययन", answer: "खगोलशास्त्र", world: "अंतरिक्ष", group: "21", phase: "5", length: 9 },
      { clue: "दस वर्ष की अवधि", answer: "दशक", world: "पृथ्वी ग्रह", group: "7", phase: "2", length: 3 },
      { clue: "खारे पानी का बड़ा जलाशय", answer: "महासागर", world: "पानी के नीचे", group: "31", phase: "1", length: 6 },
      { clue: "तीन भुजाओं वाला बहुभुज", answer: "त्रिकोण", world: "पृथ्वी ग्रह", group: "8", phase: "4", length: 5 },
      { clue: "मधुमक्खियों द्वारा बनाया गया मीठा पदार्थ", answer: "शहद", world: "पाक कला", group: "123", phase: "2", length: 3 },
      { clue: "ब्राजील में बोली जाने वाली भाषा", answer: "पुर्तगाली", world: "पाक कला", group: "127", phase: "3", length: 7 },
      { clue: "अफ्रीका का एक तेज़, चित्तीदार बिल्ली जैसा जानवर", answer: "चीता", world: "वर्षावन", group: "56", phase: "4", length: 3 },
      { clue: "तापमान मापने के लिए प्रयुक्त उपकरण", answer: "थर्मामीटर", world: "आविष्कारक", group: "111", phase: "1", length: 8 },
      { clue: "जापान की राजधानी", answer: "टोक्यो", world: "पृथ्वी ग्रह", group: "3", phase: "1", length: 5 },
      { clue: "हरी त्वचा और लाल गूदे वाला एक बड़ा फल", answer: "तरबूज", world: "पाक कला", group: "121", phase: "5", length: 5 },
      { clue: "ऑक्सीजन अंदर लेने की प्रक्रिया", answer: "श्वसन", world: "अंतरिक्ष", group: "26", phase: "3", length: 4 },
      { clue: "सुरक्षात्मक कवच वाला धीमी गति से चलने वाला सरीसृप", answer: "कछुआ", world: "पानी के नीचे", group: "32", phase: "2", length: 4 },
      { clue: "अरब शहर में खुले आसमान के नीचे लगने वाला बाज़ार", answer: "बाज़ार", world: "साहसिक कार्य", group: "15", phase: "1", length: 5 },
      { clue: "88 काली और सफेद कुंजियों वाला वाद्ययंत्र", answer: "पियानो", world: "सर्कस", group: "88", phase: "2", length: 5 },
      { clue: "प्राचीन मानव समाजों का अध्ययन", answer: "पुरातत्व", world: "प्राचीन मिस्र", group: "48", phase: "4", length: 6 },
      { clue: "वह इमारत जहाँ वस्तुएँ निर्मित की जाती हैं", answer: "कारखाना", world: "आविष्कारक", group: "119", phase: "5", length: 6 }
    ]
  }
};

export function CodyCrossAnswers() {
  const { locale } = useI18n();
  const activeTexts = LOCALIZED_TEXTS[locale] || LOCALIZED_TEXTS.en;

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ClueEntry[] | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSearch = (searchQuery: string = query) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      toast.error(activeTexts.toastEmpty);
      return;
    }

    setLoading(true);
    setResults(null);

    // Simulate database lookup latency for premium feel
    setTimeout(() => {
      const lower = trimmed.toLowerCase();
      const matched = activeTexts.database.filter(
        (entry) =>
          entry.clue.toLowerCase().includes(lower) ||
          entry.answer.toLowerCase().includes(lower) ||
          entry.world.toLowerCase().includes(lower)
      );
      setResults(matched);
      setLoading(false);
    }, 450);
  };

  const handleChipClick = (chip: string) => {
    setQuery(chip);
    handleSearch(chip);
  };

  const handleCopy = (answer: string) => {
    navigator.clipboard?.writeText(answer);
    setCopiedId(answer);
    toast.success(activeTexts.toastCopied.replace("{answer}", answer));
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setQuery("");
    setResults(null);
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="space-y-3">
        <Label htmlFor="cca-query" className="text-xs font-semibold text-muted-foreground">
          {activeTexts.label}
        </Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="cca-query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={activeTexts.placeholder}
              autoComplete="off"
              spellCheck={false}
              className="pl-12 pr-10 rounded-xl sm:h-12 sm:text-base bg-background"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            onClick={() => handleSearch()}
            disabled={loading}
            className="h-12 shrink-0 rounded-2xl px-8 text-base font-semibold gradient-honey text-honey-foreground hover:opacity-90"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Search className="mr-2 h-5 w-5" />
            )}
            {activeTexts.btnSearch}
          </Button>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1.5">
          <span className="text-xs font-medium text-muted-foreground">{activeTexts.popularClues}</span>
          {activeTexts.suggestions.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-honey/50 hover:text-foreground"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Results panel */}
      {loading && (
        <div className="mt-8 flex flex-col items-center justify-center py-10 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-honey" />
          <p className="mt-3 text-sm text-muted-foreground">{activeTexts.loadingText}</p>
        </div>
      )}

      {!loading && results !== null && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-display text-lg font-semibold">
              {activeTexts.searchResults} ({results.length})
            </h3>
            <span className="text-xs text-muted-foreground">{activeTexts.clickCopy}</span>
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/70 bg-background/40 p-8 text-center">
              <Sparkles className="mx-auto h-7 w-7 text-muted-foreground/60" />
              <p className="mt-3 text-sm font-medium text-foreground">{activeTexts.noResults}</p>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                {activeTexts.noResultsSub}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((entry) => (
                <div
                  key={`${entry.clue}-${entry.answer}`}
                  onClick={() => handleCopy(entry.answer)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-background p-4 shadow-soft cursor-pointer hover:border-honey/60 hover:shadow-lift transition-all"
                >
                  <div>
                    <span className="inline-flex items-center gap-1 rounded bg-secondary/80 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {activeTexts.world}: {entry.world} ({activeTexts.group} {entry.group}, {activeTexts.phase} {entry.phase})
                    </span>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      "{entry.clue}"
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {activeTexts.answerText.replace("{length}", String(entry.length))}
                      </span>
                      <p className="font-display text-lg font-bold tracking-wider text-honey group-hover:text-honey-dark transition-colors">
                        {entry.answer}
                      </p>
                    </div>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground group-hover:bg-honey/10 group-hover:text-honey transition-colors">
                      {copiedId === entry.answer ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
