// Default selections
let selectedYear = '*';
let selectedCategory = '*';

// Photo paths organized by year and category
const photos = {
    '2019': {
        maca: ['data/2019/maca/2019_2.jpg'],
        pera: ['data/2019/pera/2019_1.jpeg'],
    },
    '2020': {
        maca: ['data/2020/maca/2020_1.jpeg'],
        pera: ['data/2020/pera/2020_2.jpeg'],
    },
    '2021': {
        maca: ['data/2021/maca/2021_1.png'],
    }
};

// Function to update gallery based on selection
function showPhotos(selection, type) {
    const photoGallery = document.getElementById('photo-gallery');
    photoGallery.innerHTML = ''; // Clear previous photos

    // Update selected filters based on user click
    if (type === 'year') {
        selectedYear = selection;
        // Update selection style for years
        document.querySelectorAll('#year-categories a').forEach(link => link.classList.remove('selected'));
        document.querySelector(`#year-categories a[onclick="showPhotos('${selection}', 'year')"]`).classList.add('selected');
    } else if (type === 'category') {
        selectedCategory = selection;
        // Update selection style for categories
        document.querySelectorAll('#other-categories a').forEach(link => link.classList.remove('selected'));
        document.querySelector(`#other-categories a[onclick="showPhotos('${selection}', 'category')"]`).classList.add('selected');
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
        const categoriesToShow = selectedCategory === '*' ? ['maca', 'pera'] : [selectedCategory];

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

// Initial call to show all photos on page load
document.addEventListener("DOMContentLoaded", () => {
    showPhotos('*', 'year');
    showPhotos('*', 'category');
});
