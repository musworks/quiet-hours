// ==========================================
// SPECIES DATABASE
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
            en: "Phalaenopsis amabilis is one of Indonesians national flowers, known as puspa pesona. In the wild, it grows as an epiphyte in humid tropical forests, often resting on tree branches where light and air can reach its roots.",
            id: "Phalaenopsis amabilis adalah salah satu bunga nasional Indonesia, dikenal sebagai puspa pesona. Di alam liar, anggrek ini hidup sebagai epifit di hutan tropis lembap, sering menempel pada cabang pohon agar akar-akarnya mendapat cahaya dan aliran udara."
        },
        unlockQuote: {
            en: "It does not need to own the tree to belong there. Some forms of life survive by finding the right place to hold on.",
            id: "Ia tidak perlu memiliki pohon untuk menjadi bagian dari sana. Beberapa kehidupan bertahan dengan menemukan tempat yang tepat untuk berpaut."
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
            en: "Monarch butterflies are known for their long migration across North America. Some travel more than 3,000 km to overwinter in Mexico, while the full northward cycle unfolds across several generations.",
            id: "Kupu-kupu monarch dikenal karena migrasi jauhnya melintasi Amerika Utara. Sebagian menempuh lebih dari 3.000 km untuk melewati musim dingin di Meksiko, sementara siklus perjalanan ke utara berlangsung lintas beberapa generasi."
        },
        unlockQuote: {
            en: "A journey this long is never carried by wings alone. It depends on host plants, resting places, forests, weather, and the fragile continuity between one generation and the next.",
            id: "Perjalanan sejauh ini tidak pernah ditopang oleh sayap saja. Ia bergantung pada tanaman inang, tempat singgah, hutan, cuaca, dan kesinambungan rapuh dari satu generasi ke generasi berikutnya."
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
            en: "A zinnia bloom is a flower head made of many small florets. The outer florets form the petal-like ring, while the center holds a dense cluster of disk florets.",
            id: "Satu kuntum bunga zinnia sebenarnya adalah kumpulan dari banyak bunga kecil. Bagian luar membentuk lingkaran kelopak, sementara bagian tengahnya dipadati oleh deretan bunga cakram."
        },
        unlockQuote: {
            en: "Removing spent blooms helps the plant keep flowering. Zinnia stays lively through repetition: bloom, fade, return.",
            id: "Memangkas bunga yang layu akan merangsang tanaman untuk terus berbunga. Zinnia merayakan kehidupan lewat siklus yang berulang: mekar, gugur, dan tumbuh kembali."
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
            en: "Portulaca grandiflora is a sun-loving succulent that tolerates heat, drought, and lean soil as long as the ground drains well. Its fleshy leaves store water, helping it stay lively in dry, bright places.",
            id: "Portulaca grandiflora adalah sukulen penyuka matahari yang tahan panas, kekeringan, dan tanah gersang selama drainasenya baik. Daunnya yang berdaging menyimpan air, membantu tanaman ini tetap segar di tempat yang terang dan kering."
        },
        unlockQuote: {
            en: "Its flowers often arrive briefly, then give way to new buds. Moss rose keeps its color through rhythm: opening, resting, and returning with the sun.",
            id: "Bunganya sering mekar sebentar, lalu memberi ruang bagi kuncup baru. Moss rose menjaga warnanya lewat ritme: merekah, beristirahat, lalu kembali bersama matahari."
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
            en: "Mimosa pudica folds its leaflets through electrical signals and rapid changes in turgor pressure inside the pulvinus, the small motor-like swelling at the base of its leaves.",
            id: "Mimosa pudica menutup anak daunnya melalui sinyal listrik dan perubahan cepat tekanan turgor di dalam pulvinus, bantalan kecil seperti pusat gerak di pangkal daunnya."
        },
        unlockQuote: {
            en: "Every fold has a cost. After repeated harmless touch, the plant may respond less, saving its motion for signals that matter.",
            id: "Setiap lipatan punya biaya. Setelah sentuhan berulang yang tidak berbahaya, tanaman ini bisa mengurangi responsnya, seolah menyimpan gerak untuk sinyal yang lebih berarti."
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
            en: "Milnesium tardigradum is a tiny tardigrade, usually less than 1 mm long. It is often found in moist mosses and lichens, but its range extends across many regions of the world, including Antarctica.",
            id: "Milnesium tardigradum adalah tardigrade kecil, biasanya kurang dari 1 mm. Ia sering ditemukan di lumut dan lichen yang lembap, tetapi sebarannya menjangkau banyak wilayah dunia, termasuk Antarktika."
        },
        unlockQuote: {
            en: "When conditions turn harsh, it enters cryptobiosis and carries life as a pause, waiting for water, warmth, and time to return.",
            id: "Saat kondisi menjadi sulit, ia memasuki kriptobiosis dan membawa hidup sebagai jeda, menunggu air, hangat, dan waktu kembali."
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
            en: "Troides helena is a large birdwing butterfly with a wingspan that can reach about 15 cm. Its dark forewings and golden-yellow hindwings give it a striking presence in forest edges, gardens, and lowland to montane habitats.",
            id: "Troides helena adalah kupu-kupu sayap burung berukuran besar dengan rentang sayap yang dapat mencapai sekitar 15 cm. Sayap depannya gelap, sementara sayap belakangnya kuning keemasan, membuatnya mencolok di tepi hutan, kebun, hingga habitat dataran rendah dan pegunungan."
        },
        unlockQuote: {
            en: "Large wings still depend on small details: host plants, living forests, and safe passages between one patch of habitat and another.",
            id: "Sayap besar tetap bergantung pada detail kecil: tanaman inang, hutan yang hidup, dan jalur aman dari satu petak habitat ke petak lainnya."
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
            en: "Great white sharks have broad, serrated teeth arranged in several rows. As front teeth are lost, teeth from behind can move forward, keeping the jaw armed throughout life.",
            id: "Hiu putih besar memiliki gigi lebar bergerigi yang tersusun dalam beberapa baris. Saat gigi depan lepas, gigi dari belakang dapat maju menggantikannya, menjaga rahangnya tetap siap sepanjang hidup."
        },
        unlockQuote: {
            en: "An apex predator can shape the ocean and still grow slowly, mature late, and leave only a small margin for recovery.",
            id: "Sebagai predator puncak, ia mampu membentuk wajah samudra. Namun, laju tumbuhnya lambat, masa kedewasaannya lama, dan populasi mereka sangat rapuh untuk bisa pulih kembali."
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
