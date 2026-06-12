// ═══════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════
const SUPABASE_URL = 'https://eqtjsgqascldwhqomncu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_AH7nQIp9WPOqUowcPi3W4Q_djmApiMF';
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

const FORBIDDEN_NAMES = [
  'admin','administrador','administradora','moderador','mod','staff','dueño',
  'creador','soporte','sistema','oficial','ayuda','webmaster','owner','creator',
  'superadmin','root','support','official','help','manager','sysadmin','developer',
  'dev','adm1n','4dmin','m0d','staf','soport','s0porte','sys','0wner','cr3ator'
];

const RANGOS = window.RANGOS = [
  { id: 'nuevo', label: 'Nuevo', icon: '🌱', min: 0, max: 19, perk: 'Acceso básico a la comunidad', locked: false },
  { id: 'aprendiz', label: 'Aprendiz', icon: '📚', min: 20, max: 49, perk: 'Badge especial en tus respuestas', locked: false },
  { id: 'confiable', label: 'Confiable', icon: '⭐', min: 50, max: 79, perk: 'Tus recomendaciones se destacan primero', locked: false },
  { id: 'experto', label: 'Experto', icon: '🏆', min: 80, max: 99, perk: 'Acceso al canal #expertos (próximamente)', locked: true },
  { id: 'colaborador_top', label: 'Colaborador TOP', icon: '🏅', min: 100, max: 199, perk: 'Insignia dorada + voto doble', locked: false },
  { id: 'leyenda', label: 'Leyenda', icon: '🔥', min: 200, max: 999, perk: 'Insignia legendaria', locked: true },
];

let usuario = null;
let tabActual = 'abiertas';
let hilosData = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 5;
let quoteActiva = null; // { hiloId, replyId, autor, texto }
let notifCount = 0;
let rankingHiloActivo = null; // hiloId al que se está recomendando
let quillEditorNoticia = null; // Editor Quill para noticias
let noticiasPagina = 1;
const NOTICIAS_POR_PAGINA = 5;
let topMovilesVisible = true;

// ─── CATEGORÍAS DE RANKING ───────────────────
const RANKING_CATS = [
  { key: 'sc_pantalla',    label: 'Pantalla',     icon: '📱' },
  { key: 'sc_potencia',    label: 'Potencia',     icon: '🚀' },
  { key: 'sc_camara',      label: 'Cámara',       icon: '📷' },
  { key: 'sc_video',       label: 'Vídeo',        icon: '🎥' },
  { key: 'sc_bateria',     label: 'Batería',      icon: '🔋' },
  { key: 'sc_carga',       label: 'Carga',        icon: '⚡' },
  { key: 'sc_sonido',      label: 'Sonido',       icon: '🔊' },
  { key: 'sc_bloatware',   label: 'Bloatware',    icon: '🧹' },
  { key: 'sc_actualizaciones', label: 'Updates',  icon: '🔄' },
  { key: 'sc_software',    label: 'Software',     icon: '💻' },
];

// ═══════════════════════════════════════════
// LISTA MAESTRA DE MODELOS CONOCIDOS
// ═══════════════════════════════════════════

const MODELOS_CONOCIDOS = [
  // ── APPLE ──────────────────────────────────────────
  { patron: 'iphone 15', variantes: ['iphone 15'] },  // ← Eliminado '15'
  { patron: 'iphone 15 plus', variantes: ['iphone 15 plus'] },  // ← Eliminado '15 plus'
  { patron: 'iphone 15 pro', variantes: ['iphone 15 pro'] },  // ← Eliminado '15 pro'
  { patron: 'iphone 15 pro max', variantes: ['iphone 15 pro max'] },  // ← Eliminado '15 pro max'
  { patron: 'iphone 16', variantes: ['iphone 16'] },  // ← Eliminado '16'
  { patron: 'iphone 16 plus', variantes: ['iphone 16 plus'] },
  { patron: 'iphone 16 pro', variantes: ['iphone 16 pro'] },
  { patron: 'iphone 16 pro max', variantes: ['iphone 16 pro max'] },
  { patron: 'iphone 16e', variantes: ['iphone 16e'] },
  { patron: 'iphone 17', variantes: ['iphone 17'] },  // ← Eliminado '17'
  { patron: 'iphone 17 plus', variantes: ['iphone 17 plus'] },
  { patron: 'iphone 17 pro', variantes: ['iphone 17 pro'] },
  { patron: 'iphone 17 pro max', variantes: ['iphone 17 pro max'] },
  { patron: 'iphone 17e', variantes: ['iphone 17e'] },
  { patron: 'iphone se', variantes: ['iphone se'] },  // ← Eliminado 'se'
  { patron: 'iphone xr', variantes: ['iphone xr'] },  // ← Eliminado 'xr'
  { patron: 'iphone xs', variantes: ['iphone xs'] },  // ← Eliminado 'xs'
  { patron: 'iphone xs max', variantes: ['iphone xs max'] },  // ← ¡AÑADÍ LA COMA AQUÍ!

  // ── SAMSUNG ────────────────────────────────────────
  { patron: 'galaxy s23', variantes: ['s23', 'galaxy s23'] },
  { patron: 'galaxy s23+', variantes: ['s23+', 's23 plus', 'galaxy s23+'] },
  { patron: 'galaxy s23 ultra', variantes: ['s23 ultra', 'galaxy s23 ultra'] },
  { patron: 'galaxy s23 fe', variantes: ['s23 fe', 'galaxy s23 fe'] },
  { patron: 'galaxy s24', variantes: ['s24', 'galaxy s24'] },
  { patron: 'galaxy s24+', variantes: ['s24+', 's24 plus', 'galaxy s24+'] },
  { patron: 'galaxy s24 ultra', variantes: ['s24 ultra', 'galaxy s24 ultra'] },
  { patron: 'galaxy s24 fe', variantes: ['s24 fe', 'galaxy s24 fe'] },
  { patron: 'galaxy s25', variantes: ['s25', 'galaxy s25'] },
  { patron: 'galaxy s25+', variantes: ['s25+', 's25 plus', 'galaxy s25+'] },
  { patron: 'galaxy s25 ultra', variantes: ['s25 ultra', 'galaxy s25 ultra'] },
  { patron: 'galaxy s25 fe', variantes: ['s25 fe', 'galaxy s25 fe'] },
  { patron: 'galaxy s26', variantes: ['s26', 'galaxy s26'] },
  { patron: 'galaxy s26+', variantes: ['s26+', 's26 plus', 'galaxy s26+'] },
  { patron: 'galaxy s26 ultra', variantes: ['s26 ultra', 'galaxy s26 ultra'] },
  { patron: 'galaxy a15', variantes: ['a15', 'galaxy a15'] },
  { patron: 'galaxy a16', variantes: ['a16', 'galaxy a16'] },
  { patron: 'galaxy a25', variantes: ['a25', 'galaxy a25'] },
  { patron: 'galaxy a26', variantes: ['a26', 'galaxy a26'] },
  { patron: 'galaxy a35', variantes: ['a35', 'galaxy a35'] },
  { patron: 'galaxy a36', variantes: ['a36', 'galaxy a36'] },
  { patron: 'galaxy a55', variantes: ['a55', 'galaxy a55'] },
  { patron: 'galaxy a56', variantes: ['a56', 'galaxy a56'] },
  { patron: 'galaxy a57', variantes: ['a57', 'galaxy a57'] },
  { patron: 'galaxy z fold 5', variantes: ['z fold 5', 'galaxy z fold 5', 'fold 5'] },
  { patron: 'galaxy z flip 5', variantes: ['z flip 5', 'galaxy z flip 5', 'flip 5'] },
  { patron: 'galaxy z fold 6', variantes: ['z fold 6', 'galaxy z fold 6', 'fold 6'] },
  { patron: 'galaxy z flip 6', variantes: ['z flip 6', 'galaxy z flip 6', 'flip 6'] },
  { patron: 'galaxy z fold 7', variantes: ['z fold 7', 'galaxy z fold 7', 'fold 7'] },
  { patron: 'galaxy z flip 7', variantes: ['z flip 7', 'galaxy z flip 7', 'flip 7'] },
  { patron: 'galaxy note 10', variantes: ['note 10', 'galaxy note 10'] },
  { patron: 'galaxy note 10+', variantes: ['note 10+', 'note 10 plus', 'galaxy note 10+'] },
  { patron: 'galaxy note 20', variantes: ['note 20', 'galaxy note 20'] },
  { patron: 'galaxy note 20 ultra', variantes: ['note 20 ultra', 'galaxy note 20 ultra'] },

  // ── GOOGLE PIXEL ───────────────────────────────────
  { patron: 'pixel 8', variantes: ['pixel 8'] },
  { patron: 'pixel 8 pro', variantes: ['pixel 8 pro', 'pixel8 pro'] },
  { patron: 'pixel 8a', variantes: ['pixel 8a', 'pixel8a'] },
  { patron: 'pixel 9', variantes: ['pixel 9'] },
  { patron: 'pixel 9 pro', variantes: ['pixel 9 pro', 'pixel9 pro'] },
  { patron: 'pixel 9 pro xl', variantes: ['pixel 9 pro xl', 'pixel9 pro xl'] },
  { patron: 'pixel 9 pro fold', variantes: ['pixel 9 pro fold', 'pixel9 fold'] },
  { patron: 'pixel 9a', variantes: ['pixel 9a', 'pixel9a'] },
  { patron: 'pixel 10', variantes: ['pixel 10'] },
  { patron: 'pixel 10 pro', variantes: ['pixel 10 pro', 'pixel10 pro'] },
  { patron: 'pixel 10 pro xl', variantes: ['pixel 10 pro xl'] },
  { patron: 'pixel 10 pro fold', variantes: ['pixel 10 pro fold'] },
  { patron: 'pixel 10a', variantes: ['pixel 10a'] },

  // ── XIAOMI ─────────────────────────────────────────
  { patron: 'xiaomi 13', variantes: ['xiaomi 13', 'mi 13'] },
  { patron: 'xiaomi 13 ultra', variantes: ['xiaomi 13 ultra', '13 ultra'] },
  { patron: 'xiaomi 13t', variantes: ['xiaomi 13t', '13t'] },
  { patron: 'xiaomi 13t pro', variantes: ['xiaomi 13t pro', '13t pro'] },
  { patron: 'xiaomi 14', variantes: ['xiaomi 14', 'mi 14'] },
  { patron: 'xiaomi 14 ultra', variantes: ['xiaomi 14 ultra', '14 ultra'] },
  { patron: 'xiaomi 14t', variantes: ['xiaomi 14t', '14t'] },
  { patron: 'xiaomi 14t pro', variantes: ['xiaomi 14t pro', '14t pro'] },
  { patron: 'xiaomi 15', variantes: ['xiaomi 15', 'mi 15'] },
  { patron: 'xiaomi 15 ultra', variantes: ['xiaomi 15 ultra', '15 ultra'] },
  { patron: 'xiaomi 15t', variantes: ['xiaomi 15t', '15t'] },
  { patron: 'xiaomi 15t pro', variantes: ['xiaomi 15t pro', '15t pro'] },
  { patron: 'xiaomi 17', variantes: ['xiaomi 17', 'mi 17'] },
  { patron: 'xiaomi 17 ultra', variantes: ['xiaomi 17 ultra', '17 ultra'] },
  { patron: 'xiaomi mix flip', variantes: ['xiaomi mix flip', 'mix flip'] },
  { patron: 'xiaomi mix fold 4', variantes: ['mix fold 4', 'xiaomi mix fold 4'] },
  { patron: 'xiaomi mix fold 5', variantes: ['mix fold 5', 'xiaomi mix fold 5'] },

  // ── REDMI ──────────────────────────────────────────
  { patron: 'redmi note 13', variantes: ['redmi note 13', 'note 13'] },
  { patron: 'redmi note 13 pro', variantes: ['redmi note 13 pro', 'note 13 pro'] },
  { patron: 'redmi note 13 pro+', variantes: ['redmi note 13 pro+', 'note 13 pro+'] },
  { patron: 'redmi note 14', variantes: ['redmi note 14', 'note 14'] },
  { patron: 'redmi note 14 pro', variantes: ['redmi note 14 pro', 'note 14 pro'] },
  { patron: 'redmi note 14 pro+', variantes: ['redmi note 14 pro+', 'note 14 pro+'] },
  { patron: 'redmi note 15', variantes: ['redmi note 15', 'note 15'] },
  { patron: 'redmi note 15 pro', variantes: ['redmi note 15 pro', 'note 15 pro'] },
  { patron: 'redmi note 15 pro+', variantes: ['redmi note 15 pro+', 'note 15 pro+'] },
  { patron: 'redmi 13', variantes: ['redmi 13'] },
  { patron: 'redmi 14', variantes: ['redmi 14'] },
  { patron: 'redmi 15', variantes: ['redmi 15'] },

  // ── POCO ───────────────────────────────────────────
  { patron: 'poco x6', variantes: ['poco x6'] },
  { patron: 'poco x6 pro', variantes: ['poco x6 pro'] },
  { patron: 'poco x7', variantes: ['poco x7'] },
  { patron: 'poco x7 pro', variantes: ['poco x7 pro'] },
  { patron: 'poco x8', variantes: ['poco x8'] },
  { patron: 'poco x8 pro', variantes: ['poco x8 pro'] },
  { patron: 'poco f6', variantes: ['poco f6'] },
  { patron: 'poco f6 pro', variantes: ['poco f6 pro'] },
  { patron: 'poco f7', variantes: ['poco f7'] },
  { patron: 'poco f7 pro', variantes: ['poco f7 pro'] },
  { patron: 'poco f7 ultra', variantes: ['poco f7 ultra'] },
  { patron: 'poco f8', variantes: ['poco f8'] },
  { patron: 'poco f8 pro', variantes: ['poco f8 pro'] },
  { patron: 'poco f8 ultra', variantes: ['poco f8 ultra'] },
  { patron: 'poco m7', variantes: ['poco m7'] },
  { patron: 'poco m7 pro', variantes: ['poco m7 pro'] },

  // ── ONEPLUS ────────────────────────────────────────
  { patron: 'oneplus 12', variantes: ['oneplus 12', 'one plus 12'] },
  { patron: 'oneplus 12r', variantes: ['oneplus 12r', 'one plus 12r'] },
  { patron: 'oneplus 13', variantes: ['oneplus 13', 'one plus 13'] },
  { patron: 'oneplus 13r', variantes: ['oneplus 13r', 'one plus 13r'] },
  { patron: 'oneplus 15', variantes: ['oneplus 15', 'one plus 15'] },
  { patron: 'oneplus 15r', variantes: ['oneplus 15r', 'one plus 15r'] },
  { patron: 'oneplus nord 4', variantes: ['oneplus nord 4', 'nord 4'] },
  { patron: 'oneplus nord ce 4', variantes: ['oneplus nord ce 4', 'nord ce 4'] },
  { patron: 'oneplus open', variantes: ['oneplus open', 'oneplus fold'] },

  // ── OPPO ───────────────────────────────────────────
  { patron: 'oppo find x8', variantes: ['oppo find x8', 'find x8'] },
  { patron: 'oppo find x8 pro', variantes: ['oppo find x8 pro', 'find x8 pro'] },
  { patron: 'oppo find x9', variantes: ['oppo find x9', 'find x9'] },
  { patron: 'oppo find x9 pro', variantes: ['oppo find x9 pro', 'find x9 pro'] },
  { patron: 'oppo reno 13', variantes: ['oppo reno 13', 'reno 13'] },
  { patron: 'oppo reno 13 pro', variantes: ['oppo reno 13 pro', 'reno 13 pro'] },
  { patron: 'oppo reno 14', variantes: ['oppo reno 14', 'reno 14'] },

  // ── REALME ─────────────────────────────────────────
  { patron: 'realme gt 6', variantes: ['realme gt 6', 'gt 6'] },
  { patron: 'realme gt 6t', variantes: ['realme gt 6t', 'gt 6t'] },
  { patron: 'realme gt 7', variantes: ['realme gt 7', 'gt 7'] },
  { patron: 'realme gt 7 pro', variantes: ['realme gt 7 pro', 'gt 7 pro'] },
  { patron: 'realme gt 8', variantes: ['realme gt 8', 'gt 8'] },
  { patron: 'realme gt 8 pro', variantes: ['realme gt 8 pro', 'gt 8 pro'] },
  { patron: 'realme 13 pro', variantes: ['realme 13 pro'] },
  { patron: 'realme 13 pro+', variantes: ['realme 13 pro+'] },
  { patron: 'realme 14 pro', variantes: ['realme 14 pro'] },
  { patron: 'realme 14 pro+', variantes: ['realme 14 pro+'] },
  { patron: 'realme 15 pro', variantes: ['realme 15 pro'] },
  { patron: 'realme 15 pro+', variantes: ['realme 15 pro+'] },

  // ── HONOR ──────────────────────────────────────────
  { patron: 'honor magic 7', variantes: ['honor magic 7', 'magic 7'] },
  { patron: 'honor magic 7 pro', variantes: ['honor magic 7 pro', 'magic 7 pro'] },
  { patron: 'honor magic 8', variantes: ['honor magic 8', 'magic 8'] },
  { patron: 'honor magic 8 pro', variantes: ['honor magic 8 pro', 'magic 8 pro'] },
  { patron: 'honor 400', variantes: ['honor 400'] },
  { patron: 'honor 400 pro', variantes: ['honor 400 pro'] },
  { patron: 'honor 600', variantes: ['honor 600'] },

  // ── VIVO ───────────────────────────────────────────
  { patron: 'vivo x200', variantes: ['vivo x200', 'x200'] },
  { patron: 'vivo x200 pro', variantes: ['vivo x200 pro', 'x200 pro'] },
  { patron: 'vivo x300', variantes: ['vivo x300', 'x300'] },
  { patron: 'vivo x300 pro', variantes: ['vivo x300 pro', 'x300 pro'] },
  { patron: 'iqoo 13', variantes: ['iqoo 13'] },
  { patron: 'iqoo 13 pro', variantes: ['iqoo 13 pro'] },

  // ── MOTOROLA ───────────────────────────────────────
  { patron: 'moto edge 50', variantes: ['moto edge 50', 'edge 50'] },
  { patron: 'moto edge 50 pro', variantes: ['moto edge 50 pro', 'edge 50 pro'] },
  { patron: 'moto edge 50 ultra', variantes: ['moto edge 50 ultra', 'edge 50 ultra'] },
  { patron: 'moto edge 70', variantes: ['moto edge 70', 'edge 70'] },
  { patron: 'moto edge 70 pro', variantes: ['moto edge 70 pro', 'edge 70 pro'] },
  { patron: 'moto razr 50', variantes: ['moto razr 50', 'razr 50'] },
  { patron: 'moto razr 50 ultra', variantes: ['moto razr 50 ultra', 'razr 50 ultra'] },
  { patron: 'moto g54', variantes: ['moto g54', 'g54'] },
  { patron: 'moto g55', variantes: ['moto g55', 'g55'] },
  { patron: 'moto g56', variantes: ['moto g56', 'g56'] },
  { patron: 'moto g64', variantes: ['moto g64', 'g64'] },
  { patron: 'moto g75', variantes: ['moto g75', 'g75'] },
  { patron: 'moto g76', variantes: ['moto g76', 'g76'] },
  { patron: 'moto g85', variantes: ['moto g85', 'g85'] },
  { patron: 'moto g86', variantes: ['moto g86', 'g86'] },
  { patron: 'moto g86 power', variantes: ['moto g86 power', 'g86 power'] },
  { patron: 'moto g96', variantes: ['moto g96', 'g96'] },
  { patron: 'moto g100', variantes: ['moto g100', 'g100'] },
  { patron: 'moto g200', variantes: ['moto g200', 'g200'] },

  // ── NOTHING ────────────────────────────────────────
  { patron: 'nothing phone 1', variantes: ['nothing phone 1', 'nothing 1'] },
  { patron: 'nothing phone 2', variantes: ['nothing phone 2', 'nothing 2'] },
  { patron: 'nothing phone 2a', variantes: ['nothing phone 2a', 'nothing 2a'] },
  { patron: 'nothing phone 3', variantes: ['nothing phone 3', 'nothing 3'] },
  { patron: 'nothing phone 3a', variantes: ['nothing phone 3a', 'nothing 3a'] },
  { patron: 'nothing phone 3a pro', variantes: ['nothing phone 3a pro', 'nothing 3a pro'] },
  { patron: 'nothing phone 4a', variantes: ['nothing phone 4a', 'nothing 4a'] },

  // ── CMF ────────────────────────────────────────────
  { patron: 'cmf phone 1', variantes: ['cmf phone 1', 'cmf 1'] },
  { patron: 'cmf phone 2', variantes: ['cmf phone 2', 'cmf 2'] },
  { patron: 'cmf phone 2 pro', variantes: ['cmf phone 2 pro', 'cmf 2 pro'] },

  // ── HUAWEI ─────────────────────────────────────────
  { patron: 'huawei p60', variantes: ['huawei p60', 'p60'] },
  { patron: 'huawei p60 pro', variantes: ['huawei p60 pro', 'p60 pro'] },
  { patron: 'huawei p70', variantes: ['huawei p70', 'p70'] },
  { patron: 'huawei p70 pro', variantes: ['huawei p70 pro', 'p70 pro'] },
  { patron: 'huawei mate 60', variantes: ['huawei mate 60', 'mate 60'] },
  { patron: 'huawei mate 60 pro', variantes: ['huawei mate 60 pro', 'mate 60 pro'] },
  { patron: 'huawei nova 13', variantes: ['huawei nova 13', 'nova 13'] },
  { patron: 'huawei nova 13 pro', variantes: ['huawei nova 13 pro', 'nova 13 pro'] },

  // ── SONY ───────────────────────────────────────────
  { patron: 'xperia 1 v', variantes: ['xperia 1 v', 'sony xperia 1 v'] },
  { patron: 'xperia 1 vi', variantes: ['xperia 1 vi', 'sony xperia 1 vi'] },
  { patron: 'xperia 5 v', variantes: ['xperia 5 v', 'sony xperia 5 v'] },
  { patron: 'xperia 5 vi', variantes: ['xperia 5 vi', 'sony xperia 5 vi'] },
  { patron: 'xperia 10 v', variantes: ['xperia 10 v', 'sony xperia 10 v'] },
  { patron: 'xperia 10 vi', variantes: ['xperia 10 vi', 'sony xperia 10 vi'] },

  // ── ASUS ───────────────────────────────────────────
  { patron: 'rog phone 8', variantes: ['rog phone 8', 'asus rog 8'] },
  { patron: 'rog phone 8 pro', variantes: ['rog phone 8 pro', 'asus rog 8 pro'] },
  { patron: 'rog phone 9', variantes: ['rog phone 9', 'asus rog 9'] },
  { patron: 'zenfone 11', variantes: ['zenfone 11', 'asus zenfone 11'] },
  { patron: 'zenfone 11 ultra', variantes: ['zenfone 11 ultra', 'asus zenfone 11 ultra'] },

  // ── TECNO ──────────────────────────────────────────
  { patron: 'tecno spark 30', variantes: ['tecno spark 30', 'spark 30'] },
  { patron: 'tecno camon 30', variantes: ['tecno camon 30', 'camon 30'] },
  { patron: 'tecno camon 30 pro', variantes: ['tecno camon 30 pro', 'camon 30 pro'] },
  { patron: 'tecno pova 6', variantes: ['tecno pova 6', 'pova 6'] },
  { patron: 'tecno pova 6 pro', variantes: ['tecno pova 6 pro', 'pova 6 pro'] },

  // ── INFINIX ────────────────────────────────────────
  { patron: 'infinix note 40', variantes: ['infinix note 40', 'note 40'] },
  { patron: 'infinix note 40 pro', variantes: ['infinix note 40 pro', 'note 40 pro'] },
  { patron: 'infinix zero 40', variantes: ['infinix zero 40', 'zero 40'] },
  { patron: 'infinix hot 50', variantes: ['infinix hot 50', 'hot 50'] },
];

// ═══════════════════════════════════════════
// PATRONES GENÉRICOS (fallback para modelos no listados)
// ═══════════════════════════════════════════

const PATRONES_GENERICOS = [
  /\b(iphone\s+\d+\s*(?:pro\s*max|pro\s*plus|pro|plus|mini|e)?)\b/gi,
  /\b(galaxy\s+[sz]\d+\s*(?:ultra|plus|\+|fe)?)\b/gi,
  /\b(pixel\s+\d+[a-z]?\s*(?:pro\s*(?:xl|fold)?|fold|xl)?)\b/gi,
  /\b(xiaomi\s+\d+\s*(?:ultra|t\s*pro|t)?)\b/gi,
  /\b(redmi\s+note\s+\d+\s*(?:pro\+?)?)\b/gi,
  /\b(poco\s+[xfm]\d+\s*(?:pro|ultra)?)\b/gi,
  /\b(oneplus\s+\d+\s*(?:pro|r)?)\b/gi,
  /\b(realme\s+gt\s*\d+\s*(?:pro)?)\b/gi,
  /\b(moto\s+(?:edge|razr|g)\s*\d+\s*(?:pro|ultra|power)?)\b/gi,
  /\b(nothing\s+phone\s+\d+[a-z]?\s*(?:pro)?)\b/gi,
];

// ═══════════════════════════════════════════
// EXTRACCIÓN DE MODELOS
// ═══════════════════════════════════════════

