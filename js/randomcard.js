// Number of cards in each set, to determine rand max
const setCounts = [113, 120, 55, 120, 55, 120, 55, 120, 55, 114, 120, 120, 57, 132, 120, 58];

const colors = {
  'Neutral': '#a8a8a8',
  'NBN': '#d4c906',
  'Jinteki': '#db0909',
  'Weyland': '#41663c',
  'Haas-Bioroid': '#920aad',
  'Anarch': '#ed8d0e',
  'Criminal': '#0a7aa6',
  'Shaper': '#44a805',
  'Sunny LeBeau': '#4a2652',
  'Apex': '#700404',
  'Adam': '#614c0e'
}

window.onload = function() {
  const set = ('00' + Math.ceil(Math.random() * 13)).slice(-2);
  const card = ('000' + Math.ceil(Math.random() * setCounts[parseInt(set - 1)])).slice(-3);

  const cardCode = set + card;

  getCard(cardCode).then(info => {
    document.getElementById('cardTitle').innerHTML = info.title;

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

    document.getElementById('cardInfo').style.borderLeftColor = colors[faction];

    document.getElementById('cardImg').src = (info.image_url === undefined) ? `https://netrunnerdb.com/card_image/${cardCode}.png` : info.image_url;

    document.getElementById('cardInfo').classList.remove('hidden');
  });
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

function addSymbols(string) {
  
}

function getFaction(faction_code) {
  switch(faction_code) {
    case 'neutral-corp':
    case 'neutral-runner':
      return 'Neutral';
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
  }
}