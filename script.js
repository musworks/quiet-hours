import { translations } from "./locales/translations.js";

const STORAGE_KEY = "quietHoursData";
const LEGACY_STORAGE_KEY = "bioGardenData";

const TIME_PRESETS = [
    { value: 10, unit: "minutes" },
    { value: 15, unit: "minutes" },
    { value: 20, unit: "minutes" },
    { value: 25, unit: "minutes" },
    { value: 30, unit: "minutes" },
    { value: 45, unit: "minutes" },
    { value: 60, unit: "minutes" }
];

const DEFAULT_TIME = { value: 25, unit: "minutes" };
const RARITY_WEIGHTS = {
    common: 60,
    rare: 25,
    epic: 10,
    legendary: 5
};
const PITY_START_AFTER = 2;
const PITY_HARD_LIMIT = 6;
const PITY_STATE_VERSION = 1;
const POPUP_FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
].join(",");

const timeDisplay = document.getElementById("time-display");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const timeOptions = document.getElementById("time-options");
const popup = document.getElementById("popup");
const closePopupBtn = document.getElementById("close-popup");
const notificationStatusUI = document.getElementById("notification-status");
const sessionCountUI = document.getElementById("session-count");
const speciesCountUI = document.getElementById("species-count");
const latestDiscoveryUI = document.getElementById("latest-discovery");
const latestEmojiUI = document.getElementById("latest-emoji");
const latestNameUI = document.getElementById("latest-name");
const latestCommonNameUI = document.getElementById("latest-common-name");
const latestNoteUI = document.getElementById("latest-note");
const latestQuoteUI = document.getElementById("latest-quote");
const latestRarityUI = document.getElementById("latest-rarity");
const gardenArea = document.getElementById("garden-area");
const emptyGardenMsg = document.getElementById("empty-garden-msg");
const archiveIntroTextUI = document.getElementById("archive-intro-text");
const archiveListTitleUI = document.getElementById("archive-list-title");
const archiveListHintUI = document.getElementById("archive-list-hint");
const archiveListUI = document.getElementById("archive-list");
const appNameUI = document.getElementById("app-name");
const taglineUI = document.getElementById("tagline");
const supportingLineUI = document.getElementById("supporting-line");
const timeOptionsLabelUI = document.getElementById("time-options-label");
const controlsMicrocopyUI = document.getElementById("controls-microcopy");
const welcomeBackUI = document.getElementById("welcome-back");
const gardenTitleUI = document.getElementById("garden-title");
const sessionsLabelUI = document.getElementById("sessions-label");
const speciesLabelUI = document.getElementById("species-label");
const latestDiscoveryLabelUI = document.getElementById("latest-discovery-label");
const popupContentUI = document.querySelector(".popup-content");
const popupTitleUI = document.querySelector(".popup-content h2");
const popupTextUI = document.querySelector(".popup-content p");
const langEnBtn = document.getElementById("lang-en");
const langIdBtn = document.getElementById("lang-id");
const supportLinkUI = document.getElementById("support-link");

let currentLanguage = "en";
let timerInterval = null;
let timeLeft = 0;
let isRunning = false;
let hasStarted = false;
let timerEndsAt = null;
let sessionCount = 0;
let speciesCount = 0;
let currentReward = null;
let gardenCollection = [];
let selectedArchiveEntryNumber = null;
let notificationStatusKey = null;
let notificationStatusTone = "calm";
let lastFocusedElementBeforePopup = null;
let pityState = {
    version: PITY_STATE_VERSION,
    lowRarityStreak: 0,
    lastRarity: null
};

function notificationsSupported() {
    return "Notification" in window;
}

function getNotificationPermissionState() {
    if (!notificationsSupported()) return "unsupported";
    return Notification.permission;
}

function setNotificationStatus(messageKey = null, tone = "calm") {
    notificationStatusKey = messageKey;
    notificationStatusTone = tone;

    notificationStatusUI.textContent = messageKey ? t(messageKey) : "";
    notificationStatusUI.classList.toggle("is-positive", tone === "positive");
    notificationStatusUI.classList.toggle("is-calm", tone !== "positive");
}