function extraerModelos(texto) {
  // FORZAR ACTUALIZACIÓN - v2
  console.log("🔧 NUEVA VERSIÓN DE extraerModelos - 2026-01-20");
  if (!texto) return [];
  const lower = texto.toLowerCase();
  const encontrados = new Set();

  for (const modelo of MODELOS_CONOCIDOS) {
    for (const variante of modelo.variantes) {
      // Usar \b para palabras completas (solo letras/números)
      // Escapar caracteres especiales
      const varianteEscapada = variante.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${varianteEscapada}\\b`, 'i');
      if (regex.test(lower)) {
        encontrados.add(modelo.patron);
        break;
      }
    }
  }

  // Fallback: patrones genéricos
  if (encontrados.size === 0) {
    for (const patron of PATRONES_GENERICOS) {
      const matches = [...lower.matchAll(patron)];
      for (const m of matches) {
        encontrados.add(m[1].trim().replace(/\s+/g, ' '));
      }
    }
  }

  // Eliminar modelos que son subconjunto de otro modelo más específico ya detectado
  const arr = Array.from(encontrados);
  const filtrado = arr.filter(m => !arr.some(otro => otro !== m && otro.includes(m)));
  return filtrado;
}

// ═══════════════════════════════════════════
// FORMATEAR MODELO
// ═══════════════════════════════════════════

function formatearModelo(raw) {
  if (!raw) return '';
  let formatted = raw.replace(/\b\w/g, c => c.toUpperCase());
  formatted = formatted
    .replace(/Iphone/g, 'iPhone')
    .replace(/Ipad/g, 'iPad')
    .replace(/Poco/g, 'POCO')
    .replace(/Oneplus/g, 'OnePlus')
    .replace(/Realme/g, 'realme')
    .replace(/Oppo/g, 'OPPO')
    .replace(/Vivo/g, 'vivo')
    .replace(/Iqoo/g, 'iQOO')
    .replace(/Rog/g, 'ROG')
    .replace(/Cmf/g, 'CMF');
  return formatted;
}

// ═══════════════════════════════════════════
// MODELO MÁS POPULAR
// ═══════════════════════════════════════════

function modeloMasPopular(respuestas) {
  const freq = {};
  for (const r of respuestas) {
    const modelos = extraerModelos(r.contenido);
    for (const m of modelos) {
      freq[m] = (freq[m] || 0) + 1;
    }
  }
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  if (!sorted.length) return null;
  return sorted[0][1] >= 1 ? formatearModelo(sorted[0][0]) : null;
}

// ═══════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════
function cap(nick) {
  if (!nick) return '';
  return nick.charAt(0).toUpperCase() + nick.slice(1);
}

function timeAgo(ts) {
  const diff = (Date.now() - new Date(ts)) / 1000;
  if (diff < 60) return 'ahora';
  if (diff < 3600) return `hace ${Math.floor(diff/60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff/3600)} h`;
  if (diff < 86400*7) return `hace ${Math.floor(diff/86400)} d`;
  return new Date(ts).toLocaleDateString('es-ES', { day:'numeric', month:'short' });
}

function generarCodigo() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c = '';
  for (let i = 0; i < 6; i++) c += chars[Math.floor(Math.random() * chars.length)];
  return c;
}

function toast(msg, dur = 2500) {
  const t = document.getElementById('sendToast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

const AVATAR_COLORS = [
  { bg: '#EFF6FF', color: '#1E40AF' }, { bg: '#ECFDF5', color: '#065F46' },
  { bg: '#FFFBEB', color: '#B45309' }, { bg: '#FEF2F2', color: '#991B1B' },
  { bg: '#F5F3FF', color: '#5B21B6' }, { bg: '#FDF2F8', color: '#9D174D' },
  { bg: '#FFF7ED', color: '#C2410C' }, { bg: '#F0FDF4', color: '#166534' },
];

function avatarColor(nick) {
  let h = 0;
  for (let i = 0; i < nick.length; i++) h = ((h << 5) - h) + nick.charCodeAt(i);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

const _fotoCache = {};
function invalidarFotoCache(nick) { delete _fotoCache[nick]; }

function renderAvatar(nick, fotoUrl, clsName, size) {
  const ac = avatarColor(nick);
  const initials = cap(nick).substring(0,2).toUpperCase();
  const sz = size ? 'width:'+size+'px;height:'+size+'px;' : '';
  if (fotoUrl) {
    const fallbackStyle = 'background:'+ac.bg+';color:'+ac.color+';'+sz+'display:flex;align-items:center;justify-content:center;font-weight:700;border-radius:50%;';
    const fallback = "this.style.cssText='"+fallbackStyle+"';this.src='';this.alt='"+initials+"';this.className='"+clsName+"';";
    return '<img src="'+fotoUrl+'" class="'+clsName+'" style="'+sz+'border-radius:50%;object-fit:cover;flex-shrink:0;" onerror="'+fallback+'">';
  }
  return '<div class="'+clsName+'" style="background:'+ac.bg+';color:'+ac.color+';'+sz+'display:flex;align-items:center;justify-content:center;font-weight:700;border-radius:50%;">'+initials+'</div>';
}

function getRango(puntos, rol) {
  if (rol === 'admin') return { label: 'Admin', icon: '👑', id: 'admin', min: 0, max: 0 };
  // Ordenar de mayor a menor para que el primero que cumpla sea el más alto
  const sorted = [...RANGOS].sort((a, b) => b.min - a.min);
  for (let i = 0; i < sorted.length; i++) {
    if (puntos >= sorted[i].min) return sorted[i];
  }
  return RANGOS[0];
}

function getBadgeHtml(puntos, rol) {
  const r = getRango(puntos, rol);
  if (rol === 'admin') return `<span class="author-rank rank-admin">👑 Admin</span>`;
  const cls = `rank-${r.id}`;
  return `<span class="author-rank ${cls}">${r.icon} ${r.label}</span>`;
}

function esAdmin() { return usuario?.rol === 'admin'; }

// ═══════════════════════════════════════════
// MENTIONS & CITAS
// ═══════════════════════════════════════════
function renderizarContenido(texto) {
  if (!texto) return '';
  const escaped = texto.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  // @menciones
  return escaped
    .replace(/@([a-zA-Z0-9_\-\.]+)/g, '<span class="mention">@$1</span>')
    .replace(/\n/g, '<br>');
}

function setCita(hiloId, replyId, autor, texto) {
  quoteActiva = { hiloId, replyId, autor, texto };
  const preview = document.getElementById(`qpreview_${hiloId}`);
  if (!preview) return;
  preview.classList.add('active');
  preview.querySelector('.quote-preview-text').textContent = `${cap(autor)}: "${texto.slice(0, 80)}${texto.length > 80 ? '…' : ''}"`;
  document.getElementById(`rinput_${hiloId}`).focus();
}

function clearCita(hiloId) {
  quoteActiva = null;
  const preview = document.getElementById(`qpreview_${hiloId}`);
  if (preview) preview.classList.remove('active');
}

// ═══════════════════════════════════════════
// NOTIFICACIONES
// ═══════════════════════════════════════════
async function cargarNotificaciones() {
  if (!usuario) return;

  const vistoKey = `notif_visto_${usuario.nickname}`;
  let visto = {};
  try { visto = JSON.parse(localStorage.getItem(vistoKey) || '{}'); } catch(e) {}

  const todas = [];

  // ── Consultas: respuestas a mis hilos ──
  const { data: misHilos } = await db.from('hilos')
    .select('id, datos_extra, created_at')
    .eq('nickname', usuario.nickname);

  if (misHilos && misHilos.length > 0) {
    const hilosIds = misHilos.map(h => h.id);

    const { data: respuestas } = await db.from('respuestas')
      .select('*, hilo_id')
      .in('hilo_id', hilosIds)
      .neq('nickname', usuario.nickname)
      .order('created_at', { ascending: false })
      .limit(20);

    if (respuestas) {
      for (const r of respuestas) {
        todas.push({
          id: `resp_${r.id}`,
          texto: `<span class="notif-bold">${cap(r.nickname)}</span> respondió en tu consulta`,
          tiempo: timeAgo(r.created_at),
          hiloId: r.hilo_id,
          esForo: false,
          leido: !!visto[`resp_${r.id}`],
        });
      }
    }

    // Menciones en consultas
    const { data: menciones } = await db.from('respuestas')
      .select('*, hilo_id')
      .ilike('contenido', `%@${usuario.nickname}%`)
      .neq('nickname', usuario.nickname)
      .order('created_at', { ascending: false })
      .limit(10);

    if (menciones) {
      for (const m of menciones) {
        if (!todas.find(t => t.id === `resp_${m.id}`)) {
          todas.push({
            id: `men_${m.id}`,
            texto: `<span class="notif-bold">${cap(m.nickname)}</span> te mencionó en consultas`,
            tiempo: timeAgo(m.created_at),
            hiloId: m.hilo_id,
            esForo: false,
            leido: !!visto[`men_${m.id}`],
          });
        }
      }
    }
  }

  // ── Foro: respuestas y menciones ──
  try {
    const { data: misPostsForo } = await db.from('foro_posts')
      .select('id')
      .eq('nickname', usuario.nickname);

    if (misPostsForo && misPostsForo.length > 0) {
      const misPostsIds = misPostsForo.map(p => p.id);
      const { data: respsForo } = await db.from('foro_replies')
        .select('*, post_id')
        .in('post_id', misPostsIds)
        .neq('nickname', usuario.nickname)
        .order('created_at', { ascending: false })
        .limit(10);

      if (respsForo) {
        for (const r of respsForo) {
          todas.push({
            id: `foro_resp_${r.id}`,
            texto: `<span class="notif-bold">${cap(r.nickname)}</span> respondió en tu post del foro`,
            tiempo: timeAgo(r.created_at),
            hiloId: r.post_id,
            esForo: true,
            leido: !!visto[`foro_resp_${r.id}`],
          });
        }
      }
    }

    // Menciones en el foro
    const { data: mencionesF } = await db.from('foro_replies')
      .select('*, post_id')
      .ilike('contenido', `%@${usuario.nickname}%`)
      .neq('nickname', usuario.nickname)
      .order('created_at', { ascending: false })
      .limit(10);

    if (mencionesF) {
      for (const m of mencionesF) {
        if (!todas.find(t => t.id === `foro_resp_${m.id}`)) {
          todas.push({
            id: `foro_men_${m.id}`,
            texto: `<span class="notif-bold">${cap(m.nickname)}</span> te mencionó en el foro`,
            tiempo: timeAgo(m.created_at),
            hiloId: m.post_id,
            esForo: true,
            leido: !!visto[`foro_men_${m.id}`],
          });
        }
      }
    }
  } catch(e) { /* foro_replies puede no existir aún */ }

  todas.sort((a, b) => (a.leido === b.leido ? 0 : a.leido ? 1 : -1));

  const noLeidas = todas.filter(n => !n.leido).length;
  notifCount = noLeidas;
  
  const badge = document.getElementById('notifBadge');
  if (noLeidas > 0) {
    badge.textContent = noLeidas > 9 ? '9+' : noLeidas;
    badge.classList.add('visible');
  } else {
    badge.classList.remove('visible');
  }

  const list = document.getElementById('notifList');
  if (todas.length === 0) {
    list.innerHTML = '<div class="notif-empty">Sin notificaciones</div>';
    return;
  }

  list.innerHTML = todas.slice(0, 10).map(n => `
    <div class="notif-item ${n.leido ? '' : 'unread'}" data-notif-id="${n.id}" data-hilo-id="${n.hiloId}" data-es-foro="${n.esForo ? '1' : '0'}" onclick="irAHilo('${n.hiloId}', '${n.id}', ${n.esForo ? 'true' : 'false'})">
      ${n.texto} · <span style="color:var(--text-3)">${n.tiempo}</span>
    </div>
  `).join('');
}

function irAHilo(hiloId, notifId, esForo) {
  // Guardar como leída
  const vistoKey = `notif_visto_${usuario.nickname}`;
  let visto = {};
  try { visto = JSON.parse(localStorage.getItem(vistoKey) || '{}'); } catch(e) {}
  visto[notifId] = true;
  try { localStorage.setItem(vistoKey, JSON.stringify(visto)); } catch(e) {}
  toggleNotifPanel();

  if (esForo) {
    // Navegar al foro y abrir el post correspondiente
    const forumTabBtn = document.getElementById('forumTabBtn');
    if (forumTabBtn) setTab('foro', forumTabBtn);
    syncBnav('foro');
    setTimeout(() => abrirPost(hiloId), 250);
  } else {
    // Navegar a consultas si no estamos ya ahí
    const tabActualEl = document.querySelector('.tab.active');
    const estaEnConsultas = tabActual && tabActual !== 'foro' && tabActual !== 'noticias';
    if (!estaEnConsultas) {
      const tabAbiertas = document.querySelector('.tab[onclick*="abiertas"]');
      if (tabAbiertas) setTab('abiertas', tabAbiertas);
      syncBnav('abiertas');
    }
    setTimeout(() => {
      const el = document.getElementById(`thread_${hiloId}`);
      if (el) {
        const rep = document.getElementById(`replies_${hiloId}`);
        const box = document.getElementById(`replybox_${hiloId}`);
        if (rep && rep.style.display === 'none') {
          rep.style.display = 'block';
          if (box) box.style.display = 'block';
          if (rep.innerHTML === '') cargarRespuestas(hiloId);
        }
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      }
    }, estaEnConsultas ? 0 : 400);
  }
  cargarNotificaciones();
}

function marcarTodasLeidas() {
  if (!usuario) return;
  const vistoKey = `notif_visto_${usuario.nickname}`;
  let visto = {};
  try { visto = JSON.parse(localStorage.getItem(vistoKey) || '{}'); } catch(e) {}
  document.querySelectorAll('.notif-item').forEach(el => {
    const notifId = el.dataset.notifId;
    if (notifId) visto[notifId] = true;
  });
  try { localStorage.setItem(vistoKey, JSON.stringify(visto)); } catch(e) {}
  cargarNotificaciones();
  toggleNotifPanel();
}

function toggleNotifPanel() {
  const p = document.getElementById('notifPanel');
  p.classList.toggle('open');
  if (p.classList.contains('open')) {
    setTimeout(() => document.addEventListener('click', cerrarNotifPanelFuera, { once: true }), 10);
  }
}

function cerrarNotifPanelFuera(e) {
  const p = document.getElementById('notifPanel');
  const btn = document.getElementById('notifBtn');
  if (!p.contains(e.target) && !btn.contains(e.target)) p.classList.remove('open');
}

// ═══════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════
async function cargarStats() {
  // Stats removed from UI — function kept for compatibility
}

// ═══════════════════════════════════════════
// RANGOS PANEL
// ═══════════════════════════════════════════
function renderRangos() {
  const pts = usuario?.puntos || 0;
  const rol = usuario?.rol || 'usuario';
  const grid = document.getElementById('ranksGrid');
  
  grid.innerHTML = RANGOS.map(r => {
    const unlocked = pts >= r.min;
    const current = pts >= r.min && pts <= r.max;
    let cls = '';
    if (current && rol !== 'admin') cls = 'current';
    else if (unlocked) cls = 'unlocked';
    
    return `
      <div class="rank-card ${cls}">
        <div class="rank-card-icon">${r.icon}</div>
        <div class="rank-card-name">${r.label}</div>
        <div class="rank-card-pts">${r.min === 0 ? '0 pts' : `${r.min}+ pts`}</div>
        <div class="rank-card-perk ${r.locked && !unlocked ? 'locked' : ''}">${r.perk}</div>
      </div>
    `;
  }).join('');
}

function togglePerks() {
  const p = document.getElementById('perksPanel');
  p.classList.toggle('open');
  renderRangos();
}

function actualizarBarraRango() {
  if (!usuario) return;
  const pts = usuario.puntos || 0;
  const wrap = document.getElementById('rankProgressWrap');
  wrap.style.display = 'block';

  const rango = getRango(pts, usuario.rol);
  if (usuario.rol === 'admin' || rango.id === 'leyenda' || rango.id === 'colaborador_top') {
    document.getElementById('rankBarFill').style.width = '100%';
    document.getElementById('rankNextLabel').innerHTML = '¡Máximo rango!';
    document.getElementById('rankPtsLabel').textContent = `${pts} pts · ${rango.icon} ${rango.label}`;
    return;
  }

  const next = RANGOS.find(r => r.min > pts);
  if (!next) return;

  const pct = Math.min(100, ((pts - rango.min) / (next.min - rango.min)) * 100);
  const ptsFaltan = next.min - pts;
  document.getElementById('rankBarFill').style.width = `${pct}%`;
  document.getElementById('rankNextLabel').innerHTML = `<span class="rank-next-icon">${next.icon}</span> ${next.label} · faltan ${ptsFaltan} pts`;
  document.getElementById('rankPtsLabel').textContent = `Tienes ${pts} pts · Rango actual: ${rango.icon} ${rango.label} (${Math.round(pct)}%)`;
}

// ═══════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════

function generarToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let t = '';
  for (let i = 0; i < 48; i++) t += chars[Math.floor(Math.random() * chars.length)];
  return t;
}

// Guarda el token en todos los sitios posibles
function guardarToken(token) {
  try { localStorage.setItem('moviles_token', token); } catch(e) {}
  try { sessionStorage.setItem('moviles_token', token); } catch(e) {}
  try {
    const exp = new Date(Date.now() + 365 * 864e5).toUTCString();
    document.cookie = `moviles_token=${token};expires=${exp};path=/;SameSite=Lax`;
  } catch(e) {}
}

// Lee el token de donde sea que esté guardado
function leerToken() {
  try { const v = localStorage.getItem('moviles_token'); if (v) return v; } catch(e) {}
  try { const v = sessionStorage.getItem('moviles_token'); if (v) return v; } catch(e) {}
  try {
    const m = document.cookie.match('(^|;)\\s*moviles_token\\s*=\\s*([^;]+)');
    if (m) return m[2];
  } catch(e) {}
  return null;
}

function borrarToken() {
  try { localStorage.removeItem('moviles_token'); } catch(e) {}
  try { sessionStorage.removeItem('moviles_token'); } catch(e) {}
  try { document.cookie = 'moviles_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/'; } catch(e) {}
}

async function procesarAcceso() {
  const nickOrig = document.getElementById('nicknameInput').value.trim();
  const codigo = document.getElementById('codigoInput').value.trim();
  const errDiv = document.getElementById('authError');
  errDiv.textContent = '';

  if (!nickOrig || nickOrig.length < 3) { errDiv.textContent = '❌ Mínimo 3 caracteres'; return; }
  if (!/^[a-zA-Z0-9_\-\.]+$/.test(nickOrig)) { errDiv.textContent = '❌ Solo letras, números, _ y -'; return; }
  if (FORBIDDEN_NAMES.includes(nickOrig.toLowerCase())) { errDiv.textContent = '❌ Ese nombre no está permitido'; return; }

  const nickLower = nickOrig.toLowerCase();
  const { data: existe } = await db.from('usuarios').select('*').eq('nickname', nickLower).single();

  if (existe) {
    // Usuario existente sin palabra clave — pedírsela ahora (opción B)
    if (!existe.palabra_clave) {
      const palabraInput = document.getElementById('palabraClaveInput');
      palabraInput.style.display = 'block';
      palabraInput.placeholder = 'Elige una palabra clave para recuperar tu cuenta';
      if (!codigo) { errDiv.textContent = '🔐 Este usuario ya existe. Introduce tu código secreto.'; return; }
      if (existe.codigo_acceso !== codigo) { errDiv.textContent = '❌ Código incorrecto'; return; }
      const palabraClave = palabraInput.value.trim().toLowerCase();
      if (!palabraClave || palabraClave.length < 2) { errDiv.textContent = '🔑 Escribe también una palabra clave (ej: Roma)'; return; }
      await db.from('usuarios').update({ palabra_clave: palabraClave }).eq('nickname', nickLower);
      existe.palabra_clave = palabraClave;
      usuario = existe;
      await crearSesion(nickLower);
      cerrarModalAuth();
      onLogin();
      toast('✅ Palabra clave guardada. Ya puedes recuperar tu cuenta con ella.');
      return;
    }
    if (!codigo) { errDiv.textContent = '🔐 Este usuario ya existe. Introduce tu código secreto.'; return; }
    if (existe.codigo_acceso !== codigo) { errDiv.textContent = '❌ Código incorrecto'; return; }
    usuario = existe;
    await crearSesion(nickLower);
    cerrarModalAuth();
    onLogin();
  } else {
    // Nuevo usuario — mostrar campo palabra clave si no está visible
    const palabraInput = document.getElementById('palabraClaveInput');
    palabraInput.style.display = 'block';
    palabraInput.placeholder = 'Elige una palabra clave para recuperar tu cuenta (ej: Roma)';
    const palabraClave = palabraInput.value.trim().toLowerCase();
    if (!palabraClave || palabraClave.length < 2) {
      errDiv.textContent = '🔑 Elige una palabra clave para poder recuperar tu cuenta';
      palabraInput.focus();
      return;
    }
    const nuevoCodigo = generarCodigo();
    const { data: nuevo, error } = await db.from('usuarios').insert({
      nickname: nickLower, puntos: 0, codigo_acceso: nuevoCodigo, rol: 'usuario', palabra_clave: palabraClave
    }).select().single();
    if (error) { errDiv.textContent = '⚠️ Error: ' + error.message; return; }
    usuario = nuevo;
    await crearSesion(nickLower);
    cerrarModalAuth();
    onLogin();
    mostrarCodeModal(nuevoCodigo);
  }
}

function abrirRecuperacion() {
  document.getElementById('authModal').classList.add('hidden');
  document.getElementById('recoveryModal').classList.remove('hidden');
  document.getElementById('recoveryError').textContent = '';
  document.getElementById('recoveryResult').style.display = 'none';
  document.getElementById('recoveryBtn').style.display = 'block';
  document.getElementById('recoveryNick').value = '';
  document.getElementById('recoveryPalabra').value = '';
}

function cerrarRecuperacion() {
  document.getElementById('recoveryModal').classList.add('hidden');
  document.getElementById('authModal').classList.remove('hidden');
}

async function procesarRecuperacion() {
  const nick = document.getElementById('recoveryNick').value.trim().toLowerCase();
  const palabra = document.getElementById('recoveryPalabra').value.trim().toLowerCase();
  const errDiv = document.getElementById('recoveryError');
  errDiv.textContent = '';

  if (!nick || !palabra) { errDiv.textContent = '❌ Rellena los dos campos'; return; }

  const { data: u } = await db.from('usuarios').select('codigo_acceso, palabra_clave').eq('nickname', nick).single();

  if (!u) { errDiv.textContent = '❌ Usuario no encontrado'; return; }
  if (!u.palabra_clave) { errDiv.textContent = '⚠️ Este usuario no tiene palabra clave. Contacta al admin.'; return; }
  if (u.palabra_clave !== palabra) { errDiv.textContent = '❌ Palabra clave incorrecta'; return; }

  document.getElementById('recoveryCodeVal').textContent = u.codigo_acceso;
  document.getElementById('recoveryResult').style.display = 'block';
  document.getElementById('recoveryBtn').style.display = 'none';
  errDiv.textContent = '';
}

async function crearSesion(nickname) {
  const token = generarToken();
  await db.from('sesiones').insert({ token, nickname });
  guardarToken(token);
}

async function verificarSesion() {
  const token = leerToken();
  if (token) {
    try {
      const { data: sesion } = await db.from('sesiones')
        .select('nickname, expires_at')
        .eq('token', token)
        .single();
      if (sesion && new Date(sesion.expires_at) > new Date()) {
        const { data: user } = await db.from('usuarios')
          .select('*')
          .eq('nickname', sesion.nickname)
          .single();
        if (user) {
          usuario = user;
          onLogin();
          return;
        }
      }
    } catch(e) {}
    borrarToken();
  }
  mostrarModalAuth();
}

function cerrarModalAuth() {
  document.getElementById('authModal').classList.add('hidden');
  document.getElementById('nicknameInput').value = '';
  document.getElementById('codigoInput').value = '';
  document.getElementById('authError').textContent = '';
}

function mostrarModalAuth() {
  document.getElementById('authModal').classList.remove('hidden');
}

function mostrarCodeModal(codigo) {
  document.getElementById('generatedCodeValue').textContent = codigo;
  document.getElementById('codeModal').classList.remove('hidden');
}

function cerrarCodeModal() {
  document.getElementById('codeModal').classList.add('hidden');
}

function onLogin() {
  mostrarUsuario();
  cargarHilos();
  cargarStats();
  cargarNotificaciones();
  actualizarBarraRango();
  if (usuario) mostrarAdminPanel();
  renderRangos();
  cargarBannerGlobal();
  cargarActualizacionesUsuario();
  
  // Cargar TOP de móviles al iniciar sesión
  cargarTopMoviles();
  
  // Cargar TOP de usuarios
  cargarTopUsuarios();
  
  // Mostrar botones de admin si corresponde
  if (usuario && usuario.nickname === 'dastan') {
    const newNoticiaBtn = document.getElementById('newNoticiaBtn');
    const fabNewsBtn = document.getElementById('fabNewsBtn');
    const fabNoticiaMovil = document.getElementById('fabNoticiaMovil');
    if (newNoticiaBtn) newNoticiaBtn.style.display = 'flex';
    if (fabNewsBtn) fabNewsBtn.style.display = 'flex';
    if (fabNoticiaMovil) fabNoticiaMovil.style.display = 'flex';
    // Mostrar tab Cerradas solo para admin
    document.querySelectorAll('.admin-only-tab, .bnav-admin-only').forEach(el => el.style.display = '');
  }
}

function mostrarUsuario() {
  const loginBtn = document.getElementById('topbarLoginBtn');
  const chip = document.getElementById('userChip');
  const notifBtn = document.getElementById('notifBtn');
  const drawerLogout = document.getElementById('drawerLogoutBtn');
  const drawerPerfil = document.getElementById('drawerPerfilBtn');

  if (!usuario) {
    if (loginBtn) loginBtn.style.display = '';
    if (chip) chip.style.display = 'none';
    if (notifBtn) notifBtn.style.display = 'none';
    if (drawerLogout) drawerLogout.style.display = 'none';
    if (drawerPerfil) drawerPerfil.style.display = 'none';
    return;
  }

  // Logueado: ocultar login btn, mostrar chip y notif
  if (loginBtn) loginBtn.style.display = 'none';
  if (chip) chip.style.display = '';
  if (notifBtn) notifBtn.style.display = '';
  if (drawerLogout) drawerLogout.style.display = '';
  if (drawerPerfil) drawerPerfil.style.display = '';
  if (usuario.nickname === 'dastan') {
    const drawerAdmin = document.getElementById('drawerAdminItems');
    if (drawerAdmin) drawerAdmin.style.display = '';
  }

  const nombre = cap(usuario.nickname);
  const rango = getRango(usuario.puntos || 0, usuario.rol);
  const ac = avatarColor(usuario.nickname);

  const avatarEl = document.getElementById('chipAvatar');
  if (avatarEl) {
    if (usuario?.foto_url) {
      actualizarChipAvatar();
    } else {
      avatarEl.style.background = ac.bg;
      avatarEl.style.color = ac.color;
      avatarEl.textContent = nombre.substring(0, 2).toUpperCase();
    }
  }

  const nameEl = document.getElementById('chipName');
  if (nameEl) nameEl.textContent = nombre + (esAdmin() ? ' 👑' : '');

  const ptsEl = document.getElementById('chipPts');
  if (ptsEl) ptsEl.textContent = `${rango.icon} ${usuario.puntos || 0}pts`;

  // Dropdown
  const dropNick = document.getElementById('dropdownNick');
  const dropPts = document.getElementById('dropdownPts');
  if (dropNick) dropNick.textContent = nombre + (esAdmin() ? ' 👑' : '');
  if (dropPts) dropPts.textContent = `${rango.icon} ${rango.label} · ${usuario.puntos || 0} pts`;
}

function toggleUserMenu() {
  if (!usuario) {
    mostrarModalAuth();
    return;
  }
  const dropdown = document.getElementById('userDropdown');
  if (!dropdown) return;
  dropdown.classList.toggle('open');
  // Close on outside click
  if (dropdown.classList.contains('open')) {
    setTimeout(() => {
      document.addEventListener('click', function closeDD(e) {
        if (!dropdown.contains(e.target) && e.target.id !== 'userChip') {
          dropdown.classList.remove('open');
        }
        document.removeEventListener('click', closeDD);
      });
    }, 0);
  }
}

function cerrarSesion() {
  // Eliminar token y limpiar sesión
  try { localStorage.removeItem('moviles_token'); } catch(e) {}
  usuario = null;
  document.getElementById('userDropdown')?.classList.remove('open');
  mostrarUsuario();
  // Mostrar modal auth de nuevo
  mostrarModalAuth();
  toast('👋 Sesión cerrada');
}
// ═══════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════
function setTab(tab, el, pushHistory = true) {
  tabActual = tab;
  currentPage = 1;
  noticiasPagina = 1;
  document.querySelectorAll('.tab, .forum-tab-btn').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  syncBnav(tab);
  actualizarBnavNueva();
  if (pushHistory && tab !== 'foro') spaReplace({});

  const hilosEl = document.getElementById('hilosList');
  const pagEl = document.getElementById('pagination');
  const noticiasEl = document.getElementById('noticiasList');
  const formEl = document.getElementById('newForm');
  const forumEl = document.getElementById('forumSection');
  const topMovilesEl = document.getElementById('topMovilesSection');
  const topUsuariosEl = document.getElementById('topUsuariosSection');

  // Reset forum state
  if (tab !== 'foro') {
    if (forumEl) forumEl.classList.remove('open');
  }

  if (tab === 'noticias') {
    hilosEl.style.display = 'none';
    pagEl.style.display = 'none';
    noticiasEl.style.display = 'grid';
    if (formEl) formEl.style.display = 'none';
    if (forumEl) forumEl.classList.remove('open');
    if (topMovilesEl) topMovilesEl.style.display = '';
    if (topUsuariosEl) topUsuariosEl.style.display = '';
    cargarNoticias();
  } else if (tab === 'foro') {
    hilosEl.style.display = 'none';
    pagEl.style.display = 'none';
    noticiasEl.style.display = 'none';
    if (formEl) formEl.style.display = 'none';
    if (forumEl) forumEl.classList.add('open');
    if (topMovilesEl) topMovilesEl.style.display = 'none';
    if (topUsuariosEl) topUsuariosEl.style.display = 'none';
    // Ocultar botón foro shortcut cuando estamos en el foro
    const shortcut = document.getElementById('forumShortcutBtn');
    if (shortcut) shortcut.style.display = 'none';
    cargarContadoresForo();
    mostrarForumCats(true);
  } else {
    hilosEl.style.display = 'block';
    pagEl.style.display = 'block';
    noticiasEl.style.display = 'none';
    if (forumEl) forumEl.classList.remove('open');
    if (topMovilesEl) topMovilesEl.style.display = '';
    if (topUsuariosEl) topUsuariosEl.style.display = '';
    // Restaurar botón acceso al foro
    const shortcut = document.getElementById('forumShortcutBtn');
    if (shortcut) shortcut.style.display = '';
    cargarHilos();
  }
}

// ═══════════════════════════════════════════
// HISTORIAL + URLs COMPARTIBLES
// ═══════════════════════════════════════════

function spaUrl(params) {
  if (!params || Object.keys(params).length === 0) return location.pathname;
  return location.pathname + '?' + new URLSearchParams(params).toString();
}

function spaPush(params) {
  history.pushState(params, '', spaUrl(params));
}

function spaReplace(params) {
  history.replaceState(params, '', spaUrl(params));
}

// Estado base al cargar
spaReplace({});

window.addEventListener('popstate', async (e) => {
  const state = e.state || {};

  if (state['foro-post']) {
    const forumTabBtn = document.getElementById('forumTabBtn');
    if (tabActual !== 'foro') setTab('foro', forumTabBtn, false);
    if (state['foro-cat']) await abrirCategoria(state['foro-cat'], false);
    await abrirPost(state['foro-post'], false);
    return;
  }

  if (state['foro-cat']) {
    const forumTabBtn = document.getElementById('forumTabBtn');
    if (tabActual !== 'foro') setTab('foro', forumTabBtn, false);
    await abrirCategoria(state['foro-cat'], false);
    return;
  }

  if (state.tab === 'foro') {
    const forumTabBtn = document.getElementById('forumTabBtn');
    setTab('foro', forumTabBtn, false);
    mostrarForumCats(false);
    return;
  }

  if (state.hilo) {
    // Consulta: hacer scroll al hilo
    const el = document.getElementById(`thread_${state.hilo}`);
    if (el) {
      const rep = document.getElementById(`replies_${state.hilo}`);
      const box = document.getElementById(`replybox_${state.hilo}`);
      if (rep && rep.style.display === 'none') {
        rep.style.display = 'block';
        if (box) box.style.display = 'block';
        if (rep.innerHTML === '') cargarRespuestas(state.hilo);
      }
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
    return;
  }

  // Inicio: no salir de la página
  spaReplace({});
});

// Función para leer los params de la URL al cargar y navegar al contenido correcto
async function navegarDesdeUrl() {
  const p = new URLSearchParams(location.search);
  const foroPost = p.get('post');
  const foroCat  = p.get('cat');
  const hiloId   = p.get('hilo');
  const tab      = p.get('tab');

  if (foroPost) {
    const forumTabBtn = document.getElementById('forumTabBtn');
    setTab('foro', forumTabBtn, false);
    if (foroCat) await abrirCategoria(foroCat, false);
    await abrirPost(foroPost, false);
    spaReplace({ 'foro-post': foroPost, 'foro-cat': foroCat || '' });
    return;
  }

  if (foroCat) {
    const forumTabBtn = document.getElementById('forumTabBtn');
    setTab('foro', forumTabBtn, false);
    await abrirCategoria(foroCat, false);
    spaReplace({ 'foro-cat': foroCat });
    return;
  }

  if (tab === 'foro') {
    const forumTabBtn = document.getElementById('forumTabBtn');
    setTab('foro', forumTabBtn, false);
    spaReplace({ tab: 'foro' });
    return;
  }

  if (hiloId) {
    // Esperar a que los hilos carguen y hacer scroll
    spaReplace({ hilo: hiloId });
    const intentar = (intentos = 0) => {
      const el = document.getElementById(`thread_${hiloId}`);
      if (el) {
        const rep = document.getElementById(`replies_${hiloId}`);
        const box = document.getElementById(`replybox_${hiloId}`);
        if (rep && rep.style.display === 'none') {
          rep.style.display = 'block';
          if (box) box.style.display = 'block';
          if (rep.innerHTML === '') cargarRespuestas(hiloId);
        }
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      } else if (intentos < 15) {
        setTimeout(() => intentar(intentos + 1), 300);
      }
    };
    setTimeout(intentar, 600);
    return;
  }
}


async function cargarHilos() {
  if (!usuario) return;
  document.getElementById('hilosList').innerHTML = '<div class="loading">⏳ Cargando...</div>';

  let query = db.from('hilos').select('*, respuestas(count)');
  if (tabActual === 'abiertas') query = query.eq('resuelto', false);
  else if (tabActual === 'sin_responder') query = query.eq('resuelto', false);
  else if (tabActual === 'mis_abiertas') query = query.eq('nickname', usuario.nickname).eq('resuelto', false);
  else if (tabActual === 'mis_cerradas') query = query.eq('nickname', usuario.nickname).eq('resuelto', true);

  query = query.order('created_at', { ascending: false });
  const { data: hilos } = await query;
  hilosData = hilos || [];

  // Filtrar sin responder: solo hilos con 0 respuestas
  if (tabActual === 'sin_responder') {
    hilosData = hilosData.filter(h => (h.respuestas?.[0]?.count || 0) === 0);
  }

  if (hilosData.length === 0) {
    const msgs = { abiertas: 'Sé el primero en preguntar 👆', sin_responder: '✅ ¡No hay consultas sin responder!', mis_abiertas: 'No tienes consultas abiertas', mis_cerradas: 'No tienes consultas cerradas' };
    document.getElementById('hilosList').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        ${msgs[tabActual] || 'Sin resultados'}
      </div>`;
    document.getElementById('pagination').innerHTML = '';
    return;
  }

  renderPaginacion();
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pag = hilosData.slice(start, start + ITEMS_PER_PAGE);

  let html = '';
  for (const h of pag) html += await renderHilo(h);
  document.getElementById('hilosList').innerHTML = html;
  for (const h of pag) cargarRespuestas(h.id);
}

function renderPaginacion() {
  const total = Math.ceil(hilosData.length / ITEMS_PER_PAGE);
  if (total <= 1) { document.getElementById('pagination').innerHTML = ''; return; }
  let html = '';
  for (let i = 1; i <= total; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }
  document.getElementById('pagination').innerHTML = html;
}

function goToPage(p) { currentPage = p; cargarHilos(); }

async function renderHilo(h) {
  const { data: uData } = await db.from('usuarios').select('puntos, rol, foto_url').eq('nickname', h.nickname).single();
  const pts = uData?.puntos || 0;
  const rol = uData?.rol || 'usuario';
  const fotoHilo = uData?.foto_url || null;
  const replyCount = h.respuestas?.[0]?.count || 0;
  const ac = avatarColor(h.nickname);
  const nombre = cap(h.nickname);
  const puedeCerrar = usuario && (usuario.nickname === h.nickname || esAdmin());

  // ── Unread replies logic ──
  const seenKey = `seen_replies_${h.id}_${usuario?.nickname || 'anon'}`;
  let seenCount = 0;
  try { seenCount = parseInt(localStorage.getItem(seenKey) || '0', 10); } catch(e) {}
  const unreadCount = Math.max(0, replyCount - seenCount);

  // ── Participation check ──
  let haParticipado = false;
  if (usuario && h.nickname !== usuario.nickname) {
    try {
      const { count } = await db.from('respuestas')
        .select('id', { count: 'exact', head: true })
        .eq('hilo_id', h.id)
        .eq('nickname', usuario.nickname);
      haParticipado = (count || 0) > 0;
    } catch(e) {}
  }

  const specs = [
    { label: 'Presupuesto', val: h.presupuesto, icon: '💰' },
    { label: 'Móvil actual', val: h.movil_actual, icon: '📱' },
    { label: 'Marca pref.', val: h.marca_preferida, icon: '⭐' },
    { label: 'Marca NO', val: h.marca_no_quiere, icon: '🚫' },
    { label: 'Garantía ES', val: h.garantia_espana, icon: '🛡️' },
    { label: 'Uso', val: h.uso_principal, icon: '🎯' },
    { label: 'Pantalla', val: h.tamano_pantalla, icon: '📏' },
    { label: 'Juegos', val: h.juegos, icon: '🎮' },
    { label: 'Cámara', val: h.camara, icon: '📸' },
    { label: 'Batería', val: h.bateria, icon: '🔋' },
    { label: 'Carga rápida', val: h.carga_rapida, icon: '⚡' },
  ].filter(s => s.val && !['Sin preferencia','No','No mucho','Normal','No necesaria',''].includes(s.val));

  // Extract budget for header badge
  const budgetSpec = specs.find(s => s.label === 'Presupuesto');
  const otherSpecs = specs.filter(s => s.label !== 'Presupuesto');

  return `
    <div class="thread-card" id="thread_${h.id}">
      <!-- CARD HEADER: author strip -->
      <div class="thread-author-strip">
        ${renderAvatar(h.nickname, fotoHilo, 'avatar', 36)}
        <div class="thread-author-info">
          <div class="thread-author-name">
            <span class="nick-link" onclick="abrirPerfil('${h.nickname}')">${nombre}</span>
            ${getBadgeHtml(pts, rol)}
          </div>
          <div class="thread-author-meta">${timeAgo(h.created_at)}${haParticipado ? '<span class="participated-icon">✏️ Participé</span>' : ''}</div>
        </div>
        ${budgetSpec ? `<div class="thread-budget-pill">${budgetSpec.icon} ${budgetSpec.val}</div>` : ''}
      </div>

      <!-- SPECS TABLE -->
      ${otherSpecs.length ? `
        <div class="thread-specs-table">
          ${otherSpecs.map(s => `
            <div class="tst-row">
              <span class="tst-label">${s.icon} ${s.label}</span>
              <span class="tst-val">${s.val}</span>
            </div>`).join('')}
        </div>` : ''}

      <!-- EXTRA NOTE -->
      ${h.datos_extra ? `
        <div class="thread-extra-note">
          <div class="ten-lead">📋 Datos adicionales</div>
          <div class="ten-text">${h.datos_extra}</div>
        </div>` : ''}

      <!-- TOP RECOMMENDATION -->
      <div id="topRec_${h.id}"></div>

      <!-- FOOTER BAR -->
      <div class="thread-bar">
        <button class="reply-count-btn" onclick="toggleReplies('${h.id}')">
          💬 <span class="cnt" id="rcnt_${h.id}">${replyCount}</span> respuestas${replyCount === 0 ? '<span class="badge-sin-responder">⚡ Sin responder</span>' : ''}${unreadCount > 0 ? `<span class="unread-badge" id="unread_${h.id}">${unreadCount} nuevo${unreadCount > 1 ? 's' : ''}</span>` : `<span class="unread-badge" id="unread_${h.id}" style="display:none"></span>`}
        </button>
        ${h.resuelto
          ? '<div class="resolved-pill">✅ Resuelta</div>'
          : (puedeCerrar ? `<button class="resolve-btn" onclick="marcarResuelta('${h.id}')">🔒 Marcar resuelta</button>` : '')}
      </div>

      <div class="replies-section" id="replies_${h.id}" style="display:none;"></div>

      ${!h.resuelto ? `
        <div class="reply-box" id="replybox_${h.id}" style="display:none;">
          <div class="quote-preview" id="qpreview_${h.id}">
            <span class="quote-preview-text"></span>
            <button class="quote-clear" onclick="clearCita('${h.id}')">✕</button>
          </div>
          <div class="reply-input-row">
            <textarea class="reply-input" id="rinput_${h.id}" placeholder="Escribe tu respuesta..."
              rows="2"
              onkeydown="if(event.key==='Enter'&&!event.shiftKey&&!/Android|iPhone|iPad/i.test(navigator.userAgent)){event.preventDefault();enviarRespuesta('${h.id}')}"
              oninput="autoResize(this)"
            ></textarea>
            <div class="reply-actions-row">
              <button class="send-btn" id="sendbtn_${h.id}" onclick="enviarRespuesta('${h.id}')">➤ Enviar respuesta</button>
              <button class="recommend-icon-btn" onclick="abrirModalRanking('${h.id}')" title="Recomendar un móvil">📱</button>
            </div>
          </div>
        </div>` : ''}
    </div>
  `;
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function toggleReplies(hiloId) {
  const rep = document.getElementById(`replies_${hiloId}`);
  const box = document.getElementById(`replybox_${hiloId}`);
  const isOpen = rep.style.display !== 'none';

  if (isOpen) {
    rep.style.display = 'none';
    if (box) box.style.display = 'none';
    spaReplace({});
  } else {
    rep.style.display = 'block';
    if (box) box.style.display = 'block';
    cargarRespuestas(hiloId);
    marcarRespuestasVistas(hiloId);
    spaPush({ hilo: hiloId });
  }
}

function marcarRespuestasVistas(hiloId) {
  // Lee el conteo actual del DOM y lo guarda como visto
  const cntEl = document.getElementById(`rcnt_${hiloId}`);
  const badgeEl = document.getElementById(`unread_${hiloId}`);
  const count = cntEl ? parseInt(cntEl.textContent || '0', 10) : 0;
  try {
    const seenKey = `seen_replies_${hiloId}_${usuario?.nickname || 'anon'}`;
    localStorage.setItem(seenKey, String(count));
  } catch(e) {}
  // Ocultar el badge
  if (badgeEl) badgeEl.style.display = 'none';
}

async function marcarResuelta(hiloId) {
  if (!usuario) return;
  const { data: hilo } = await db.from('hilos').select('nickname').eq('id', hiloId).single();
  if (hilo && (usuario.nickname === hilo.nickname || esAdmin())) {
    await db.from('hilos').update({ resuelto: true }).eq('id', hiloId);
    cargarHilos();
    cargarStats();
    toast('✅ Consulta marcada como resuelta');
  }
}

// ═══════════════════════════════════════════
// RESPUESTAS MAS VOTADAS DESTACADAS
// ═══════════════════════════════════════════

// ── Parsear scores desde el campo contenido (fallback si las columnas no existen en BD) ──
function parsearScoresDesdeContenido(contenido) {
  if (!contenido) return {};
  const match = contenido.match(/\[Scores:\s*([^\]]+)\]/);
  if (!match) return {};
  const scores = {};
  const partes = match[1].split('·');
  for (const parte of partes) {
    const m = parte.trim().match(/(.+?)\s+([\d.]+)\/10/);
    if (!m) continue;
    const labelRaw = m[1].replace(/^[\s\S]*?([\w]+[\w\s]*)$/, '$1').trim();
    const val = parseFloat(m[2]);
    const cat = RANKING_CATS.find(c => c.label.toLowerCase() === labelRaw.toLowerCase());
    if (cat) scores[cat.key] = val;
  }
  return scores;
}

async function cargarRespuestas(hiloId, forceVisible = false) {
  const container = document.getElementById(`replies_${hiloId}`);
  if (!container) return;

  const box = document.getElementById(`replybox_${hiloId}`);

  // Solo forzar visibilidad cuando se llama tras enviar (no en la carga inicial de la lista)
  if (forceVisible) {
    container.style.display = 'block';
    if (box) box.style.display = 'block';
  }

  const { data: respuestas, error: errResp } = await db.from('respuestas')
    .select('*')
    .eq('hilo_id', hiloId)
    .order('created_at', { ascending: true });

  if (errResp) {
    container.innerHTML = `<div class="replies-empty">⚠️ Error al cargar: ${errResp.message}</div>`;
    return;
  }

  if (!respuestas || respuestas.length === 0) {
    container.innerHTML = '<div class="replies-empty">💬 Sé el primero en recomendar</div>';
    const topRecEl0 = document.getElementById(`topRec_${hiloId}`);
    if (topRecEl0) topRecEl0.innerHTML = '';
    return;
  }

// Calcular respuesta más votada (incluye las de ranking aunque no tengan modelo detectado)
let mejorRespuesta = null;
let maxVotos = -1;
for (const r of respuestas) {
  const votosUtil = r.votos_util || 0;
  
  // 👇 AÑADE ESTOS CONSOLE.LOG 👇
  const modelosDetectados = extraerModelos(r.contenido);
  console.log('🔍 DEBUG - Respuesta de:', r.nickname);
  console.log('📝 Contenido:', r.contenido);
  console.log('📱 Modelos detectados:', modelosDetectados);
  console.log('---');
  
  const tieneModelo = r.movil_nombre || modelosDetectados.length > 0;
  if (tieneModelo && votosUtil > maxVotos) {
    maxVotos = votosUtil;
    mejorRespuesta = r;
  }
}

  // Top recommendation
  const topRecEl = document.getElementById(`topRec_${hiloId}`);
  if (topRecEl) {
    if (mejorRespuesta && maxVotos > 0) {
      const modeloTop = mejorRespuesta.movil_nombre
        ? formatearModelo(mejorRespuesta.movil_nombre)
        : (() => { const m = extraerModelos(mejorRespuesta.contenido); return m.length > 0 ? m.map(mod => formatearModelo(mod)).join(' / ') : 'Respuesta útil'; })();
      topRecEl.innerHTML = `
        <div class="top-rec">
          <div class="top-rec-icon">🏅</div>
          <div>
            <div class="top-rec-text">Más votado por la comunidad (${maxVotos} 👍)</div>
            <div class="top-rec-model">${modeloTop}</div>
            <div style="font-size:0.90rem;color:rgba(255,255,255);">Recomendado por ${cap(mejorRespuesta.nickname)}</div>
          </div>
        </div>
      `;
    } else {
      topRecEl.innerHTML = '';
    }
  }

  const cntEl = document.getElementById(`rcnt_${hiloId}`);
  if (cntEl) cntEl.textContent = respuestas.length;

  // ── Cargar votos y usuarios en batch (una sola query cada uno, mucho más rápido) ──
  let votosUsuario = {};
  if (usuario) {
    const { data: vots } = await db.from('votos')
      .select('respuesta_id, tipo')
      .eq('usuario_id', usuario.id)
      .in('respuesta_id', respuestas.map(r => r.id));
    if (vots) vots.forEach(v => votosUsuario[v.respuesta_id] = v.tipo);
  }

  const nicknames = [...new Set(respuestas.map(r => r.nickname))];
  const { data: usuariosData } = await db.from('usuarios').select('nickname, puntos, rol, foto_url').in('nickname', nicknames);
  const usuariosMap = {};
  if (usuariosData) usuariosData.forEach(u => usuariosMap[u.nickname] = u);

  let html = '';
  for (const r of respuestas) {
    const uData = usuariosMap[r.nickname] || null;
    const ac = avatarColor(r.nickname);
    const nombre = cap(r.nickname);
    const miVoto = votosUsuario[r.id];
    const votosUtil = r.votos_util || 0;
    const esTopVotada = (mejorRespuesta && mejorRespuesta.id === r.id && maxVotos > 0);
    const topClass = esTopVotada ? 'reply-item top-voted' : 'reply-item';

    // INDICADOR DE EDITADO
    const editadoBadge = r.editado ? `<span class="editado-badge"><i>✏️</i> Editado ${r.editado_en ? timeAgo(r.editado_en) : ''}</span>` : '';

    // BOTONES EDITAR Y BORRAR (solo para el autor)
    const esAutor = usuario && usuario.nickname === r.nickname;
    const editBtn = esAutor ?
      `<button class="edit-reply-btn" data-edit-id="${r.id}">✏️ Editar</button>` : '';
    const deleteBtn = esAutor ?
      `<button class="delete-reply-btn" data-delete-id="${r.id}" data-delete-hilo="${hiloId}">🗑 Borrar</button>` : '';

    // Cita
    let citaHtml = '';
    if (r.cita_id) {
      const citada = respuestas.find(rx => rx.id === r.cita_id);
      if (citada) {
        citaHtml = `<div class="quote-block"><div class="quote-author">↩ ${cap(citada.nickname)}</div>${citada.contenido.slice(0, 120)}${citada.contenido.length > 120 ? '…' : ''}</div>`;
      }
    }

    // ── Limpiar texto: quitar [Scores:...] y la primera línea si es el nombre del móvil ──
    let textoLimpio = (r.contenido || '').replace(/\[Scores:[^\]]*\]/g, '').trim();
    if (r.movil_nombre && textoLimpio) {
      const lineas = textoLimpio.split('\n');
      if (lineas[0].trim().toLowerCase() === r.movil_nombre.trim().toLowerCase()) lineas.shift();
      textoLimpio = lineas.join('\n').trim();
    }
    const contenidoLimpio = renderizarContenido(textoLimpio);

    // ── Modelo a mostrar ──
    const modelosAMostrar = r.movil_nombre
      ? [r.movil_nombre]
      : extraerModelos(r.contenido);

    // ── Scores: primero columnas de BD, si no hay, parsear desde el campo contenido ──
    const scoresEnBD = RANKING_CATS.some(c => r[c.key] != null);
    const scoresFinales = scoresEnBD ? r : parsearScoresDesdeContenido(r.contenido);
    const mediaFinal = r.sc_media != null
      ? r.sc_media
      : (() => {
          const vs = RANKING_CATS.map(c => scoresFinales[c.key]).filter(v => v != null);
          return vs.length ? parseFloat((vs.reduce((a,b) => a+b, 0) / vs.length).toFixed(1)) : null;
        })();

    // ── Bloque de ranking ──
    let rankingHtml = '';
    const tieneScores = RANKING_CATS.some(c => scoresFinales[c.key] != null);
    if (r.tiene_ranking || r.movil_nombre || tieneScores) {
      const chipsHtml = RANKING_CATS
        .filter(cat => scoresFinales[cat.key] != null)
        .map(cat => `<span class="reply-ranking-chip">${cat.icon} ${cat.label} <b>${scoresFinales[cat.key]}/10</b></span>`)
        .join('');
      rankingHtml = `<div class="reply-ranking-block">${mediaFinal != null ? `<div class="reply-ranking-media">⭐ Media <span style="margin-left:4px;font-size:1.05rem;">${mediaFinal}/10</span></div>` : ''}${chipsHtml ? `<div class="reply-ranking-chips">${chipsHtml}</div>` : ''}</div>`;
    }

    const modelosTitleHtml = modelosAMostrar.length > 0 ? `<div class="reply-model-title">${modelosAMostrar.map(m => `<span class="phone-title-tag">📱 ${formatearModelo(m)}</span>`).join('')}</div>` : '';
    html += `<div class="${topClass}" id="reply_${r.id}" data-reply-id="${r.id}"><div class="reply-header">${renderAvatar(r.nickname, uData?.foto_url||null, 'reply-avatar', 32)}<span class="reply-author nick-link" onclick="abrirPerfil('${r.nickname}')">${nombre}</span>${getBadgeHtml(uData?.puntos || 0, uData?.rol || 'usuario')}${esTopVotada ? `<span class="top-voted-badge">🏅 Más votada</span>` : ''}${editadoBadge}<span class="reply-time">${timeAgo(r.created_at)}</span></div><div class="reply-content">${citaHtml}${modelosTitleHtml}${rankingHtml}<span class="reply-text">${contenidoLimpio}</span></div><div class="reply-actions"><button class="vote-btn ${miVoto === 'util' ? 'voted-util' : ''}" onclick="votar('${r.id}','util','${hiloId}','${r.nickname}')">👍 ${votosUtil}</button><button class="vote-btn ${miVoto === 'noutil' ? 'voted-noutil' : ''}" onclick="votar('${r.id}','noutil','${hiloId}','${r.nickname}')">👎 ${r.votos_noutil || 0}</button><button class="cite-btn" data-hilo="${hiloId}" data-reply="${r.id}" data-autor="${r.nickname}" data-contenido="${r.contenido.replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/\n/g,' ')}">↩ Citar</button>${editBtn}${deleteBtn}</div></div>`;
  }

  container.innerHTML = html;

  // Event delegation para citar y editar (evita problemas con comillas en onclick inline)
  container.querySelectorAll('.cite-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const hiloId = btn.dataset.hilo;
      const replyId = btn.dataset.reply;
      const autor = btn.dataset.autor;
      const texto = btn.dataset.contenido;
      setCita(hiloId, replyId, autor, texto);
    });
  });
  container.querySelectorAll('.edit-reply-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.editId;
      // Buscar el contenido original en la respuesta ya cargada
      const resp = respuestas.find(r => r.id === id);
      const contenido = resp ? resp.contenido : '';
      abrirModalEditarRespuesta(id, contenido);
    });
  });
  container.querySelectorAll('.delete-reply-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      borrarRespuestaPropia(btn.dataset.deleteId, btn.dataset.deleteHilo);
    });
  });

  // Si forceVisible: asegurarse de que box sigue visible después de reescribir innerHTML
  if (forceVisible && box) box.style.display = 'block';
}

