/*  Pixel Sweeper - PWA Helpers
    Get the game working offline! Based on code used for my old work.
    For use with vanilla HTML5 games powered by JS

    (C) 2021-2022 John Vincent M. Corcega - TenSeventy7
*/

const OFFLINE_VERSION = 1.1;

BASE_CACHE_FILES = [
    "/",
    "/lib/about.js",
    "/lib/main.js",
    "/lib/minesweeper.js",
    "/lib/title.js",
    "/lib/helpers/audio.js",
    "/lib/helpers/classes.js",
    "/lib/helpers/dialog.js",
    "/lib/helpers/gamestorage.js",
    "/lib/helpers/level.js",
    "/lib/helpers/page.js",
    "/lib/helpers/progress.js",
    "/pwa.js",
    "/lib/helpers/threed.js",
    "/lib/external/flatted.js",
    "/lib/external/three.js/three.module.js",
    "/lib/external/three.js/GLTFLoader.module.js",
    "/leveldata/seasons.json",
    "/sfx/close.ogg",
    "/sfx/dialog.ogg",
    "/sfx/levelLose.ogg",
    "/sfx/levelWin.ogg",
    "/sfx/menu.ogg",
    "/sfx/mine.ogg",
    "/sfx/select.ogg",
    "/pages/about-screen.html",
    "/pages/level-screen.html",
    "/pages/title-screen.html",
    "/gl/level_select_spring.glb",
    "/gl/level_select_summer.glb",
    "/gl/level_select_fall.gltf",
    "/gl/level_select_winter.glb",
    "/fonts/Kenney-Blocks.woff",
    "/fonts/Kenney-Blocks.woff2",
    "/fonts/Kenney-Mini-Square.woff",
    "/fonts/Kenney-Mini-Square.woff2",
    "/fonts/Kenney-Mini.woff",
    "/fonts/Kenney-Mini.woff2",
    "/css/animate.min.css",
    "/css/bulma.min.css",
    "/css/fonts.css",
    "/css/main.css",
    "/bgm/title.mp3",
    "/bgm/spring.mp3",
    "/bgm/summer.mp3",
    "/bgm/fall.mp3",
    "/bgm/winter.mp3",
    "/img/backgrounds/seasons-fall.png",
    "/img/backgrounds/seasons-spring.png",
    "/img/backgrounds/seasons-summer.png",
    "/img/backgrounds/seasons-winter.png",
    "/img/backgrounds/title-background.png",
    "/img/buttons/back.svg",
    "/img/buttons/next.svg",
    "/img/cursor/normal.png",
    "/img/favicons/android-chrome-192x192.png",
    "/img/favicons/site.webmanifest",
    "/img/favicons/favicon.ico",
    "/img/favicons/favicon-16x16.png",
    "/img/favicons/favicon-32x32.png",
    "/img/icons/arrowLeft.png",
    "/img/icons/audioOff.png",
    "/img/icons/audioOn.png",
    "/img/icons/bestTime.png",
    "/img/icons/bomb.png",
    "/img/icons/cross.png",
    "/img/icons/cursor.png",
    "/img/icons/flag.png",
    "/img/icons/information.png",
    "/img/icons/mouseLeft.png",
    "/img/icons/mouseRight.png",
    "/img/icons/musicOff.png",
    "/img/icons/musicOn.png",
    "/img/icons/play.png",
    "/img/icons/restart.png",
    "/img/icons/save.png",
    "/img/icons/star.png",
    "/img/icons/time.png",
    "/img/tile/flag.png",
    "/img/tile/mine.png",
    "/img/tile/normal.png",
    "/img/tile/revealed.png",
    "/img/tile/wrongMine.png",
    "/img/tile/mineAnimation.gif",
    "/img/game-logo.png"
]

CACHE_NAME = "offline_1.1"
OFFLINE_URL = "/";

self.addEventListener("install", e => {
    e.waitUntil((async () => {
        const e = await caches.open(CACHE_NAME);
        await e.add(new Request("/", {
            cache: "reload"
        })), e.addAll(BASE_CACHE_FILES)
    })())
})

self.addEventListener("activate", e => {
    e.waitUntil((async () => {
        "navigationPreload" in self.registration && await self.registration.navigationPreload.enable()
    })()), self.clients.claim()
})

self.addEventListener("fetch", e => {
    "navigate" === e.request.mode && e.respondWith((async () => {
        try {
            const a = await e.preloadResponse;
            return a || await fetch(e.request)
        } catch (e) {
            console.log("Fetch failed; returning offline page instead.", e);
            const a = await caches.open(CACHE_NAME);
            return await a.match("/")
        }
    })())
});
