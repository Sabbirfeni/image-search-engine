const API_KEY = '8OEPsRN8OisvEnYTq0LVOamPhTMvDSomfLRhHJR9cSj6K1TFvE8vAmuX';
let perPage = 15;
let currentPage = 1;
let searchTerm = '';
const imagesWrapper = document.querySelector('.images');
const loadMoreBtn = document.querySelector('.load-more');
const serachInput = document.querySelector('.search-box input');
const lightBox = document.querySelector('.light-box');
const closeBtn = document.querySelector('.close-btn');
const downloadBtn = document.querySelector('.download-img-btn');

const downloadImg = imageUrl => {
    fetch(imageUrl)
    .then(res => res.blob())
    .then(file => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    })
    .catch(err => {
        console.log(err.message)
        alert('Failed to download image!');
    })
}
const showLightbox = (photographerName, imgUrl) => {
    lightBox.querySelector('.preview-img img').src = imgUrl;
    lightBox.querySelector('span').innerText = photographerName;
    lightBox.classList.add('display');
    
    downloadBtn.setAttribute('data-url', imgUrl);
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        lightBox.classList.add('animation');
    }, 100)
}
const hideLightbox = () => {
    lightBox.classList.remove('animation');
    document.body.style.overflow = 'auto';
    setTimeout(() => {
        lightBox.classList.remove('display');
    }, 400)
}
const generateHtml = photos => {
    let allPhotosEle = '';
    photos.map(photo => {
        allPhotosEle += `
        <li class="card">
            <img onclick="showLightbox('${photo.photographer}', '${photo.src.large2x}')" src=${photo.src.large2x} alt=${photo.alt}>
            <div class="details">
                <div class="photographer">
                    <img src="./assets/images/camera.png" alt="">
                    <span>${photo.photographer}</span>
                </div>
                <div class='download-btn-container' onclick="downloadImg('${photo.src.large2x}')">
                    <img class="download-icon" src="./assets/images/downloads.png" alt="download-btn">
                </div>
                
            </div>
         </li>
        `

    })

    imagesWrapper.innerHTML += allPhotosEle;
}
const getImages = apiUrl => {
    loadMoreBtn.innerText = 'Loading...'
    loadMoreBtn.classList.add('disabled')
    const parameters = {
        headers: { Authorization: API_KEY }
    }
    fetch(apiUrl, parameters)
    .then(res => res.json())
    .then(data => {
        generateHtml(data.photos)
        loadMoreBtn.innerText = 'Load More'
        loadMoreBtn.classList.remove('disabled')
    })
    .catch(err => {
        alert('Failed to load images!')
    })
}
const loadMoreImages = () => {
    // imagesWrapper.lastElementChild.scrollIntoView();
    currentPage++;
    const url = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`:
                            `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    getImages(url);
}
const loadSearchImages = e => {
    if(e.target.value === '') return searchTerm = null;
    if(e.key === 'Enter') {
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = '';
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`)
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

loadMoreBtn.addEventListener('click', loadMoreImages);
serachInput.addEventListener('keyup', loadSearchImages);
closeBtn.addEventListener('click', hideLightbox);
downloadBtn.addEventListener('click', (e) => downloadImg(e.target.dataset.url))