// MODAL RANKING — RECOMENDAR MÓVIL
// ═══════════════════════════════════════════
function abrirModalRanking(hiloId) {
  if (!usuario) { mostrarModalAuth(); return; }
  rankingHiloActivo = hiloId;

  // Generar grid de categorías
  const grid = document.getElementById('rankingScoresGrid');
  grid.innerHTML = RANKING_CATS.map(cat => `
    <div class="ranking-score-item">
      <div class="ranking-score-label">${cat.icon} ${cat.label}</div>
      <div class="ranking-score-row">
        <input class="ranking-score-input" type="number" id="rk_${cat.key}"
          min="0" max="10" step="1" value=""
          placeholder="—"
          oninput="actualizarMediaRanking()" />
        <div class="ranking-score-bar">
          <div class="ranking-score-bar-fill" id="bar_${cat.key}" style="width:0%"></div>
        </div>
      </div>
    </div>
  `).join('');

  document.getElementById('rankingMovilNombre').value = '';
  document.getElementById('rankingNota').value = '';
  document.getElementById('rankingMediaNum').textContent = '—';
  document.getElementById('rankingModalOverlay').style.display = 'flex';
  document.getElementById('rankingMovilNombre').focus();
}

function cerrarModalRanking(e) {
  if (e && e.target !== document.getElementById('rankingModalOverlay')) return;
  document.getElementById('rankingModalOverlay').style.display = 'none';
  rankingHiloActivo = null;
}

