function cleanText(input) {
  return input
    .trim() // Remove leading and trailing whitespace
    .replace(/\s+/g, ' ') // Replace multiple spaces/newlines/tabs with a single space
    .replace(/\s*\n\s*/g, '\n') // Remove extra spaces around newlines
    .replace(/\n{2,}/g, '\n'); // Replace multiple newlines with a single newline
}

function getTextLanguage(text) {
  const langPatterns = {
    en: /^[a-zA-Z0-9\s.,'";?!-]+$/, // Basic Latin characters
    bo: /[\u0F00-\u0FFF]/, // Tibetan script
  };

  return Object.entries(langPatterns).find(([lang, regex]) => regex.test(text))?.shift() || '';
}

function getTextSentences({ lang, text }) {
  switch (lang) {
    case 'bo': {

    }
    case 'en':
    default: {

    }
  }
}

function getSentencesFromText(text) {
  const sentenceEndRegex = /([.!?]+|\u0F0D|\u0F0E)(\s|$)/g;
  const sentences = [];
  let startIndex = 0;
  text = cleanText(text);

  text.replace(sentenceEndRegex, (match, punctuation, after, offset) => {
    const sentence = text.slice(startIndex, offset + punctuation.length).trim();
    if (sentence) sentences.push(sentence);
    startIndex = offset + punctuation.length;
  });
  
  return sentences;
}

module.exports = {
  cleanText,
  getTextLanguage,
  getSentencesFromText
}