function refreshNotificationStatus() {
    if (notificationStatusKey) {
        setNotificationStatus(notificationStatusKey, notificationStatusTone);
        return;
    }

    const permissionState = getNotificationPermissionState();

    if (permissionState === "granted") {
        setNotificationStatus("notificationStatusGranted", "positive");
        return;
    }

    if (permissionState === "denied") {
        setNotificationStatus("notificationStatusDenied");
        return;
    }

    if (permissionState === "unsupported") {
        setNotificationStatus("notificationStatusUnavailable");
        return;
    }

    setNotificationStatus("notificationStatusDefault");
}

function t(key) {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
}

function getLocalizedText(field, lang = currentLanguage) {
    if (typeof field === "string") return field;
    if (!field || typeof field !== "object") return "";

    return field[lang] || field.en || field.id || "";
}

function getSpeciesName(species, lang = currentLanguage) {
    return getLocalizedText(species.name, lang);
}

function getSpeciesFact(species, lang = currentLanguage) {
    return getLocalizedText(species.fact, lang);
}

function getSpeciesUnlockQuote(species, lang = currentLanguage) {
    return getLocalizedText(species.unlockQuote, lang);
}

function getArchiveLevelLabel(rarity) {
    const rarityMap = {
        common: t("rarityCommon"),
        rare: t("rarityRare"),
        epic: t("rarityEpic"),
        legendary: t("rarityLegendary")
    };

    return rarityMap[rarity] || rarity;
}

function getSelectedTimeConfig() {
    const selectedOption = timeOptions.options[timeOptions.selectedIndex];
    return {
        value: parseInt(selectedOption.value, 10),
        unit: selectedOption.dataset.unit || "minutes"
    };
}

function formatTimeOptionLabel(value, unit, label) {
    if (label) return label;
    const unitLabel = unit === "seconds" ? t("secondsUnit") : t("minutesUnit");
    return `${value} ${unitLabel}`;
}

function safeParseStorage(key, fallback = null) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
        console.warn(`Invalid localStorage data for ${key}. Resetting...`, error);
        localStorage.removeItem(key);
        return fallback;
    }
}

function getStoredData() {
    return safeParseStorage(STORAGE_KEY, null) || safeParseStorage(LEGACY_STORAGE_KEY, null);
}

function isRareOrHigher(rarity) {
    return rarity === "rare" || rarity === "epic" || rarity === "legendary";
}

function getTrailingLowRarityStreak(collection = []) {
    let streak = 0;

    for (let index = collection.length - 1; index >= 0; index--) {
        const rarity = collection[index]?.rarity || "common";
        if (isRareOrHigher(rarity)) break;

        streak++;
    }

    return Math.min(streak, PITY_HARD_LIMIT);
}

function normalizePityState(rawState, collection = []) {
    const latestArchivedRarity = collection.length
        ? collection[collection.length - 1]?.rarity || null
        : null;
    const lastRarity = typeof rawState?.lastRarity === "string"
        ? rawState.lastRarity
        : latestArchivedRarity;
    const inferredStreak = getTrailingLowRarityStreak(collection);
    const savedStreak = Number.isInteger(rawState?.lowRarityStreak)
        ? rawState.lowRarityStreak
        : inferredStreak;
    const lowRarityStreak = isRareOrHigher(lastRarity)
        ? 0
        : Math.min(Math.max(savedStreak, 0), PITY_HARD_LIMIT);

    return {
        version: PITY_STATE_VERSION,
        lowRarityStreak,
        lastRarity
    };
}

function getPityAdjustedRarityWeights() {
    const streak = Math.min(Math.max(pityState.lowRarityStreak || 0, 0), PITY_HARD_LIMIT);

    if (streak >= PITY_HARD_LIMIT) {
        return {
            common: 0,
            rare: 70,
            epic: 20,
            legendary: 10
        };
    }

    if (streak < PITY_START_AFTER) {
        return { ...RARITY_WEIGHTS };
    }

    const pitySteps = streak - PITY_START_AFTER + 1;

    return {
        common: Math.max(0, RARITY_WEIGHTS.common - (pitySteps * 10)),
        rare: RARITY_WEIGHTS.rare + (pitySteps * 7),
        epic: RARITY_WEIGHTS.epic + (pitySteps * 2),
        legendary: RARITY_WEIGHTS.legendary + pitySteps
    };
}

