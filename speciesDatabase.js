// ==========================================
// DATABASE SPESIES (QUIET HOURS)
// ==========================================
// Arsitektur:
// - Database memakai key internal berbahasa Inggris
// - Teks yang dilihat user memakai field per-language (en/id)
// - UI translation system nanti cukup membaca field ini lewat helper

const SPECIES_DEFAULTS = {
    key: "unknown_species",
    image: "",
    thumbnail: "",
    name: {
        en: "Unknown Species",
        id: "Spesies Tidak Dikenal"
    },
    fact: {
        en: "A quiet trace remains, even before it is fully named.",
        id: "Jejak tenang tetap tinggal, bahkan sebelum sepenuhnya diberi nama."
    },
    unlockQuote: {
        en: "A new entry settles into the archive.",
        id: "Satu entri baru menetap di dalam arsip."
    },
    tags: [],
    habitat: "garden",
    focusMinutesRequired: 0,
    sellValue: 0,
    sound: {
        discover: "",
        ambient: ""
    },
    effects: {
        gardenClass: "",
        popupClass: "",
        aura: false,
        float: false,
        sparkle: false,
        glow: false
    }
};

function createSpecies(config) {
    return {
        ...SPECIES_DEFAULTS,
        ...config,
        name: {
            ...SPECIES_DEFAULTS.name,
            ...(config.name || {})
        },
        fact: {
            ...SPECIES_DEFAULTS.fact,
            ...(config.fact || {})
        },
        unlockQuote: {
            ...SPECIES_DEFAULTS.unlockQuote,
            ...(config.unlockQuote || {})
        },
        sound: {
            ...SPECIES_DEFAULTS.sound,
            ...(config.sound || {})
        },
        effects: {
            ...SPECIES_DEFAULTS.effects,
            ...(config.effects || {})
        },
        tags: config.tags || []
    };
}

