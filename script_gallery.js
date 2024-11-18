// Default selections
let selectedYear = '*';
let selectedCategory = '*';

// Photo paths organized by year and category
const photos = {
    "2019": {
        "papeis": [
            "data\\imagens_mao\\2019\\papeis\\2019_11_16_16_13_48_papeis.JPG"
        ],
        "passaros": [
            "data\\imagens_mao\\2019\\passaros\\2019_11_16_16_13_48_passaros.JPG"
        ]
    },
    "2020": {
        "feridas": [
            "data\\imagens_mao\\2020\\feridas\\2020_05_05_20_15_52_feridas.JPG"
        ],
        "frutas": [
            "data\\imagens_mao\\2020\\frutas\\2020_08_15_18_16_41_frutas.JPG"
        ]
    },
    "2021": {
        "passaros": [
            "data\\imagens_mao\\2021\\passaros\\2021_06_13_17_53_30_passaros.JPG"
        ]
    },
    "2022": {
        "flores": [
            "data\\imagens_mao\\2022\\flores\\2022_03_21_14_19_48_flores.JPEG",
            "data\\imagens_mao\\2022\\flores\\2022_03_26_11_53_11_flores.JPEG",
            "data\\imagens_mao\\2022\\flores\\2022_03_28_16_02_27_flores.JPEG"
        ],
        "frutas": [
            "data\\imagens_mao\\2022\\frutas\\2022_02_23_15_58_26_frutas.JPEG",
            "data\\imagens_mao\\2022\\frutas\\2022_04_02_22_03_47_frutas.JPEG",
            "data\\imagens_mao\\2022\\frutas\\2022_08_25_19_31_55_frutas.JPEG"
        ],
        "luz": [
            "data\\imagens_mao\\2022\\luz\\2022_11_11_17_05_52_luz.JPEG"
        ]
    },
    "2023": {
        "animais": [
            "data\\imagens_mao\\2023\\animais\\2023_07_11_17_01_20_animais.JPEG"
        ],
        "flores": [
            "data\\imagens_mao\\2023\\flores\\2023_07_10_16_40_48_flores.JPEG"
        ],
        "luz": [
            "data\\imagens_mao\\2023\\luz\\2023_08_10_11_39_15_luz.JPEG"
        ],
        "papeis": [
            "data\\imagens_mao\\2023\\papeis\\2023_05_24_15_35_16_papeis.JPEG"
        ],
        "peixes": [
            "data\\imagens_mao\\2023\\peixes\\2023_08_20_20_43_24_peixes.JPEG"
        ]
    },
    "2024": {
        "feridas": [
            "data\\imagens_mao\\2024\\feridas\\2024_10_02_13_05_17_feridas.JPEG"
        ]
    },
    "2025": {}
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

    const selectedPhotos = new Set(); // A Set to avoid duplicates

    // If both filters are set to "All" (`*`), show all photos
    if (selectedYear === '*' && selectedCategory === '*') {
        Object.values(photos).forEach(yearPhotos => {
            Object.values(yearPhotos).forEach(categoryPhotos => {
                categoryPhotos.forEach(photo => selectedPhotos.add(photo)); // Add photos to set
            });
        });
    } else {
        // Filter based on year selection
        const yearsToShow = selectedYear === '*' ? Object.keys(photos) : [selectedYear];
        const categoriesToShow = selectedCategory === '*' ? Object.keys(photos[selectedYear] || {}) : [selectedCategory];

        // Loop through selected years and categories to gather matching photos
        yearsToShow.forEach(year => {
            const yearPhotos = photos[year] || {};
            categoriesToShow.forEach(category => {
                const categoryPhotos = yearPhotos[category] || [];
                categoryPhotos.forEach(photo => selectedPhotos.add(photo)); // Add photos to set
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

// Function to generate year and category links dynamically
function generateYearAndCategoryLinks() {
    // Generate year links dynamically
    const yearContainer = document.getElementById('year-links');
    yearContainer.innerHTML = ''; // Clear existing links

    // Add "All *" option for years
    const allYearLink = document.createElement('a');
    allYearLink.href = '#';
    allYearLink.textContent = 'Todos';
    allYearLink.setAttribute('onclick', `showPhotos('*', 'year')`);
    yearContainer.appendChild(allYearLink);

    // Generate links for each year
    Object.keys(photos).forEach(year => {
        const yearLink = document.createElement('a');
        yearLink.href = '#';
        yearLink.textContent = year;
        yearLink.setAttribute('onclick', `showPhotos('${year}', 'year')`);
        yearContainer.appendChild(yearLink);
    });

    // Gather all unique categories across all years
    const allCategories = new Set();
    Object.values(photos).forEach(yearPhotos => {
        Object.keys(yearPhotos).forEach(category => {
            allCategories.add(category);
        });
    });

    // Generate category links dynamically
    const categoryContainer = document.getElementById('category-links');
    categoryContainer.innerHTML = ''; // Clear existing links

    // Add "All *" option for categories
    const allCategoryLink = document.createElement('a');
    allCategoryLink.href = '#';
    allCategoryLink.textContent = 'Todas';
    allCategoryLink.setAttribute('onclick', `showPhotos('*', 'category')`);
    categoryContainer.appendChild(allCategoryLink);

    // Generate links for each category
    allCategories.forEach(category => {
        const categoryLink = document.createElement('a');
        categoryLink.href = '#';
        categoryLink.textContent = category;
        categoryLink.setAttribute('onclick', `showPhotos('${category}', 'category')`);
        categoryContainer.appendChild(categoryLink);
    });
}

// Function to toggle showing of year links
function toggleAllYearLinks() {
    const yearLinks = document.getElementById('year-links');
    yearLinks.classList.toggle('hidden');
    const yearToggleButton = document.getElementById('year-toggle-button');
    yearToggleButton.textContent = yearLinks.classList.contains('hidden') ? '+' : '-';
}

// Function to toggle showing of category links
function toggleAllCategoryLinks() {
    const categoryLinks = document.getElementById('category-links');
    categoryLinks.classList.toggle('hidden');
    const categoryToggleButton = document.getElementById('category-toggle-button');
    categoryToggleButton.textContent = categoryLinks.classList.contains('hidden') ? '+' : '-';
}

// Initialize the year and category links when the page loads
window.onload = function () {
    generateYearAndCategoryLinks();
    showPhotos('*', 'year'); // Default show all photos for year
    showPhotos('*', 'category'); // Default show all photos for category
};
