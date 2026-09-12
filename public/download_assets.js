const https = require('https');
const fs = require('fs');
const path = require('path');

const TARGET_HOST = 'https://2025.oceanx.org';

const assetsToDownload = [
    // Nuxt Assets & Chunks
    '/_nuxt/entry.Cg15Foxi.css',
    '/_nuxt/ChapterDrawerFrame.B8PhWFDM.css',
    '/_nuxt/ChapterSwiperButton.DT-K45KZ.css',
    '/_nuxt/Page.Dz-M8kGG.css',
    '/_nuxt/index.BzITBpb0.css',
    '/_nuxt/Header.BLRnO-zH.css',
    '/_nuxt/ShareButton.CSkqi5_t.css',
    '/_nuxt/default.BXuw_ujx.css',
    '/_payload.json?c7eb02db-39d8-4f2e-821d-f8bba78a06e8',
    '/_nuxt/DbhncAIU.js',
    '/_nuxt/BlYrOyGk.js',
    '/_nuxt/DOhj_bPB.js',
    '/_nuxt/gqoVtOw1.js',
    '/_nuxt/DcSZ4-5K.js',
    '/_nuxt/D_meo6Gv.js',
    '/_nuxt/CeyM3Pgu.js',
    '/_nuxt/CcnAkSs6.js',
    '/_nuxt/q_EadbwV.js',
    '/_nuxt/D7U0N6dC.js',
    '/_nuxt/Di-hxrBd.js',
    '/_nuxt/builds/meta/c7eb02db-39d8-4f2e-821d-f8bba78a06e8.json',
    
    // Fonts
    '/static/fonts/DMMono-Medium.ttf',
    '/static/fonts/ZeistT1Web-Medium.woff2',
    '/static/fonts/ZeistN2Web-Medium.woff2',
    '/static/fonts/ZeistN2Web-SemiBold.woff2',
    '/static/fonts/ZeistN2Web-Regular.woff2',
    
    // Images & Icons
    '/static/images/article_footer.png',
    '/static/favicon/favicon.ico',
    '/static/favicon/apple-touch-icon.png',
    '/static/images/map-00.png',
    '/static/images/map-01.png',
    '/static/images/map-02.png',
    '/static/images/map-03.png',
    '/static/images/map-04.png',
    '/static/images/map-05.png',
    '/static/images/map-06.png',
    '/static/images/timor-leste-01.jpg',
    '/static/images/timor-leste-02.jpg',
    '/static/images/timor-leste-03.jpg',
    '/static/images/timor-leste-04.jpg',
    '/static/images/timor-leste-05.jpg',
    '/static/images/timor-leste-06.jpg',
    '/static/images/timor-leste-07.jpg',
    '/static/images/chapter_preview-00.jpg',
    '/static/images/chapter_preview-01.jpg',
    '/static/images/chapter_preview-02.jpg',
    '/static/images/chapter_preview-03.jpg',
    '/static/images/chapter_preview-04.jpg',
    '/static/images/chapter_preview-05.jpg',
    '/static/images/chapter_preview-06.jpg',
    
    // Media
    '/audio/sfx.webm',
    
    // WebGL Models
    '/webgl/models/earth.glb',
    '/webgl/models/clouds.glb',
    '/webgl/models/ship.glb',
    '/webgl/models/seagull.glb',
    '/webgl/models/land.glb',
    '/webgl/models/buoy.glb',
    
    // WebGL Data & Textures
    '/webgl/earth_markers.json',
    '/webgl/textures/earth_diffuse_grade.ktx2',
    '/webgl/textures/earth_normal.ktx2',
    '/webgl/textures/earth_roughness.ktx2',
    '/webgl/textures/earth_clouds.ktx2',
    '/webgl/textures/water-depth-2.ktx2',
    '/webgl/textures/ship_Ambient_Occlusion.1001.ktx2',
    '/webgl/textures/ship_Ambient_Occlusion.1002.ktx2',
    '/webgl/textures/ship_Ambient_Occlusion.1003.ktx2',
    '/webgl/textures/ship_Ambient_Occlusion.1004.ktx2',
    '/webgl/textures/ship_Diffuse.1001.ktx2',
    '/webgl/textures/ship_Diffuse.1002.ktx2',
    '/webgl/textures/ship_Diffuse.1003.ktx2',
    '/webgl/textures/ship_Diffuse.1004.ktx2',
    '/webgl/textures/seagull_diffuse.ktx2',
    '/webgl/textures/bouy_diffuse.ktx2',
    '/webgl/textures/land_diffuse.ktx2',
    '/webgl/textures/ocean-envmap.jpg',
    '/webgl/textures/water-normal.webp',
    '/webgl/textures/clouds/cloud0.webp',
    '/webgl/textures/clouds/cloud1.webp',
    '/webgl/textures/clouds/cloud2.webp',
    '/webgl/textures/clouds/cloud3.webp',
    '/webgl/textures/clouds/cloud4.webp',
    '/webgl/textures/clouds/cloud5.webp',
    '/webgl/textures/clouds/cloud6.webp',
    '/webgl/textures/clouds/cloud7.webp',
    '/webgl/textures/clouds/cloud8.webp',
    '/webgl/textures/grid.png',
    
    // Basis Transcoders
    '/basis/basis_transcoder.js',
    '/basis/basis_transcoder.wasm'
];

async function downloadFile(assetUrl) {
    return new Promise((resolve, reject) => {
        // Handle payload edgecase with query string
        let cleanPath = assetUrl.split('?')[0]; 
        
        // If it's the _payload.json, we want to save it WITH the query string locally so it matches exactly
        // But Windows doesn't allow '?' in filenames.
        // Wait, Nuxt requests it exactly as `/_payload.json?c7eb0...` which will be handled by our offline server mapping.
        // Let's save it cleanly as `/_payload.json`.
        
        let localPath = path.join(__dirname, cleanPath);
        
        fs.mkdirSync(path.dirname(localPath), { recursive: true });

        // Build the target URL properly
        // For netlify images, the list already contains their raw /static/images/... equivalents
        let requestUrl = TARGET_HOST + assetUrl;
        
        console.log(`Downloading: ${requestUrl}`);
        
        https.get(requestUrl, (response) => {
            if (response.statusCode === 200) {
                const fileStream = fs.createWriteStream(localPath);
                response.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    resolve();
                });
            } else {
                console.error(`Failed to download ${requestUrl} (Status: ${response.statusCode})`);
                resolve(); // resolve anyway so we don't block the whole process
            }
        }).on('error', (err) => {
            console.error(`Error fetching ${requestUrl}:`, err.message);
            resolve();
        });
    });
}

async function main() {
    console.log('Starting asset downloads...');
    for (const url of assetsToDownload) {
        await downloadFile(url);
    }
    console.log('Done downloading assets!');
}

main();
