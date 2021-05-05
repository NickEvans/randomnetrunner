const root = document.documentElement;

const factions = {
  'nbn': { 'name': 'NBN', 'color': '#FAE593', 'icon': '\ue915' },
  'jinteki': { 'name': 'Jinteki', 'color': '#E9A68F', 'icon': '\ue916' },
  'haas-bioroid': { 'name': 'Haas-Bioroid', 'color': '#C8ACCB', 'icon': '\ue918' },
  'weyland-consortium': { 'name': 'Weyland', 'color': '#A6B8A9', 'icon': '\ue917' },
  'criminal': { 'name': 'Criminal', 'color': '#9AC4D5', 'icon': '\ue919' },
  'shaper': { 'name': 'Shaper', 'color': '#D2E9AA', 'icon': '\ue91b' },
  'anarch': { 'name': 'Anarch', 'color': '#F6C5A1', 'icon': '\ue91a' },
  'apex': { 'name': 'Apex', 'color': '#E07D96', 'icon': '\ue91e' },
  'sunny-lebeau': { 'name': 'Sunny LeBeau', 'color': '#685B6B', 'icon': '\ue91c' },
  'adam': { 'name': 'Adam', 'color': '#FCD6A0', 'icon': '\ue91d' },
  'neutral-corp': { 'name': 'Neutral', 'color': '#A8A8A8', 'icon': '' },
  'neutral-runner': { 'name': 'Neutral', 'color': '#A8A8A8', 'icon': '' }
}

const icons = {
  '[subroutine]': '\ue900',
  '[credit]': '\ue90B',
  '[click]': '\ue909',
  '[trash]': '\ue905',
  '[link]': '\ue908',
  '[recurring-credit]': '\ue90A',
  '[mu]': '\ue904',
  '[interrupt]': '\ue92B'
}

window.onload = function () {
  const cardCode = generateCardCode();

  setClickHandlers(cardCode);

  fetchCardInfo(cardCode)
    .then(info => renderCard(info))
    .then(revealCard);
}

function generateCardCode() {
  const setCounts = [113, 120, 55, 120, 55, 120, 55, 120,
    55, 114, 120, 120, 57, 132, 120, 58];

  let set = Math.ceil(Math.random() * 13);
  set = ('00' + set).slice(-2);

  let card = Math.ceil(Math.random() * setCounts[set - 1]);
  card = ('000' + card).slice(-3);

  const cardCode = set + card;

  return cardCode;
}

function setClickHandlers(cardCode) {
  // "See a New Card"
  document.getElementById('new-card').onclick = e => {
    e.preventDefault();
    location.reload();
  }

  // "View on NetrunnerDB"
  document.getElementById('nrdb-link').href = `https://netrunnerdb.com/en/card/${cardCode}`;
}

fetchCardInfo = async function(code) {
  const url = `https://netrunnerdb.com/api/2.0/public/card/${code}`;
  return await fetch(url)
    .then(res => {
      return res.json();
    })
    .then(cjson => {
      return cjson.data[0];
    }).catch(err => {
      console.log(`Error with card #${code}: ${err}`);
    });
}

function renderCard(info) {
  const factionName = factions[info.faction_code].name;
  const type = info.type_code.replace(/^\w/, c => c.toUpperCase());
  const icon = factions[info.faction_code].icon;
  const cardCode = info.code;

  root.style.setProperty('--main-color', factions[info.faction_code].color);

  // Format card name
  let title = info.title;
  if (info.uniqueness)
    title = `\u2666 ${title}`;
  document.getElementById('cardTitle').innerHTML = title;

  // Format cost and stats
  let costText = [];
  if (type === 'Identity' &&
    (factionName === 'Apex' || factionName === 'Sunny LeBeau' || factionName === 'Adam'))
    costText.push(type);
  else
    costText.push(`<span class="icon">${icon}</span> ${factionName} ${type}`);

  if (info.cost)
    if (type === 'Ice' || type === 'Asset' || type === 'Upgrade')
      costText.push(`Rez: ${info.cost}`);
    else
      costText.push(`Cost: ${info.cost}`);
  if (info.memory_cost)
    costText.push(`MU: ${info.memory_cost}`);
  if (info.strength)
    costText.push(`Strength: ${info.strength}`);
  if (info.trash_cost)
    costText.push(`Trash: ${info.trash_cost}`);
  if (info.advancement_cost)
    costText.push(`Adv: ${info.advancement_cost}`);
  if (info.agenda_points)
    costText.push(`Points: ${info.advancement_cost}`);
  if (info.minimum_deck_size)
    costText.push(`Deck: ${info.minimum_deck_size}`);
  if (info.influence_limit)
    costText.push(`Influence: ${info.influence_limit}`);
  const costHTML = costText.join(' &bull; ');
  document.getElementById('cardType').innerHTML = costHTML;

  // Filter card text body
  if (info.text) {
    const bodyHTML = info.text.replace(/[^\r\n]+/gm, line => `<p>${line}</p>`)
      .replace(/\[[a-z]+\-*[a-z]+\]/gm, code => `<span class="icon">${icons[code]}</span>`)
      .replace(/Trace (\d)/gm, t => `<b>Trace${t.slice(-1).sup()}</b> - `);
    document.getElementById('cardText').innerHTML = bodyHTML;
  }

  // Flavor text
  document.getElementById('cardFlavor').innerHTML = info.flavor ?? '';

  // Image
  const cardImgElement = document.getElementById('cardImg');
  cardImgElement.src = info.image_url ?? `https://netrunnerdb.com/card_image/${cardCode}.png`;
  cardImgElement.onload = function () {
    this.style.opacity = 1;
  }


}

function revealCard() {
  // Hide loader 
  document.getElementById('loader-main').classList.add('hidden');

  // Reveal card info
  document.getElementById('cardInfo').classList.remove('hidden');

  // Play highlight animation on card title
  document.getElementById('cardTitle').classList.add('animated');
}