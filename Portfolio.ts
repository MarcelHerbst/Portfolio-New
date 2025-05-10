const canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
  const toggleButton = item.querySelector('a') as HTMLElement;
  const submenu = item.querySelector('.submenu') as HTMLElement;

  if (!submenu) return;

  toggleButton.addEventListener('click', (e) => {
    e.preventDefault();
    const isVisible = submenu.style.display === 'flex';

    // Alle Submenüs schließen
    document.querySelectorAll('.submenu').forEach(menu => {
      (menu as HTMLElement).style.display = 'none';
    });

    // Alle Sub-Submenüs schließen
    document.querySelectorAll('.sub-submenu').forEach(sub => {
      (sub as HTMLElement).style.display = 'none';
    });

    submenu.style.display = isVisible ? 'none' : 'flex';
  });

  // Innerhalb des NavItems: Klick auf Submenu-Items
  const submenuItems = item.querySelectorAll('.submenu-item');

  submenuItems.forEach(subItem => {
    const subToggle = subItem.querySelector('a') as HTMLElement;
    const subSubmenu = subItem.querySelector('.sub-submenu') as HTMLElement;

    if (!subSubmenu) return;

    subToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isVisible = subSubmenu.style.display === 'flex';

      // Alle Sub-Submenüs schließen
      document.querySelectorAll('.sub-submenu').forEach(sub => {
        (sub as HTMLElement).style.display = 'none';
      });

      subSubmenu.style.display = isVisible ? 'none' : 'flex';
    });
  });
});

// Klick außerhalb schließt alles
document.addEventListener('click', (e) => {
  if (!(e.target as HTMLElement).closest('.nav-item')) {
    document.querySelectorAll('.submenu').forEach(menu => {
      (menu as HTMLElement).style.display = 'none';
    });
    document.querySelectorAll('.sub-submenu').forEach(sub => {
      (sub as HTMLElement).style.display = 'none';
    });
  }
});


function drawImageWithTitle(src: string, title: string) {
  clearCanvas();

  const img = new Image();
  img.onload = () => {
    const scale = Math.min(canvas.width / 600, 1);
    const imgWidth = 400 * scale;
    const imgHeight = 400 * scale;
    const x = (canvas.width - imgWidth) / 2;
    const y = 120;

    ctx.drawImage(img, x, y, imgWidth, imgHeight);

    ctx.fillStyle = "#ffffff";
    ctx.font = "26px Arial";
    ctx.textAlign = "center";
    ctx.fillText(title, canvas.width / 2, y - 30);
  };

  img.src = src;
}



document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = (link.getAttribute('href') || "").trim();
    const content = htmlContentMap[href];

    if (content) {
      e.preventDefault();
      console.log("Zeige HTML-Inhalt für:", href);
      console.log("Titel:", content.title);
      console.log("Bilder:", content.images);
      console.log("Text:", content.text);
      showHTMLContent(content.title, content.images, content.text,content.sectionTitle);
    }
  });
});


console.log("Gefundene Menü-Links:", document.querySelectorAll('.main-nav a').length);

