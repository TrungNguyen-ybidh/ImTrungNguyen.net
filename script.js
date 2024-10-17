// Toggle the hamburger menu
function hamburg() {
    const navbar = document.querySelector(".dropdown");
    navbar.style.transform = "translateY(0)"; // Show the dropdown by setting translateY to 0
    navbar.style.transition = "transform 0.3s ease-in-out"; // Add a transition for smooth effect
}

function cancel() {
    const navbar = document.querySelector(".dropdown");
    navbar.style.transform = "translateY(-100%)"; // Hide the dropdown by moving it up
    navbar.style.transition = "transform 0.3s ease-in-out"; // Add a transition for smooth effect
}

// Add functionality to the nav links
document.querySelectorAll('.links .link a').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default behavior
        const section = this.textContent.toLowerCase(); // Get the section name
        console.log(`Navigating to ${section}`);
        // Add logic here to scroll to the specific section if you have sections with corresponding IDs
    });
});

// Add functionality to the dropdown links
document.querySelectorAll('.dropdown a').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default behavior
        const section = this.textContent.toLowerCase(); // Get the section name
        console.log(`Navigating to ${section}`);
        // Add logic here to scroll to the specific section if you have sections with corresponding IDs
        const dropdown = document.querySelector('.dropdown');
        dropdown.style.display = 'none'; // Hide the dropdown after clicking a link
    });
});

// Add smooth scrolling functionality to both nav and dropdown links
document.querySelectorAll('.links .link a, .dropdown a').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default behavior
        const sectionId = this.textContent.toLowerCase();
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
        const dropdown = document.querySelector('.dropdown');
        dropdown.style.transform = "translateY(-100%)"; // Hide dropdown after clicking a link
    });
});

function toggleDropdown(contentId, iconId) {
    const dropdownContent = document.getElementById(contentId);
    const icon = document.getElementById(iconId);

    // Toggle the active class for smooth transition
    dropdownContent.classList.toggle('active');

    
    icon.classList.toggle('rotate');

    // Dynamically set the max-height based on the content height for smooth expansion
    if (dropdownContent.classList.contains('active')) {
        dropdownContent.style.maxHeight = dropdownContent.scrollHeight + "px";
    } else {
        dropdownContent.style.maxHeight = "0";
    }
}

 // Function to create random moving hexagon objects
 function createRandomObject() {
    const object = document.createElement('div');
    object.classList.add('moving-object');

    // Random initial position within the viewport
    object.style.top = Math.random() * window.innerHeight + 'px';
    object.style.left = Math.random() * window.innerWidth + 'px';

    // Append the object to the background container
    document.getElementById('background-container').appendChild(object);

    // Animate the object
    moveObject(object);
}

// Function to move the object
function moveObject(object) {
    let posX = parseFloat(object.style.left);
    let posY = parseFloat(object.style.top);
    let speedX = (Math.random() - 0.5) * 2; // Random horizontal speed
    let speedY = (Math.random() - 0.5) * 2; // Random vertical speed

    function animate() {
        // Update positions based on speed
        posX += speedX;
        posY += speedY;

        // Update object position in the DOM
        object.style.left = posX + 'px';
        object.style.top = posY + 'px';

        // Bounce off the right or left boundary
        if (posX + object.offsetWidth >= window.innerWidth || posX <= 0) {
            speedX = -speedX; // Reverse horizontal direction
        }

        // Bounce off the bottom or top boundary
        if (posY + object.offsetHeight >= window.innerHeight || posY <= 0) {
            speedY = -speedY; // Reverse vertical direction
        }

        // Continue the animation
        requestAnimationFrame(animate);
    }

    // Start the animation
    animate();
}

// Function to create fewer larger random hexagon objects
function generateRandomObjects() {
    for (let i = 0; i < 8; i++) { // Reduced number of objects (8 instead of 15)
        createRandomObject();
    }
}

// Generate random moving objects when the page loads
window.onload = generateRandomObjects;

let speedX = (Math.random() - 0.5) * 2; // Slower horizontal speed for smoother movement
let speedY = (Math.random() - 0.5) * 2; // Slower vertical speed

