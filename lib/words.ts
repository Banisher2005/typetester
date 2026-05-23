export const WORD_POOL: string[] = [
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
  "long", "word", "side", "keep", "children", "begin", "got", "walk",
  "example", "ease", "paper", "group", "always", "music", "those", "both",
  "mark", "book", "letter", "until", "mile", "river", "car", "feet",
  "care", "second", "enough", "eat", "face", "watch", "far", "Indian",
  "real", "almost", "let", "above", "girl", "sometimes", "mountain",
  "cut", "young", "talk", "soon", "list", "song", "leave", "family",
  "body", "light", "hear", "country", "answer", "school", "grow", "study",
  "still", "learn", "plant", "cover", "food", "sun", "four", "between",
  "state", "never", "became", "here", "add", "land", "different", "home",
  "move", "try", "kind", "hand", "picture", "again", "change", "off",
  "play", "spell", "air", "away", "animal", "house", "point", "page",
  "letter", "mother", "answer", "found", "study", "still", "learn",
  "should", "America", "world", "below", "country", "plant", "last",
  "school", "father", "keep", "tree", "never", "start", "city", "earth",
  "eye", "light", "thought", "head", "under", "story", "saw", "left",
  "don't", "few", "while", "along", "might", "close", "something", "seem",
  "next", "hard", "open", "example", "begin", "life", "always", "those",
  "both", "paper", "together", "got", "group", "often", "run", "important",
  "until", "children", "side", "feet", "car", "mile", "night", "walk",
  "white", "sea", "began", "grow", "took", "river", "four", "carry",
  "state", "once", "book", "hear", "stop", "without", "second", "later",
  "miss", "idea", "enough", "eat", "face", "watch", "far", "Indian",
  "real", "almost", "let", "above", "girl", "sometimes", "mountain",
  "cut", "young", "talk", "soon", "list", "song", "leave", "family",
];

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getWords(count: number): string[] {
  const shuffled = shuffle(WORD_POOL);
  // If we need more words than the pool, repeat
  if (count <= shuffled.length) return shuffled.slice(0, count);
  const result: string[] = [];
  while (result.length < count) {
    result.push(...shuffle(WORD_POOL));
  }
  return result.slice(0, count);
}