function showHTMLContent(title: string, imagePaths: string[], textLines: string[],sectionTitle: string) {
  // 👉 Alle Submenüs schließen
  document.querySelectorAll('.submenu').forEach(menu => {
    (menu as HTMLElement).style.display = 'none';
  });
  document.querySelectorAll('.sub-submenu').forEach(sub => {
    (sub as HTMLElement).style.display = 'none';
  });

  // 👉 HTML zusammenbauen
  const container = document.getElementById("contentArea")!;
  
  // 👇 alle Bilder als <img>-Elemente
  const imageHtml = imagePaths.map((src, index) => {
    const isHorde = title.includes("Horde");
    const isSingleImage = imagePaths.length === 1;
    const labels = isHorde
      ? ["Left", "Front Left", "Front", "Front Right", "Right", "Back"]
      : isSingleImage
      ? ["Front"]
      : ["Left", "Front", "Right", "Back"];
    const label = labels[index] || `Ansicht ${index + 1}`;
    const imageClass = `model-image${isSingleImage ? ' single-image' : ''}`;
    return `
      <div class="image-block">
       <img src="${src}" alt="${title} - ${label}" class="${imageClass}">
        <div class="image-caption">${label}</div>
      </div>`;
  }).join("");

  const joinedText = textLines.join("\n").trim();
  const isAudioOnly = joinedText.startsWith("<div") && joinedText.endsWith("</div>");
  const textHtml = isAudioOnly ? joinedText : `<p class="model-description">${joinedText.replace(/\n/g, "<br>")}</p>`;
 
  const galleryClass = title.includes("Horde") ? "image-gallery horde-gallery" : "image-gallery";
  const hasGalleryContent = imagePaths.length > 0 && imageHtml.trim() !== "";
  const galleryHtml = hasGalleryContent ? `<div class="${galleryClass}">${imageHtml}</div>` : "";
  const isInvisibleTitle = title === "InvisibleTitle";
  const titleHtml = isInvisibleTitle ? "" : `<h2 class="model-title">${title}</h2>`;
  
  container.innerHTML = `
    <h1 class="section-heading ${getSectionClass(sectionTitle)}">${sectionTitle}</h1>
    ${titleHtml}
    ${galleryHtml}
    ${textHtml}
  `;
    // 👉 Jetzt die Click-Events auf neue Bilder registrieren
    container.querySelectorAll('.model-image').forEach(img => {
      img.addEventListener('click', () => {
        const modal = document.getElementById('imageModal')!;
        const modalImg = document.getElementById('modalImage') as HTMLImageElement;
        modalImg.src = (img as HTMLImageElement).src;
        modal.style.display = "flex";
      });
    });
  }

  function getSectionClass(title: string): string {
    switch (title) {
      case 'Fall of Egypt: The Last City':
        return 'section-foe';
      case '3D-Character':
        return 'section-3D-Character';
      case 'Ambisonic':
        return 'section-ambisonic';
      // Weitere Sektionen hier ergänzen
      default:
        return '';
    }
  }
//--------------------------------------------------------------------------------------------------------------------------------------------------

