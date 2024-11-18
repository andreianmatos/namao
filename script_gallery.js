// Default selections
let selectedYear = '*';
let selectedCategory = '*';

// Photo paths organized by year and category
const photos = 
{
    "2019": {
        "papeis": [
            "data\\imagens_mao\\2019\\papeis\\2019_11_16_16_13_48.JPG"
        ],
        "passaros": [
            "data\\imagens_mao\\2019\\passaros\\2019_11_16_16_13_48.JPG"
        ]
    },
    "2020": {
        "feridas": [
            "data\\imagens_mao\\2020\\feridas\\2020_05_05_20_15_52.JPG"
        ],
        "frutas": [
            "data\\imagens_mao\\2020\\frutas\\2020_08_15_18_16_41.JPG"
        ]
    },
    "2021": {
        "passaros": [
            "data\\imagens_mao\\2021\\passaros\\2021_06_13_17_53_30.JPG"
        ]
    },
    "2022": {
        "flores": [
            "data\\imagens_mao\\2022\\flores\\2022_03_21_14_19_48.JPEG",
            "data\\imagens_mao\\2022\\flores\\2022_03_26_11_53_11.JPEG",
            "data\\imagens_mao\\2022\\flores\\2022_03_28_16_02_27.JPEG"
        ],
        "frutas": [
            "data\\imagens_mao\\2022\\frutas\\2022_02_23_15_58_26.JPEG",
            "data\\imagens_mao\\2022\\frutas\\2022_04_02_22_03_47.JPEG",
            "data\\imagens_mao\\2022\\frutas\\2022_08_25_19_31_55.JPEG"
        ],
        "luz": [
            "data\\imagens_mao\\2022\\luz\\2022_11_11_17_05_52.JPEG"
        ]
    },
    "2023": {
        "animais": [
            "data\\imagens_mao\\2023\\animais\\2023_07_11_17_01_20.JPEG"
        ],
        "flores": [
            "data\\imagens_mao\\2023\\flores\\2023_07_10_16_40_48.JPEG"
        ],
        "luz": [
            "data\\imagens_mao\\2023\\luz\\2023_08_10_11_39_15.JPEG"
        ],
        "papeis": [
            "data\\imagens_mao\\2023\\papeis\\2023_05_24_15_35_16.JPEG"
        ],
        "peixes": [
            "data\\imagens_mao\\2023\\peixes\\2023_08_20_20_43_24.JPEG"
        ]
    },
    "2024": {
        "feridas": [
            "data\\imagens_mao\\2024\\feridas\\2024_10_02_13_05_17.JPEG"
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

    const selectedPhotos = new Set(); // A Set to avoid duplicates by timestamp
    const displayedTimestamps = new Set(); // Track displayed timestamps

    // If both filters are set to "All" (`*`), show all photos
    if (selectedYear === '*' && selectedCategory === '*') {
        Object.values(photos).forEach(yearPhotos => {
            Object.values(yearPhotos).forEach(categoryPhotos => {
                categoryPhotos.forEach(photo => {
                    const timestamp = photo.split("\\").pop().split("_").slice(0, 3).join("_"); // Extract timestamp (e.g., "2019_11_16_16_13_48")
                    if (!displayedTimestamps.has(timestamp)) {
                        displayedTimestamps.add(timestamp); // Mark this timestamp as displayed
                        selectedPhotos.add(photo); // Add photo to the set
                    }
                });
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
                categoryPhotos.forEach(photo => {
                    const timestamp = photo.split("\\").pop().split("_").slice(0, 3).join("_"); // Extract timestamp
                    if (!displayedTimestamps.has(timestamp)) {
                        displayedTimestamps.add(timestamp); // Mark this timestamp as displayed
                        selectedPhotos.add(photo); // Add photo to the set
                    }
                });
            });
        });
    }

    // Display each unique photo in the gallery
    selectedPhotos.forEach(photo => {
        const container = document.createElement('div');
        container.className = 'gallery-photo-container';
        
        const img = document.createElement('img');
        img.src = photo;
        img.alt = 'Selected photo';
        img.className = 'gallery-photo';

        // Extract date from filename for overlay
        const date = photo.split("\\").pop().split("_").slice(0, 3).join("_");
        img.setAttribute('data-date', date); // Store date as a data attribute

        const dateText = document.createElement('div');
        dateText.className = 'photo-date';
        dateText.textContent = date;

        container.appendChild(img);
        container.appendChild(dateText);
        photoGallery.appendChild(container);
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
    allYearLink.classList.add('selected')
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
    allCategoryLink.classList.add('selected')
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

// Initialize page with links and photo display
document.addEventListener('DOMContentLoaded', function() {
    generateYearAndCategoryLinks();
    showPhotos('*', '*'); // Show all photos by default
});