function selectRarityFromWeights(weights) {
    const entries = Object.entries(weights).filter(([, weight]) => weight > 0);
    const totalWeight = entries.reduce((total, [, weight]) => total + weight, 0);
    let roll = Math.random() * totalWeight;

    for (const [rarity, weight] of entries) {
        roll -= weight;
        if (roll < 0) return rarity;
    }

    return entries[entries.length - 1]?.[0] || "common";
}

function updatePityStateForReward(reward) {
    const rarity = reward?.rarity || "common";

    pityState = {
        version: PITY_STATE_VERSION,
        lowRarityStreak: isRareOrHigher(rarity)
            ? 0
            : Math.min((pityState.lowRarityStreak || 0) + 1, PITY_HARD_LIMIT),
        lastRarity: rarity
    };
}

function renderTimeOptions() {
    const previousSelection = timeOptions.options.length
        ? getSelectedTimeConfig()
        : DEFAULT_TIME;

    timeOptions.innerHTML = "";

    TIME_PRESETS.forEach((preset) => {
        const option = document.createElement("option");
        option.value = String(preset.value);
        option.dataset.unit = preset.unit;
        option.textContent = formatTimeOptionLabel(preset.value, preset.unit, preset.label);

        const shouldSelect = preset.value === previousSelection.value && preset.unit === previousSelection.unit;
        if (shouldSelect) option.selected = true;

        timeOptions.appendChild(option);
    });
}

function getSavedTimerState() {
    return getStoredData()?.timerState || null;
}

function getSelectedTimeInSeconds() {
    const selectedOption = getSelectedTimeConfig();
    return selectedOption.unit === "seconds" ? selectedOption.value : selectedOption.value * 60;
}

function setSelectedTimeConfig(config = DEFAULT_TIME) {
    const { value, unit } = config;
    const matchingOption = Array.from(timeOptions.options).find((option) => (
        parseInt(option.value, 10) === value && (option.dataset.unit || "minutes") === unit
    ));

    if (matchingOption) {
        matchingOption.selected = true;
    }
}

function syncLanguageToggle() {
    langEnBtn.classList.toggle("is-active", currentLanguage === "en");
    langIdBtn.classList.toggle("is-active", currentLanguage === "id");
    langEnBtn.setAttribute("aria-pressed", String(currentLanguage === "en"));
    langIdBtn.setAttribute("aria-pressed", String(currentLanguage === "id"));
}

function getPopupFocusableElements() {
    return Array.from(popup.querySelectorAll(POPUP_FOCUSABLE_SELECTOR))
        .filter((element) => element.offsetParent !== null || element === document.activeElement);
}

function openRewardPopup() {
    const activeElement = document.activeElement;
    lastFocusedElementBeforePopup = activeElement instanceof HTMLElement && !popup.contains(activeElement)
        ? activeElement
        : startBtn;

    popup.classList.remove("hidden");
    popup.setAttribute("aria-hidden", "false");

    requestAnimationFrame(() => {
        closePopupBtn.focus();
    });
}

function returnFocusAfterPopupClose() {
    const focusTarget = lastFocusedElementBeforePopup instanceof HTMLElement
        && document.contains(lastFocusedElementBeforePopup)
        ? lastFocusedElementBeforePopup
        : startBtn;

    focusTarget?.focus?.();
    lastFocusedElementBeforePopup = null;
}

function closeRewardPopup() {
    if (popup.classList.contains("hidden")) return;

    popup.classList.add("hidden");
    popup.setAttribute("aria-hidden", "true");

    if (currentReward) {
        plantToGarden(currentReward);
        currentReward = null;
    }

    notificationStatusKey = null;
    refreshNotificationStatus();
    returnFocusAfterPopupClose();
}