const htmlContentMap: Record<string, { title: string; images: string[]; text: string[]; sectionTitle: string }> = {

  "#Player": {
    title: "Player Character Modell:",
    sectionTitle: "Fall of Egypt: The Last City",
    images: [
      "3DModell/PlayerCharakter/PlayerCharakter_Links.png",
      "3DModell/PlayerCharakter/PlayerCharakter_Vorne.png",
      "3DModell/PlayerCharakter/PlayerCharakter_Rechts.png",
      "3DModell/PlayerCharakter/PlayerCharakter_Hinten.png"
    ],
    text: [
      "This model represents the player character of the game Fall of Egypt: The Last City. \nIt is inspired by the citizens of ancient Egypt.",  
    ]
  },
  "#soldier": {
  title: "Soldier Modell",
  sectionTitle: "Fall of Egypt: The Last City",
  images: [
      "3DModell/Soldat/Soldat_Links.png",
      "3DModell/Soldat/Soldat_Vorne.png",
      "3DModell/Soldat/Soldat_Rechts.png",
      "3DModell/Soldat/Soldat_Hinten.png"
  ],
  text: ["This model represents a soldier in ancient Egypt. He carries a spear and a shield, as these weapons were commonly used by Egyptian soldiers. I also gave him a head covering to suggest that soldiers protected themselves from the heat to avoid heatstroke."]
  },
  "#Horde":{
    title:"Horde Modell",
    sectionTitle: "Fall of Egypt: The Last City",
    images:[
      "3DModell/Horde/Horde_Links.png",
      "3DModell/Horde/Horde_Vorne_Links.png",
      "3DModell/Horde/Horde_Vorne.png",
      "3DModell/Horde/Horde_Vorne_Rechts.png",
      "3DModell/Horde/Horde_Rechts.png",
      "3DModell/Horde/Horde_Hinten.png"
    ],
    text:[
      "The horde model was created using multiple individual parts of the zombie model in a modular, kit-like system. This allowed me to save time and create different poses, or omit parts like arms or legs. sThe result is a chaotic-looking cluster of zombies."
    ]
  },
  "#zombie":{
    title:"Zombie Modell",
    sectionTitle: "Fall of Egypt: The Last City",
    images:[
      "3DModell/Zombie/Zombie_Links.png",
      "3DModell/Zombie/Zombie_Vorne.png",
      "3DModell/Zombie/Zombie_Rechts.png",
      "3DModell/Zombie/Zombie_Hinten.png"
    ],
    text:[
      "For the zombie, I modeled all body parts individually to allow for experimenting with different poses. This saved time, as the parts could be reused like a modular kit. The boils are meant to suggest an infection – complemented by bite wounds and a hole in the thigh where the bone is exposed. My idea for this specific zombie was that it should lack intelligence. While it’s possible to imagine that some zombies could be intelligent, I deliberately wanted to show the opposite here: a creature that got stuck somewhere due to its stupidity, resulting in the hole. I found this idea intriguing."
    ]
  },
  "#roundtracker":{
    title:"Round Tracker",
    sectionTitle: "Fall of Egypt: The Last City",
    images:[
      "3DModell/Roundtracker/Roundtracker.png",
    ],
    text:[
      "For the Round Tracker, I chose a classic design inspired by an hourglass. Although the ancient Egyptians didn’t have hourglasses in the modern sense, they used a type of water clock that had certain similarities in both function and appearance."
    ]
  },
  "#cardholder":{
    title:"Card Holder",
    sectionTitle: "Fall of Egypt: The Last City",
    images:[
      "3DModell/Cardholder/Cardholder.png",
    ],
    text:[
      "The card holder was designed to be large and deep enough to neatly hold all resource cards, instead of having them scattered across the table."
    ]
  },

  "#kumo":{
    title: "Kumo the One-Legged",
    sectionTitle: "3D-Character",
    images:[
      "3DModell/Kumo/Kumo_Links.png",
      "3DModell/Kumo/Kumo_Vorne.png",
      "3DModell/Kumo/Kumo_Rechts.png",
      "3DModell/Kumo/Kumo_Hinten.png",
    ],
    text: [
      "Kumo the One-Legged is the very first character I ever modeled. He had existed in my mind for a long time – a panda-like humanoid, covered in scars, capable of fighting, and also a blacksmith.",
      "Many of my personal 'what if' thoughts flowed into Kumo’s creation. For example, if I had lived in the Middle Ages, I would have definitely become a blacksmith – I have a deep appreciation for that craft.",
      "Life is full of unexpected events. Things happen that you can't foresee. But no matter what life throws at you, you should never give up. That’s exactly what Kumo represents. He has only one leg and is marked by wounds, yet he still stands strong.",
      "The reason I made Kumo an animal-human hybrid is because I’ve always found such beings fascinating, especially in anime. And why a panda? Pandas are clumsy and cute, but they survive through their clumsiness.",
      "This animal felt like the perfect symbol to express all of that in Kumo. I’m very proud of Kumo. :D"
    ]
  },

"#ambiente": {
  title: "InvisibleTitle",
  sectionTitle: "Sound & Audio Experiences",
  images: [],
  text: [
    `<div class="audio-block"><h3>Ambience Dead Man's Call:</h3><audio controls><source src="Sound/Ambiente/Ambient_Dead_Mans_Call.WAV.wav" type="audio/wav"></audio></div>`,
    `<div class="audio-block"><h3>Catacombs:</h3><audio controls><source src="Sound/Ambiente/Ambient_Katakomb.WAV.wav" type="audio/wav"></audio></div>`,
  ]
},
"#sfx":{
  title: "InvisibleTitle",
  sectionTitle: "Sound Effects",
  images:[],
  text:[
    `<div class="audio-block"><h3>SFX_Jump_Scare_Door</h3><audio controls><source src="Sound/SFX/SFX_Türschreck_D_M_C.WAV.wav" type="audio/wav"></audio></div>`,
  ],
},

//"#deadmanscall": {
  //title: "Dead Man's Call – Trailer",
  //sectionTitle: "Games & Interactive Media",
  //images: [],
  //text: [
  //  `<div class="video-block">
   //   <video controls poster="Picture_Website/DeadManPoster.jpg" width="100%" style="border-radius: 10px;">
    //    <source src="Video/" type="video/mp4">
    //    Your browser does not support the video tag.
    //  </video>
  //  </div>`
 // ]
//}


}









function closeModal() {
  document.getElementById('imageModal')!.style.display = "none";
}