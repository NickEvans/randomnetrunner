// Number of cards in each set, to determine rand max
const setCounts = [113, 120, 55, 120, 55, 120, 55, 120, 55, 114, 120, 120, 57, 132, 120, 58];

const colors = {
  'Neutral': '#a8a8a8',
  'NBN': '#FAE593',
  'Jinteki': '#E9A68F',
  'Weyland': '#A6B8A9',
  'Haas-Bioroid': '#C8ACCB',
  'Anarch': '#F6C5A1',
  'Criminal': '#9AC4D5',
  'Shaper': '#D2E9AA',
  'Sunny LeBeau': '#685B6B',
  'Apex': '#E07D96',
  'Adam': '#FCD6A0'
}

const root = document.documentElement;

function getFaction(faction_code) {
  switch(faction_code) {
    case 'nbn':
      return 'NBN';
    case 'jinteki':
      return 'Jinteki';
    case 'haas-bioroid':
      return 'Haas-Bioroid';
    case 'weyland-consortium':
      return 'Weyland';
    case 'criminal':
      return 'Criminal';
    case 'shaper':
      return 'Shaper';
    case 'anarch':
      return 'Anarch';
    case 'apex':
      return 'Apex';
    case 'sunny-lebeau':
      return 'Sunny LeBeau';
    case 'adam':
      return 'Adam';
    default:
      return 'Neutral';
  }
}

getCard = async function(code) {
  const url = 'https://netrunnerdb.com/api/2.0/public/card/' + code;
  return await fetch(url)
    .then(res => {
      return res.json();
    })
    .then(cjson => {
      return cjson.data[0];
    });
}

window.onload = function() {
  document.getElementById('new-card').onclick = e => {
    e.preventDefault();
    location.reload();
  }

  let set = Math.ceil(Math.random() * 13);
  set = ('00' + set).slice(-2);

  let card = Math.ceil(Math.random() * setCounts[set - 1]);
  card = ('000' + card).slice(-3);
  
  const cardCode = set + card;

  getCard(cardCode).then(info => {
    document.getElementById('cardTitle').innerHTML = info.title;

    // Wrap body text in <p> tags
    const bodyText = info.text.replace(/[^\r\n]+/gm, line => '<p>' + line + '</p>');
    document.getElementById('cardText').innerHTML = bodyText;

    if(info.flavor)
      document.getElementById('cardFlavor').innerHTML = info.flavor;
    
    const f = info.faction_code;
    const faction = getFaction(f);

    const t = info.type_code;
    const type = t.replace(/^\w/, c => c.toUpperCase());

    let costText;
    switch(type) {
      case 'Ice':
      case 'Asset':
      case 'Upgrade':
        costText = faction + ' ' + type + ' &bull; Rez: ' + info.cost;
        break;
      case 'Agenda':
        costText = faction + ' ' + type + ' &bull; Adv: ' + info.advancement_cost + ' &bull; Points: ' + info.agenda_points;
        break;
      case 'Identity':
        costText = type + ' &bull; Deck: ' + info.minimum_deck_size + ' &bull; Influence: ' + info.influence_limit;
        break;
      default:
        costText = faction + ' ' + type + ' &bull; Cost: ' + info.cost;
        break;
    }
    document.getElementById('cardType').innerHTML = costText;

    root.style.setProperty('--main-color', colors[faction]);

    document.getElementById('cardImg').src = (info.image_url === undefined) ? `https://netrunnerdb.com/card_image/${cardCode}.png` : info.image_url;

    document.getElementById('nrdb-link').href = 'https://netrunnerdb.com/en/card/' + cardCode;
  }).then( () => {
    // Reveal card after info is retreived
    document.getElementById('cardInfo').classList.remove('hidden');
  });
}
