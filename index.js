const axios = require('axios');
const JSZip = require('jszip')
const express = require('express');

const app = express();
const PORT = 3000;


app.listen(PORT, (error) =>{
	if(!error)
		console.log(`Server is Successfully Running,
					and App is listening on port ${PORT}`)
	else
		console.log("Error occurred, server can't start", error);
	}
);

const urls = [
    "https://www.publicdomainpictures.net/pictures/60000/nahled/cute-kittens-in-basket.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/8/8f/Cute-kittens-12929201-1600-1200.jpg",
];

app.get('/', async (req, res)=>{
    const proms = [];

    for (let i = 0; i < urls.length; i++) {
    proms.push(axios(urls[i], { responseType: 'arraybuffer' }));
    }

    const images = await Promise.all(proms);
    const zip = new JSZip();
    const fold = zip.folder('images')

    images.forEach((d, i) => {
        fold.file(`img${i}.jpg`, d.data, { binary: true });
    })

    const fzip = await zip.generateAsync({ type: 'nodebuffer' });
    res.setHeader('Content-Disposition', `attachment; filename="archive.zip"`);
    res.setHeader('Content-Type', 'application/zip');
    res.send(fzip);
});
