const root = document.documentElement;

const setCounts = [113, 120, 55, 120, 55, 120, 55, 120, 
  55, 114, 120, 120, 57, 132, 120, 58];

const factions = {
    'nbn': { 'name': 'NBN', 'color': '#FAE593', 'icon': '\ue915' },
    'jinteki': { 'name': 'Jinteki', 'color': '#E9A68F', 'icon': '\ue916' },
    'haas-bioroid': { 'name': 'Haas-Bioroid', 'color': '#C8ACCB', 'icon': '\ue918' },
    'weyland-consortium': { 'name': 'Weyland', 'color': '#A6B8A9', 'icon': '\ue917' },
    'criminal': { 'name': 'Criminal', 'color': '#9AC4D5', 'icon': '\ue919' },
    'shaper': { 'name': 'Shaper', 'color': '#D2E9AA', 'icon': '\ue91b' },
    'anarch': { 'name': 'Anarch', 'color': '#F6C5A1', 'icon': '\ue91a' },
    'apex': { 'name': 'Apex', 'color': '#E07D96','icon': '\ue91e' },
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

getCard = async function(code) {
  const url = 'https://netrunnerdb.com/api/2.0/public/card/' + code;
  return await fetch(url)
    .then(res => {
      return res.json();
    })
    .then(cjson => {
      return cjson.data[0];
    }).catch(err => {
      console.log('Error with card #' + code + ': ' + err );
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
    const faction = factions[info.faction_code].name;
    const type = info.type_code.replace(/^\w/, c => c.toUpperCase());
    const icon = factions[info.faction_code].icon;

    root.style.setProperty('--main-color', factions[info.faction_code].color);

    // Format card name
    let title = info.title;
    if(info.uniqueness === true)
      title = '\u2666 ' + title;
    document.getElementById('cardTitle').innerHTML = title;
    
    // Format cost and stats
    let costText = [];
    if(type === 'Identity' &&
      (faction === 'Apex' || faction === 'Sunny LeBeau' || faction === 'Adam'))
        costText.push(type);
    else 
      costText.push('<span class="icon">' + icon + '</span> ' + faction + ' ' + type);
    if(info.cost !== undefined)
      if(type === 'Ice' || type === 'Asset' || type === 'Upgrade')
        costText.push('Rez: ' + info.cost);
      else
        costText.push('Cost: ' + info.cost);
    if(info.memory_cost !== undefined)
      costText.push('MU: ' + info.memory_cost);
    if(info.strength !== undefined)
      costText.push('Strength: ' + info.strength);
    if(info.trash_cost !== undefined)
      costText.push('Trash: ' + info.trash_cost);
    if(info.advancement_cost !== undefined)
      costText.push('Adv: ' + info.advancement_cost);
    if(info.agenda_points !== undefined)
      costText.push('Points: ' + info.agenda_points);
    if(info.minimum_deck_size !== undefined)
      costText.push('Deck: ' + info.minimum_deck_size);
    if(info.influence_limit !== undefined)
      costText.push('Influence: ' + info.influence_limit);
    costText = costText.join(' &bull; ');
    document.getElementById('cardType').innerHTML = costText;

    // Format card body
    if(info.text) {
      let bodyText = info.text.replace(/[^\r\n]+/gm, line => '<p>' + line + '</p>');
      bodyText = bodyText.replace(/\[[a-z]+\-*[a-z]+\]/gm, code => '<span class="icon">' + icons[code] + '</span>');
      bodyText = bodyText.replace(/Trace (\d)/gm, t => '<b>Trace' + t.slice(-1).sup() + '</b> - ');
      document.getElementById('cardText').innerHTML = bodyText;
    }

    // Flavor text
    if(info.flavor)
      document.getElementById('cardFlavor').innerHTML = info.flavor;

    // Image
    const cardImg = document.getElementById('cardImg');
    if(info.image_url === undefined) 
      cardImg.src = `https://netrunnerdb.com/card_image/${cardCode}.png`
    else 
      cardImg.src = info.image_url;

    cardImg.onload = function() {
      // Reveal card
      this.style.opacity = 1;
    }

    document.getElementById('nrdb-link').href = 'https://netrunnerdb.com/en/card/' + cardCode;
  }).then( () => {
    // Hide loader
    document.getElementById('loader-main').classList.add('hidden');

    // Reveal card after info is retreived
    document.getElementById('cardInfo').classList.remove('hidden');

    // Play highlight animation on title
    document.getElementById('cardTitle').classList.add('animated');
  });

}