function handlePopupKeydown(event) {
    if (popup.classList.contains("hidden")) return;

    if (event.key === "Escape") {
        event.preventDefault();
        closeRewardPopup();
        return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = getPopupFocusableElements();
    const firstElement = focusableElements[0] || popupContentUI;
    const lastElement = focusableElements[focusableElements.length - 1] || popupContentUI;

    if (!popup.contains(document.activeElement)) {
        event.preventDefault();
        firstElement.focus();
        return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const displayMinutes = minutes < 10 ? "0" + minutes : minutes;
    const displaySeconds = seconds < 10 ? "0" + seconds : seconds;

    timeDisplay.textContent = `${displayMinutes}:${displaySeconds}`;
}

function updateButtons() {
    if (!hasStarted) {
        startBtn.textContent = t("startFocus");
        startBtn.disabled = false;
        startBtn.classList.remove("btn-disabled");
        pauseBtn.classList.add("hidden");
        pauseBtn.textContent = t("pause");
        return;
    }

    startBtn.disabled = true;
    startBtn.classList.add("btn-disabled");
    pauseBtn.classList.remove("hidden");

    if (isRunning) {
        startBtn.textContent = t("focusRunning");
        pauseBtn.textContent = t("pause");
    } else {
        startBtn.textContent = t("breakTime");
        pauseBtn.textContent = t("resume");
    }
}

function createSpeciesVisual(species, className = "") {
    if (!species.image) {
        const placeholder = document.createElement("span");
        placeholder.className = className ? `${className} species-visual-placeholder` : "species-visual-placeholder";
        placeholder.setAttribute("aria-hidden", "true");
        return placeholder;
    }

    const image = document.createElement("img");
    image.src = species.image;
    image.alt = getSpeciesName(species);
    image.className = className;
    image.loading = "lazy";
    return image;
}

function applySpeciesEffects(species) {
    const rewardImage = popupContentUI?.querySelector(".popup-reward-art");
    const effectClasses = [
        "effect-glow",
        "effect-aura",
        "effect-sparkle",
        "rarity-common",
        "rarity-minor",
        "rarity-rare",
        "rarity-noted",
        "rarity-epic",
        "rarity-marked",
        "rarity-legendary",
        "rarity-singular"
    ];

    if (!popupContentUI || !species) return;

    popupContentUI.classList.remove(...effectClasses);
    rewardImage?.classList.remove("effect-float");

    const rarity = species.rarity || "common";
    popupContentUI.classList.add(`rarity-${rarity}`);

    if (rarity === "rare" || rarity === "noted" || rarity === "epic" || rarity === "marked") {
        popupContentUI.classList.add("effect-glow");
        rewardImage?.classList.add("effect-float");
    }

    if (rarity === "legendary" || rarity === "singular") {
        popupContentUI.classList.add("effect-glow", "effect-aura", "effect-sparkle");
        rewardImage?.classList.add("effect-float");
    }
}

function updateLatestDiscovery(reward) {
    if (!reward) return;

    latestEmojiUI.innerHTML = "";
    latestEmojiUI.appendChild(createSpeciesVisual(reward, "latest-discovery-art"));
    latestNameUI.textContent = reward.scientificName;
    latestCommonNameUI.textContent = getSpeciesName(reward);
    latestCommonNameUI.style.display = getSpeciesName(reward) === reward.scientificName ? "none" : "block";
    latestNoteUI.textContent = getSpeciesFact(reward);
    latestQuoteUI.textContent = getSpeciesUnlockQuote(reward);
    latestQuoteUI.classList.toggle("hidden", !getSpeciesUnlockQuote(reward));
    latestRarityUI.textContent = getArchiveLevelLabel(reward.rarity);
    latestRarityUI.className = `badge ${reward.rarity}`;
    latestDiscoveryUI.classList.remove("hidden");
}

function getRewardByEntryNumber(entryNumber) {
    if (!Number.isInteger(entryNumber)) return null;
    return gardenCollection[entryNumber - 1] || null;
}

function getActiveArchiveEntryNumber() {
    if (getRewardByEntryNumber(selectedArchiveEntryNumber)) {
        return selectedArchiveEntryNumber;
    }

    return sessionCount > 0 ? sessionCount : null;
}

function updateArchiveDetail() {
    const activeEntryNumber = getActiveArchiveEntryNumber();
    const reward = getRewardByEntryNumber(activeEntryNumber);

    if (!reward) {
        latestDiscoveryUI.classList.add("hidden");
        return;
    }

    latestDiscoveryLabelUI.textContent = activeEntryNumber === sessionCount
        ? t("latestDiscovery")
        : t("selectedDiscovery");

    updateLatestDiscovery(reward);
}

function createArchiveListItem(species, entryNumber, isActive) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = `archive-list-item rarity-${species.rarity}${isActive ? " is-active" : ""}`;
    item.setAttribute("aria-pressed", String(isActive));

    const label = document.createElement("span");
    label.className = "archive-item-index";
    label.textContent = `${t("archiveEntryLabel")} ${entryNumber}`;

    const scientificName = document.createElement("strong");
    scientificName.className = "archive-item-name";
    scientificName.textContent = species.scientificName;

    const commonName = document.createElement("span");
    commonName.className = "archive-item-common";
    commonName.textContent = getSpeciesName(species);
    if (getSpeciesName(species) === species.scientificName) {
        commonName.style.display = "none";
    }

    const level = document.createElement("span");
    level.className = `archive-item-level badge ${species.rarity}`;
    level.textContent = getArchiveLevelLabel(species.rarity);

    item.append(label, scientificName, commonName, level);
    item.addEventListener("click", () => {
        selectedArchiveEntryNumber = entryNumber;
        renderGarden();
        updateArchiveDetail();
    });

    return item;
}

function renderGarden() {
    archiveListUI.innerHTML = "";

    if (gardenCollection.length > 0) {
        emptyGardenMsg.style.display = "none";
    } else {
        emptyGardenMsg.style.display = "block";
        emptyGardenMsg.textContent = t("emptyGarden");
    }

    const recentEntries = gardenCollection.slice(-3).reverse();

    if (recentEntries.length === 0) {
        const emptyList = document.createElement("p");
        emptyList.className = "archive-list-empty";
        emptyList.textContent = t("archiveEmptyList");
        archiveListUI.appendChild(emptyList);
        selectedArchiveEntryNumber = null;
        latestDiscoveryUI.classList.add("hidden");
        return;
    }

    const activeEntryNumber = getActiveArchiveEntryNumber();

    recentEntries.forEach((species, index) => {
        const entryNumber = sessionCount - index;
        archiveListUI.appendChild(
            createArchiveListItem(species, entryNumber, entryNumber === activeEntryNumber)
        );
    });
}

function saveData() {
    const latestDiscovery = gardenCollection.length > 0
        ? gardenCollection[gardenCollection.length - 1]
        : null;
    const selectedTime = getSelectedTimeConfig();

    const dataPacket = {
        sessionCount,
        speciesCount,
        gardenCollection,
        latestDiscovery,
        pityState,
        timerState: {
            selectedTime,
            timeLeft,
            hasStarted,
            isRunning,
            timerEndsAt
        }
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataPacket));
}

