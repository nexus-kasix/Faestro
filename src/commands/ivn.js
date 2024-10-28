export const ivncmds = {
    ver: "0.0.1",
    'version': () => "ivn - Faestro package manager - version: "+ivncmds.ver,
}
// help: () => "Available commands: faestro.save.log, faestro.version, faestro.link, faestro.theme_engine.background.set.image, faestro.theme_engine.background.set.example.",
// 'faestro.save.log': () => "Not implemented yet", // Placeholder, actual implementation depends on your logging setup
// 'faestro.version': () => "Faestro version 1.3",
// 'faestro.link': (link) => {
//   if (!link.startsWith('http://') && !link.startsWith('https://')) {
//     link = 'https://' + link;
//   }
  
//   try {
//     window.open(link, '_blank');
//     return `Opening ${link} in a new tab...`;
//   } catch (error) {
//     return `Error opening ${link}: ${error.message}`;
//   }
// },
// 'faestro.credits': () => "Thanks to: [solid.js](https://www.solidjs.com/), artificial intelligence, and the world for making this project possible.",
// 'faestro.theme_engine.background.set.image': () => {
// return new Promise((resolve) => {
//   const input = document.createElement('input');
//   input.type = 'file';
//   input.accept = 'image/*';
  
//   input.onchange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const imagePath = e.target.result;
//         document.body.style.backgroundImage = `url(${imagePath})`;
//         document.body.style.backgroundSize = 'cover';
//         document.body.style.backgroundPosition = 'center';
//         resolve(`Background image set to: ${file.name}`);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       resolve("No image selected.");
//     }
//   };
// };
// }