const speciesDatabase = [
    createSpecies({
        id: "sp_003",
        key: "moon_orchid",
        name: {
            en: "Moon Orchid",
            id: "Anggrek Bulan"
        },
        scientificName: "Phalaenopsis amabilis",
        rarity: "rare",
        image: "assets/Phalaenopsisamabilis.png",
        fact: {
            en: "Phalaenopsis amabilis is officially designated as Indonesia's 'flower of charm' (puspa pesona). This means it's not just beautiful, but a true symbol of the elegance of the archipelago's flora.",
            id: "Phalaenopsis amabilis ditetapkan sebagai salah satu puspa pesona Indonesia. Artinya, dia bukan sekadar cantik, tapi juga simbol keanggunan flora Nusantara."
        },
        unlockQuote: {
            en: "After the flowers fall, the stem can sometimes produce new branches and bloom again. So, even when it seems finished... it's actually just preparing for its next chapter.",
            id: "Setelah bunga gugur, tangkainya kadang bisa menghasilkan cabang baru dan berbunga lagi. Jadi, meskipun terlihat selesai… sebenarnya dia hanya sedang menyiapkan bab berikutnya."
        },
        tags: ["flower", "orchid"],
        habitat: "tree_branch",
        sellValue: 18,
        effects: {
            glow: true
        }
    }),
    createSpecies({
        id: "sp_004",
        key: "monarch_butterfly",
        name: {
            en: "Monarch Butterfly",
            id: "Kupu-Kupu Monarch"
        },
        scientificName: "Danaus plexippus",
        rarity: "rare",
        image: "assets/Danausplexippus.png",
        fact: {
            en: "These butterflies migrate thousands of kilometers from North America to Mexico. Interestingly, this journey isn't completed by a single individual, but spans across multiple generations. Imagine... one generation 'starts', the next 'continues', and the final one reaches the destination. It's like a relay race of life.",
            id: "Kupu-kupu ini melakukan migrasi ribuan kilometer dari Amerika Utara ke Meksiko. Yang menarik, perjalanan itu tidak diselesaikan oleh satu individu saja, tapi lintas generasi. Bayangkan… satu generasi “memulai”, generasi berikutnya “melanjutkan”, dan yang terakhir tiba di tujuan. Seperti estafet kehidupan."
        },
        unlockQuote: {
            en: "Their population is declining due to habitat loss, pesticide use, and climate change. It's ironic, isn't it? A creature so resilient is ultimately vulnerable to the changes we create.",
            id: "Populasinya menurun karena hilangnya habitat, penggunaan pestisida, dan perubahan iklim. Ironis ya, makhluk yang begitu tangguh justru rentan oleh perubahan yang kita ciptakan.."
        },
        tags: ["pollinator", "butterfly", "flying"],
        habitat: "air",
        sellValue: 20,
        effects: {
            float: true
        }
    }),
    createSpecies({
        id: "sp_007",
        key: "zinnia",
        name: {
            en: "Zinnia",
            id: "Bunga Kertas"
        },
        scientificName: "Zinnia elegans",
        rarity: "common",
        image: "assets/Zinniaelegans.png",
        fact: {
            en: "What we perceive as a single flower is actually a cluster of many tiny flowers (florets). The center is made of disk flowers, and the outer 'petals' are ray flowers. Conceptually, it's like having multiple versions of the self appearing as one unified identity.",
            id: "Yang kita lihat sebagai satu bunga sebenarnya adalah kumpulan banyak bunga kecil (floret). Bagian tengah itu bunga tabung, dan “kelopak” di luar adalah bunga pita. Secara konsep, ini seperti beberapa versi diri yang keliatan sebagai satu identitas."
        },
        unlockQuote: {
            en: "Picking the flowers actually stimulates the growth of new blooms. It's a bit of a paradox, isn't it... 'loss' actually encourages productivity. Bright petals bloom, making the garden feel more alive.",
            id: "Memetik bunga justru merangsang pertumbuhan bunga baru. Sedikit paradoks ya… “kehilangan” malah mendorong produktivitas. Kelopak cerah bermekaran dan membuat kebun terasa lebih ramai."
        },
        tags: ["flower", "botany", "starter"],
        habitat: "flower_bed",
        sellValue: 7
    }),
    createSpecies({
        id: "sp_008",
        key: "moss_rose",
        name: {
            en: "Moss Rose",
            id: "Bunga Krokot"
        },
        scientificName: "Portulaca grandiflora",
        rarity: "common",
        image: "assets/Portulacagrandiflora.png",
        fact: {
            en: "It tolerates heat, survives droughts, and can even thrive in nutrient-poor soil. The secret lies in its succulent nature—its leaves store water like tiny bottles it carries everywhere.",
            id: "Dia tahan panas, tahan kering, bahkan tanah miskin nutrisi pun masih bisa ditinggali. Kuncinya ada pada sifat sukulen, daunnya menyimpan air seperti botol kecil yang selalu dibawa ke mana-mana."
        },
        unlockQuote: {
            en: "Each flower might only last a single day, but this plant continuously produces new blooms. It is not about the duration of a single moment, but the continuity.",
            id: "Setiap bunga mungkin hanya bertahan sehari, tapi tanaman ini terus-menerus menghasilkan bunga baru. Bukan tentang durasi satu momen, tapi kontinuitas."
        },
        tags: ["flower", "succulent", "light_sensitive"],
        habitat: "sunny_patch",
        sellValue: 8
    }),
    createSpecies({
        id: "sp_013",
        key: "touch-me-not",
        name: {
            en: "touch-me-not",
            id: "Putri Malu"
        },
        scientificName: "Mimosa pudica",
        rarity: "epic",
        image: "assets/Mimosapudica.png",
        fact: {
            en: "Even though it's not an animal, it can transmit electrical signals between cells. It's like a minimalist version of a nervous system... just enough to say, 'Hey, there's a disturbance!'",
            id: "Walau bukan hewan, dia bisa menghantarkan sinyal listrik antar sel. Mirip sistem saraf versi minimalis... cukup untuk bilang, 'Hei, ada gangguan!'"
        },
        unlockQuote: {
            en: "Folding and unfolding its leaves takes energy, so it won't react constantly without reason. Its common name is literally 'touch-me-not'—a perfect reminder that it's okay to set clear boundaries to protect your energy.",
            id: "Menutup dan membuka daun itu butuh energi. dia tidak akan terus-menerus bereaksi tanpa alasan. Jadi meskipun nama lokalnya putri malu, dia tidak malu untuk membuat batasan."
        },
        tags: ["plant", "sensitive", "botany"],
        habitat: "wild_grass",
        sellValue: 50,
        effects: {
            glow: true,
            sparkle: true
        }
    }),
    createSpecies({
        id: "sp_015",
        key: "tardigrade",
        name: {
            en: "Tardigrade",
            id: "Tardigrade"
        },
        scientificName: "Milnesium tardigradum",
        rarity: "legendary",
        image: "assets/Milnesiumtardigradum.png",
        fact: {
            en: "It’s only about 0.3 to 0.5 mm long. Yet, it can be found almost anywhere: from damp moss patches to the freezing ice of Antarctica.",
            id: "Panjangnya cuma sekitar 0,3–0,5 mm. Tapi dia bisa ditemukan hampir di mana saja: dari lumut lembap sampai es Antartika."
        },
        unlockQuote: {
            en: "Despite its incredible resilience, it still has its limits. Extreme conditions that last too long or are too intense can still be fatal. So, even with extreme tolerance, it remains an organism, just like us.",
            id: "Walaupun luar biasa tangguh, dia tetap punya batas. Kondisi ekstrem yang terlalu lama atau terlalu intens tetap bisa membunuhnya. Jadi meskipun punya toleransi ekstrem dia tetap organisme seperti kita."
        },
        tags: ["microorganism", "extremophile", "legendary"],
        habitat: "water_drop",
        sellValue: 150,
        effects: {
            glow: true,
            aura: true,
            sparkle: true,
            float: true
        }
    }),
    createSpecies({
        id: "sp_016",
        key: "troides_helena",
        name: {
            en: "Troides Helena",
            id: "Kupu-Kupu Troides Helena"
        },
        scientificName: "Troides helena",
        rarity: "legendary",
        image: "assets/Troideshelena.png",
        fact: {
            en: "Its wingspan can reach around 15–18 cm. When in flight, it feels less like a mere butterfly... and more like a small bird.",
            id: "Rentang sayapnya bisa mencapai sekitar 15-18 cm. Saat terbang, kesannya bukan sekadar kupu-kupu... lebih seperti burung kecil."
        },
        unlockQuote: {
            en: "Commonly found in Indonesia, especially in forests that are still well-preserved. Yet... they are increasingly threatened by the loss of their habitat.",
            id: "Banyak ditemukan di Indonesia, termasuk di hutan-hutan yang masih cukup terjaga. Tapi... mereka mulai terancam karena hilangnya habitat."
        },
        tags: ["butterfly", "pollinator", "endangered", "legendary", "flying"],
        habitat: "forest_canopy",
        sellValue: 120,
        effects: {
            glow: true,
            aura: true,
            sparkle: true,
            float: true
        }
    }),
    createSpecies({
        id: "sp_001",
        key: "great_white_shark",
        name: {
            en: "Great White Shark",
            id: "Hiu Putih Besar"
        },
        scientificName: "Carcharodon carcharias",
        rarity: "legendary",
        image: "assets/Carcharodoncarcharias.png",
        fact: {
            en: "Great white sharks have multiple rows of teeth, and if one falls out, it's immediately replaced by a new one. Throughout their lives, they can lose thousands of teeth... like a natural conveyor belt.",
            id: "Hiu putih besar punya beberapa baris gigi, dan kalau satu copot, langsung digantikan oleh yang baru. Sepanjang hidupnya, dia bisa kehilangan ribuan gigi… seperti conveyor belt alami."
        },
        unlockQuote: {
            en: "They take a long time to mature and produce very few offspring. This makes their population highly vulnerable to overfishing.",
            id: "Butuh waktu lama untuk dewasa, dan jumlah anaknya tidak banyak. Ini membuat populasinya rentan terhadap penangkapan berlebih."
        },
        tags: ["predator", "solitary", "marine", "apex"],
        habitat: "open_ocean",
        sellValue: 120,
        effects: {
            glow: true,
            aura: true,
            sparkle: true,
            float: true
        }
    })
];

window.speciesDatabase = speciesDatabase;