function requestNotificationPermissionIfNeeded() {
    if (!notificationsSupported()) {
        setNotificationStatus("notificationStatusUnavailable");
        return;
    }

    if (Notification.permission !== "default") {
        refreshNotificationStatus();
        return;
    }

    Notification.requestPermission()
        .then((permission) => {
            if (permission === "granted") {
                setNotificationStatus("notificationStatusGranted", "positive");
            } else if (permission === "denied") {
                setNotificationStatus("notificationStatusDenied");
            } else {
                setNotificationStatus("notificationStatusDefault");
            }
        })
        .catch(() => {
            setNotificationStatus("notificationStatusError");
        });
}

function showRewardNotification(reward) {
    if (!notificationsSupported()) return false;
    if (Notification.permission !== "granted") return false;
    if (!document.hidden && document.hasFocus()) return false;

    const rewardName = getSpeciesName(reward);
    const bodyLines = [
        `${t("rewardNotificationBody")} ${reward.scientificName}`,
        rewardName !== reward.scientificName ? rewardName : "",
        getSpeciesFact(reward)
    ].filter(Boolean);

    const notification = new Notification(t("rewardNotificationTitle"), {
        body: bodyLines.join("\n"),
        icon: "favicon.png",
        badge: "favicon.png",
        tag: "mustimere-reward"
    });

    notification.onclick = () => {
        window.focus();
        notification.close();
    };

    setNotificationStatus("notificationStatusGranted", "positive");
    return true;
}

