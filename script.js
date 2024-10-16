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


