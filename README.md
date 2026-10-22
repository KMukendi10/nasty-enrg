# Nasty ENRG campaign microsite
Plain HTML/CSS/JS. Open index.html. Fonts (Permanent Marker, Archivo Black, Kalam, Inter) load from Google Fonts.
- Real photos and video are in: Hero, Spaces, Objects, Film and Impact. Still crops of the design comp (low-res): sketch.jpg, taxi.jpg, shop.jpg. The hero is a court photo for now; swap images/hero.jpg for the player shot if you have it.
- Placeholder links: "View original deck" (index.html, #thinking) and the TikTok links (#film): add the real URLs.

## Performance
Images are WebP in 640/1000/1600w sizes (srcset), lazy-loaded below the fold; the hero is preloaded. The lightbox loads the largest size only when opened. Videos load nothing until played/visible. To add a photo: export a 1600px-wide JPG, make 640/1000/1600 WebPs named name-640.webp etc. and add srcset like the others.