function completeSession() {
    isRunning = false;

    const reward = pullGacha();
    currentReward = reward;

    popupTitleUI.textContent = t("sessionComplete");
    popupTextUI.innerHTML = getRewardMarkup(reward);
    applySpeciesEffects(reward);

    const notificationShown = showRewardNotification(reward);
    if (!notificationShown) {
        const permissionState = getNotificationPermissionState();
        if (permissionState !== "granted") {
            setNotificationStatus("notificationStatusFallback");
        }
    }
    resetTimer();
    openRewardPopup();
}

function loadData() {
    const parsedData = getStoredData();
    if (!parsedData) return;

    sessionCount = parsedData.sessionCount || 0;
    gardenCollection = parsedData.gardenCollection || [];
    pityState = normalizePityState(parsedData.pityState, gardenCollection);

    const uniqueSpecies = new Set(gardenCollection.map((species) => species.id));
    speciesCount = uniqueSpecies.size;

    const savedTimerState = parsedData.timerState;
    if (savedTimerState?.selectedTime) {
        setSelectedTimeConfig(savedTimerState.selectedTime);
    }

    if (savedTimerState?.hasStarted) {
        hasStarted = true;

        if (savedTimerState.isRunning && savedTimerState.timerEndsAt) {
            timerEndsAt = savedTimerState.timerEndsAt;
            timeLeft = Math.max(0, Math.ceil((timerEndsAt - Date.now()) / 1000));

            if (timeLeft <= 0) {
                completeSession();
            } else {
                isRunning = true;
                timeOptions.disabled = true;
                startInterval();
            }
        } else {
            isRunning = false;
            timerEndsAt = null;
            timeLeft = savedTimerState.timeLeft || getSelectedTimeInSeconds();
            timeOptions.disabled = true;
        }
    } else {
        timeLeft = getSelectedTimeInSeconds();
    }

    sessionCountUI.textContent = sessionCount;
    speciesCountUI.textContent = speciesCount;

    renderGarden();
    updateArchiveDetail();

    if (!localStorage.getItem(STORAGE_KEY)) {
        saveData();
    }
}

function getRewardMarkup(reward) {
    const rewardVisual = reward.image
        ? `<img src="${reward.image}" alt="${getSpeciesName(reward)}" class="popup-reward-art">`
        : `<span class="popup-reward-art species-visual-placeholder" aria-hidden="true"></span>`;
    const commonNameMarkup = getSpeciesName(reward) !== reward.scientificName
        ? `<span>${getSpeciesName(reward)}</span><br>`
        : "";

    return `
        ${t("popupIntro")}<br>
        <span class="popup-reward-visual">${rewardVisual}</span><br>
        <strong>${reward.scientificName}</strong><br>
        ${commonNameMarkup}
        <span class="popup-rarity-chip ${reward.rarity}">
            ${t("rarityLabel")}: ${getArchiveLevelLabel(reward.rarity)}
        </span><br>
        <small>${getSpeciesFact(reward)}</small>
    `;
}

function renderUI() {
    document.documentElement.lang = currentLanguage;
    document.title = t("pageTitle");
    appNameUI.textContent = t("appName");
    taglineUI.textContent = t("tagline");
    supportingLineUI.textContent = t("supportingLine");
    timeOptionsLabelUI.textContent = t("chooseFocusTime");
    controlsMicrocopyUI.textContent = t("controlsMicrocopy");
    welcomeBackUI.textContent = t("welcomeBack");
    gardenTitleUI.textContent = t("yourGarden");
    sessionsLabelUI.textContent = t("sessionsDone");
    speciesLabelUI.textContent = t("speciesFound");
    archiveIntroTextUI.textContent = t("archiveIntro");
    archiveListTitleUI.textContent = t("archiveListTitle");
    archiveListHintUI.textContent = t("archiveListHint");
    latestDiscoveryLabelUI.textContent = t("latestDiscovery");
    emptyGardenMsg.textContent = t("emptyGarden");
    closePopupBtn.textContent = t("close");
    langEnBtn.textContent = t("languageEnglish");
    langIdBtn.textContent = t("languageIndonesian");
    supportLinkUI.textContent = t("supportLink");

    syncLanguageToggle();
    refreshNotificationStatus();
    renderTimeOptions();
    updateButtons();

    if (!hasStarted) {
        timeLeft = getSelectedTimeInSeconds();
        updateDisplay();
    }

    if (currentReward && !popup.classList.contains("hidden")) {
        popupTitleUI.textContent = t("sessionComplete");
        popupTextUI.innerHTML = getRewardMarkup(currentReward);
        applySpeciesEffects(currentReward);
    }

    renderGarden();
    updateArchiveDetail();
}

