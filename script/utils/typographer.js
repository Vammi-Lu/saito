const CHARACTERS = {
  emdash: "—",
  endash: "–",
  minus: "−",
  ellipsis: "…",
  no_break_space: "\u00A0",
  thinspace: "\u2009",
  ensp: "\u2002",
  emsp: "\u2003",
  wallet: "₽$€£¥"
};

const PUNCTUATION = {
  leftSided: "«„",
  rightSided: "“»",
};

const TYPOGRAPHY_RULES = {
  "0::Разное": [
    [/\s\s/g, " "],
    [/^\s|\s$/g, ""],
    [/--/g, CHARACTERS.emdash],
    [/(\d+|[XIVCMLDZ]+)-(\d+|[XIVCMLDZ]+)/g, `$1${CHARACTERS.endash}$2`],
    [/(?<!\d)-(\d+)/g, `${CHARACTERS.minus}$1`],
    [/(\d+)[\s\u00A0](%|‰|‱)/g, "$1$2"],
    [new RegExp(`([-${CHARACTERS.minus}])(\\d+)[${CHARACTERS.endash}\\-](\\d+)`, 'g'), `$1$2${CHARACTERS.ellipsis}$3`],
    [/\.\.\./g, CHARACTERS.ellipsis],
    [/""\s*(.*?)\s*""/g, "«„$1“»"],
    [/"(.*?)"(.*?)"(.*?)"/g, "«$1„$2“$3»"],
    [/"(.*?)"/g, "«$1»"],
    [new RegExp(`((\\!|\\?)((\\.\\.\\.|${CHARACTERS.ellipsis}))|((\\.\\.\\.|${CHARACTERS.ellipsis}))(\\!|\\?))`, 'g'), "$2$7.."],
    [new RegExp(`(?<=[${PUNCTUATION.leftSided}«„\\(\\[])\\s+|(?<!\\s)\\s(?=[${PUNCTUATION.rightSided}»"'\\)\\]])`, 'g'), ""],
    [/\.»/g, "»."],
    [new RegExp(`(?<!\\d\\s)([${CHARACTERS.wallet}])\\s(\\d{1,3}(?:\\d{3})*(?:,\\d+)?|\\d+(?:,\\d+)?)`, 'g'), `$2${CHARACTERS.no_break_space}$1`],
    [new RegExp(`(\\d+)\\s([${CHARACTERS.wallet}])`, 'g'), `$1${CHARACTERS.no_break_space}$2`]
  ],
  
  "1::Тире": [
    [new RegExp(`^(${CHARACTERS.emdash})\\s`, 'g'), `$1${CHARACTERS.no_break_space}`],
    [new RegExp(`(?<=[${PUNCTUATION.rightSided}])\\s${CHARACTERS.emdash}\\s`, 'g'), `${CHARACTERS.no_break_space}${CHARACTERS.emdash}${CHARACTERS.no_break_space}`],
    [new RegExp(`(?<![${PUNCTUATION.rightSided}])\\s${CHARACTERS.emdash}\\s`, 'g'), `${CHARACTERS.no_break_space}${CHARACTERS.emdash} `]
  ],
  
  "2::Цифры": [
    [/(?<=\d)(?=(\d{3})+(?!\d))/g, CHARACTERS.no_break_space],
    [/(?<=\d)\s(?=\d{3})/g, CHARACTERS.no_break_space]
  ],
  
  "3::Инициалы": [
    [/([A-ZА-ЯЁ]\.)\s([A-ZА-ЯЁ]\.)\s([A-ZА-ЯЁ][a-zа-яё]+)/g, `$1${CHARACTERS.thinspace}$2${CHARACTERS.thinspace}$3`],
    [/([A-ZА-ЯЁ][a-zа-яё]+)\s([A-ZА-Яё]\.)\s([A-ZА-ЯЁ]\.)/g, `$1${CHARACTERS.thinspace}$2${CHARACTERS.thinspace}$3`]
  ],
  
  "4::Союзы и прочее": [
    [/\s(б|бы|ж|же|ли|ль)(?![а-яА-Я])/gi, `${CHARACTERS.no_break_space}$1`],
    [/(^|[\s([«„])(за|из|до|об|на|но|не|ни|то|от|по|со|или|для|над|под|при|что|если|через|после|перед|г\.|обл\.|кр\.|ст\.|пос\.|с\.|д\.|ул\.|пер\.|пр\.|пр-т\.|просп\.|пл\.|бул\.|б-р\.|наб\.|ш\.|туп\.|оф\.|кв\.|комн\.|под\.|мкр\.|уч\.|вл\.|влад\.|стр\.|корп\.|литер|эт\.|пгт\.|стр\.|гл\.|рис\.|илл\.|ст\.|п\.|c\.|№|§|АО|ОАО|ЗАО|ООО|ПАО)\s/gi, ` $1$2${CHARACTERS.no_break_space}`]
  ],
  
  "5::Одиночные буквы": [
    [/(?<![а-яА-ЯёЁa-zA-Z])([а-яА-ЯёЁa-zA-Z],?)\s/g, `$1${CHARACTERS.no_break_space}`]
  ],
  
  "6::Конец абзаца": [
    [new RegExp(`(?<=[а-яА-ЯёЁa-zA-Z])\\s(?=[а-яА-ЯёЁa-zA-Z]{1,12}[${PUNCTUATION.rightSided}]*$)`, 'g'), CHARACTERS.no_break_space]
  ]
};

function applyTypography(text) {
  let result = text;
  
  for (const [category, rules] of Object.entries(TYPOGRAPHY_RULES)) {
    for (const [pattern, replacement] of rules) {
      result = result.replace(pattern, replacement);
    }
  }
  
  return result;
}

function applyTypographyToElement(element) {
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (text && text.trim()) {
        node.textContent = applyTypography(text);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const skipTags = ["SCRIPT", "STYLE", "CODE", "PRE", "TEXTAREA", "INPUT"];

      if (!skipTags.includes(node.tagName)) {
        const childNodes = Array.from(node.childNodes);
        childNodes.forEach((child) => processNode(child));
      }
    }
  }

  processNode(element);
}

export { applyTypography, applyTypographyToElement };