function actualizarMediaRanking() {
  const vals = RANKING_CATS.map(cat => {
    const v = parseFloat(document.getElementById(`rk_${cat.key}`)?.value);
    // Actualizar barra
    const bar = document.getElementById(`bar_${cat.key}`);
    if (bar) bar.style.width = (!isNaN(v) && v >= 0 && v <= 10) ? `${v * 10}%` : '0%';
    return (!isNaN(v) && v >= 0 && v <= 10) ? v : null;
  }).filter(v => v !== null);

  const mediaEl = document.getElementById('rankingMediaNum');
  if (vals.length === 0) { mediaEl.textContent = '—'; return; }
  const media = (vals.reduce((a,b) => a+b, 0) / vals.length).toFixed(1);
  mediaEl.textContent = media;
}

async function enviarConRanking() {
  if (!rankingHiloActivo || !usuario) return;

  const nombre = document.getElementById('rankingMovilNombre').value.trim();
  if (!nombre) { toast('❌ Escribe el nombre del móvil'); document.getElementById('rankingMovilNombre').focus(); return; }

  // Recoger scores
  const scores = {};
  let algunScore = false;
  const vals = [];
  for (const cat of RANKING_CATS) {
    const raw = document.getElementById(`rk_${cat.key}`)?.value;
    const v = parseFloat(raw);
    if (!isNaN(v) && v >= 0 && v <= 10) {
      scores[cat.key] = Math.round(v * 10) / 10;
      vals.push(scores[cat.key]);
      algunScore = true;
    } else {
      scores[cat.key] = null;
    }
  }

  const media = vals.length > 0
    ? Math.round((vals.reduce((a,b) => a+b, 0) / vals.length) * 10) / 10
    : null;

  const nota = document.getElementById('rankingNota').value.trim();

  // Construir texto legible para el campo contenido
  // Nota: el nombre del móvil se guarda en movil_nombre y se renderiza como tag,
  // así que NO lo incluimos en el texto plano para evitar duplicados.
  const scoreTxt = RANKING_CATS
    .filter(cat => scores[cat.key] !== null)
    .map(cat => `${cat.icon} ${cat.label} ${scores[cat.key]}/10`)
    .join(' · ');
  const contenido = `${nombre}\n${nota ? nota : ''}${algunScore ? '\n[Scores: ' + scoreTxt + ']' : ''}`.trim();

  const insertData = {
    hilo_id: rankingHiloActivo,
    usuario_id: usuario.id,
    nickname: usuario.nickname,
    contenido,
    movil_nombre: nombre,
    ...scores,
    sc_media: media,
    tiene_ranking: true,
  };

  // Adjuntar cita si existe
  if (quoteActiva && quoteActiva.hiloId === rankingHiloActivo) {
    insertData.cita_id = quoteActiva.replyId;
  }

  const { error } = await db.from('respuestas').insert(insertData);
  if (error) {
    // Si las columnas de score no existen aún, insertamos sin ellas
    const fallback = {
      hilo_id: rankingHiloActivo,
      usuario_id: usuario.id,
      nickname: usuario.nickname,
      contenido,
    };
    if (quoteActiva && quoteActiva.hiloId === rankingHiloActivo) fallback.cita_id = quoteActiva.replyId;
    const { error: err2 } = await db.from('respuestas').insert(fallback);
    if (err2) { toast('⚠️ Error: ' + err2.message); return; }
  }

  // Cerrar modal inmediatamente (los puntos se actualizan en background abajo)
  const hiloIdRanking = rankingHiloActivo;
  document.getElementById('rankingModalOverlay').style.display = 'none';
  clearCita(hiloIdRanking);
  toast('✅ Recomendación enviada · +2 pts');

  // Mostrar sección si estaba oculta
  const repRk = document.getElementById(`replies_${hiloIdRanking}`);
  const boxRk = document.getElementById(`replybox_${hiloIdRanking}`);
  if (repRk) repRk.style.display = 'block';
  if (boxRk) boxRk.style.display = 'block';

  // Insertar la recomendación en el DOM al instante
  const ac2 = avatarColor(usuario.nickname);
  const nombre2 = cap(usuario.nickname);
  const chipsInstant = RANKING_CATS
    .filter(cat => scores[cat.key] !== null)
    .map(cat => `<span class="reply-ranking-chip">${cat.icon} ${cat.label} <b>${scores[cat.key]}/10</b></span>`)
    .join('');
  const rankingInstant = `
    <div class="reply-ranking-block">
      ${media != null ? `<div class="reply-ranking-media">⭐ Media <span style="margin-left:4px;font-size:1.05rem;">${media}/10</span></div>` : ''}
      ${chipsInstant ? `<div class="reply-ranking-chips">${chipsInstant}</div>` : ''}
    </div>`;
  const nuevoHtmlRanking = `
    <div class="reply-item" id="temp_${Date.now()}">
      <div class="reply-header">
        ${renderAvatar(usuario.nickname, usuario.foto_url||null, 'reply-avatar', 32)}
        <span class="reply-author nick-link" onclick="abrirPerfil('${usuario.nickname}')">${nombre2}</span>
        ${getBadgeHtml(usuario.puntos || 0, usuario.rol || 'usuario')}
        <span class="reply-time">ahora</span>
      </div>
      <div class="reply-content">
        <div class="reply-model-title"><span class="phone-title-tag">📱 ${formatearModelo(nombre)}</span></div>
        ${rankingInstant}
        ${nota ? renderizarContenido(nota) : ''}
      </div>
      <div class="reply-actions">
        <button class="vote-btn">👍 0</button>
        <button class="vote-btn">👎 0</button>
      </div>
    </div>`;
  if (!repRk || repRk.querySelector('.replies-empty')) {
    if (repRk) repRk.innerHTML = nuevoHtmlRanking;
  } else {
    repRk.insertAdjacentHTML('beforeend', nuevoHtmlRanking);
  }
  const cntElRk = document.getElementById(`rcnt_${hiloIdRanking}`);
  if (cntElRk) cntElRk.textContent = parseInt(cntElRk.textContent || '0') + 1;

  // Marcar como visto
  marcarRespuestasVistas(hiloIdRanking);

  // En background: puntos y refresh completo con datos reales de BD
  db.from('usuarios').update({ puntos: (usuario.puntos || 0) + 2 }).eq('id', usuario.id).then(() => {
    usuario.puntos = (usuario.puntos || 0) + 2;
    mostrarUsuario();
    actualizarBarraRango();
    cargarTopMoviles();
  });
  rankingHiloActivo = null;
  setTimeout(() => cargarRespuestas(hiloIdRanking, true), 1000);
  // Actualizar TOP de móviles después de enviar una recomendación
  setTimeout(() => cargarTopMoviles(), 1500);
}

async function enviarRespuesta(hiloId) {
  if (!usuario) { mostrarModalAuth(); return; }
  const input = document.getElementById(`rinput_${hiloId}`);
  const texto = input.value.trim();
  if (!texto) return;

  const sendBtn = document.getElementById(`sendbtn_${hiloId}`);
  sendBtn.disabled = true;

  const insertData = {
    hilo_id: hiloId,
    usuario_id: usuario.id,
    nickname: usuario.nickname,
    contenido: texto,
  };

  if (quoteActiva && quoteActiva.hiloId === hiloId) {
    insertData.cita_id = quoteActiva.replyId;
  }

  const { error } = await db.from('respuestas').insert(insertData);
  if (error) {
    toast('⚠️ Error al enviar: ' + error.message);
    sendBtn.disabled = false;
    return;
  }

  // Limpiar input inmediatamente
  const textoCopy = texto;
  input.value = '';
  input.style.height = 'auto';
  clearCita(hiloId);
  sendBtn.disabled = false;
  toast('✅ Respuesta enviada · +2 pts');

  // Mostrar sección si estaba oculta
  const rep = document.getElementById(`replies_${hiloId}`);
  const box = document.getElementById(`replybox_${hiloId}`);
  if (rep) rep.style.display = 'block';
  if (box) box.style.display = 'block';

  // Insertar el comentario en el DOM al instante sin esperar a la BD
  const ac = avatarColor(usuario.nickname);
  const nombre = cap(usuario.nickname);
  const tempId = 'temp_' + Date.now();
  const nuevoHtml = `
    <div class="reply-item" id="${tempId}">
      <div class="reply-header">
        ${renderAvatar(usuario.nickname, usuario.foto_url||null, 'reply-avatar', 32)}
        <span class="reply-author nick-link" onclick="abrirPerfil('${usuario.nickname}')">${nombre}</span>
        ${getBadgeHtml(usuario.puntos || 0, usuario.rol || 'usuario')}
        <span class="reply-time">ahora</span>
      </div>
      <div class="reply-content">${renderizarContenido(textoCopy)}</div>
      <div class="reply-actions">
        <button class="vote-btn">👍 0</button>
        <button class="vote-btn">👎 0</button>
      </div>
    </div>`;

  // Si el contenedor está vacío o tiene el placeholder, reemplazarlo; si no, añadir al final
  if (!rep || rep.querySelector('.replies-empty')) {
    if (rep) rep.innerHTML = nuevoHtml;
  } else {
    rep.insertAdjacentHTML('beforeend', nuevoHtml);
  }

  // Actualizar contador
  const cntEl = document.getElementById(`rcnt_${hiloId}`);
  if (cntEl) cntEl.textContent = parseInt(cntEl.textContent || '0') + 1;

  // Marcar como visto (el usuario acaba de enviar y está leyendo el hilo)
  marcarRespuestasVistas(hiloId);

  // En background: puntos y refresh completo (sin await = no bloquea)
  db.from('usuarios').update({ puntos: (usuario.puntos || 0) + 2 }).eq('id', usuario.id).then(() => {
    usuario.puntos = (usuario.puntos || 0) + 2;
    mostrarUsuario();
    actualizarBarraRango();
    cargarTopMoviles();
  });
  setTimeout(() => cargarRespuestas(hiloId, true), 800);
  // Actualizar TOP
  setTimeout(() => cargarTopMoviles(), 1500);
}

async function votar(respuestaId, tipo, hiloId, nickAsesor) {
  if (!usuario) { mostrarModalAuth(); return; }
  const { data: yaVoto } = await db.from('votos')
    .select('id').eq('respuesta_id', respuestaId).eq('usuario_id', usuario.id).single();
  if (yaVoto) { toast('Ya votaste esta respuesta'); return; }

  await db.from('votos').insert({ respuesta_id: respuestaId, usuario_id: usuario.id, tipo });
  const campo = tipo === 'util' ? 'votos_util' : 'votos_noutil';
  const { data: resp } = await db.from('respuestas').select(campo).eq('id', respuestaId).single();
  await db.from('respuestas').update({ [campo]: (resp[campo] || 0) + 1 }).eq('id', respuestaId);

  if (tipo === 'util') {
    const { data: asesor } = await db.from('usuarios').select('puntos').eq('nickname', nickAsesor).single();
    if (asesor) await db.from('usuarios').update({ puntos: (asesor.puntos || 0) + 3 }).eq('nickname', nickAsesor);
  }

  cargarRespuestas(hiloId);
  // Actualizar TOP después de votar
  setTimeout(() => cargarTopMoviles(), 1000);
}

