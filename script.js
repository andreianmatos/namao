// Global variables
let imageStack = [];
let images = [];
let currentDraggedImage = null;

// Define your updated photo paths organized by year and category
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

// Set the default selection to show all years
let selectedYear = '*';
let selectedCategory = '*';

let connections = [];
let targetPositions = [];
let transitionSpeed = 0.01;
let maxConnectionsPerImage = 3;
let moveInterval = 3000;
let lastMoveTime = 0;

// Function to update the gallery images based on the selected year
function updateGalleryImages() {
    imageStack = []; // Clear previous images
    const selectedPhotos = new Set();

    // Handle the "*" wildcard for year and category
    const yearsToShow = selectedYear === '*' ? Object.keys(photos) : [selectedYear];

    // Loop through selected years and get one random photo per year
    yearsToShow.forEach(year => {
        const yearPhotos = photos[year] || {};
        // Get all photos from all categories of the selected year
        const allPhotos = Object.values(yearPhotos).flat();
        if (allPhotos.length > 0) {
            // Select one random image from the year
            const randomPhoto = random(allPhotos);
            selectedPhotos.add(randomPhoto);
        }
    });

    // Load selected images into the stack
    selectedPhotos.forEach(photo => {
        loadImage(photo, img => {
            imageStack.push(img);
            console.log(`Image loaded: ${photo}`);
        }, () => {
            console.log(`Failed to load image: ${photo}`);
        });
    });
}

// Function to handle year/category selection from the HTML interface
function showPhotos(selection, type) {
    if (type === 'year') {
        selectedYear = selection;
        document.querySelectorAll('#year-categories a').forEach(link => link.classList.remove('selected'));
        document.querySelector(`#year-categories a[onclick="showPhotos('${selection}', 'year')"]`).classList.add('selected');
    } else if (type === 'category') {
        selectedCategory = selection;
        document.querySelectorAll('#other-categories a').forEach(link => link.classList.remove('selected'));
        document.querySelector(`#other-categories a[onclick="showPhotos('${selection}', 'category')"]`).classList.add('selected');
    }

    // Update the gallery based on the selected filters
    updateGalleryImages();
}

// Preload images for the sketch
function preload() {
    updateGalleryImages(); // Preload images based on the initial selections
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);

    // Load and initialize images for the sketch
    for (let img of imageStack) {
        let x = random(width - 100);
        let y = random(height - 100);
        images.push(new DraggableImage(img, x, y, 100, 100));
        targetPositions.push({ x: x, y: y });
    }

    // Create random connections
    createRandomConnections();
}

function draw() {
    background(255);

    // Update target positions if needed
    if (millis() - lastMoveTime > moveInterval) {
        updateTargetPositions();
        lastMoveTime = millis();
    }

    // Draw dashed lines between connections
    stroke(0);
    strokeWeight(1);
    dashLine();

    // Update and display images
    for (let i = 0; i < images.length; i++) {
        let img = images[i];
        let target = targetPositions[i];
        img.x += (target.x - img.x) * transitionSpeed;
        img.y += (target.y - img.y) * transitionSpeed;

        img.display();
        img.update();
    }
}

// Load images into the stack
function loadImagesIntoStack(images) {
    images.forEach(url => {
        loadImage(url, img => {
            imageStack.push(img);
        }, () => {
            console.log(`Failed to load image: ${url}`);
        });
    });
}

function updateTargetPositions() {
    for (let i = 0; i < images.length; i++) {
        targetPositions[i] = {
            x: random(width - 100),
            y: random(height - 100)
        };
    }
}

function dashLine() {
    for (let connection of connections) {
        let img1 = connection[0];
        let img2 = connection[1];
        let x1 = img1.x + img1.w / 2;
        let y1 = img1.y + img1.h / 2;
        let x2 = img2.x + img2.w / 2;
        let y2 = img2.y + img2.h / 2;
        let dashLength = 10;
        let gapLength = 5;
        let totalLength = dist(x1, y1, x2, y2);
        let numDashes = floor(totalLength / (dashLength + gapLength));
        let angle = atan2(y2 - y1, x2 - x1);
        for (let i = 0; i < numDashes; i++) {
            let startX = x1 + i * (dashLength + gapLength) * cos(angle);
            let startY = y1 + i * (dashLength + gapLength) * sin(angle);
            let endX = startX + dashLength * cos(angle);
            let endY = startY + dashLength * sin(angle);
            line(startX, startY, endX, endY);
        }
    }
}

function createRandomConnections() {
    connections = [];
    for (let i = 0; i < images.length; i++) {
        let connectionsCount = 0;
        while (connectionsCount < random(maxConnectionsPerImage)) {
            let j = floor(random(images.length));
            if (i !== j && !connections.some(c => (c[0] === images[i] && c[1] === images[j]) || (c[0] === images[j] && c[1] === images[i]))) {
                connections.push([images[i], images[j]]);
                connectionsCount++;
            }
        }
    }
}

// Draggable Image class for interactive sketch
class DraggableImage {
    constructor(img, x, y, maxW, maxH) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.maxW = maxW;
        this.maxH = maxH;
        this.dragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.calculateDimensions();
    }

    calculateDimensions() {
        let imgAspect = this.img.width / this.img.height;
        let maxAspect = this.maxW / this.maxH;
        if (imgAspect > maxAspect) {
            this.w = this.maxW;
            this.h = this.maxW / imgAspect;
        } else {
            this.h = this.maxH;
            this.w = this.maxH * imgAspect;
        }
    }

    display() {
        image(this.img, this.x, this.y, this.w, this.h);
    }

    update() {
        if (this.dragging && currentDraggedImage === this) {
            this.x = mouseX + this.offsetX;
            this.y = mouseY + this.offsetY;
        }
    }

    pressed() {
        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
            this.dragging = true;
            this.offsetX = this.x - mouseX;
            this.offsetY = this.y - mouseY;
            currentDraggedImage = this;
        }
    }

    released() {
        this.dragging = false;
        if (currentDraggedImage === this) {
            currentDraggedImage = null;
        }
    }
}
