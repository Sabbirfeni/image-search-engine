const API_KEY = '8OEPsRN8OisvEnYTq0LVOamPhTMvDSomfLRhHJR9cSj6K1TFvE8vAmuX';
const perPage = 15;
const currentPage = 1;
const imagesWrapper = document.querySelector('.images');

const generateHtml = photos => {
    let allPhotosEle = '';
    photos.map(photo => {
        allPhotosEle += `
        <li class="card">
            <img src=${photo.src.large2x} alt=${photo.alt}>
            <div class="details">
                <div class="photographer">
                    <img src="./assets/images/camera.png" alt="">
                    <span>${photo.photographer}</span>
                </div>
                <div>
                    <img class="download-icon" src="./assets/images/downloads.png" alt="">
                </div>
                
            </div>
         </li>
        `

    })

    imagesWrapper.innerHTML = allPhotosEle;
}
const getImages = apiUrl => {
    const parameters = {
        headers: { Authorization: API_KEY }
    }
    fetch(apiUrl, parameters)
    .then(res => res.json())
    .then(data => {
        generateHtml(data.photos)
        console.log(data.photos[0])
    })
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`)