// ═══════════════════════════════════════════
// FORM NUEVA CONSULTA
// ═══════════════════════════════════════════
function abrirForm() {
  if (!usuario) { mostrarModalAuth(); return; }
  document.getElementById('newForm').style.display = 'block';
  document.getElementById('newForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cerrarForm() {
  document.getElementById('newForm').style.display = 'none';
  document.querySelectorAll('#newForm input, #newForm textarea, #newForm select').forEach(el => {
    if (el.tagName === 'SELECT') {
      el.selectedIndex = 0;
    } else {
      el.value = '';
    }
  });
}

async function publicarHilo() {
  if (!usuario) { mostrarModalAuth(); return; }

  // Clear previous errors
  document.querySelectorAll('#newForm .form-field').forEach(f => f.classList.remove('has-error'));

  let hasError = false;

  const checks = [
    { id: 'f_presupuesto', type: 'select' },
    { id: 'f_movil_actual', type: 'text' },
    { id: 'f_marca_pref', type: 'text' },
    { id: 'f_marca_no', type: 'text' },
    { id: 'f_garantia', type: 'select' },
    { id: 'f_modelos', type: 'select' },
    { id: 'f_uso', type: 'text' },
    { id: 'f_tamano', type: 'select' },
    { id: 'f_juegos', type: 'select' },
    { id: 'f_camara', type: 'select' },
    { id: 'f_bateria', type: 'select' },
    { id: 'f_carga', type: 'select' },
    { id: 'f_extra', type: 'textarea', minLen: 10 },
  ];

  for (const c of checks) {
    const el = document.getElementById(c.id);
    if (!el) continue;
    const val = el.value.trim();
    const empty = !val || (c.minLen && val.length < c.minLen);
    if (empty) {
      el.closest('.form-field').classList.add('has-error');
      hasError = true;
    }
  }

  if (hasError) {
    toast('⚠️ Rellena todos los campos obligatorios');
    const firstErr = document.querySelector('#newForm .has-error');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const presupuesto = document.getElementById('f_presupuesto').value;
  const extra = document.getElementById('f_extra').value.trim();
  const { error } = await db.from('hilos').insert({
    usuario_id: usuario.id,
    nickname: usuario.nickname,
    presupuesto: presupuesto,
    movil_actual: document.getElementById('f_movil_actual').value,
    marca_preferida: document.getElementById('f_marca_pref').value,
    marca_no_quiere: document.getElementById('f_marca_no').value,
    garantia_espana: document.getElementById('f_garantia').value,
    modelos: document.getElementById('f_modelos').value,
    uso_principal: document.getElementById('f_uso').value,
    tamano_pantalla: document.getElementById('f_tamano').value,
    juegos: document.getElementById('f_juegos').value,
    camara: document.getElementById('f_camara').value,
    bateria: document.getElementById('f_bateria').value,
    carga_rapida: document.getElementById('f_carga').value,
    datos_extra: extra,
  });

  if (!error) {
    cerrarForm();
    // +1 pt por nueva consulta
    const newPts = (usuario.puntos || 0) + 1;
    await db.from('usuarios').update({ puntos: newPts }).eq('id', usuario.id);
    usuario.puntos = newPts;
    mostrarUsuario();
    actualizarBarraRango();
    cargarHilos();
    cargarStats();
    toast('📱 Consulta publicada · +1 pt');
  } else {
    toast('⚠️ Error: ' + error.message);
  }
}

// ═══════════════════════════════════════════
// NOTICIAS CON PAGINACIÓN
// ═══════════════════════════════════════════

let noticiasCache = [];

async function cargarNoticias() {
  const el = document.getElementById('noticiasList');
  if (!el) return;
  el.innerHTML = '<div class="noticias-empty">⏳ Cargando noticias...</div>';

  const { data, error } = await db.from('noticias').select('*').order('created_at', { ascending: false });
  if (error || !data || data.length === 0) {
    el.innerHTML = '<div class="noticias-empty">📭 Aún no hay noticias publicadas. Vuelve pronto.</div>';
    return;
  }

  noticiasCache = data;
  renderNoticiasPagina();
}

function renderNoticiasPagina() {
  const el = document.getElementById('noticiasList');
  if (!el) return;
  
  const totalPaginas = Math.ceil(noticiasCache.length / NOTICIAS_POR_PAGINA);
  const start = (noticiasPagina - 1) * NOTICIAS_POR_PAGINA;
  const pag = noticiasCache.slice(start, start + NOTICIAS_POR_PAGINA);
  
  const CAT_ICONS = { rumor: '💬', oficial: '✅', analisis: '🔍', comunidad: '👥' };
  const noticiasHtml = pag.map((n, idx) => {
    const globalIdx = noticiasCache.findIndex(item => item.id === n.id);
    const isFeatured = idx === 0 && noticiasPagina === 1;
    const catClass = 'noticia-cat-' + (n.categoria || 'comunidad');
    const catLabel = NOTICIA_CAT_LABELS[n.categoria] || n.categoria;
    const catIcon = CAT_ICONS[n.categoria] || '📰';
    const resumenTexto = n.resumen ? n.resumen.replace(/<[^>]*>/g, ' ').trim() : '';
    const resumenCorto = resumenTexto.substring(0, isFeatured ? 220 : 110) + (resumenTexto.length > (isFeatured ? 220 : 110) ? '…' : '');
    const imgHtml = n.imagen_url
      ? `<div class="noticia-img-wrap"><img class="noticia-img" src="${n.imagen_url}" alt="${n.titulo}" onerror="this.parentElement.style.display='none'" loading="lazy" /></div>`
      : `<div class="noticia-no-img">📰</div>`;
    return `
      <div class="noticia-card${isFeatured ? ' noticia-featured' : ''}" onclick="abrirNoticia(${globalIdx})">
        ${imgHtml}
        <div class="noticia-body">
          <span class="noticia-cat ${catClass}">${catIcon} ${catLabel}</span>
          <div class="noticia-titulo">${n.titulo}</div>
          <div class="noticia-resumen">${resumenCorto}</div>
          <div class="noticia-meta">
            <span>📅 ${n.fecha || ''}</span>
            <span class="noticia-leer-mas">Leer más →</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Paginación
  let paginacionHtml = '';
  if (totalPaginas > 1) {
    paginacionHtml = '<div class="pagination" style="margin-top: 20px;">';
    for (let i = 1; i <= totalPaginas; i++) {
      paginacionHtml += `<button class="page-btn ${i === noticiasPagina ? 'active' : ''}" onclick="irAPaginaNoticias(${i})">${i}</button>`;
    }
    paginacionHtml += '</div>';
  }
  
  el.innerHTML = noticiasHtml + paginacionHtml;
}

function irAPaginaNoticias(pagina) {
  noticiasPagina = pagina;
  renderNoticiasPagina();
  document.getElementById('noticiasList').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ═══════════════════════════════════════════
// NOTICIAS ADMIN - NUEVO MODAL CON QUILL
// ═══════════════════════════════════════════

// ═══════════════════════════════════════════
// EDITOR DE NOTICIAS - QUILL AVANZADO
// ═══════════════════════════════════════════

// Lista de emojis frecuentes para el picker
const EMOJIS_NOTICIA = [
  '😀','😂','😍','🤔','😎','🔥','💯','👍','👎','❤️','⭐','🎉','📱','💰','🚀','⚡','✅','❌','⚠️','📢',
  '🆕','🔝','😱','🤩','😏','😴','🤯','👀','🙌','💪','📸','🎮','🕹️','💎','🔋','📶','📷','🆚',
  // ── Flechas y dirección (ideales para comparativas y guías) ──
  '➡️','⬅️','⬆️','⬇️','↗️','↘️','↙️','↖️','🔄','🔁','↔️','↕️','▶️','◀️',
  // ── Símbolos para destacar contenido en la noticia ──
  '📌','🏷️','🔖','💡','📝','🔍','🔒','🔓','🎯','🆓','💲','🟢','🟡','🔴','🔵','⚪','⚫','◾','◽','✳️','❗','❓','‼️','⁉️','✔️','➕','➖'
];

function crearQuillNoticia() {
  // Inyectar estilos propios del editor una sola vez
  if (!document.getElementById('noticiaQuillStyles')) {
    const style = document.createElement('style');
    style.id = 'noticiaQuillStyles';
    style.textContent = `
      .noticia-callout {
        background: #FFF8E1;
        border-left: 4px solid #F5A623;
        border-radius: 6px;
        padding: 10px 14px;
        margin: 8px 0;
        font-size: 14px;
        line-height: 1.5;
      }
      .noticia-hr {
        border: none;
        border-top: 2px dashed #D1D5DB;
        margin: 16px 0;
      }
      .noticia-embed-yt { position: relative; width: 100%; padding-bottom: 56.25%; height: 0; margin: 8px 0; border-radius: 8px; overflow: hidden; }
      .noticia-embed-yt iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
      .noticia-embed-tt { display: flex; justify-content: center; margin: 8px 0; }
      #emojiPicker {
        position: absolute;
        display: none;
        grid-template-columns: repeat(8, 1fr);
        gap: 4px;
        background: #fff;
        border: 1px solid #D1D5DB;
        border-radius: 8px;
        padding: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        z-index: 50;
        max-height: 220px;
        overflow-y: auto;
      }
      #emojiPicker span { cursor: pointer; font-size: 18px; text-align: center; padding: 4px; border-radius: 4px; }
      #emojiPicker span:hover { background: #F3F4F6; }
    `;
    document.head.appendChild(style);
  }

  const COLORES_NOTICIA = ['#0F1B2D', '#1D6FE8', '#F5A623', '#10B981', '#E83B3B', '#9333EA', '#6B7280', '#FFFFFF'];

  const quill = new Quill('#noticiaQuillEditor', {
    theme: 'snow',
    placeholder: 'Escribe aquí el cuerpo completo de la noticia...',
    modules: {
      toolbar: {
        container: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic'],
          [{ 'color': COLORES_NOTICIA }],
          ['blockquote', 'callout', 'hr'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['link', 'image'],
          ['emoji'],
          ['embed-tw', 'embed-yt'],
          ['clean']
        ],
        handlers: {
          emoji:      function () { toggleEmojiPicker(quill); },
          callout:    function () { insertCalloutNoticia(quill); },
          hr:         function () { insertHrNoticia(quill); },
          'embed-tw': function () { insertEmbedNoticia(quill, 'tw'); },
          'embed-yt': function () { insertEmbedNoticia(quill, 'yt'); }
        }
      }
    }
  });

  // Iconos personalizados para la toolbar
  setTimeout(() => {
    const toolbar = document.querySelector('#noticiaModalAdmin .ql-toolbar');
    if (!toolbar) return;
    const emojiBtn = toolbar.querySelector('.ql-emoji');
    if (emojiBtn) { emojiBtn.innerHTML = '😀'; emojiBtn.title = 'Insertar emoji'; }
    const calloutBtn = toolbar.querySelector('.ql-callout');
    if (calloutBtn) { calloutBtn.innerHTML = '💡'; calloutBtn.title = 'Insertar caja destacada'; }
    const hrBtn = toolbar.querySelector('.ql-hr');
    if (hrBtn) { hrBtn.innerHTML = '➖'; hrBtn.title = 'Insertar separador'; }
    const ytBtn = toolbar.querySelector('.ql-embed-yt');
    if (ytBtn) { ytBtn.innerHTML = '▶️'; ytBtn.title = 'Insertar vídeo de YouTube'; }
    const twBtn = toolbar.querySelector('.ql-embed-tw');
    if (twBtn) { twBtn.innerHTML = '🐦'; twBtn.title = 'Insertar tweet (X/Twitter)'; }
  }, 0);

  return quill;
}

// ─── Caja destacada (callout) ────────────────────────────
function insertCalloutNoticia(quill) {
  const range = quill.getSelection(true) || { index: quill.getLength() };
  const html = `<div class="noticia-callout">💡 <strong>Dato destacado:</strong> escribe aquí el texto importante...</div><p><br></p>`;
  quill.clipboard.dangerouslyPasteHTML(range.index, html, 'user');
}

// ─── Línea separadora (hr) ────────────────────────────────
function insertHrNoticia(quill) {
  const range = quill.getSelection(true) || { index: quill.getLength() };
  const html = `<hr class="noticia-hr"><p><br></p>`;
  quill.clipboard.dangerouslyPasteHTML(range.index, html, 'user');
}

function toggleEmojiPicker(quill) {
  const picker = document.getElementById('emojiPicker');
  if (picker.style.display === 'grid') {
    picker.style.display = 'none';
    return;
  }
  picker.innerHTML = EMOJIS_NOTICIA.map(e => `<span onclick="insertarEmojiNoticia('${e}')">${e}</span>`).join('');
  const toolbar = document.querySelector('#noticiaModalAdmin .ql-toolbar');
  const rect = toolbar.getBoundingClientRect();
  const modalRect = document.querySelector('#noticiaModalAdmin .modal').getBoundingClientRect();
  picker.style.top = (rect.bottom - modalRect.top) + 'px';
  picker.style.left = '0px';
  picker.style.display = 'grid';
  quillEditorNoticia._ultimaSeleccion = quill.getSelection(true);
}

function insertarEmojiNoticia(emoji) {
  const quill = quillEditorNoticia;
  const range = quill._ultimaSeleccion || quill.getSelection(true) || { index: quill.getLength(), length: 0 };
  quill.insertText(range.index, emoji, 'user');
  quill.setSelection(range.index + emoji.length, 0);
  document.getElementById('emojiPicker').style.display = 'none';
}

function insertEmbedNoticia(quill, tipo) {
  const labels = {
    tw: { txt: 'Pega la URL del tweet (X / Twitter):', ph: 'https://x.com/usuario/status/1234567890' },
    yt: { txt: 'Pega la URL del vídeo de YouTube:', ph: 'https://www.youtube.com/watch?v=XXXXXXXXXXX' },
    tt: { txt: 'Pega la URL del vídeo de TikTok:', ph: 'https://www.tiktok.com/@usuario/video/1234567890123456789' }
  };
  const url = prompt(labels[tipo].txt, '');
  if (!url) return;

  const range = quill.getSelection(true) || { index: quill.getLength() };
  let html = '';

  if (tipo === 'yt') {
    let videoId = '';
    const m1 = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{6,})/);
    if (m1) videoId = m1[1];
    if (!videoId) { toast('❌ URL de YouTube no válida'); return; }
    html = `<div class="noticia-embed-yt"><iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe></div><p><br></p>`;
  } else if (tipo === 'tw') {
    if (!/twitter\.com|x\.com/.test(url)) { toast('❌ URL de X/Twitter no válida'); return; }
    html = `<blockquote class="twitter-tweet"><a href="${url}"></a></blockquote><p><br></p>`;
  } else if (tipo === 'tt') {
    if (!/tiktok\.com/.test(url)) { toast('❌ URL de TikTok no válida'); return; }
    const m2 = url.match(/video\/(\d+)/);
    const videoId = m2 ? m2[1] : '';
    html = `<div class="noticia-embed-tt"><blockquote class="tiktok-embed" cite="${url}" data-video-id="${videoId}" style="max-width:605px;min-width:325px;"><section></section></blockquote></div><p><br></p>`;
  }

  quill.clipboard.dangerouslyPasteHTML(range.index, html, 'user');

  // Re-cargar scripts de embeds para que los renderice cada plataforma
  setTimeout(() => {
    if (tipo === 'tw' && window.twttr && window.twttr.widgets) window.twttr.widgets.load(quill.root);
    if (tipo === 'tt' && window.tiktokEmbed && window.tiktokEmbed.lib) window.tiktokEmbed.lib.render(quill.root);
    if (tipo === 'tt') {
      // Forzar recarga del script de TikTok si ya estaba cargado
      const s = document.createElement('script');
      s.src = 'https://www.tiktok.com/embed.js';
      document.body.appendChild(s);
    }
  }, 100);
}



function abrirModalNuevaNoticia() {
  if (!usuario || usuario.nickname !== 'dastan') {
    toast('⛔ Solo el administrador puede crear noticias');
    return;
  }
  
  // Inicializar Quill si no existe
  if (!quillEditorNoticia) {
    quillEditorNoticia = crearQuillNoticia();
  } else {
    quillEditorNoticia.root.innerHTML = '';
  }
  
  document.getElementById('noticiaTitulo').value = '';
  document.getElementById('noticiaImagen').value = '';
  document.getElementById('noticiaCategoria').value = 'rumor';
  document.getElementById('noticiaFecha').value = '';
  document.getElementById('editandoNoticiaId').value = '';
  document.getElementById('noticiaModalTitle').textContent = '📰 Nueva noticia';
  
  document.getElementById('noticiaModalAdmin').classList.remove('hidden');
}

function cerrarModalNuevaNoticia() {
  document.getElementById('noticiaModalAdmin').classList.add('hidden');
  if (quillEditorNoticia) quillEditorNoticia.root.innerHTML = '';
  document.getElementById('editandoNoticiaId').value = '';
}

async function guardarNoticia() {
  const id = document.getElementById('editandoNoticiaId').value;
  const titulo = document.getElementById('noticiaTitulo').value.trim();
  const imagen_url = document.getElementById('noticiaImagen').value.trim();
  const categoria = document.getElementById('noticiaCategoria').value;
  const fecha = document.getElementById('noticiaFecha').value.trim();
  const resumen = quillEditorNoticia ? quillEditorNoticia.root.innerHTML : '';
  const textoPlano = quillEditorNoticia ? quillEditorNoticia.getText().trim() : '';
  
  if (!titulo || !textoPlano) { toast('❌ Título y cuerpo son obligatorios'); return; }
  
  toast('⏳ Guardando...');
  
  let error;
  if (id) {
    ({ error } = await db.from('noticias').update({ titulo, resumen, imagen_url, categoria, fecha }).eq('id', id));
  } else {
    ({ error } = await db.from('noticias').insert({ titulo, resumen, imagen_url, categoria, fecha }));
  }
  
  if (error) { toast('❌ Error: ' + error.message); return; }
  toast(id ? '✅ Noticia actualizada' : '✅ Noticia publicada');
  cerrarModalNuevaNoticia();
  
  // Recargar noticias
  if (tabActual === 'noticias') {
    cargarNoticias();
  }
  
  // Si admin panel está abierto, recargar admin de noticias
  if (document.getElementById('adminPanel').style.display === 'block' && typeof renderAdminNoticias === 'function') {
    renderAdminNoticias();
  }
}

// ═══════════════════════════════════════════
// NOTICIAS ADMIN - RENDER (para el panel de admin)
// ═══════════════════════════════════════════

async function renderAdminNoticias() {
  const { data: noticias } = await db.from('noticias').select('*').order('created_at', { ascending: false });
  
  let listaHtml = '';
  if (noticias && noticias.length > 0) {
    listaHtml = noticias.map(n => `
      <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);">
        ${n.imagen_url ? `<img src="${n.imagen_url}" style="width:64px;height:40px;object-fit:cover;border-radius:8px;flex-shrink:0;" onerror="this.style.display='none'" />` : '<div style="width:64px;height:40px;background:var(--surface-3);border-radius:8px;flex-shrink:0;"></div>'}
        <div style="flex:1;min-width:0;">
          <div style="font-size:0.8rem;font-weight:600;color:var(--navy);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${n.titulo}</div>
          <div style="font-size:0.68rem;color:var(--text-3);">${n.categoria || ''} · ${n.fecha || ''}</div>
        </div>
        <button class="admin-btn admin-btn-blue" onclick="adminEditarNoticia('${n.id}')">✏️</button>
        <button class="admin-btn admin-btn-red" onclick="adminBorrarNoticia('${n.id}')">🗑</button>
      </div>
    `).join('');
  } else {
    listaHtml = '<div class="admin-empty">No hay noticias todavía.</div>';
  }
  
  document.getElementById('adminContent').innerHTML = `
    <div style="margin-bottom:16px;">
      <button class="admin-btn admin-btn-blue" onclick="abrirModalNuevaNoticia()">➕ Nueva noticia</button>
    </div>
    <div class="admin-section-title">📰 Noticias publicadas</div>
    <div id="adminNoticiasList">${listaHtml}</div>
  `;
}

async function adminEditarNoticia(id) {
  const { data: n } = await db.from('noticias').select('*').eq('id', id).single();
  if (!n) return;
  
  if (!quillEditorNoticia) {
    quillEditorNoticia = crearQuillNoticia();
  }
  
  quillEditorNoticia.root.innerHTML = n.resumen || '';
  document.getElementById('noticiaTitulo').value = n.titulo || '';
  document.getElementById('noticiaImagen').value = n.imagen_url || '';
  document.getElementById('noticiaCategoria').value = n.categoria || 'rumor';
  document.getElementById('noticiaFecha').value = n.fecha || '';
  document.getElementById('editandoNoticiaId').value = n.id;
  document.getElementById('noticiaModalTitle').textContent = '✏️ Editar noticia';
  
  document.getElementById('noticiaModalAdmin').classList.remove('hidden');
}

async function adminBorrarNoticia(id) {
  if (!confirm('¿Borrar esta noticia permanentemente?')) return;
  const { error } = await db.from('noticias').delete().eq('id', id);
  if (error) { toast('❌ Error: ' + error.message); return; }
  toast('🗑 Noticia borrada');
  await renderAdminNoticias();
  if (tabActual === 'noticias') cargarNoticias();
}

// Función global para abrir noticia
function abrirNoticia(idx) {
  const n = noticiasCache[idx];
  if (!n) return;
  const catClass = 'noticia-cat-' + (n.categoria || 'comunidad');
  const catLabel = NOTICIA_CAT_LABELS[n.categoria] || n.categoria;
  const imgHtml = n.imagen_url
    ? `<img class="noticia-modal-img" src="${n.imagen_url}" alt="${n.titulo}" onerror="this.style.display='none'" />`
    : '';
  const html = `
    <div class="noticia-modal-overlay" id="noticiaModal" onclick="cerrarNoticia(event)">
      <div class="noticia-modal" onclick="event.stopPropagation()">
        ${imgHtml}
        <div class="noticia-modal-body">
          <span class="noticia-cat ${catClass}">${catLabel}</span>
          <div class="noticia-modal-titulo">${n.titulo}</div>
          <div class="noticia-modal-resumen ql-editor" style="padding:0;">${n.resumen || ''}</div>
          <div class="noticia-modal-meta">📅 ${n.fecha || ''}</div>
        </div>
        <button class="noticia-modal-close" onclick="cerrarNoticia()">✕ Cerrar</button>
      </div>
    </div>
  `;
  const old = document.getElementById('noticiaModal');
  if (old) old.remove();
  document.body.insertAdjacentHTML('beforeend', html);

  // Renderizar embeds de Twitter/X y TikTok si los hay
  setTimeout(() => {
    if (window.twttr && window.twttr.widgets) window.twttr.widgets.load();
    if (/tiktok-embed/.test(n.resumen || '')) {
      const s = document.createElement('script');
      s.src = 'https://www.tiktok.com/embed.js';
      document.body.appendChild(s);
    }
  }, 100);
}

function cerrarNoticia(e) {
  if (e && e.target !== document.getElementById('noticiaModal')) return;
  const m = document.getElementById('noticiaModal');
  if (m) m.remove();
}

// ═══════════════════════════════════════════
// PANEL ADMIN COMPLETO (resto de funciones)
// ═══════════════════════════════════════════

const ADMIN_NICK = 'dastan';
let adminTabActual = 'usuarios';
let adminBodyOpen = true;
let adminPagina = 1;
const ADMIN_POR_PAG = 10;

function mostrarAdminPanel() {
  if (!usuario) {
    const btn = document.getElementById('adminBtn');
    if (btn) btn.style.display = 'none';
    return;
  }
  
  const nick = (usuario.nickname || '').toLowerCase().trim();
  const btn = document.getElementById('adminBtn');
  
  if (nick === 'dastan') {
    if (btn) btn.style.display = 'flex';
  } else {
    if (btn) btn.style.display = 'none';
  }
}

function emergenciaAdmin() {
  if (!usuario) {
    toast('⚠️ Inicia sesión primero');
    return;
  }
  const nick = (usuario.nickname || '').toLowerCase().trim();
  if (nick !== 'dastan') {
    toast('⛔ Acceso denegado');
    return;
  }
  const panel = document.getElementById('adminPanel');
  if (!panel) return;
  const visible = panel.style.display === 'block';
  panel.style.display = visible ? 'none' : 'block';
  if (!visible) { 
    if (typeof cargarAdminContent === 'function') cargarAdminContent();
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function toggleAdminBody() {
  adminBodyOpen = !adminBodyOpen;
  document.getElementById('adminBody').style.display = adminBodyOpen ? 'block' : 'none';
  document.getElementById('adminToggleIcon').textContent = adminBodyOpen ? '▴' : '▾';
}

function adminSetTab(tab, el) {
  adminTabActual = tab;
  adminPagina = 1;
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  cargarAdminContent();
}

async function cargarAdminContent() {
  document.getElementById('adminContent').innerHTML = '<div class="admin-loading">⏳ Cargando...</div>';
  if (adminTabActual === 'usuarios') await renderAdminUsuarios();
  else if (adminTabActual === 'posts') await renderAdminPosts();
  else if (adminTabActual === 'respuestas') await renderAdminRespuestas();
  else if (adminTabActual === 'stats') await renderAdminStats();
  else if (adminTabActual === 'config') renderAdminConfig();
  else if (adminTabActual === 'actualizaciones') renderAdminActualizaciones();
  else if (adminTabActual === 'noticias_admin') await renderAdminNoticias();
  else if (adminTabActual === 'reportes') await renderAdminReportes();
}

function adminPaginarHtml(total) {
  const totalPags = Math.ceil(total / ADMIN_POR_PAG);
  if (totalPags <= 1) return '';
  let html = `<div style="display:flex;gap:5px;justify-content:center;margin-top:14px;flex-wrap:wrap;">`;
  for (let i = 1; i <= totalPags; i++) {
    html += `<button class="admin-btn ${i === adminPagina ? 'admin-btn-blue' : 'admin-btn-gray'}" onclick="adminIrPag(${i})">${i}</button>`;
  }
  html += `</div>`;
  return html;
}

function adminIrPag(p) { adminPagina = p; cargarAdminContent(); }

// ── 1. USUARIOS ──────────────────────────────
async function renderAdminUsuarios() {
  const { data: users } = await db.from('usuarios').select('*').order('puntos', { ascending: false });
  if (!users || users.length === 0) { document.getElementById('adminContent').innerHTML = '<div class="admin-empty">Sin usuarios</div>'; return; }

  const inicio = (adminPagina - 1) * ADMIN_POR_PAG;
  const pag = users.slice(inicio, inicio + ADMIN_POR_PAG);

  let html = `
    <div class="admin-section-title">👥 Todos los usuarios (${users.length})</div>
    <div class="admin-table-wrap"><table class="admin-table">
      <thead><tr><th>Usuario</th><th>Puntos</th><th>Estado</th><th>Acciones</th></tr></thead>
      <tbody>`;

  for (const u of pag) {
    const badge = u.rol === 'admin'
      ? `<span class="admin-badge admin-badge-admin">👑 Admin</span>`
      : u.baneado ? `<span class="admin-badge admin-badge-baneado">🚫 Baneado</span>`
      : `<span class="admin-badge admin-badge-usuario">👤 Usuario</span>`;

    html += `<tr>
      <td>
        <div class="admin-nick">${cap(u.nickname)}</div>
        ${u.palabra_clave ? `<div style="font-size:0.65rem;color:var(--text-3);">🔑 Palabra: <b>${u.palabra_clave}</b></div>` : `<div style="font-size:0.65rem;color:var(--accent);">⚠️ Sin palabra clave</div>`}
       </td>
      <td>
        <input class="admin-inline-input" type="number" value="${u.puntos||0}" id="pts_${u.nickname}" />
        <button class="admin-btn admin-btn-blue" onclick="adminAjustarPuntos('${u.nickname}')">✔</button>
       </td>
      <td>${badge}</td>
      <td><div class="admin-actions-row">
        ${u.nickname !== ADMIN_NICK ? `
          <select class="admin-select" id="rol_${u.nickname}">
            <option value="usuario" ${u.rol==='usuario'?'selected':''}>Usuario</option>
            <option value="mod" ${u.rol==='mod'?'selected':''}>Mod</option>
            <option value="admin" ${u.rol==='admin'?'selected':''}>Admin</option>
          </select>
          <button class="admin-btn admin-btn-gray" onclick="adminCambiarRol('${u.nickname}')">Cambiar rol</button>
          <button class="admin-btn admin-btn-red" onclick="adminBanear('${u.nickname}',${!u.baneado})">${u.baneado?'✅ Desbanear':'🚫 Banear'}</button>
          <button class="admin-btn admin-btn-gray" onclick="adminResetCodigo('${u.nickname}')">🔑 Reset código</button>
        ` : `<span style="font-size:0.68rem;color:var(--text-3);">— eres tú —</span>`}
      </div></td>
    </tr>`;
  }
  html += `</tbody></table></div>${adminPaginarHtml(users.length)}`;
  document.getElementById('adminContent').innerHTML = html;
}

// ── 2. HILOS ─────────────────────────────────
async function renderAdminPosts() {
  const { data: hilos } = await db.from('hilos').select('*').order('created_at', { ascending: false });
  if (!hilos || hilos.length === 0) { document.getElementById('adminContent').innerHTML = '<div class="admin-empty">Sin hilos</div>'; return; }

  const inicio = (adminPagina - 1) * ADMIN_POR_PAG;
  const pag = hilos.slice(inicio, inicio + ADMIN_POR_PAG);

  let html = `
    <div class="admin-section-title">📋 Hilos (${hilos.length})</div>
    <div class="admin-table-wrap"><table class="admin-table">
      <thead><tr><th>Autor</th><th>Consulta</th><th>Estado</th><th>Acciones</th></tr></thead>
      <tbody>`;

  for (const h of pag) {
    const resumen = [h.presupuesto, h.uso_principal, h.datos_extra].filter(Boolean).join(' · ') || 'Sin detalle';
    const fijado = h.fijado ? '📌 ' : '';
    html += `<tr>
      <td style="font-weight:600;font-size:0.78rem;">${cap(h.nickname)}</td>
      <td><div class="admin-hilo-title" title="${resumen}">${fijado}${resumen}</div></td>
      <td>
        ${h.resuelto
          ? `<span style="color:var(--green);font-size:0.72rem;font-weight:600;">✅ Resuelta</span>`
          : `<span style="color:var(--accent);font-size:0.72rem;font-weight:600;">🟡 Abierta</span>`}
      </td>
      <td><div class="admin-actions-row">
        <button class="admin-btn ${h.fijado?'admin-btn-blue':'admin-btn-gray'}" onclick="adminFijarHilo('${h.id}',${!h.fijado})">${h.fijado?'📌 Desfijar':'📌 Fijar'}</button>
        ${!h.resuelto?`<button class="admin-btn admin-btn-green" onclick="adminCerrarHilo('${h.id}')">🔒 Cerrar</button>`:''}
        <button class="admin-btn admin-btn-red" onclick="adminEliminarHilo('${h.id}')">🗑 Eliminar</button>
      </div></td>
    </tr>`;
  }
  html += `</tbody></table></div>${adminPaginarHtml(hilos.length)}`;
  document.getElementById('adminContent').innerHTML = html;
}

// ── 3. RESPUESTAS ─────────────────────────────
async function renderAdminRespuestas() {
  const { data: resps } = await db.from('respuestas').select('*').order('created_at', { ascending: false });
  if (!resps || resps.length === 0) { document.getElementById('adminContent').innerHTML = '<div class="admin-empty">Sin respuestas</div>'; return; }

  const inicio = (adminPagina - 1) * ADMIN_POR_PAG;
  const pag = resps.slice(inicio, inicio + ADMIN_POR_PAG);

  let html = `
    <div class="admin-section-title">💬 Respuestas (${resps.length})</div>
    <div class="admin-table-wrap"><table class="admin-table">
      <thead><tr><th>Autor</th><th>Contenido</th><th>Votos</th><th>Acciones</th></tr></thead>
      <tbody>`;

  for (const r of pag) {
    const preview = (r.contenido || '').slice(0, 90) + ((r.contenido||'').length > 90 ? '…' : '');
    html += `<tr>
      <td style="font-weight:600;font-size:0.78rem;white-space:nowrap;">${cap(r.nickname)}</td>
      <td style="font-size:0.75rem;color:var(--text-2);max-width:260px;">${preview}</td>
      <td style="white-space:nowrap;font-size:0.75rem;">👍${r.votos_util||0} 👎${r.votos_noutil||0}</td>
      <td><div class="admin-actions-row">
        <button class="admin-btn admin-btn-blue" onclick="adminVotoExtra('${r.id}','${r.nickname}')">⭐ +Voto útil</button>
        <button class="admin-btn admin-btn-red" onclick="adminEliminarRespuesta('${r.id}','${r.hilo_id}')">🗑 Eliminar</button>
      </div></td>
    </tr>`;
  }
  html += `</tbody></table></div>${adminPaginarHtml(resps.length)}`;
  document.getElementById('adminContent').innerHTML = html;
}

// ── 4. ESTADÍSTICAS ───────────────────────────
async function renderAdminStats() {
  const [
    { count: totalHilos },
    { count: hilosAbiertos },
    { count: hilosCerrados },
    { count: totalRespuestas },
    { count: totalUsuarios },
    { data: topUsuarios },
    { data: ultimasResps },
  ] = await Promise.all([
    db.from('hilos').select('*', { count: 'exact', head: true }),
    db.from('hilos').select('*', { count: 'exact', head: true }).eq('resuelto', false),
    db.from('hilos').select('*', { count: 'exact', head: true }).eq('resuelto', true),
    db.from('respuestas').select('*', { count: 'exact', head: true }),
    db.from('usuarios').select('*', { count: 'exact', head: true }),
    db.from('usuarios').select('nickname,puntos,rol').order('puntos', { ascending: false }).limit(10),
    db.from('respuestas').select('created_at').order('created_at', { ascending: false }).limit(200),
  ]);

  // Horas pico
  const horaCounts = Array(24).fill(0);
  (ultimasResps || []).forEach(r => {
    const h = new Date(r.created_at).getHours();
    horaCounts[h]++;
  });
  const maxHora = Math.max(...horaCounts);
  const horasPicoHtml = horaCounts.map((c, h) => {
    const pct = maxHora > 0 ? Math.round((c / maxHora) * 100) : 0;
    return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">
      <span style="font-size:0.65rem;color:var(--text-3);width:28px;text-align:right;">${h}h</span>
      <div style="flex:1;height:10px;background:var(--surface-3);border-radius:999px;overflow:hidden;">
        <div style="width:${pct}%;height:100%;background:var(--blue);border-radius:999px;"></div>
      </div>
      <span style="font-size:0.65rem;color:var(--text-3);width:18px;">${c}</span>
    </div>`;
  }).join('');

  // Top usuarios tabla
  const topHtml = (topUsuarios || []).map((u, i) => `
    <tr>
      <td style="font-size:0.75rem;">${i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}</td>
      <td style="font-weight:600;font-size:0.78rem;">${cap(u.nickname)}</td>
      <td style="font-size:0.75rem;">${u.puntos||0} pts</td>
      <td>${u.rol==='admin'?'<span class="admin-badge admin-badge-admin">👑 Admin</span>':'<span class="admin-badge admin-badge-usuario">👤</span>'}</td>
    </tr>`).join('');

  document.getElementById('adminContent').innerHTML = `
    <div class="admin-section-title">📊 Dashboard general</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;margin-bottom:20px;">
      ${[
        ['📋','Hilos totales', totalHilos||0,'var(--blue)'],
        ['🟡','Abiertas', hilosAbiertos||0,'var(--accent)'],
        ['✅','Resueltas', hilosCerrados||0,'var(--green)'],
        ['💬','Respuestas', totalRespuestas||0,'#8B5CF6'],
        ['👥','Miembros', totalUsuarios||0,'#EC4899'],
      ].map(([ic,lb,val,col]) => `
        <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:14px;padding:14px;text-align:center;">
          <div style="font-size:1.4rem;margin-bottom:4px;">${ic}</div>
          <div style="font-size:1.3rem;font-weight:800;color:${col};font-family:'Syne',sans-serif;">${val}</div>
          <div style="font-size:0.65rem;color:var(--text-3);margin-top:2px;">${lb}</div>
        </div>`).join('')}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;flex-wrap:wrap;">
      <div>
        <div class="admin-section-title">🏆 Top usuarios</div>
        <div class="admin-table-wrap"><table class="admin-table">
          <thead><tr><th>#</th><th>Usuario</th><th>Pts</th><th>Rol</th></tr></thead>
          <tbody>${topHtml}</tbody>
        </table>
      </div>
      <div>
        <div class="admin-section-title">⏰ Horas pico (últimas 200 resp.)</div>
        <div style="padding:4px 0;">${horasPicoHtml}</div>
      </div>
    </div>
  `;
}

// ── 5. CONFIGURACIÓN ──────────────────────────
function renderAdminConfig() {
  document.getElementById('adminContent').innerHTML = `
    <div class="admin-section-title">🎖️ Rangos — puntos mínimos</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;margin-bottom:20px;">
      ${window.RANGOS.map(r => `
        <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:12px;">
          <div style="font-size:1rem;margin-bottom:4px;">${r.icon} <b>${r.label}</b></div>
          <div style="display:flex;align-items:center;gap:6px;margin-top:6px;">
            <input class="admin-inline-input" type="number" value="${r.min}" id="rango_min_${r.id}" style="width:70px;" />
            <button class="admin-btn admin-btn-blue" onclick="adminActualizarRango('${r.id}')">✔</button>
          </div>
        </div>`).join('')}
    </div>

    <div class="admin-section-title">📢 Banner de aviso global</div>
    <div style="margin-bottom:20px;">
      <p style="font-size:0.75rem;color:var(--text-3);margin-bottom:10px;">El banner aparecerá debajo de la barra de rango para todos los usuarios. Guárdalo vacío para ocultarlo.</p>
      <textarea id="adminMsgMasivo" style="width:100%;padding:10px;border:1.5px solid var(--border);border-radius:12px;font-size:0.82rem;font-family:'DM Sans',sans-serif;resize:vertical;min-height:60px;" placeholder="Texto del aviso para todos los usuarios..."></textarea>
      <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">
        <button class="admin-btn admin-btn-blue" onclick="adminEnviarMasivo()">💾 Guardar banner</button>
        <button class="admin-btn admin-btn-gray" onclick="adminBorrarBanner()">🗑 Ocultar banner</button>
        <span style="font-size:0.7rem;color:var(--text-3);align-self:center;">(Los usuarios verán un banner que pueden cerrar con ✕)</span>
      </div>
    </div>

    <div class="admin-section-title">💾 Backup de datos</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button class="admin-btn admin-btn-blue" onclick="adminBackup('json')">⬇️ Exportar JSON</button>
      <button class="admin-btn admin-btn-green" onclick="adminBackup('csv')">⬇️ Exportar CSV</button>
    </div>
  `;
}

// ── ACCIONES ──────────────────────────────────
async function adminAjustarPuntos(nick) {
  const val = parseInt(document.getElementById(`pts_${nick}`).value);
  if (isNaN(val) || val < 0) { toast('❌ Valor no válido'); return; }
  await db.from('usuarios').update({ puntos: val }).eq('nickname', nick);
  toast(`✅ Puntos de ${cap(nick)} → ${val}`);
  cargarAdminContent();
}

async function adminCambiarRol(nick) {
  const rol = document.getElementById(`rol_${nick}`).value;
  await db.from('usuarios').update({ rol }).eq('nickname', nick);
  toast(`✅ Rol de ${cap(nick)} → ${rol}`);
  cargarAdminContent();
}

async function adminBanear(nick, banear) {
  await db.from('usuarios').update({ baneado: banear }).eq('nickname', nick);
  toast(banear ? `🚫 ${cap(nick)} baneado` : `✅ ${cap(nick)} desbaneado`);
  cargarAdminContent();
}

async function adminResetCodigo(nick) {
  if (!confirm(`¿Generar nuevo código secreto para ${cap(nick)}? El anterior quedará inválido.`)) return;
  const nuevoCodigo = generarCodigo();
  await db.from('usuarios').update({ codigo_acceso: nuevoCodigo }).eq('nickname', nick);
  toast(`🔑 Nuevo código de ${cap(nick)}: ${nuevoCodigo}`, 8000);
  setTimeout(() => alert(`🔑 Nuevo código secreto de ${cap(nick)}:\n\n${nuevoCodigo}\n\nComunícaselo al usuario.`), 100);
}

async function adminFijarHilo(hiloId, fijar) {
  await db.from('hilos').update({ fijado: fijar }).eq('id', hiloId);
  toast(fijar ? '📌 Hilo fijado' : '📌 Hilo desfijado');
  cargarAdminContent();
  cargarHilos();
}

async function adminCerrarHilo(hiloId) {
  await db.from('hilos').update({ resuelto: true }).eq('id', hiloId);
  toast('🔒 Hilo cerrado');
  cargarAdminContent();
  cargarHilos();
  cargarStats();
}

async function adminEliminarHilo(hiloId) {
  if (!confirm('¿Eliminar este hilo y todas sus respuestas?')) return;
  await db.from('respuestas').delete().eq('hilo_id', hiloId);
  await db.from('hilos').delete().eq('id', hiloId);
  toast('🗑 Hilo eliminado');
  cargarAdminContent();
  cargarHilos();
  cargarStats();
}

