const root = document.documentElement;

const factions = {
  nbn: { name: "NBN", color: "#FAE593", icon: "\ue915" },
  jinteki: { name: "Jinteki", color: "#E9A68F", icon: "\ue916" },
  "haas-bioroid": { name: "Haas-Bioroid", color: "#C8ACCB", icon: "\ue918" },
  "weyland-consortium": { name: "Weyland", color: "#A6B8A9", icon: "\ue917" },
  criminal: { name: "Criminal", color: "#9AC4D5", icon: "\ue919" },
  shaper: { name: "Shaper", color: "#D2E9AA", icon: "\ue91b" },
  anarch: { name: "Anarch", color: "#F6C5A1", icon: "\ue91a" },
  apex: { name: "Apex", color: "#E07D96", icon: "\ue91e" },
  "sunny-lebeau": { name: "Sunny LeBeau", color: "#685B6B", icon: "\ue91c" },
  adam: { name: "Adam", color: "#FCD6A0", icon: "\ue91d" },
  "neutral-corp": { name: "Neutral", color: "#A8A8A8", icon: "" },
  "neutral-runner": { name: "Neutral", color: "#A8A8A8", icon: "" },
};

const icons = {
  "[subroutine]": "\ue900",
  "[credit]": "\ue90B",
  "[click]": "\ue909",
  "[trash]": "\ue905",
  "[link]": "\ue908",
  "[recurring-credit]": "\ue90A",
  "[mu]": "\ue904",
  "[interrupt]": "\ue92B",
};

window.onload = function () {
  const cardCode = generateCardCode();

  setClickHandlers(cardCode);

  fetchCardInfo(cardCode)
    .then((info) => renderCard(info))
    .then(revealCard);
};

function generateCardCode() {
  const setCounts = [
    113,
    120,
    55,
    120,
    55,
    120,
    55,
    120,
    55,
    114,
    120,
    120,
    57,
    132,
    120,
    58,
  ];

  let set = Math.ceil(Math.random() * 13);
  set = ("00" + set).slice(-2);

  let card = Math.ceil(Math.random() * setCounts[set - 1]);
  card = ("000" + card).slice(-3);

  const cardCode = set + card;

  return cardCode;
}

function setClickHandlers(cardCode) {
  // "See a New Card"
  document.getElementById("new-card").onclick = (e) => {
    e.preventDefault();
    location.reload();
  };

  // "View on NetrunnerDB"
  document.getElementById(
    "nrdb-link"
  ).href = `https://netrunnerdb.com/en/card/${cardCode}`;
}

fetchCardInfo = async function (code) {
  const url = `https://netrunnerdb.com/api/2.0/public/card/${code}`;
  return await fetch(url)
    .then((res) => res.json())
    .then((cjson) => cjson)
    .catch((err) => console.log(`Error with card #${code}: ${err}`));
};

function renderCard(response) {
  const info = response.data[0];
  const factionName = factions[info.faction_code].name;
  const type = info.type_code.replace(/^\w/, (c) => c.toUpperCase());
  const icon = factions[info.faction_code].icon;
  const cardCode = info.code;

  root.style.setProperty("--main-color", factions[info.faction_code].color);

  // Format card name
  const title = info.uniqueness ? `\u2666 ${info.title}` : info.title;
  document.getElementById("cardTitle").innerHTML = title;

  // Format cost and stats
  const costHTML = [
    type === "Identity" &&
    (factionName === "Apex" ||
      factionName === "Sunny LeBeau" ||
      factionName === "Adam")
      ? type
      : `<span class="icon">${icon}</span> ${factionName} ${type}`,
    info.cost &&
      (type === "Ice" || type === "Asset" || type === "Upgrade"
        ? `Rez: ${info.cost}`
        : `Cost: ${info.cost}`),
    info.memory_cost && `MU: ${info.memory_cost}`,
    info.strength && `Strength: ${info.strength}`,
    info.trash_cost && `Trash: ${info.trash_cost}`,
    info.advancement_cost && `Adv: ${info.advancement_cost}`,
    info.agenda_points && `Points: ${info.advancement_cost}`,
    info.minimum_deck_size && `Deck: ${info.minimum_deck_size}`,
    info.influence_limit && `Influence: ${info.influence_limit}`,
  ]
    .filter((x) => x != null)
    .join(" &bull; ");
  document.getElementById("cardType").innerHTML = costHTML;

  // Filter card text body
  if (info.text) {
    const bodyHTML = info.text
      .replace(/[^\r\n]+/gm, (line) => `<p>${line}</p>`)
      .replace(
        /\[[a-z]+\-*[a-z]+\]/gm,
        (code) => `<span class="icon">${icons[code]}</span>`
      )
      .replace(/Trace (\d)/gm, (t) => `<b>Trace${t.slice(-1).sup()}</b> - `);
    document.getElementById("cardText").innerHTML = bodyHTML;
  }

  // Flavor text
  document.getElementById("cardFlavor").innerHTML = info.flavor ?? "";

  // Image
  const cardImgElement = document.getElementById("cardImg");
  const imageUrl = response.imageUrlTemplate.replace('{code}', cardCode);
  cardImgElement.src = imageUrl;
  cardImgElement.onload = function() {
    this.style.opacity = 1;
  };
}

function revealCard() {
  // Hide loader
  document.getElementById("loader-main").classList.add("hidden");

  // Reveal card info
  document.getElementById("cardInfo").classList.remove("hidden");

  // Play highlight animation on card title
  document.getElementById("cardTitle").classList.add("animated");
}
