export type DifficultyLevel = "easy" | "medium" | "hard";

/** Easy — short, high-frequency words (2–4 letters) */
export const EASY_WORDS: string[] = [
  "the", "be", "to", "of", "and", "a", "in", "it", "is", "do",
  "at", "but", "by", "we", "or", "an", "my", "up", "if", "so",
  "no", "he", "me", "go", "us", "as", "on", "was", "are", "you",
  "his", "her", "can", "not", "one", "out", "has", "had", "she",
  "get", "see", "run", "let", "day", "way", "say", "all", "two",
  "use", "how", "its", "now", "put", "set", "try", "old", "new",
  "too", "few", "ask", "cut", "low", "own", "eat", "end", "lot",
  "off", "sit", "had", "big", "far", "own", "add", "eye", "ago",
  "act", "age", "air", "arm", "art", "bed", "bit", "box", "boy",
  "bus", "car", "cup", "dog", "ear", "egg", "fee", "fly", "fun",
  "gun", "hat", "hot", "ice", "key", "law", "leg", "map", "mix",
  "mud", "oil", "pan", "pet", "pie", "pig", "pin", "pot", "red",
  "rid", "row", "rub", "sea", "sir", "sky", "sun", "tax", "tea",
  "ten", "tie", "tip", "top", "toy", "war", "web", "wet", "win",
  "yes", "yet", "zoo", "fed", "fit", "gap", "gas", "got", "hit",
  "hop", "hug", "hut", "ink", "jam", "jog", "joy", "jug", "kid",
];

/** Medium — standard common words (the current pool) */
export const MEDIUM_WORDS: string[] = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know",
  "take", "people", "into", "year", "your", "good", "some", "could",
  "them", "see", "other", "than", "then", "now", "look", "only", "come",
  "its", "over", "think", "also", "back", "after", "use", "two", "how",
  "our", "work", "first", "well", "way", "even", "new", "want", "because",
  "any", "these", "give", "day", "most", "us", "great", "between", "need",
  "large", "often", "hand", "high", "place", "hold", "turn", "move", "live",
  "long", "word", "side", "keep", "children", "begin", "walk",
  "example", "ease", "paper", "group", "always", "music", "those", "both",
  "mark", "book", "letter", "until", "mile", "river", "car", "feet",
  "care", "second", "enough", "eat", "face", "watch", "far",
  "real", "almost", "let", "above", "girl", "sometimes", "mountain",
  "cut", "young", "talk", "soon", "list", "song", "leave", "family",
  "body", "light", "hear", "country", "answer", "school", "grow", "study",
  "still", "learn", "plant", "cover", "food", "sun", "four",
  "state", "never", "here", "add", "land", "different", "home",
  "try", "kind", "picture", "again", "change", "off",
  "play", "spell", "air", "away", "animal", "house", "point", "page",
  "mother", "found", "should", "world", "below", "last",
  "father", "keep", "tree", "start", "city", "earth",
  "eye", "thought", "head", "under", "story", "saw", "left",
  "few", "while", "along", "might", "close", "something", "seem",
  "next", "hard", "open", "life", "always", "together", "run", "important",
  "until", "night", "white", "sea", "began", "took", "carry",
  "once", "stop", "without", "later",
  "miss", "idea", "enough", "real", "almost",
];

/** Hard — longer, less common words (6+ letters) */
export const HARD_WORDS: string[] = [
  "abstract", "accomplish", "accurate", "achieve", "acquire",
  "additional", "adventure", "advocate", "analyze", "ancient",
  "anxiety", "apparent", "appropriate", "argument", "arrange",
  "attention", "attitude", "attribute", "available", "awareness",
  "balance", "barrier", "beautiful", "behavior", "believe",
  "beneath", "boundary", "brilliant", "calculate", "capable",
  "capture", "careful", "certain", "challenge", "chapter",
  "character", "chemical", "circumstance", "collective", "combine",
  "community", "compare", "complex", "concern", "concept",
  "consider", "consistent", "control", "convince", "courage",
  "creative", "critical", "culture", "curious", "current",
  "dangerous", "decision", "definition", "deliberate", "demonstrate",
  "describe", "destroy", "develop", "difficult", "discover",
  "discussion", "distance", "document", "dominant", "dynamic",
  "economy", "educated", "effective", "element", "emphasize",
  "emotion", "encourage", "energy", "engage", "enormous",
  "environment", "establish", "evaluate", "evidence", "evolution",
  "examine", "example", "excellent", "exercise", "experience",
  "explain", "explore", "express", "extreme", "familiar",
  "feature", "federal", "finally", "flexible", "follows",
  "foreign", "foundation", "frequent", "function", "generate",
  "generally", "guidance", "happen", "history", "identify",
  "important", "improve", "include", "increase", "independent",
  "indicate", "influence", "initial", "insight", "inspire",
  "intelligence", "involve", "journey", "knowledge", "language",
  "learning", "machine", "maintain", "measure", "mechanism",
  "memory", "mention", "message", "method", "minimum",
  "movement", "multiply", "mutual", "natural", "negative",
  "nothing", "notice", "objective", "observe", "obvious",
  "operate", "opportunity", "organize", "original", "outcome",
  "overlap", "overcome", "pattern", "perform", "perhaps",
  "physical", "platform", "positive", "possible", "practice",
  "prepare", "present", "primary", "problem", "process",
  "produce", "progress", "provide", "purpose", "quality",
  "question", "quickly", "realize", "reason", "recognize",
  "relation", "relevant", "replace", "require", "research",
  "resolve", "respect", "respond", "restore", "result",
  "reveal", "review", "section", "security", "separate",
  "serious", "service", "similar", "simple", "situation",
  "solution", "specific", "strength", "structure", "subject",
  "success", "suggest", "support", "surface", "technology",
  "together", "transfer", "transform", "typical", "ultimate",
  "understand", "unique", "universe", "various", "version",
  "visible", "whether", "without", "written",
];

/** Pick the right pool based on difficulty */
function getPool(difficulty: DifficultyLevel): string[] {
  if (difficulty === "easy") return EASY_WORDS;
  if (difficulty === "hard") return HARD_WORDS;
  return MEDIUM_WORDS;
}

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Punctuation that can be appended to words */
const PUNCTUATION = [",", ".", "!", "?", ";", ":"];

/** Random number string (1–3 digits) */
function randomNumber(): string {
  const n = Math.floor(Math.random() * 999) + 1;
  return String(n);
}

/**
 * Get a list of words for the test.
 * @param count     Number of words to generate
 * @param difficulty Word pool difficulty
 * @param punct     Inject punctuation on ~30% of words
 * @param numbers   Inject number words every ~8 words
 */
export function getWords(
  count: number,
  difficulty: DifficultyLevel = "medium",
  punct = false,
  numbers = false
): string[] {
  const pool = getPool(difficulty);

  // Build a large shuffled list
  const result: string[] = [];
  while (result.length < count) {
    result.push(...shuffle(pool));
  }
  let words = result.slice(0, count);

  // Inject numbers (every ~8th word becomes a number)
  if (numbers) {
    words = words.map((w, i) =>
      (i + 1) % 8 === 0 ? randomNumber() : w
    );
  }

  // Inject punctuation on ~30% of words (not the last word)
  if (punct) {
    words = words.map((w, i) => {
      if (i === words.length - 1) return w;
      if (Math.random() < 0.3) {
        const p = PUNCTUATION[Math.floor(Math.random() * PUNCTUATION.length)];
        return w + p;
      }
      return w;
    });
  }

  return words;
}
