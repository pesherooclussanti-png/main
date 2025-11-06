// Exemplo de lista de vídeos do TeraBox
const videos = [
    {
        title: "Filme 1",
        url: "https://download.terabox.com/arquivo.mp4" // substitua pelo link direto do TeraBox
    },
    {
        title: "Filme 2",
        url: "https://download.terabox.com/arquivo2.mp4"
    }
];

const videoList = document.getElementById('video-list');

videos.forEach(video => {
    const div = document.createElement('div');
    div.className = 'video-item';
    div.innerHTML = `
        <h3>${video.title}</h3>
        <video controls>
            <source src="${video.url}" type="video/mp4">
            Seu navegador não suporta vídeo.
        </video>
    `;
    videoList.appendChild(div);
});