function borrarRespuestaPropia(respId, hiloId) {
  if (!usuario) return;
  // Buscar por atributo data en vez de ID (más robusto con UUIDs)
  const replyEl = document.querySelector(`[data-reply-id="${respId}"]`) ||
                  document.getElementById(`reply_${CSS.escape(respId)}`);
  if (!replyEl) { toast('❌ No se encontró la respuesta'); return; }
  if (replyEl.querySelector('.delete-confirm-row')) return;

  const confirmRow = document.createElement('div');
  confirmRow.className = 'delete-confirm-row';
  confirmRow.style.cssText = 'display:flex;align-items:center;gap:8px;margin-top:6px;padding:8px 12px;background:#FEF2F2;border-radius:10px;border:1px solid #FECACA;';
  confirmRow.innerHTML = `
    <span style="font-size:0.78rem;color:#991B1B;flex:1;">¿Estás seguro que quieres eliminarlo?</span>
    <button class="confirm-yes" style="background:#EF4444;color:white;border:none;border-radius:999px;padding:4px 12px;font-size:0.72rem;font-weight:600;cursor:pointer;font-family:'Roboto',sans-serif;">Sí</button>
    <button class="confirm-no" style="background:var(--surface-3);color:var(--text-2);border:none;border-radius:999px;padding:4px 12px;font-size:0.72rem;font-weight:600;cursor:pointer;font-family:'Roboto',sans-serif;">No</button>
  `;

  confirmRow.querySelector('.confirm-yes').addEventListener('click', () => confirmarBorradoRespuesta(respId, hiloId));
  confirmRow.querySelector('.confirm-no').addEventListener('click', () => confirmRow.remove());
  replyEl.appendChild(confirmRow);
}

function cancelarBorradoRespuesta(respId) {
  const replyEl = document.querySelector(`[data-reply-id="${respId}"]`) ||
                  document.getElementById(`reply_${CSS.escape(respId)}`);
  if (!replyEl) return;
  const row = replyEl.querySelector('.delete-confirm-row');
  if (row) row.remove();
}

async function confirmarBorradoRespuesta(respId, hiloId) {
  if (!usuario) return;
  const { data: r } = await db.from('respuestas').select('nickname').eq('id', respId).single();
  if (!r || r.nickname !== usuario.nickname) {
    toast('❌ No puedes borrar esta respuesta');
    return;
  }
  await db.from('votos').delete().eq('respuesta_id', respId);
  await db.from('respuestas').delete().eq('id', respId);
  const { data: u } = await db.from('usuarios').select('puntos').eq('nickname', usuario.nickname).single();
  if (u) await db.from('usuarios').update({ puntos: Math.max(0, (u.puntos || 0) - 2) }).eq('nickname', usuario.nickname);
  toast('🗑 Respuesta eliminada');
  cargarRespuestas(hiloId);
  cargarTopMoviles();
}

async function adminEliminarRespuesta(respId, hiloId) {
  if (!confirm('¿Eliminar esta respuesta?')) return;
  await db.from('votos').delete().eq('respuesta_id', respId);
  await db.from('respuestas').delete().eq('id', respId);
  toast('🗑 Respuesta eliminada');
  cargarAdminContent();
  cargarRespuestas(hiloId);
  cargarTopMoviles();
}

async function adminVotoExtra(respId, nickAsesor) {
  const { data: r } = await db.from('respuestas').select('votos_util').eq('id', respId).single();
  await db.from('respuestas').update({ votos_util: (r?.votos_util || 0) + 1 }).eq('id', respId);
  const { data: u } = await db.from('usuarios').select('puntos').eq('nickname', nickAsesor).single();
  if (u) await db.from('usuarios').update({ puntos: (u.puntos || 0) + 3 }).eq('nickname', nickAsesor);
  toast(`⭐ Voto útil añadido a ${cap(nickAsesor)}`);
  cargarAdminContent();
  cargarTopMoviles();
}

function adminActualizarRango(rangoId) {
  const r = window.RANGOS.find(x => x.id === rangoId);
  if (!r) return;
  const nuevoMin = parseInt(document.getElementById(`rango_min_${rangoId}`).value);
  if (isNaN(nuevoMin) || nuevoMin < 0) { toast('❌ Valor inválido'); return; }
  r.min = nuevoMin;
  toast(`✅ Rango ${r.label} actualizado a ${nuevoMin} pts mínimos (sesión actual)`);
}

// ── ACTUALIZACIONES (CHANGELOG) ───────────────
const ACTUALIZACIONES_KEY = 'admin_actualizaciones';

async function getActualizaciones() {
  try {
    const { data } = await db.from('configuracion').select('valor').eq('clave', 'actualizaciones').single();
    if (data?.valor) return JSON.parse(data.valor);
  } catch(e) {}
  try { return JSON.parse(localStorage.getItem(ACTUALIZACIONES_KEY) || '[]'); } catch(e) { return []; }
}

async function saveActualizaciones(list) {
  const json = JSON.stringify(list);
  try {
    await db.from('configuracion').upsert({ clave: 'actualizaciones', valor: json });
  } catch(e) {
    try { localStorage.setItem(ACTUALIZACIONES_KEY, json); } catch(e2) {}
  }
  mostrarActualizacionesUsuario(list);
}

function mostrarActualizacionesUsuario(items) {
  const panel = document.getElementById('actualizacionesPanel');
  const list = document.getElementById('actualizacionesList');
  if (!panel || !list) return;
  if (!items || items.length === 0) { panel.style.display = 'none'; return; }

  const iconMap = { x: '❌', v: '✅', '?': '🔍' };
  const colorMap = {
    x:   { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
    v:   { bg: '#ECFDF5', border: '#A7F3D0', text: '#065F46' },
    '?': { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
  };

  list.innerHTML = items.map(it => {
    const c = colorMap[it.tipo] || colorMap['?'];
    const ic = iconMap[it.tipo] || '🔍';
    return `<div style="display:flex;align-items:flex-start;gap:8px;padding:7px 10px;background:${c.bg};border-radius:10px;border:1px solid ${c.border};">
      <span style="font-size:1rem;flex-shrink:0;">${ic}</span>
      <span style="font-size:0.8rem;color:${c.text};line-height:1.45;flex:1;">${it.texto}</span>
      ${it.fecha ? `<span style="font-size:0.65rem;color:var(--text-3);white-space:nowrap;align-self:center;">${it.fecha}</span>` : ''}
    </div>`;
  }).join('');

  panel.style.display = 'block';
}

async function cargarActualizacionesUsuario() {
  const items = await getActualizaciones();
  mostrarActualizacionesUsuario(items);
}

async function renderAdminActualizaciones() {
  const items = await getActualizaciones();
  const iconOpts = [
    { val: 'x', label: '❌ No funciona' },
    { val: 'v', label: '✅ Solucionado' },
    { val: '?', label: '🔍 Investigando' },
  ];

  const listaHtml = items.length === 0
    ? `<div class="admin-empty">Sin actualizaciones todavía.</div>`
    : items.map((it, i) => {
        const icon = it.tipo === 'x' ? '❌' : it.tipo === 'v' ? '✅' : '🔍';
        const color = it.tipo === 'x' ? '#991B1B' : it.tipo === 'v' ? '#065F46' : '#92400E';
        const bg = it.tipo === 'x' ? '#FEF2F2' : it.tipo === 'v' ? '#ECFDF5' : '#FFFBEB';
        const border = it.tipo === 'x' ? '#FECACA' : it.tipo === 'v' ? '#A7F3D0' : '#FDE68A';
        return `
          <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;background:${bg};border-radius:12px;margin-bottom:8px;border:1px solid ${border};">
            <span style="font-size:1.2rem;flex-shrink:0;margin-top:1px;">${icon}</span>
            <div style="flex:1;">
              <span style="font-size:0.82rem;color:${color};line-height:1.5;">${it.texto}</span>
              ${it.fecha ? `<div style="font-size:0.65rem;color:var(--text-3);margin-top:2px;">${it.fecha}</div>` : ''}
            </div>
            <button onclick="eliminarActualizacion(${i})" style="background:none;border:none;color:var(--text-3);cursor:pointer;font-size:0.85rem;padding:2px 4px;border-radius:6px;flex-shrink:0;" title="Eliminar">✕</button>
          </div>`;
      }).join('');

  document.getElementById('adminContent').innerHTML = `
    <div class="admin-section-title">📋 Registro de cambios <span style="font-size:0.7rem;font-weight:400;color:var(--text-3);">Visible para todos los usuarios bajo la barra de rango</span></div>
    <div style="margin-bottom:16px;background:var(--surface-2);border:1px solid var(--border);border-radius:14px;padding:16px;">
      <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
        ${iconOpts.map(o => `
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;font-size:0.78rem;padding:6px 12px;border-radius:999px;border:1.5px solid var(--border);background:var(--surface);">
            <input type="radio" name="tipo_act" value="${o.val}" ${o.val === 'v' ? 'checked' : ''} style="margin:0;" />
            ${o.label}
          </label>`).join('')}
      </div>
      <textarea id="actTexto" rows="2" style="width:100%;padding:10px 12px;border:1.5px solid var(--border);border-radius:12px;font-size:0.82rem;font-family:'DM Sans',sans-serif;resize:vertical;background:var(--surface);" placeholder="Describe el cambio, error o novedad..."></textarea>
      <button class="admin-btn admin-btn-blue" onclick="añadirActualizacion()" style="margin-top:10px;">➕ Añadir entrada</button>
    </div>
    <div id="actLista">${listaHtml}</div>
  `;
}

async function añadirActualizacion() {
  const tipo = document.querySelector('input[name="tipo_act"]:checked')?.value || 'v';
  const texto = document.getElementById('actTexto')?.value?.trim();
  if (!texto) { toast('❌ Escribe el texto del cambio'); return; }
  const list = await getActualizaciones();
  list.unshift({ tipo, texto, fecha: new Date().toLocaleDateString('es-ES') });
  await saveActualizaciones(list);
  toast('✅ Entrada añadida y visible para usuarios');
  renderAdminActualizaciones();
}

async function eliminarActualizacion(idx) {
  const list = await getActualizaciones();
  list.splice(idx, 1);
  await saveActualizaciones(list);
  renderAdminActualizaciones();
}

async function adminEnviarMasivo() {
  const msg = document.getElementById('adminMsgMasivo').value.trim();
  if (!msg) { toast('❌ Escribe un mensaje'); return; }
  try {
    await db.from('configuracion').upsert({ clave: 'mensaje_masivo', valor: msg });
    toast('✅ Banner guardado — visible para todos al cargar');
    mostrarBannerGlobal(msg);
  } catch(e) {
    try { localStorage.setItem('banner_global', msg); } catch(e2) {}
    mostrarBannerGlobal(msg);
    toast('✅ Banner activado');
  }
}

async function adminBorrarBanner() {
  try { await db.from('configuracion').upsert({ clave: 'mensaje_masivo', valor: '' }); } catch(e) {}
  try { localStorage.removeItem('banner_global'); } catch(e) {}
  ocultarBannerGlobal();
  toast('🗑 Banner ocultado');
}

function mostrarBannerGlobal(msg) {
  const wrap = document.getElementById('globalBannerWrap');
  const banner = document.getElementById('globalBanner');
  const collapsed = document.getElementById('globalBannerCollapsed');
  if (!wrap || !banner || !collapsed) return;
  const escaped = msg.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  banner.querySelector('#globalBannerText').innerHTML = escaped.replace(/\n/g, '<br>');
  wrap.style.display = 'block';
  // Comienza colapsado por defecto; se expande solo si el usuario lo abrió explícitamente
  let expandido = false;
  try { expandido = sessionStorage.getItem('banner_expandido') === '1'; } catch(e) {}
  if (expandido) {
    banner.style.display = 'flex';
    collapsed.style.display = 'none';
  } else {
    banner.style.display = 'none';
    collapsed.style.display = 'flex';
  }
}

function ocultarBannerGlobal() {
  const banner = document.getElementById('globalBanner');
  const collapsed = document.getElementById('globalBannerCollapsed');
  if (banner) banner.style.display = 'none';
  if (collapsed) collapsed.style.display = 'flex';
  try { sessionStorage.removeItem('banner_expandido'); } catch(e) {}
}

function expandirBannerGlobal() {
  const banner = document.getElementById('globalBanner');
  const collapsed = document.getElementById('globalBannerCollapsed');
  if (banner) banner.style.display = 'flex';
  if (collapsed) collapsed.style.display = 'none';
  try { sessionStorage.setItem('banner_expandido', '1'); } catch(e) {}
}

async function cargarBannerGlobal() {
  let msg = '';
  try {
    const { data } = await db.from('configuracion').select('valor').eq('clave', 'mensaje_masivo').single();
    if (data?.valor) msg = data.valor;
  } catch(e) {}
  if (!msg) {
    try { msg = localStorage.getItem('banner_global') || ''; } catch(e) {}
  }
  if (msg) mostrarBannerGlobal(msg);
}

const NOTICIA_CAT_LABELS = {
  rumor: 'Rumor',
  oficial: 'Oficial',
  analisis: 'Análisis',
  comunidad: 'Comunidad'
};

// ═══════════════════════════════════════════
// BACKUP
// ═══════════════════════════════════════════

async function adminBackup(formato) {
  const [{ data: hilos }, { data: usuarios }, { data: respuestas }] = await Promise.all([
    db.from('hilos').select('*'),
    db.from('usuarios').select('nickname,puntos,rol,created_at'),
    db.from('respuestas').select('*'),
  ]);

  let contenido, tipo, ext;

  if (formato === 'json') {
    contenido = JSON.stringify({ hilos, usuarios, respuestas }, null, 2);
    tipo = 'application/json';
    ext = 'json';
  } else {
    const cabecera = 'nickname,puntos,rol,created_at';
    const filas = (usuarios || []).map(u => `${u.nickname},${u.puntos||0},${u.rol},${u.created_at||''}`);
    contenido = [cabecera, ...filas].join('\n');
    tipo = 'text/csv';
    ext = 'csv';
  }

  const blob = new Blob([contenido], { type: tipo });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_movilweb_${new Date().toISOString().slice(0,10)}.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
  toast(`⬇️ Backup ${ext.toUpperCase()} descargado`);
}

// ═══════════════════════════════════════════
// TOP MÓVILES - Función principal
// ═══════════════════════════════════════════

async function cargarTopMoviles() {
  const listContainer = document.getElementById('topMovilesList');
  if (!listContainer) return;
  
  listContainer.innerHTML = '<div class="loading">⏳ Analizando recomendaciones de la comunidad...</div>';
  
  // Obtener filtro de presupuesto
  const presupuestoInput = document.getElementById('topPresupuestoFiltro');
  let presupuestoFiltro = null;
  if (presupuestoInput && presupuestoInput.value) {
    presupuestoFiltro = parseInt(presupuestoInput.value);
    if (isNaN(presupuestoFiltro)) presupuestoFiltro = null;
  }
  
  // Obtener hilos con respuestas
  const { data: hilosConRespuestas, error: hilosError } = await db
    .from('hilos')
    .select(`
      id,
      presupuesto,
      created_at,
      respuestas ( 
        id,
        contenido,
        movil_nombre,
        votos_util,
        created_at,
        nickname
      )
    `)
    .not('respuestas', 'is', null);
  
  if (hilosError || !hilosConRespuestas) {
    listContainer.innerHTML = '<div class="empty-state">❌ No se pudo cargar el ranking de móviles.</div>';
    return;
  }
  
  // Procesar cada respuesta
  const recomendacionesPonderadas = [];
  
  for (const hilo of hilosConRespuestas) {
    // Filtrar por presupuesto si se especifica
    if (presupuestoFiltro && hilo.presupuesto) {
      const presupuestoHilo = parseInt(hilo.presupuesto);
      if (!isNaN(presupuestoHilo) && Math.abs(presupuestoHilo - presupuestoFiltro) > 100) {
        continue; // Ignorar hilos fuera del rango de presupuesto
      }
    }
    
    for (const respuesta of hilo.respuestas) {
      // Extraer nombre del móvil
      let nombreMovil = respuesta.movil_nombre;
      if (!nombreMovil) {
        const modelosExtraidos = extraerModelos(respuesta.contenido);
        if (modelosExtraidos.length > 0) nombreMovil = modelosExtraidos[0];
      }
      if (!nombreMovil) continue;
      
      // Calcular puntuación ponderada por antigüedad
      const votos = respuesta.votos_util || 0;
      const fechaRespuesta = new Date(respuesta.created_at);
      const diasAntiguedad = (Date.now() - fechaRespuesta.getTime()) / (1000 * 3600 * 24);
      
      let factorActualidad = 1.0;
      if (diasAntiguedad > 60) factorActualidad = 0.3;
      else if (diasAntiguedad > 30) factorActualidad = 0.6;
      else if (diasAntiguedad > 14) factorActualidad = 0.8;
      else if (diasAntiguedad > 7) factorActualidad = 0.9;
      
      const score = votos * factorActualidad;
      
      if (score > 0 || votos > 0) {
        recomendacionesPonderadas.push({
          nombre: formatearModelo(nombreMovil),
          score: score,
          votos: votos,
          hace: timeAgo(respuesta.created_at),
          recomendadoPor: respuesta.nickname,
        });
      }
    }
  }
  
  // Agrupar por nombre de móvil y sumar scores
  const mapaMoviles = new Map();
  for (const rec of recomendacionesPonderadas) {
    const nombreLimpio = rec.nombre.toLowerCase();
    if (mapaMoviles.has(nombreLimpio)) {
      const existing = mapaMoviles.get(nombreLimpio);
      existing.score += rec.score;
      existing.votos += rec.votos;
    } else {
      mapaMoviles.set(nombreLimpio, { ...rec });
    }
  }
  
  // Ordenar y tomar top 5
  let topMoviles = Array.from(mapaMoviles.values());
  topMoviles.sort((a, b) => b.score - a.score);
  topMoviles = topMoviles.slice(0, 3);
  
  // Renderizar
  if (topMoviles.length === 0) {
    listContainer.innerHTML = '<div class="empty-state">🤷‍♂️ No hay móviles recomendados con suficientes votos.</div>';
    return;
  }
  
  let rankingHtml = '';
  for (let i = 0; i < topMoviles.length; i++) {
    const m = topMoviles[i];
    const medalla = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '📱';
    rankingHtml += `
      <div class="top-moviles-item">
        <div class="top-moviles-rank">${medalla}</div>
        <div class="top-moviles-info">
          <div class="top-moviles-name">${m.nombre}</div>
          <div class="top-moviles-stats">👍 ${m.votos} votos · ${m.hace}</div>
        </div>
        <div class="top-moviles-score">
          <div class="top-moviles-score-value">${Math.round(m.score * 10) / 10}</div>
          <div class="top-moviles-score-label">puntos</div>
        </div>
      </div>
    `;
  }
  
  listContainer.innerHTML = rankingHtml;
  // Update mini rank bar with #1 mobile
  if (topMoviles.length > 0) actualizarMiniRankBar(topMoviles[0].nombre, null);
}

// Función para ocultar/mostrar el TOP de móviles
function toggleTopMoviles() {
  const content = document.getElementById('topMovilesContent');
  const btn = document.getElementById('topToggleBtn');
  
  if (topMovilesVisible) {
    content.classList.add('collapsed');
    btn.innerHTML = '▸';
    topMovilesVisible = false;
    localStorage.setItem('topMovilesOculto', 'true');
  } else {
    content.classList.remove('collapsed');
    btn.innerHTML = '▾';
    topMovilesVisible = true;
    localStorage.setItem('topMovilesOculto', 'false');
  }
}

// Restaurar estado del TOP al cargar
function restaurarEstadoTop() {
  const oculto = localStorage.getItem('topMovilesOculto');
  if (oculto === 'true') {
    topMovilesVisible = false;
    const content = document.getElementById('topMovilesContent');
    const btn = document.getElementById('topToggleBtn');
    if (content) content.classList.add('collapsed');
    if (btn) btn.innerHTML = '▸';
  }
}

// ═══════════════════════════════════════════
// BOTTOM NAV SYNC
// ═══════════════════════════════════════════
function syncBnav(tab) {
  document.querySelectorAll('.bnav-btn').forEach(b => b.classList.remove('active'));
  // Map tab names to button IDs
  const tabToBtn = {
    'abiertas': 'bnav_abiertas',
    'sin_responder': 'bnav_sin_responder',
    'foro': 'bnav_foro',
    'mis_abiertas': 'bnav_mis_abiertas',
    'mis_cerradas': 'bnav_mis_abiertas', // fallback
    'noticias': 'bnav_noticias',
  };
  const btnId = tabToBtn[tab] || `bnav_${tab}`;
  const el = document.getElementById(btnId);
  if (el) el.classList.add('active');
}

function scrollToTopMoviles() {
  const el = document.getElementById('topMovilesSection');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToTopUsuarios() {
  const el = document.getElementById('topUsuariosSection');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function actualizarMiniRankBar(topMovil, topUsuario) {
  if (topMovil !== null) {
    const movilEl = document.getElementById('miniTopMovil');
    if (movilEl) movilEl.textContent = topMovil;
  }
  if (topUsuario !== null) {
    const usuarioEl = document.getElementById('miniTopUsuario');
    const usuarioPtsEl = document.getElementById('miniTopUsuarioPts');
    if (usuarioEl) usuarioEl.textContent = cap(topUsuario.nickname);
    if (usuarioPtsEl) usuarioPtsEl.textContent = `${topUsuario.puntos || 0} pts`;
  }
}

// ═══════════════════════════════════════════
// TOP RANKING USUARIOS
// ═══════════════════════════════════════════
let topUsuariosVisible = true;

async function cargarTopUsuarios() {
  const listEl = document.getElementById('topUsuariosList');
  if (!listEl) return;

  const { data: usuarios, error } = await db
    .from('usuarios')
    .select('nickname, puntos, rol, foto_url')
    .order('puntos', { ascending: false })
    .limit(5);

  if (error || !usuarios || usuarios.length === 0) {
    listEl.innerHTML = '<div class="empty-state" style="padding:20px;">No hay usuarios aún.</div>';
    return;
  }

  let html = '';
  for (let i = 0; i < usuarios.length; i++) {
    const u = usuarios[i];
    const medalla = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}º`;
    const rango = getRango(u.puntos || 0, u.rol);
    const ac = avatarColor(u.nickname);
    const nombre = cap(u.nickname);
    html += `
      <div class="top-usuarios-item">
        <div class="top-usuarios-rank">${medalla}</div>
        ${renderAvatar(u.nickname, u.foto_url||null, 'top-usuarios-avatar', 36)}
        <div class="top-usuarios-info" style="cursor:pointer;" onclick="abrirPerfil('${u.nickname}')">
          <div class="top-usuarios-name">${nombre}${u.rol === 'admin' ? ' 👑' : ''}</div>
          <div class="top-usuarios-badge">${rango.icon} ${rango.label}</div>
        </div>
        <div class="top-usuarios-score">
          <div class="top-usuarios-score-value">${u.puntos || 0}</div>
          <div class="top-usuarios-score-label">puntos</div>
        </div>
      </div>
    `;
  }
  listEl.innerHTML = html;
  // Update mini rank bar
  if (usuarios.length > 0) actualizarMiniRankBar(null, usuarios[0]);
}

function toggleTopUsuarios() {
  const content = document.getElementById('topUsuariosContent');
  const btn = document.getElementById('topUsuariosToggleBtn');
  topUsuariosVisible = !topUsuariosVisible;
  if (topUsuariosVisible) {
    content.classList.remove('collapsed');
    btn.innerHTML = '▾';
  } else {
    content.classList.add('collapsed');
    btn.innerHTML = '▸';
  }
}

// ═══════════════════════════════════════════
// FORO
// ═══════════════════════════════════════════
const FORUM_CATS = {
  android: { name: 'Foro Android', icon: '🤖' },
  ios: { name: 'Foro iOS', icon: '🍎' },
  personalizacion: { name: 'Personalización', icon: '🎨' },
  apps: { name: 'Apps y juegos', icon: '📲' },
  ayuda: { name: 'Foro Ayuda', icon: '🆘' },
};
let forumCatActual = null;
let forumPostActual = null;

function mostrarForumCats(pushHistory = true) {
  document.getElementById('forumCats').style.display = 'block';
  document.getElementById('forumThreadArea').classList.remove('open');
  document.getElementById('forumDetailArea').classList.remove('open');
  if (pushHistory) spaPush({ tab: 'foro' });
}

function volverForumCats() {
  mostrarForumCats();
  forumPostActual = null;
}

function volverForumHilos() {
  document.getElementById('forumDetailArea').classList.remove('open');
  document.getElementById('forumThreadArea').classList.add('open');
  forumPostActual = null;
}

async function cargarContadoresForo() {
  for (const cat of Object.keys(FORUM_CATS)) {
    const { count } = await db.from('foro_posts')
      .select('id', { count: 'exact', head: true })
      .eq('categoria', cat);
    const el = document.getElementById(`fcat_count_${cat}`);
    if (el) el.textContent = (count || 0) + ' posts';
  }
}

async function abrirCategoria(cat, pushHistory = true) {
  forumCatActual = cat;
  const catInfo = FORUM_CATS[cat];
  document.getElementById('forumCats').style.display = 'none';
  document.getElementById('forumDetailArea').classList.remove('open');
  document.getElementById('forumThreadArea').classList.add('open');
  document.getElementById('forumCatTitle').textContent = `${catInfo.icon} ${catInfo.name}`;
  document.getElementById('forumPostList').innerHTML = '<div class="loading">⏳ Cargando...</div>';
  if (pushHistory) spaPush({ tab: 'foro', cat });

  const { data: posts, error } = await db.from('foro_posts')
    .select('*, foro_replies(count)')
    .eq('categoria', cat)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    document.getElementById('forumPostList').innerHTML = '<div class="empty-state">❌ Error cargando posts. ¿Está la tabla creada en Supabase?</div>';
    return;
  }

  if (!posts || posts.length === 0) {
    document.getElementById('forumPostList').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">${catInfo.icon}</div>
        <div>Sé el primero en publicar en ${catInfo.name}</div>
      </div>`;
    return;
  }

  let html = `
    <div class="fc-thread-header-row">
      <div class="fc-thread-header-title">Tema</div>
      <div class="fc-thread-header-right">Resp. / Última</div>
    </div>`;
  for (const p of posts) {
    const nombre = cap(p.nickname);
    const replies = p.foro_replies?.[0]?.count || 0;
    const preview = (p.contenido || '').replace(/\[cite:[^\]]*\][\s\S]*?\[\/cite\]/g,'').replace(/<[^>]*>/g,'').trim().substring(0, 80);
    html += `
      <div class="fc-thread-row" onclick="abrirPost('${p.id}')">
        <div class="fc-thread-icon">
          <div class="fc-thread-envelope${p.pinned ? ' pinned' : ''}"></div>
        </div>
        <div class="fc-thread-body">
          <div class="fc-thread-title-text">${p.pinned ? '<span class="fc-pin-badge">📌 Fijado</span>' : ''}${escHtml(p.titulo)}</div>
          <div class="fc-thread-meta-row">
            <span class="fc-thread-author">@${nombre}</span>
            ${preview ? `<span class="fc-thread-preview">· ${escHtml(preview)}</span>` : ''}
          </div>
        </div>
        <div class="fc-thread-right">
          <span class="fc-thread-replies">💬 ${replies}</span>
          <span class="fc-thread-time">${timeAgo(p.created_at)}</span>
        </div>
      </div>
    `;
  }
  document.getElementById('forumPostList').innerHTML = html;
}

async function abrirPost(postId, pushHistory = true) {
  forumPostActual = postId;
  fcMultiCitas = [];
  actualizarBarraMulticita();
  document.getElementById('forumThreadArea').classList.remove('open');
  const detailArea = document.getElementById('forumDetailArea');
  detailArea.classList.add('open');
  document.getElementById('forumDetailContent').innerHTML = '<div class="loading" style="padding:20px;">⏳ Cargando...</div>';
  document.getElementById('forumRepliesSection').innerHTML = '';
  document.getElementById('forumReplyBox').style.display = 'none';
  if (pushHistory) spaPush({ tab: 'foro', cat: forumCatActual || '', post: postId });

  const { data: post, error } = await db.from('foro_posts').select('*').eq('id', postId).single();
  if (error || !post) {
    document.getElementById('forumDetailContent').innerHTML = '<div class="empty-state">❌ Post no encontrado</div>';
    return;
  }

  const ac = avatarColor(post.nickname);
  const nombre = cap(post.nickname);
  const catInfo = FORUM_CATS[post.categoria] || { icon: '💬', name: post.categoria };
  const { data: uPost } = await db.from('usuarios').select('puntos,rol,foto_url').eq('nickname', post.nickname).single();
  const rangoPost = getRango(uPost?.puntos || 0, uPost?.rol || 'usuario');

  const esAutor = usuario && usuario.nickname === post.nickname;
  const esAdmin = usuario && (usuario.rol === 'admin' || usuario.nickname === 'dastan');
  const contenidoSafe = (post.contenido || '').replace(/`/g,"'").replace(/\\/g,'');

  const accionesPost = usuario ? `
    <input type="checkbox" class="fc-multicita-check" id="fc_check_${post.id}" onclick="toggleCitaPost('${escHtml(nombre)}', \`${contenidoSafe.substring(0,200)}\`, '${post.id}')">
    <button class="fc-action-btn" onclick="citarPostForo('${escHtml(nombre)}', \`${contenidoSafe}\`)">💬 Citar</button>
    <button class="fc-action-btn" onclick="mencionarEnForo('${escHtml(post.nickname)}')">@</button>
    ${(esAutor || esAdmin) ? `<button class="fc-action-btn" onclick="editarPostForo('${post.id}')">✏️ Editar</button>` : ''}
    ${(esAutor || esAdmin) ? `<button class="fc-action-btn danger" onclick="borrarPostForo('${post.id}')">🗑</button>` : ''}
    <button class="fc-action-btn" onclick="reportarPostForo('${post.id}')" title="Reportar">⚠️</button>
  ` : '';

  document.getElementById('forumDetailContent').innerHTML = `
    <div class="fc-thread-container">
      <div class="fc-thread-title-bar">${catInfo.icon} ${escHtml(post.titulo)}</div>
      <div class="fc-post">
        <div class="fc-post-body">
          <div class="fc-post-header">
            ${renderAvatar(post.nickname, uPost?.foto_url||null, 'fc-post-avatar-inline', 28)}
            <span class="fc-post-nick-inline nick-link" onclick="abrirPerfil('${post.nickname}')">${nombre}</span>
            <span class="fc-post-rank-inline rank-${rangoPost.id}">${rangoPost.icon} ${rangoPost.label}</span>
            <span class="fc-post-time">${timeAgo(post.created_at)}</span>
            <span class="fc-post-num">#1</span>
          </div>
          <div class="fc-post-content">${renderForumContent(post.contenido || '')}</div>
          <div class="fc-post-actions-top">${accionesPost}</div>
        </div>
      </div>
    </div>
  `;

  await cargarRespuestasForo(postId);
  if (usuario) document.getElementById('forumReplyBox').style.display = 'block';
}

async function cargarRespuestasForo(postId) {
  const { data: replies } = await db.from('foro_replies')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  const el = document.getElementById('forumRepliesSection');
  if (!replies || replies.length === 0) {
    el.innerHTML = '<div style="padding:14px 0 8px;color:var(--text-3);font-size:13px;">Sin respuestas aún. ¡Sé el primero!</div>';
    return;
  }

  let html = `<div style="font-family:'Roboto',sans-serif;font-weight:700;font-size:13px;color:var(--navy);margin:10px 0 4px;">💬 ${replies.length} respuesta${replies.length > 1 ? 's' : ''}</div>`;
  html += `<div class="fc-thread-container">`;

  for (let i = 0; i < replies.length; i++) {
    const r = replies[i];
    const ac = avatarColor(r.nickname);
    const nombre = cap(r.nickname);
    const { data: uData } = await db.from('usuarios').select('puntos,rol,foto_url').eq('nickname', r.nickname).single();
    const rango = getRango(uData?.puntos || 0, uData?.rol || 'usuario');
    const contenidoHtml = renderForumContent(r.contenido || '');
    const contenidoSafe = (r.contenido || '').replace(/`/g,"'").replace(/\\/g,'');

    const esAutor = usuario && usuario.nickname === r.nickname;
    const esAdmin = usuario && (usuario.rol === 'admin' || usuario.nickname === 'dastan');

    const acciones = usuario ? `
      <input type="checkbox" class="fc-multicita-check" id="fc_check_${r.id}" onclick="toggleCitaPost('${escHtml(nombre)}', \`${contenidoSafe.substring(0,200)}\`, '${r.id}')">
      <button class="fc-action-btn" onclick="citarPostForo('${escHtml(nombre)}', \`${contenidoSafe}\`)">💬 Citar</button>
      <button class="fc-action-btn" onclick="mencionarEnForo('${escHtml(r.nickname)}')">@</button>
      ${(esAutor || esAdmin) ? `<button class="fc-action-btn" onclick="editarRespuestaForo('${r.id}')">✏️ Editar</button>` : ''}
      ${(esAutor || esAdmin) ? `<button class="fc-action-btn danger" onclick="borrarRespuestaForo('${r.id}')">🗑</button>` : ''}
      <button class="fc-action-btn" onclick="reportarPostForo('${r.id}')" title="Reportar">⚠️</button>
    ` : '';

    html += `
      <div class="fc-post" id="fcpost_${r.id}">
        <div class="fc-post-body">
          <div class="fc-post-header">
            ${renderAvatar(r.nickname, uData?.foto_url||null, 'fc-post-avatar-inline', 28)}
            <span class="fc-post-nick-inline nick-link" onclick="abrirPerfil('${r.nickname}')">${nombre}</span>
            <span class="fc-post-rank-inline rank-${rango.id}">${rango.icon} ${rango.label}</span>
            <span class="fc-post-time">${timeAgo(r.created_at)}</span>
            <span class="fc-post-num">#${i + 2}</span>
          </div>
          <div class="fc-post-content">${contenidoHtml}</div>
          <div class="fc-post-actions-top">${acciones}</div>
        </div>
      </div>`;
  }
  html += `</div>`;
  el.innerHTML = html;
}

function getTextFromContentEditable(el) {
  // Recorre el DOM del contenteditable preservando saltos de línea
  // que el navegador inserta como <br> o <div> al pulsar Enter
  let result = '';
  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toUpperCase();
      if (tag === 'BR') {
        result += '\n';
      } else {
        const isBlock = ['DIV','P','LI','BLOCKQUOTE'].includes(tag);
        // Añadir salto antes del bloque si ya hay contenido (no el primero)
        if (isBlock && result && !result.endsWith('\n')) result += '\n';
        node.childNodes.forEach(walk);
        if (isBlock && !result.endsWith('\n')) result += '\n';
      }
    }
  }
  el.childNodes.forEach(walk);
  // Eliminar salto de línea final extra
  return result.replace(/\n$/, '');
}