export function setLanguage(lang) {
    if (!translations[lang] || lang === currentLanguage) return;

    document.body.classList.add("is-language-switching");
    currentLanguage = lang;

    requestAnimationFrame(() => {
        renderUI();
        requestAnimationFrame(() => {
            document.body.classList.remove("is-language-switching");
        });
    });
}

window.setLanguage = setLanguage;

function startInterval() {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (!timerEndsAt) return;

        timeLeft = Math.max(0, Math.ceil((timerEndsAt - Date.now()) / 1000));
        updateDisplay();
        saveData();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            completeSession();
        }
    }, 1000);
}

function startTimer() {
    if (isRunning) return;

    hasStarted = true;
    isRunning = true;
    timeLeft = getSelectedTimeInSeconds();
    timerEndsAt = Date.now() + (timeLeft * 1000);
    timeOptions.disabled = true;
    notificationStatusKey = null;

    updateButtons();
    updateDisplay();
    refreshNotificationStatus();
    saveData();
    startInterval();
    requestNotificationPermissionIfNeeded();
}

function pauseTimer() {
    if (!hasStarted || !isRunning) return;

    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = Math.max(0, Math.ceil((timerEndsAt - Date.now()) / 1000));
    timerEndsAt = null;
    isRunning = false;
    saveData();
    updateDisplay();
    updateButtons();
}

function resumeTimer() {
    if (!hasStarted || isRunning) return;

    isRunning = true;
    timerEndsAt = Date.now() + (timeLeft * 1000);
    updateButtons();
    saveData();
    startInterval();
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;

    isRunning = false;
    hasStarted = false;
    timerEndsAt = null;
    timeLeft = getSelectedTimeInSeconds();
    timeOptions.disabled = false;

    updateDisplay();
    updateButtons();
    saveData();
}

function pullGacha() {
    const selectedRarity = selectRarityFromWeights(getPityAdjustedRarityWeights());

    const filteredSpecies = window.speciesDatabase.filter(
        (species) => species.rarity === selectedRarity
    );

    return filteredSpecies[Math.floor(Math.random() * filteredSpecies.length)];
}

function plantToGarden(reward) {
    sessionCount++;

    const isDuplicate = gardenCollection.some((species) => species.id === reward.id);
    if (!isDuplicate) {
        speciesCount++;
    }

    gardenCollection.push(reward);
    updatePityStateForReward(reward);
    selectedArchiveEntryNumber = sessionCount;

    sessionCountUI.textContent = sessionCount;
    speciesCountUI.textContent = speciesCount;

    renderGarden();
    updateArchiveDetail();
    saveData();
}

startBtn.addEventListener("click", startTimer);

pauseBtn.addEventListener("click", () => {
    if (isRunning) {
        pauseTimer();
    } else {
        resumeTimer();
    }
});

timeOptions.addEventListener("change", () => {
    if (hasStarted) return;

    timeLeft = getSelectedTimeInSeconds();
    updateDisplay();
    saveData();
});

closePopupBtn.addEventListener("click", closeRewardPopup);
document.addEventListener("keydown", handlePopupKeydown);

langEnBtn.addEventListener("click", () => setLanguage("en"));
langIdBtn.addEventListener("click", () => setLanguage("id"));

renderTimeOptions();
const initialTimerState = getSavedTimerState();
setSelectedTimeConfig(initialTimerState?.selectedTime || DEFAULT_TIME);
timeLeft = initialTimerState?.hasStarted
    ? (
        initialTimerState.isRunning && initialTimerState.timerEndsAt
            ? Math.max(0, Math.ceil((initialTimerState.timerEndsAt - Date.now()) / 1000))
            : (initialTimerState.timeLeft || getSelectedTimeInSeconds())
    )
    : getSelectedTimeInSeconds();
updateDisplay();
loadData();
renderUI();
