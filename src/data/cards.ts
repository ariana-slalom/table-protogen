import type { Card } from '@/types'

export const CARDS: Card[] = [
  // ── TASTE ──────────────────────────────────────────────────────────
  {
    id: 'taste-01',
    categoryId: 'taste',
    prompt: 'Blind taste round — host pours two olive oils. Which is grassier? Which has a peppery finish, and why is that finish a mark of quality rather than a flaw?',
    hasTimer: true,
    timerSeconds: 60,
    note: 'Peppery finish = high polyphenol content, sign of fresh, early-harvest oil. Bitterness and pepper are features, not defects.'
  },
  {
    id: 'taste-02',
    categoryId: 'taste',
    prompt: 'Tear a basil leaf with your hands. Now chiffonade one. Taste both. Does the cut change the flavor — and if so, why?',
    hasTimer: false,
    note: 'Tearing bruises cells differently than cutting. A sharp chiffonade minimizes oxidation. Bruising releases more volatile aromatics but also browns faster. Both are right depending on context.'
  },
  {
    id: 'taste-03',
    categoryId: 'taste',
    prompt: 'Blind taste: two vinegars. One sherry, one aged balsamic. Which is which — and what specifically gives it away?',
    hasTimer: true,
    timerSeconds: 60,
    note: 'Sherry vinegar: nuttier, drier, higher acid. Aged balsamic: syrupy, sweet-tart, complex. Both from oxidative aging processes but entirely different base products.'
  },
  {
    id: 'taste-04',
    categoryId: 'taste',
    prompt: 'Name a vegetable where the cut fundamentally changes the dish — not just size, but flavor or texture. Explain why.',
    hasTimer: false,
    note: 'Classic answers: onions (thin slice vs dice changes sulfur compound release and sweetness), carrots (oblique cut vs coin changes caramelization surface area), cabbage (chiffonade vs wedge for braising).'
  },
  { id: 'taste-05', categoryId: 'taste', prompt: 'Describe umami without using the words savory, meaty, or Japanese.', hasTimer: false },
  { id: 'taste-06', categoryId: 'taste', prompt: 'Everyone rank these fats in order of flavor complexity: butter, duck fat, lard, extra virgin olive oil. Defend your first choice.', hasTimer: false },
  { id: 'taste-07', categoryId: 'taste', prompt: 'Name something you\'ve eaten that was technically perfect but emotionally flat. What was missing?', hasTimer: false },
  {
    id: 'taste-08',
    categoryId: 'taste',
    prompt: 'Blind taste: two salts at the table — fleur de sel and kosher. Does finishing salt actually matter on a cooked dish, or is it texture only?',
    hasTimer: true,
    timerSeconds: 60,
    note: 'Fleur de sel: mineral, moist, flaky. Kosher: clean, neutral. The argument is texture vs dissolution rate. Samin Nosrat\'s Salt Fat Acid Heat comes down firmly on salt type mattering enormously — the table decides.'
  },
  {
    id: 'taste-09',
    categoryId: 'taste',
    prompt: 'Name four olive oil varietals and where they\'re grown. Bonus: what flavor profile is each known for?',
    hasTimer: false,
    note: 'Examples: Arbequina (Catalonia — mild, fruity, low bitterness), Picual (Andalusia — robust, peppery, high polyphenol), Koroneiki (Greece — grassy, bitter, intense), Taggiasca (Liguria — delicate, sweet, buttery).'
  },

  // ── WOULD YOU RATHER ───────────────────────────────────────────────
  { id: 'wyr-01', categoryId: 'would-you-rather', prompt: 'Cook only over live fire for the rest of your life — or — only on induction?', hasTimer: false },
  { id: 'wyr-02', categoryId: 'would-you-rather', prompt: 'Give up your chef\'s knife — or — give up your best pan?', hasTimer: false },
  { id: 'wyr-03', categoryId: 'would-you-rather', prompt: 'Cook a 12-course tasting menu for the table from memory, no recipes — or — eat at a three-star Michelin with someone who narrates every bite?', hasTimer: false },
  { id: 'wyr-04', categoryId: 'would-you-rather', prompt: 'Cook only with one fat for the rest of your life. You have ten seconds to pick it. Go.', hasTimer: false },
  { id: 'wyr-05', categoryId: 'would-you-rather', prompt: 'Give up your entire spice collection — or — give up all fresh herbs forever?', hasTimer: false },
  { id: 'wyr-06', categoryId: 'would-you-rather', prompt: 'Eat only seasonally and locally for a year — or — eat whatever you want but everything has to come from a can?', hasTimer: false },
  { id: 'wyr-07', categoryId: 'would-you-rather', prompt: 'Have Fergus Henderson\'s offal obsession but no one to share it with — or — Thomas Keller\'s precision but only cook for people who don\'t notice?', hasTimer: false },
  { id: 'wyr-08', categoryId: 'would-you-rather', prompt: 'Never eat bread again — or — never eat pasta again?', hasTimer: false },
  { id: 'wyr-09', categoryId: 'would-you-rather', prompt: 'Only eat fermented or aged foods for a month — or — only eat raw foods for a month?', hasTimer: false },

  // ── HOT TAKE ───────────────────────────────────────────────────────
  {
    id: 'hottake-01',
    categoryId: 'hot-take',
    prompt: 'MSG belongs in every serious home kitchen. Agree or disagree?',
    hasTimer: false,
    note: 'One player states their take. Table votes agree or disagree. Alton Brown has been very publicly pro-MSG for 20 years — use it if needed.'
  },
  {
    id: 'hottake-02',
    categoryId: 'hot-take',
    prompt: 'The best olive oil you own should never touch heat. Defend your position.',
    hasTimer: false,
    note: 'One player states their take. Table votes agree or disagree. The smoke point argument vs the flavor argument — both are legitimate.'
  },
  { id: 'hottake-03', categoryId: 'hot-take', prompt: 'A great stock is the single clearest line between a home cook and a serious one. Agree?', hasTimer: false, note: 'One player states their take. Table votes agree or disagree.' },
  { id: 'hottake-04', categoryId: 'hot-take', prompt: 'Natural wine is either the future of the category or a hill people die on unnecessarily. Pick a side.', hasTimer: false, note: 'One player states their take. Table votes agree or disagree.' },
  { id: 'hottake-05', categoryId: 'hot-take', prompt: 'Heirloom tomatoes are mostly marketing. The flavor difference rarely justifies the price. True or myth?', hasTimer: false, note: 'One player states their take. Table votes agree or disagree.' },
  { id: 'hottake-06', categoryId: 'hot-take', prompt: 'Alton Brown is right: unitasker kitchen tools are almost always a waste. Agree or disagree?', hasTimer: false, note: 'One player states their take. Table votes. Classic exceptions: the spider strainer, the oyster knife, the pasta machine.' },
  { id: 'hottake-07', categoryId: 'hot-take', prompt: 'A tasting menu over ten courses stops being hospitality and becomes endurance. Agree?', hasTimer: false, note: 'One player states their take. Table votes agree or disagree.' },
  { id: 'hottake-08', categoryId: 'hot-take', prompt: 'The mandoline is more important than a stand mixer in a serious home kitchen. Make your case.', hasTimer: false, note: 'One player states their take. Table votes agree or disagree.' },
  { id: 'hottake-09', categoryId: 'hot-take', prompt: 'Nose-to-tail eating is a philosophy, not a trend. If you won\'t eat the whole animal, you shouldn\'t eat it at all.', hasTimer: false, note: 'One player states their take. Table votes agree or disagree. Fergus Henderson, St. John, London.' },

  // ── CHEF'S TABLE ───────────────────────────────────────────────────
  {
    id: 'chefs-01',
    categoryId: 'chefs-table',
    prompt: 'What is koji, how does it work biologically, and name one dish where it fundamentally changes the ingredient?',
    hasTimer: false,
    note: 'Koji = Aspergillus oryzae, a mold that produces amylase and protease enzymes. Breaks down starches into sugars, proteins into amino acids. Used in miso, sake, soy sauce, and by Noma to dry-age beef in days rather than weeks.'
  },
  {
    id: 'chefs-02',
    categoryId: 'chefs-table',
    prompt: 'Noma\'s fermentation lab pioneered which specific technique that\'s now appearing in serious kitchens worldwide — and what does it produce?',
    hasTimer: false,
    note: 'Lacto-fermentation at scale applied to non-traditional ingredients (garlic, rose hips, pine). Also koji aging of non-traditional proteins. René Redzepi and David Zilber\'s The Noma Guide to Fermentation codified it.'
  },
  {
    id: 'chefs-03',
    categoryId: 'chefs-table',
    prompt: 'Eggnog: what spirit was it originally made with in 17th century Britain, and how did the American colonial version diverge — and why?',
    hasTimer: false,
    note: 'British original: sherry or Madeira, milk, eggs, spices — a drink for the wealthy. American colonial version substituted rum (cheap, local, Caribbean trade routes) and later bourbon. The ratio of egg to cream also shifted to be richer. George Washington had a famously lethal recipe using rye, rum, and sherry together.'
  },
  {
    id: 'chefs-04',
    categoryId: 'chefs-table',
    prompt: 'What is the difference between a gastrique and a pan sauce — and when would you choose one over the other?',
    hasTimer: false,
    note: 'Gastrique: sugar caramelized then deglazed with vinegar — sweet-sour base, made independently. Pan sauce: built directly from fond using the pan drippings, stock, butter mount. Gastrique suits fruit-paired dishes (duck, pork). Pan sauce is more versatile and immediate.'
  },
  {
    id: 'chefs-05',
    categoryId: 'chefs-table',
    prompt: 'Name three things Escoffier codified that every professional kitchen still uses today.',
    hasTimer: false,
    note: 'Brigade system (hierarchy of kitchen roles), mother sauces (five base sauces everything derives from), mise en place as formal doctrine. Also: the à la carte menu format, systematized classical French technique.'
  },
  {
    id: 'chefs-06',
    categoryId: 'chefs-table',
    prompt: 'Amanda Freitag talks constantly about the importance of tasting as you cook. What specifically goes wrong in a dish when a cook stops tasting mid-process?',
    hasTimer: false,
    note: 'Open answer — but good ones include: seasoning imbalance compounds (underseasoned stock makes everything flat), acid added too late doesn\'t integrate, reduction changes salt concentration so a properly seasoned beginning becomes too salty at the end.'
  },
  {
    id: 'chefs-07',
    categoryId: 'chefs-table',
    prompt: 'What is the Scoville scale measuring, and what specific chemical compound is responsible for heat in chilis?',
    hasTimer: false,
    note: 'Scoville measures capsaicin concentration via dilution until heat is undetectable. Capsaicin (and related capsaicinoids) bind to TRPV1 receptors — the same pain receptor activated by heat above 43°C. The burn is a neurological trick, not actual tissue damage.'
  },
  {
    id: 'chefs-08',
    categoryId: 'chefs-table',
    prompt: 'The chefs at Noma argued that terroir applies to fermented foods the same way it applies to wine. What does terroir mean in this context and do you buy it?',
    hasTimer: false,
    note: 'Terroir in fermentation = wild yeasts and bacteria are geographically specific. Sourdough started in San Francisco behaves differently from one started in Copenhagen. Miso made with local koji strains reflects regional microbial culture. The table debates whether this is meaningful or romantic.'
  },
  {
    id: 'chefs-09',
    categoryId: 'chefs-table',
    prompt: 'What makes a knife steel different from a whetstone — and which one should you be reaching for before service?',
    hasTimer: false,
    note: 'A honing steel realigns the edge without removing metal. A whetstone grinds metal to create a new edge. Before service: honing steel — quick realignment. Whetstoning is maintenance, done weekly or monthly depending on use. Most home cooks confuse the two and only own a steel.'
  },

  // ── STORY ──────────────────────────────────────────────────────────
  { id: 'story-01', categoryId: 'story', prompt: 'The dish you\'ve made fifty times and still can\'t stop adjusting. What are you still chasing?', hasTimer: false },
  { id: 'story-02', categoryId: 'story', prompt: 'The meal that made you understand food differently — not the best meal you\'ve had, the most clarifying one.', hasTimer: false },
  { id: 'story-03', categoryId: 'story', prompt: 'A cookbook that changed how you cook. Not the recipes — what it taught you that no recipe actually says.', hasTimer: false },
  { id: 'story-04', categoryId: 'story', prompt: 'The most pretentious food opinion you\'ve ever held that you\'ve since completely abandoned.', hasTimer: false },
  { id: 'story-05', categoryId: 'story', prompt: 'You\'re cooking for someone who knows nothing about food and everything about it matters to you. What do you make — and why that?', hasTimer: false },
  { id: 'story-06', categoryId: 'story', prompt: 'The ingredient you were wrong about for years. What changed your mind?', hasTimer: false },
  { id: 'story-07', categoryId: 'story', prompt: 'A food tradition from someone else\'s culture that you\'ve genuinely absorbed into your own cooking. How did it happen?', hasTimer: false },
  { id: 'story-08', categoryId: 'story', prompt: 'The worst food advice you\'ve ever been given by someone who was extremely confident about it.', hasTimer: false },
  { id: 'story-09', categoryId: 'story', prompt: 'Your death row meal. Not what sounds impressive — what you actually want.', hasTimer: false }
]