function renderForumContent(text) {
  if (!text) return '';
  let html = text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  // Citas anidadas [cite:autor]...[/cite]
  html = html.replace(/\[cite:([^\]]+)\]([\s\S]*?)\[\/cite\]/g, (_,autor,cuerpo) =>
    `<div class="fc-quote"><div class="fc-quote-from">${escHtml(autor)} dijo:</div><div class="fc-quote-body">${cuerpo}</div></div>`);
  // @menciones
  html = html.replace(/@([\w\-\.]+)/g, '<span style="color:var(--blue);font-weight:600;">@$1</span>');
  // Saltos de línea
  return html.replace(/\n/g,'<br>');
}

async function enviarRespuestaForo() {
  if (!usuario) { toast('❌ Inicia sesión para responder'); return; }
  if (!forumPostActual) return;

  const input = document.getElementById('forumReplyInput');
  let texto = '';
  if (input && input.tagName === 'DIV') {
    const rawText = getTextFromContentEditable(input).trim();
    if (fcCitaActiva) {
      if (fcCitaActiva.isMulti) {
        // Multicita: el contenido ya viene formateado
        texto = `${fcCitaActiva.contenido}\n${rawText}`;
      } else {
        texto = `[cite:${fcCitaActiva.nickname}]${fcCitaActiva.contenido.substring(0,200)}[/cite]\n${rawText}`;
      }
    } else {
      texto = rawText;
    }
    if (!texto.trim()) { toast('❌ Escribe algo'); return; }
    input.innerHTML = '';
  } else if (input) {
    texto = input.value.trim();
    if (!texto) { toast('❌ Escribe algo'); return; }
    input.value = '';
  }

  const { error } = await db.from('foro_replies').insert({
    post_id: forumPostActual,
    nickname: usuario.nickname,
    contenido: texto,
  });

  if (error) { toast('❌ Error: ' + error.message); return; }
  clearForumCita();
  toast('✅ Respuesta publicada');
  await cargarRespuestasForo(forumPostActual);
}

