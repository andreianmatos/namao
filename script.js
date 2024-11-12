// Global variables
let imageStack = [];
let images = [];
let currentDraggedImage = null;

// Define your photo paths organized by year and category
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

let connections = [];
let targetPositions = [];
let transitionSpeed = 0.01;
let maxConnectionsPerImage = 3;
let moveInterval = 3000;
let lastMoveTime = 0;

// Selected filters from the HTML interface
let selectedYear = '*';
let selectedCategory = '*';

// Function to update the gallery images based on the selected year and category
function updateGalleryImages() {
  imageStack = []; // Clear previous images
  const selectedPhotos = new Set();

  // Handle the "*" wildcard for year and category
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

  // Load images into the stack
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
