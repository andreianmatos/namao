let selectedYear = '*';     // Default to all years
let selectedCategory = '*'; // Default to all categories

// Photo paths organized by year and category
const photos = {
    '2019': {
        nature: ['data/2019/nature/photo1.jpg', 'data/2019/nature/photo2.jpg'],
        folhas: ['data/2019/folhas/photo1.jpg', 'data/2019/folhas/photo2.jpg'],
    },
    '2020': {
        vermelho: ['data/2020/vermelho/photo1.jpg', 'data/2020/vermelho/photo2.jpg'],
        comida: ['data/2020/comida/photo1.jpg', 'data/2020/comida/photo2.jpg'],
    },
    '2021': {
        outras_maos: ['data/2021/outras-maos/photo1.jpg', 'data/2021/outras-maos/photo2.jpg'],
    },
    '2022': {
        nature: ['data/2022/nature/photo1.jpg', 'data/2022/nature/photo2.jpg'],
        comida: ['data/2022/comida/photo1.jpg', 'data/2022/comida/photo2.jpg'],
    }
};

// Main function to update gallery based on year and category selection
function showPhotos(selection, type) {
    const photoGallery = document.getElementById('photo-gallery');
    photoGallery.innerHTML = ''; // Clear previous photos

    // Update selected filters based on user click
    if (type === 'year') {
        selectedYear = selection;
    } else if (type === 'category') {
        selectedCategory = selection;
    }

    const selectedPhotos = new Set();

    // If both filters are set to "All" (`*`), show all photos
    if (selectedYear === '*' && selectedCategory === '*') {
        Object.values(photos).forEach(yearPhotos => {
            Object.values(yearPhotos).forEach(categoryPhotos => {
                categoryPhotos.forEach(photo => selectedPhotos.add(photo));
            });
        });
    } else {
        // Filter based on year selection
        const yearsToShow = selectedYear === '*' ? Object.keys(photos) : [selectedYear];
        const categoriesToShow = selectedCategory === '*' ? ['nature', 'folhas', 'vermelho', 'comida', 'outras_maos'] : [selectedCategory];

        // Loop through selected years and categories to gather matching photos
        yearsToShow.forEach(year => {
            const yearPhotos = photos[year] || {};
            categoriesToShow.forEach(category => {
                const categoryPhotos = yearPhotos[category] || [];
                categoryPhotos.forEach(photo => selectedPhotos.add(photo));
            });
        });
    }

    // Display each unique photo in the gallery
    selectedPhotos.forEach(photo => {
        const img = document.createElement('img');
        img.src = photo;
        img.alt = 'Selected photo';
        img.className = 'gallery-photo';
        photoGallery.appendChild(img);
    });
}