// ── EDITAR / BORRAR POST DEL FORO ──────────────
async function editarPostForo(postId) {
  const { data: post } = await db.from('foro_posts').select('titulo,contenido').eq('id', postId).single();
  if (!post) return;
  const modalHtml = `
    <div class="fc-newpost-overlay" id="editForumPostModal" onclick="if(event.target===this)this.remove()">
      <div class="fc-newpost-sheet">
        <div class="fc-newpost-handle"></div>
        <div class="fc-newpost-header">
          <span class="fc-newpost-title">✏️ Editar post</span>
          <button class="fc-newpost-close" onclick="document.getElementById('editForumPostModal').remove()">✕</button>
        </div>
        <input class="fc-newpost-input" type="text" id="editForumTitulo" value="${escHtml(post.titulo)}" maxlength="200" />
        <textarea class="fc-newpost-textarea" id="editForumContenido" rows="5">${escHtml(post.contenido)}</textarea>
        <div class="fc-newpost-actions">
          <button class="fc-newpost-publish" onclick="guardarEdicionPostForo('${postId}')">Guardar cambios</button>
          <button class="fc-newpost-cancel" onclick="document.getElementById('editForumPostModal').remove()">Cancelar</button>
        </div>
      </div>
    </div>`;
  const old = document.getElementById('editForumPostModal');
  if (old) old.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

async function guardarEdicionPostForo(postId) {
  const titulo = (document.getElementById('editForumTitulo').value || '').trim();
  const contenido = (document.getElementById('editForumContenido').value || '').trim();
  if (!titulo || !contenido) { toast('❌ Título y contenido son obligatorios'); return; }
  const { error } = await db.from('foro_posts').update({ titulo, contenido }).eq('id', postId);
  if (error) { toast('❌ Error: ' + error.message); return; }
  toast('✅ Post editado');
  document.getElementById('editForumPostModal')?.remove();
  await abrirPost(postId);
}

async function borrarPostForo(postId) {
  if (!confirm('¿Borrar este post permanentemente? Se eliminarán también todas sus respuestas.')) return;
  await db.from('foro_replies').delete().eq('post_id', postId);
  const { error } = await db.from('foro_posts').delete().eq('id', postId);
  if (error) { toast('❌ Error: ' + error.message); return; }
  toast('🗑 Post borrado');
  volverForumHilos();
  await abrirCategoria(forumCatActual);
}

// ── EDITAR / BORRAR RESPUESTA DEL FORO ──────────
async function editarRespuestaForo(replyId) {
  const { data: r } = await db.from('foro_replies').select('contenido').eq('id', replyId).single();
  if (!r) return;
  const modalHtml = `
    <div class="fc-newpost-overlay" id="editForumReplyModal" onclick="if(event.target===this)this.remove()">
      <div class="fc-newpost-sheet">
        <div class="fc-newpost-handle"></div>
        <div class="fc-newpost-header">
          <span class="fc-newpost-title">✏️ Editar respuesta</span>
          <button class="fc-newpost-close" onclick="document.getElementById('editForumReplyModal').remove()">✕</button>
        </div>
        <textarea class="fc-newpost-textarea" id="editForumReplyContenido" rows="6" style="min-height:140px;">${escHtml(r.contenido)}</textarea>
        <div class="fc-newpost-actions">
          <button class="fc-newpost-cancel" onclick="document.getElementById('editForumReplyModal').remove()">Cancelar</button>
          <button class="fc-newpost-publish" onclick="guardarEdicionRespuestaForo('${replyId}')">Guardar</button>
        </div>
      </div>
    </div>`;
  const old = document.getElementById('editForumReplyModal');
  if (old) old.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

async function guardarEdicionRespuestaForo(replyId) {
  const contenido = (document.getElementById('editForumReplyContenido').value || '').trim();
  if (!contenido) { toast('❌ No puede estar vacío'); return; }
  const { error } = await db.from('foro_replies').update({ contenido }).eq('id', replyId);
  if (error) { toast('❌ Error: ' + error.message); return; }
  toast('✅ Respuesta editada');
  document.getElementById('editForumReplyModal')?.remove();
  await cargarRespuestasForo(forumPostActual);
}

async function borrarRespuestaForo(replyId) {
  if (!confirm('¿Borrar esta respuesta?')) return;
  const { error } = await db.from('foro_replies').delete().eq('id', replyId);
  if (error) { toast('❌ Error: ' + error.message); return; }
  toast('🗑 Respuesta borrada');
  await cargarRespuestasForo(forumPostActual);
}

async function reportarPostForo(id) {
  if (!usuario) { toast('⚠️ Debes iniciar sesión para reportar'); return; }
  try {
    await db.from('foro_reports').insert({
      post_id: id,
      reporter_nickname: usuario.nickname,
      created_at: new Date().toISOString()
    });
  } catch(e) {
    // Si la tabla no existe, guardar en configuracion como fallback
    try {
      const { data: existing } = await db.from('configuracion').select('valor').eq('clave', 'reportes').single();
      const lista = existing?.valor ? JSON.parse(existing.valor) : [];
      lista.push({ id, reporter: usuario.nickname, ts: new Date().toISOString() });
      await db.from('configuracion').upsert({ clave: 'reportes', valor: JSON.stringify(lista) });
    } catch(e2) {}
  }
  toast('⚠️ Reportado. El equipo lo revisará en breve.');
}

function abrirNuevoPostForo() {
  if (!usuario) { mostrarModalAuth(); return; }
  if (!forumCatActual) return;

  const catInfo = FORUM_CATS[forumCatActual];
  const warning = forumCatActual === 'apps' ? `
    <div class="forum-warning">⚠️ <strong>Recuerda:</strong> No se permite hablar de piratería ni apps de fuentes no oficiales.</div>` : '';

  const modalHtml = `
    <div class="fc-newpost-overlay" id="forumNewPostModal" onclick="if(event.target===this)cerrarNuevoPostForo()">
      <div class="fc-newpost-sheet">
        <div class="fc-newpost-handle"></div>
        <div class="fc-newpost-header">
          <span class="fc-newpost-title">${catInfo.icon} Nuevo post en ${catInfo.name}</span>
          <button class="fc-newpost-close" onclick="cerrarNuevoPostForo()">✕</button>
        </div>
        ${warning}
        <input class="fc-newpost-input" type="text" id="forumPostTitulo" placeholder="Título del post" maxlength="200" />
        <textarea class="fc-newpost-textarea" id="forumPostContenido" rows="5" placeholder="Describe tu consulta, opinión o tema..."></textarea>
        <div class="fc-newpost-actions">
          <button class="fc-newpost-publish" onclick="publicarPostForo()">ENVIAR NUEVO TEMA</button>
          <button class="fc-newpost-cancel" onclick="cerrarNuevoPostForo()">VISTA PREVIA DE MENSAJE</button>
        </div>
      </div>
    </div>
  `;
  const old = document.getElementById('forumNewPostModal');
  if (old) old.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function cerrarNuevoPostForo() {
  const m = document.getElementById('forumNewPostModal');
  if (m) m.remove();
}

async function publicarPostForo() {
  if (!usuario || !forumCatActual) return;
  const titulo = (document.getElementById('forumPostTitulo').value || '').trim();
  const contenido = (document.getElementById('forumPostContenido').value || '').trim();
  if (!titulo) { toast('❌ El título es obligatorio'); return; }
  if (!contenido) { toast('❌ Escribe el contenido'); return; }

  const { error } = await db.from('foro_posts').insert({
    categoria: forumCatActual,
    titulo,
    contenido,
    nickname: usuario.nickname,
    pinned: false,
  });

  if (error) { toast('❌ Error: ' + error.message + ' — ¿Está la tabla foro_posts creada?'); return; }
  toast('✅ Post publicado');
  cerrarNuevoPostForo();
  await abrirCategoria(forumCatActual);
  await cargarContadoresForo();
}

function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── BNAV NUEVA CONTEXTUAL ───────────────────
function bnavNueva() {
  if (tabActual === 'foro') {
    abrirNuevoPostForo();
  } else {
    abrirForm();
  }
}

// Update bnav nueva label based on context
function actualizarBnavNueva() {
  const icon = document.getElementById('bnavNuevaIcon');
  const label = document.getElementById('bnavNuevaLabel');
  if (!icon || !label) return;
  if (tabActual === 'foro') {
    icon.textContent = '✏️';
    label.textContent = 'Nuevo post';
  } else {
    icon.textContent = '✏️';
    label.textContent = 'Nueva';
  }
}

// ═══════════════════════════════════════════
// HAMBURGER DRAWER
// ═══════════════════════════════════════════
function toggleSideDrawer() {
  const drawer = document.getElementById('sideDrawer');
  const overlay = document.getElementById('drawerOverlay');
  drawer.classList.toggle('open');
  overlay.classList.toggle('open');
}
function closeSideDrawer() {
  document.getElementById('sideDrawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
}

// ═══════════════════════════════════════════
// MODALES RANGOS / TOP USUARIOS / TOP MÓVILES
// ═══════════════════════════════════════════
function abrirModalRangos() {
  document.getElementById('modalRangos').classList.add('open');
  // Render rangos en el modal
  const grid = document.getElementById('modalRanksGrid');
  if (!grid) return;
  const pts = usuario?.puntos || 0;
  const rol = usuario?.rol || 'usuario';
  const rangoActual = getRango(pts, rol);
  grid.innerHTML = RANGOS.map(r => {
    const unlocked = pts >= r.min || rol === 'admin';
    const current = rangoActual.id === r.id;
    return `
      <div class="rank-card ${unlocked ? 'unlocked' : ''} ${current ? 'current' : ''}">
        <div class="rank-card-icon">${r.icon}</div>
        <div class="rank-card-name">${r.label}</div>
        <div class="rank-card-pts">${r.min === 0 ? '0 pts' : `${r.min}+ pts`}</div>
        <div class="rank-card-perk ${!unlocked ? 'locked' : ''}">${r.perk}</div>
      </div>`;
  }).join('');
}
function cerrarModalRangos() { document.getElementById('modalRangos').classList.remove('open'); }

async function abrirModalTopUsuarios() {
  document.getElementById('modalTopUsuarios').classList.add('open');
  const body = document.getElementById('modalTopUsuariosBody');
  body.innerHTML = '<div class="loading">⏳ Cargando...</div>';
  const { data } = await db.from('usuarios').select('nickname,puntos,rol,foto_url').order('puntos', { ascending: false }).limit(20);
  if (!data || data.length === 0) { body.innerHTML = '<div style="text-align:center;color:var(--text-3);padding:20px;">Sin datos</div>'; return; }
  const medals = ['🥇','🥈','🥉'];
  let html = '';
  data.forEach((u, i) => {
    const ac = avatarColor(u.nickname);
    const rango = getRango(u.puntos || 0, u.rol);
    html += `
      <div class="top-usuarios-item">
        <div class="top-usuarios-rank">${medals[i] || `#${i+1}`}</div>
        ${renderAvatar(u.nickname, u.foto_url||null, 'top-usuarios-avatar', 36)}
        <div class="top-usuarios-info">
          <div class="top-usuarios-name">${cap(u.nickname)}</div>
          <div class="top-usuarios-badge">${rango.icon} ${rango.label}</div>
        </div>
        <div class="top-usuarios-score">
          <div class="top-usuarios-score-value">${u.puntos || 0}</div>
          <div class="top-usuarios-score-label">pts</div>
        </div>
      </div>`;
  });
  body.innerHTML = html;
}
function cerrarModalTopUsuarios() { document.getElementById('modalTopUsuarios').classList.remove('open'); }

async function abrirModalTopMoviles() {
  document.getElementById('modalTopMoviles').classList.add('open');
  const body = document.getElementById('modalTopMovilesBody');
  body.innerHTML = '<div class="loading">\u23f3 Cargando...</div>';

  const { data: hilos, error } = await db.from('hilos').select(`
    id, presupuesto,
    respuestas ( id, contenido, movil_nombre, votos_util, created_at, nickname )
  `).not('respuestas', 'is', null);

  if (error || !hilos) { body.innerHTML = '<div style="text-align:center;color:var(--text-3);padding:20px;">\u274c Error al cargar</div>'; return; }

  const map = {};
  for (const hilo of hilos) {
    for (const r of hilo.respuestas) {
      let nombre = r.movil_nombre;
      if (!nombre) {
        const extraidos = extraerModelos(r.contenido);
        if (extraidos.length > 0) nombre = extraidos[0];
      }
      if (!nombre) continue;
      const key = nombre.toLowerCase();
      const votos = r.votos_util || 0;
      if (!map[key]) map[key] = { nombre: formatearModelo(nombre), votos: 0, menciones: 0 };
      map[key].votos += votos;
      map[key].menciones++;
    }
  }

  const sorted = Object.values(map).sort((a, b) => b.votos - a.votos || b.menciones - a.menciones).slice(0, 10);
  if (sorted.length === 0) { body.innerHTML = '<div style="text-align:center;color:var(--text-3);padding:20px;">\ud83d\udce6 Sin m\u00f3viles recomendados todav\u00eda</div>'; return; }

  const medals = ['\ud83e\udd47','\ud83e\udd48','\ud83e\udd49'];
  let html = '';
  sorted.forEach((m, i) => {
    html += '<div class="top-usuarios-item">'
      + '<div class="top-usuarios-rank" style="font-size:18px;">' + (medals[i] || '#' + (i+1)) + '</div>'
      + '<div class="top-usuarios-info">'
      + '<div class="top-usuarios-name" style="font-size:13px;">' + m.nombre + '</div>'
      + '<div class="top-usuarios-badge">\ud83d\udcac ' + m.menciones + ' menci\u00f3n' + (m.menciones>1?'es':'') + ' \u00b7 \ud83d\udc4d ' + m.votos + ' votos</div>'
      + '</div></div>';
  });
  body.innerHTML = html;
}
function cerrarModalTopMoviles() { document.getElementById('modalTopMoviles').classList.remove('open'); }

// ═══════════════════════════════════════════
// FORO FC STYLE
// ═══════════════════════════════════════════
let fcCitaActiva = null; // { nickname, contenido }
let fcMultiCitas = []; // array de { nickname, contenido } para multicita
let fcMulticitaMode = false;

function clearForumCita() {
  fcCitaActiva = null;
  fcMultiCitas = [];
  const preview = document.getElementById('fcQuotePreview');
  if (preview) preview.style.display = 'none';
}

function toggleMulticitaMode() {
  fcMulticitaMode = !fcMulticitaMode;
  if (!fcMulticitaMode) cancelarMulticita();
  actualizarBarraMulticita();
}

function actualizarBarraMulticita() {
  const bar = document.getElementById('fcMulticitaBar');
  const count = document.getElementById('fcMulticitaCount');
  if (!bar) return;
  if (fcMultiCitas.length > 0) {
    bar.classList.add('visible');
    if (count) count.textContent = fcMultiCitas.length;
  } else {
    bar.classList.remove('visible');
  }
}

function toggleCitaPost(nickname, contenido, postId) {
  const idx = fcMultiCitas.findIndex(c => c.postId === postId);
  const check = document.getElementById(`fc_check_${postId}`);
  if (idx >= 0) {
    fcMultiCitas.splice(idx, 1);
    if (check) check.checked = false;
  } else {
    fcMultiCitas.push({ nickname, contenido, postId });
    if (check) check.checked = true;
  }
  actualizarBarraMulticita();
}

function aplicarMulticita() {
  if (fcMultiCitas.length === 0) return;
  // Construir texto de multicita
  let texto = fcMultiCitas.map(c =>
    `[cite:${c.nickname}]${c.contenido.substring(0, 200)}[/cite]`
  ).join('\n');
  fcCitaActiva = { nickname: 'multicita', contenido: texto, isMulti: true };
  const preview = document.getElementById('fcQuotePreview');
  const authorEl = document.getElementById('fcQuoteAuthor');
  const textEl = document.getElementById('fcQuoteText');
  if (preview && authorEl && textEl) {
    authorEl.textContent = `${fcMultiCitas.length} citas seleccionadas`;
    textEl.textContent = fcMultiCitas.map(c => c.nickname).join(', ') + '…';
    preview.style.display = 'flex';
  }
  cancelarMulticita();
  const box = document.getElementById('forumReplyBox');
  if (box) { box.style.display = 'block'; box.scrollIntoView({ behavior: 'smooth', block: 'end' }); }
  const input = document.getElementById('forumReplyInput');
  if (input) input.focus();
}

function cancelarMulticita() {
  fcMultiCitas = [];
  fcMulticitaMode = false;
  // uncheck all
  document.querySelectorAll('.fc-multicita-check').forEach(c => c.checked = false);
  actualizarBarraMulticita();
}

function citarPostForo(nickname, contenido) {
  fcCitaActiva = { nickname, contenido };
  const preview = document.getElementById('fcQuotePreview');
  const authorEl = document.getElementById('fcQuoteAuthor');
  const textEl = document.getElementById('fcQuoteText');
  if (preview && authorEl && textEl) {
    authorEl.textContent = nickname + ' dijo:';
    textEl.textContent = contenido.replace(/<[^>]+>/g, '').substring(0, 120) + (contenido.length > 120 ? '…' : '');
    preview.style.display = 'flex';
  }
  const box = document.getElementById('forumReplyBox');
  if (box) { box.style.display = 'block'; box.scrollIntoView({ behavior: 'smooth', block: 'end' }); }
  const input = document.getElementById('forumReplyInput');
  if (input) input.focus();
}

function mencionarEnForo(nickname) {
  const input = document.getElementById('forumReplyInput');
  if (!input) return;
  const mencion = `<span class="fc-mention">@${nickname}</span>&nbsp;`;
  input.focus();
  document.execCommand('insertHTML', false, mencion);
  const box = document.getElementById('forumReplyBox');
  if (box) { box.style.display = 'block'; box.scrollIntoView({ behavior: 'smooth', block: 'end' }); }
}

// Toolbar WYSIWYG
function fcFormat(cmd) {
  document.getElementById('forumReplyInput').focus();
  document.execCommand(cmd, false, null);
}

function fcInsertImg() {
  const url = prompt('URL de la imagen:');
  if (!url) return;
  document.getElementById('forumReplyInput').focus();
  document.execCommand('insertHTML', false, `<img src="${escHtml(url)}" style="max-width:100%;border-radius:8px;" />`);
}

function fcInsertLink() {
  const url = prompt('URL del enlace:');
  if (!url) return;
  const texto = prompt('Texto del enlace (opcional):') || url;
  document.getElementById('forumReplyInput').focus();
  document.execCommand('insertHTML', false, `<a href="${escHtml(url)}" target="_blank" rel="noopener">${escHtml(texto)}</a>`);
}


function abrirModalEditarRespuesta(respuestaId, contenidoActual) {
  if (!usuario) { toast('❌ Inicia sesión para editar'); return; }
  const oldModal = document.getElementById('editModal');
  if (oldModal) oldModal.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'editModal';
  overlay.style.cssText = 'display:flex; z-index:2000;';

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.maxWidth = '500px';
  modal.innerHTML = `
    <div class="modal-title">✏️ Editar respuesta</div>
    <div class="modal-sub">Modifica tu recomendación.</div>
    <textarea id="editContenido" rows="6" style="width:100%; padding:12px; border:1.5px solid var(--border); border-radius:12px; font-size:0.9rem; margin-bottom:16px; font-family:'DM Sans',sans-serif; resize:vertical;"></textarea>
    <div style="display:flex; gap:10px; justify-content:flex-end;">
      <button class="btn-cancel" id="editModalCancelBtn">Cancelar</button>
      <button class="btn-submit" id="editModalSaveBtn">Guardar</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Asignar contenido directamente via JS (evita problemas con HTML encoding)
  document.getElementById('editContenido').value = contenidoActual || '';

  document.getElementById('editModalCancelBtn').addEventListener('click', cerrarModalEditar);
  document.getElementById('editModalSaveBtn').addEventListener('click', () => guardarEdicionRespuesta(respuestaId));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrarModalEditar(); });
}

function cerrarModalEditar() {
  const modal = document.getElementById('editModal');
  if (modal) modal.remove();
}

async function guardarEdicionRespuesta(respuestaId) {
  const nuevo = document.getElementById('editContenido')?.value?.trim();
  if (!nuevo) { toast('❌ No puede estar vacío'); return; }
  const saveBtn = document.getElementById('editModalSaveBtn');
  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Guardando...'; }

  const { error } = await db.from('respuestas').update({
    contenido: nuevo,
    editado: true,
    editado_en: new Date().toISOString()
  }).eq('id', respuestaId);

  if (error) {
    toast('❌ Error: ' + error.message);
    if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Guardar'; }
    return;
  }

  toast('✅ Editado');
  cerrarModalEditar();

  // Recargar solo el contenedor de respuestas del hilo correspondiente
  const { data: resp } = await db.from('respuestas').select('hilo_id').eq('id', respuestaId).single();
  if (resp) {
    const container = document.getElementById(`replies_${resp.hilo_id}`);
    // Solo recargar si ya está visible (para no abrir secciones cerradas)
    if (container && container.style.display !== 'none') {
      await cargarRespuestas(resp.hilo_id);
    }
  }
  cargarTopMoviles();
}

// ═══════════════════════════════════════════
// ADMIN — REPORTES
// ═══════════════════════════════════════════
async function renderAdminReportes() {
  const el = document.getElementById('adminContent');

  // Intentar cargar desde tabla foro_reports
  let reportes = [];
  let fuenteTabla = false;
  try {
    const { data, error } = await db.from('foro_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (!error && data) { reportes = data; fuenteTabla = true; }
  } catch(e) {}

  // Fallback: cargar desde configuracion
  if (!fuenteTabla) {
    try {
      const { data } = await db.from('configuracion').select('valor').eq('clave', 'reportes').single();
      if (data?.valor) reportes = JSON.parse(data.valor);
    } catch(e) {}
  }

  if (reportes.length === 0) {
    el.innerHTML = `
      <div class="admin-section-title">⚠️ Reportes recibidos</div>
      <div class="admin-empty">✅ Sin reportes pendientes</div>`;
    return;
  }

  const filas = reportes.map((r, i) => {
    const id = r.post_id || r.id || '—';
    const reporter = r.reporter_nickname || r.reporter || '—';
    const ts = r.created_at || r.ts ? new Date(r.created_at || r.ts).toLocaleString('es-ES') : '—';
    return `
      <tr>
        <td style="font-family:'DM Mono',monospace;font-size:11px;">${id}</td>
        <td><strong>${reporter}</strong></td>
        <td>${ts}</td>
        <td>
          <div class="admin-actions-row">
            ${fuenteTabla
              ? `<button class="admin-btn admin-btn-red" onclick="eliminarReporte('${r.id}')">🗑 Descartar</button>`
              : `<button class="admin-btn admin-btn-red" onclick="eliminarReporteFallback(${i})">🗑 Descartar</button>`
            }
          </div>
        </td>
      </tr>`;
  }).join('');

  el.innerHTML = `
    <div class="admin-section-title">⚠️ Reportes recibidos <span style="font-size:0.7rem;font-weight:400;color:var(--text-3);">(${reportes.length})</span></div>
    <div class="admin-table-wrap"><table class="admin-table">
      <thead><tr>
        <th>ID reportado</th><th>Reportado por</th><th>Fecha</th><th>Acción</th>
      </tr></thead>
      <tbody>${filas}</tbody>
    </table>
    </div>
    <div style="margin-top:12px;">
      <button class="admin-btn admin-btn-gray" onclick="limpiarTodosReportes()">🧹 Limpiar todos</button>
    </div>`;
}

async function eliminarReporte(reporteId) {
  await db.from('foro_reports').delete().eq('id', reporteId);
  toast('🗑 Reporte descartado');
  renderAdminReportes();
}

async function eliminarReporteFallback(idx) {
  try {
    const { data } = await db.from('configuracion').select('valor').eq('clave', 'reportes').single();
    const lista = data?.valor ? JSON.parse(data.valor) : [];
    lista.splice(idx, 1);
    await db.from('configuracion').upsert({ clave: 'reportes', valor: JSON.stringify(lista) });
  } catch(e) {}
  toast('🗑 Reporte descartado');
  renderAdminReportes();
}

async function limpiarTodosReportes() {
  if (!confirm('¿Limpiar todos los reportes?')) return;
  try { await db.from('foro_reports').delete().neq('id', '00000000-0000-0000-0000-000000000000'); } catch(e) {}
  try { await db.from('configuracion').upsert({ clave: 'reportes', valor: '[]' }); } catch(e) {}
  toast('🧹 Reportes limpiados');
  renderAdminReportes();
}

// ═══════════════════════════════════════════
// COOKIES
// ═══════════════════════════════════════════
function initCookieBanner() {
  try {
    if (localStorage.getItem('cookie_accepted')) {
      document.getElementById('cookieBanner').classList.add('hidden');
      return;
    }
  } catch(e) {}
  document.getElementById('cookieBanner').classList.remove('hidden');
}

function aceptarCookies() {
  try { localStorage.setItem('cookie_accepted', '1'); } catch(e) {}
  document.getElementById('cookieBanner').classList.add('hidden');
}

// ═══════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════
async function init() {
    mostrarUsuario(); // Mostrar estado inicial (botón login o chip)
    cargarBannerGlobal();
    cargarStats();
    restaurarEstadoTop();
    cargarTopUsuarios();
    const token = leerToken();
    console.log("TOKEN manual en localStorage:", token ? "encontrado" : "no encontrado");

    if (token) {
        const { data: sesion, error: errorSesion } = await db.from('sesiones').select('*').eq('token', token).single();
        console.log("SESION en DB:", JSON.stringify(sesion), "ERR:", errorSesion);

        if (sesion) {
            const { data: usuarioDB, error: errorUsuario } = await db.from('usuarios').select('*').eq('nickname', sesion.nickname).single();
            console.log("USER en DB:", JSON.stringify(usuarioDB), "ERR:", errorUsuario);

            if (usuarioDB) {
                usuario = usuarioDB; 
                cerrarModalAuth();
                onLogin();
                await navegarDesdeUrl();
                return; 
            }
        }
    }

    // Sin token o sesión inválida: mostrar botón login en topbar (no forzar modal)
    mostrarUsuario();
    await navegarDesdeUrl();
}

document.addEventListener('DOMContentLoaded', () => {
  init();
  initCookieBanner();
  initKeyboardHandler();
});

function initKeyboardHandler() {
  if (!window.visualViewport) return;
  let rafId = null;

  function adjust() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const vv = window.visualViewport;

      // Keep bottom nav pinned to bottom of visual viewport (handles Chrome showing/hiding URL bar)
      const nav = document.getElementById('bottomNav');
      if (nav) {
        const offsetFromBottom = window.innerHeight - (vv.offsetTop + vv.height);
        nav.style.bottom = Math.max(0, offsetFromBottom) + 'px';
      }

      // Keep admin button above nav
      const adminBtn = document.getElementById('adminBtn');
      if (adminBtn && adminBtn.style.display !== 'none') {
        const offsetFromBottom = window.innerHeight - (vv.offsetTop + vv.height);
        adminBtn.style.bottom = (Math.max(0, offsetFromBottom) + 70) + 'px';
      }

      // Keep fabNoticiaMovil above nav
      const fabNoticia = document.getElementById('fabNoticiaMovil');
      if (fabNoticia && fabNoticia.style.display !== 'none') {
        const offsetFromBottom = window.innerHeight - (vv.offsetTop + vv.height);
        fabNoticia.style.bottom = (Math.max(0, offsetFromBottom) + 122) + 'px';
      }

      // Keep FAB nueva consulta above nav
      const fab = document.querySelector('.fab');
      if (fab) {
        const offsetFromBottom = window.innerHeight - (vv.offsetTop + vv.height);
        fab.style.bottom = (Math.max(0, offsetFromBottom) + 70) + 'px';
      }

      // Ranking modal keyboard adjust
      const overlay = document.getElementById('rankingModalOverlay');
      if (overlay && overlay.style.display !== 'none') {
        const modal = overlay.querySelector('.ranking-modal');
        if (modal) {
          const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
          if (kb > 50) {
            overlay.style.paddingBottom = kb + 'px';
            modal.style.maxHeight = Math.min(vv.height * 0.88, vv.height - 40) + 'px';
          } else {
            overlay.style.paddingBottom = '';
            modal.style.maxHeight = '';
          }
        }
      }
    });
  }

  window.visualViewport.addEventListener('resize', adjust);
  window.visualViewport.addEventListener('scroll', adjust);
  // Run once on load
  adjust();
}
// ═══════════════════════════════════════════
// PERFIL DE USUARIO
// ═══════════════════════════════════════════

async function abrirPerfil(nick) {
  if (!nick) return;
  const overlay = document.getElementById('perfilOverlay');
  const cont = document.getElementById('perfilContent');
  overlay.classList.add('open');
  cont.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-3);">⏳ Cargando...</div>';

  const { data: u } = await db.from('usuarios')
    .select('nickname,puntos,rol,foto_url,ciudad,movil_actual,sistema_operativo,capa_ui,sobre_mi')
    .eq('nickname', nick).single();
  if (!u) { cont.innerHTML = '<div style="padding:30px;text-align:center;">❌ Usuario no encontrado</div>'; return; }

  const esPropio = usuario && usuario.nickname === nick;

  const [{ count: seguidores }, { count: seguidos }] = await Promise.all([
    db.from('seguidores').select('id', { count: 'exact', head: true }).eq('seguido', nick),
    db.from('seguidores').select('id', { count: 'exact', head: true }).eq('seguidor', nick),
  ]);

  let yaSigo = false;
  if (usuario && !esPropio) {
    const { count } = await db.from('seguidores').select('id', { count: 'exact', head: true })
      .eq('seguidor', usuario.nickname).eq('seguido', nick);
    yaSigo = (count || 0) > 0;
  }

  const [{ count: nConsultas }, { count: nPosts }] = await Promise.all([
    db.from('hilos').select('id', { count: 'exact', head: true }).eq('nickname', nick),
    db.from('foro_posts').select('id', { count: 'exact', head: true }).eq('nickname', nick),
  ]);

  const rango = getRango(u.puntos || 0, u.rol);
  const ac = avatarColor(nick);
  const initials = cap(nick).substring(0,2).toUpperCase();
  const avatarHtml = u.foto_url
    ? '<img src="' + escHtml(u.foto_url) + '" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.3);">'
    : '<div class="perfil-avatar-grande" style="background:' + ac.bg + ';color:' + ac.color + ';">' + initials + '</div>';

  const seguirBtn = (!esPropio && usuario) ? '<button class="perfil-seguir-btn ' + (yaSigo ? 'siguiendo' : '') + '" id="perfilSeguirBtn" onclick="toggleSeguir(\'' + nick + '\')">' + (yaSigo ? '✓ Siguiendo' : '+ Seguir') + '</button>' : '';
  const editBtn   = esPropio ? '<button class="perfil-seguir-btn" onclick="mostrarEditPerfil()">✏️ Editar perfil</button>' : '';

  const infoItems = [
    u.ciudad        && { icon: '📍', label: 'Ciudad',   val: u.ciudad },
    u.movil_actual  && { icon: '📱', label: 'Móvil',    val: u.movil_actual },
    u.sistema_operativo && { icon: '🤖', label: 'SO',   val: u.sistema_operativo },
    u.capa_ui       && { icon: '🎨', label: 'Capa UI',  val: u.capa_ui },
  ].filter(Boolean);

  const infoHtml = infoItems.length ? '<div><div class="perfil-section-title">📋 Información</div><div class="perfil-info-grid">'
    + infoItems.map(it => '<div class="perfil-info-chip"><span>' + it.icon + '</span><div><b>' + it.label + '</b>' + escHtml(it.val) + '</div></div>').join('')
    + '</div></div>' : '';

  const sobreHtml = u.sobre_mi ? '<div><div class="perfil-section-title">💬 Sobre mí</div><div class="perfil-sobre-mi">' + escHtml(u.sobre_mi) + '</div></div>' : '';

  cont.innerHTML = '<div class="perfil-header">'
    + '<button class="perfil-close-btn" onclick="cerrarPerfil()">✕</button>'
    + '<div class="perfil-avatar-wrap"' + (esPropio ? ' onclick="mostrarEditPerfil()"' : '') + '>' + avatarHtml + (esPropio ? '<div class="perfil-avatar-edit-badge">✏️</div>' : '') + '</div>'
    + '<div class="perfil-nick">' + cap(nick) + (u.rol==='admin'?' 👑':'') + '</div>'
    + '<div class="perfil-rango-badge">' + rango.icon + ' ' + rango.label + ' · ' + (u.puntos||0) + ' pts</div>'
    + '<div class="perfil-stats-row">'
    + '<div class="perfil-stat" onclick="verSeguidoresPerfil(\'' + nick + '\',\'seguidores\')"><div class="perfil-stat-val">' + (seguidores||0) + '</div><div class="perfil-stat-label">Seguidores</div></div>'
    + '<div class="perfil-stat" onclick="verSeguidoresPerfil(\'' + nick + '\',\'seguidos\')"><div class="perfil-stat-val">' + (seguidos||0) + '</div><div class="perfil-stat-label">Siguiendo</div></div>'
    + '<div class="perfil-stat"><div class="perfil-stat-val">' + ((nConsultas||0)+(nPosts||0)) + '</div><div class="perfil-stat-label">Posts</div></div>'
    + '</div>' + seguirBtn + editBtn + '</div>'
    + '<div class="perfil-tabs">'
    + '<div class="perfil-tab active" onclick="switchPerfilTab(\'info\',this)">Info</div>'
    + '<div class="perfil-tab" onclick="switchPerfilTab(\'menciones\',this)">Menciones</div>'
    + '<div class="perfil-tab" onclick="switchPerfilTab(\'citas\',this)">Citas recibidas</div>'
    + '</div>'
    + '<div class="perfil-tab-panel active" id="ptab_info">' + infoHtml + sobreHtml + (!infoItems.length && !u.sobre_mi ? '<div style="color:var(--text-3);font-size:13px;text-align:center;padding:16px 0;">Sin información de perfil todavía</div>' : '') + '</div>'
    + '<div class="perfil-tab-panel" id="ptab_menciones"><div id="perfilMencionesList"><div style="color:var(--text-3);font-size:13px;text-align:center;padding:20px;">⏳ Cargando...</div></div></div>'
    + '<div class="perfil-tab-panel" id="ptab_citas"><div id="perfilCitasList"><div style="color:var(--text-3);font-size:13px;text-align:center;padding:20px;">⏳ Cargando...</div></div></div>';

  cargarMencionesPerfil(nick);
  cargarCitasPerfil(nick);
}

function cerrarPerfil() { document.getElementById('perfilOverlay').classList.remove('open'); }

function switchPerfilTab(id, el) {
  document.querySelectorAll('.perfil-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.perfil-tab-panel').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('ptab_' + id).classList.add('active');
}

async function cargarMencionesPerfil(nick) {
  const el = document.getElementById('perfilMencionesList');
  if (!el) return;
  const [{ data: mc }, { data: mf }] = await Promise.all([
    db.from('respuestas').select('id,hilo_id,nickname,contenido,created_at').ilike('contenido','%@'+nick+'%').order('created_at',{ascending:false}).limit(15),
    db.from('foro_replies').select('id,post_id,nickname,contenido,created_at').ilike('contenido','%@'+nick+'%').order('created_at',{ascending:false}).limit(15),
  ]);
  const todas = [...(mc||[]).map(r=>({...r,tipo:'consulta',destId:r.hilo_id})),...(mf||[]).map(r=>({...r,tipo:'foro',destId:r.post_id}))].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,20);
  if (!todas.length) { el.innerHTML = '<div style="color:var(--text-3);font-size:13px;text-align:center;padding:16px;">Sin menciones</div>'; return; }
  el.innerHTML = todas.map(m => '<div class="perfil-historial-item" onclick="' + (m.tipo==='foro' ? 'cerrarPerfil();setTimeout(()=>abrirPost(\"'+m.destId+'\"),100)' : 'cerrarPerfil();irAHilo(\"'+m.destId+'\",\"\",false)') + '"><span style="font-weight:600;color:var(--navy);">' + cap(m.nickname) + '</span> <span style="color:var(--text-3);">· ' + (m.tipo==='foro'?'💬 Foro':'📋 Consultas') + ' · ' + timeAgo(m.created_at) + '</span><br><span style="color:var(--text-2);">' + escHtml((m.contenido||'').substring(0,80)) + (m.contenido?.length>80?'…':'') + '</span></div>').join('');
}

async function cargarCitasPerfil(nick) {
  const el = document.getElementById('perfilCitasList');
  if (!el) return;
  const { data: misResp } = await db.from('respuestas').select('id').eq('nickname',nick).limit(100);
  const misIds = (misResp||[]).map(r=>r.id);
  let citasC = [];
  if (misIds.length) { const { data } = await db.from('respuestas').select('id,hilo_id,nickname,contenido,created_at,cita_id').in('cita_id',misIds).order('created_at',{ascending:false}).limit(15); citasC = data||[]; }
  const { data: citasF } = await db.from('foro_replies').select('id,post_id,nickname,contenido,created_at').ilike('contenido','%[cite:'+nick+'%').order('created_at',{ascending:false}).limit(15);
  const todas = [...citasC.map(r=>({...r,tipo:'consulta',destId:r.hilo_id})),...(citasF||[]).map(r=>({...r,tipo:'foro',destId:r.post_id}))].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,20);
  if (!todas.length) { el.innerHTML = '<div style="color:var(--text-3);font-size:13px;text-align:center;padding:16px;">Sin citas recibidas</div>'; return; }
  el.innerHTML = todas.map(c => '<div class="perfil-historial-item" onclick="' + (c.tipo==='foro'?'cerrarPerfil();setTimeout(()=>abrirPost(\"'+c.destId+'\"),100)':'cerrarPerfil();irAHilo(\"'+c.destId+'\",\"\",false)') + '"><span style="font-weight:600;color:var(--navy);">' + cap(c.nickname) + '</span> te citó <span style="color:var(--text-3);">· ' + (c.tipo==='foro'?'💬 Foro':'📋 Consultas') + ' · ' + timeAgo(c.created_at) + '</span><br><span style="color:var(--text-2);">' + escHtml((c.contenido||'').substring(0,80)) + (c.contenido?.length>80?'…':'') + '</span></div>').join('');
}

async function toggleSeguir(nick) {
  if (!usuario) { mostrarModalAuth(); return; }
  const btn = document.getElementById('perfilSeguirBtn');
  if (!btn) return;
  const yaSigo = btn.classList.contains('siguiendo');
  if (yaSigo) {
    await db.from('seguidores').delete().eq('seguidor',usuario.nickname).eq('seguido',nick);
    btn.classList.remove('siguiendo'); btn.textContent = '+ Seguir';
  } else {
    await db.from('seguidores').insert({ seguidor: usuario.nickname, seguido: nick });
    btn.classList.add('siguiendo'); btn.textContent = '✓ Siguiendo';
  }
  const { count } = await db.from('seguidores').select('id',{count:'exact',head:true}).eq('seguido',nick);
  const statVal = document.querySelector('.perfil-stat-val');
  if (statVal) statVal.textContent = count || 0;
}

async function verSeguidoresPerfil(nick, tipo) {
  const q = tipo==='seguidores'
    ? db.from('seguidores').select('seguidor').eq('seguido',nick).limit(50)
    : db.from('seguidores').select('seguido').eq('seguidor',nick).limit(50);
  const { data } = await q;
  const lista = (data||[]).map(r => tipo==='seguidores' ? r.seguidor : r.seguido);
  const infoTab = document.getElementById('ptab_info');
  if (!infoTab) return;
  infoTab.innerHTML = '<div style="font-weight:700;font-size:14px;margin-bottom:12px;color:var(--navy);"><button onclick="abrirPerfil(\''+nick+'\');" style="background:none;border:none;cursor:pointer;font-size:16px;margin-right:8px;">←</button>' + (tipo==='seguidores'?'Seguidores':'Siguiendo') + '</div>'
    + (lista.length ? lista.map(n=>'<div class="perfil-historial-item" onclick="abrirPerfil(\''+n+'\')">' + cap(n) + '</div>').join('') : '<div style="color:var(--text-3);font-size:13px;">Sin ' + tipo + '</div>');
  document.querySelectorAll('.perfil-tab').forEach((t,i)=>t.classList.toggle('active',i===0));
  document.querySelectorAll('.perfil-tab-panel').forEach((p,i)=>p.classList.toggle('active',i===0));
}

function mostrarEditPerfil() {
  if (!usuario) return;
  const u = usuario;
  const cont = document.getElementById('perfilContent');
  cont.innerHTML = '<div class="perfil-header" style="padding-bottom:16px;"><button class="perfil-close-btn" onclick="cerrarPerfil()">✕</button><div style="color:white;font-family:Roboto,sans-serif;font-size:16px;font-weight:700;margin-top:8px;">Editar perfil</div></div>'
    + '<div class="perfil-body">'
    + '<div class="perfil-edit-field"><label>🖼️ URL foto de perfil</label><input id="ep_foto" type="url" placeholder="https://..." value="' + escHtml(u.foto_url||'') + '"></div>'
    + '<div class="perfil-edit-field"><label>📍 Ciudad</label><input id="ep_ciudad" type="text" placeholder="ej. Madrid" value="' + escHtml(u.ciudad||'') + '"></div>'
    + '<div class="perfil-edit-field"><label>📱 Móvil actual</label><input id="ep_movil" type="text" placeholder="ej. Xiaomi 14T Pro" value="' + escHtml(u.movil_actual||'') + '"></div>'
    + '<div class="perfil-edit-field"><label>🤖 Sistema operativo</label><input id="ep_so" type="text" placeholder="Android / iOS" value="' + escHtml(u.sistema_operativo||'') + '"></div>'
    + '<div class="perfil-edit-field"><label>🎨 Capa UI</label><input id="ep_capa" type="text" placeholder="ej. HyperOS, OxygenOS, One UI..." value="' + escHtml(u.capa_ui||'') + '"></div>'
    + '<div class="perfil-edit-field"><label>💬 Sobre mí</label><textarea id="ep_sobre" rows="3" placeholder="Cuéntanos algo sobre ti...">' + escHtml(u.sobre_mi||'') + '</textarea></div>'
    + '<button class="perfil-save-btn" onclick="guardarPerfil()">💾 Guardar cambios</button>'
    + '<button onclick="abrirPerfil(\''+u.nickname+'\');" style="background:none;border:none;color:var(--text-3);font-size:13px;cursor:pointer;text-align:center;width:100%;margin-top:4px;">Cancelar</button>'
    + '</div>';
}

async function guardarPerfil() {
  if (!usuario) return;
  const foto_url          = document.getElementById('ep_foto')?.value.trim() || null;
  const ciudad            = document.getElementById('ep_ciudad')?.value.trim() || null;
  const movil_actual      = document.getElementById('ep_movil')?.value.trim() || null;
  const sistema_operativo = document.getElementById('ep_so')?.value.trim() || null;
  const capa_ui           = document.getElementById('ep_capa')?.value.trim() || null;
  const sobre_mi          = document.getElementById('ep_sobre')?.value.trim() || null;

  const { error } = await db.from('usuarios').update({ foto_url, ciudad, movil_actual, sistema_operativo, capa_ui, sobre_mi }).eq('id', usuario.id);
  if (error) { toast('❌ Error: ' + error.message); return; }

  Object.assign(usuario, { foto_url, ciudad, movil_actual, sistema_operativo, capa_ui, sobre_mi });
  invalidarFotoCache(usuario.nickname);
  actualizarChipAvatar();
  toast('✅ Perfil actualizado');
  abrirPerfil(usuario.nickname);
}

function actualizarChipAvatar() {
  const u = usuario;
  if (!u) return;
  const avatarEl = document.getElementById('chipAvatar');
  if (!avatarEl) return;
  const ac = avatarColor(u.nickname);
  const nombre = cap(u.nickname);
  const initials = nombre.substring(0,2).toUpperCase();
  if (u.foto_url) {
    const img = document.createElement('img');
    img.id = 'chipAvatar';
    img.src = u.foto_url;
    img.style.cssText = 'width:22px;height:22px;border-radius:50%;object-fit:cover;flex-shrink:0;';
    img.onerror = function() {
      this.outerHTML = '<div id="chipAvatar" style="background:'+ac.bg+';color:'+ac.color+';width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;">'+initials+'</div>';
    };
    avatarEl.replaceWith(img);
  } else {
    avatarEl.style.background = ac.bg;
    avatarEl.style.color = ac.color;
    avatarEl.textContent = initials;
  }
}

