// Street Dog Management System JavaScript

// Sample data from the system
const sampleData = {
  dogs: [
    {
      id: "CBE-001-DOG001",
      district: "Coimbatore",
      area: "Edayarpalayam",
      location: "Near Iyyapan Kovil",
      vaccinated: true,
      vaccination_date: "2025-08-15",
      booster_due: "2026-08-15",
      sterilized: true,
      sterilization_date: "2025-08-15",
      gender: "Female",
      age_estimate: "3 years",
      notes: "Friendly dog, regular feeding spot near metro. Well-socialized with humans.",
      last_seen: "2025-08-15",
      health_status: "Good"
    },
    {
      id: "CBE-001-DOG002",
      district: "Coimbatore",
      area: "Edayarpalayam",
      location: "Near IOB",
      vaccinated: true,
      vaccination_date: "2025-08-15",
      booster_due: "2026-08-15",
      sterilized: true,
      sterilization_date: null,
      gender: "male",
      age_estimate: "3 years",
      notes: "Scheduled for sterilization next week. Slightly territorial but not aggressive.",
      last_seen: "2025-09-01",
      health_status: "Good"
    },
    {
      id: "CBE-001-DOG003",
      district: "Coimbatore",
      area: "Vadavalli",
      location: "Near IOB",
      vaccinated: true,
      vaccination_date: "2025-07-15",
      booster_due: "2026-07-15",
      sterilized: true,
      sterilization_date: null,
      gender: "male",
      age_estimate: "3 years",
      notes: "needs to be sterilized. Slightly territorial but not aggressive.",
      last_seen: "2025-09-01",
      health_status: "Good"
    }
  ],
  stats: {
    total_dogs_registered: 3,
    dogs_vaccinated: 0,
    dogs_sterilized: 0,
    dogs_rescued_this_month: 0,
    active_volunteers: 0,
    partner_organizations: 0,
    total_donations_raised: "₹0",
    areas_covered: 0
  },
  credentials: {
    username: "demo",
    password: "streetdog123"
  }
};

// Application state
let currentUser = null;
let currentPage = 'home';
let sidebarOpen = false;

// DOM Elements
const loginPage = document.getElementById('login-page');
const app = document.getElementById('app');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const menuToggle = document.getElementById('menu-toggle');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Set up event listeners
  setupEventListeners();
  
  // Check if user is already logged in (for demo purposes)
  const isLoggedIn = sessionStorage.getItem('loggedIn');
  if (isLoggedIn) {
    showMainApp();
  } else {
    showLoginPage();
  }
}

function setupEventListeners() {
  // Login form
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  
  // Search form
  document.getElementById('search-form').addEventListener('submit', handleSearch);
  
  // Report form
  document.getElementById('report-form').addEventListener('submit', handleReportSubmission);
  
  // Feedback form
  document.getElementById('feedback-form').addEventListener('submit', handleFeedbackSubmission);
  
  // Menu toggle
  menuToggle.addEventListener('click', toggleSidebar);
  
  // Sidebar overlay
  sidebarOverlay.addEventListener('click', closeSidebar);
  
  // Close sidebar when clicking nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', closeSidebar);
  });
}

// Authentication Functions
function handleLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  // Validate credentials
  if (username === sampleData.credentials.username && 
      password === sampleData.credentials.password) {
    
    currentUser = { username: username };
    sessionStorage.setItem('loggedIn', 'true');
    showMainApp();
    showAlert('Login successful!', 'success');
    
  } else {
    showAlert('Invalid credentials. Please try again.', 'error');
  }
}

function logout() {
  currentUser = null;
  sessionStorage.removeItem('loggedIn');
  showLoginPage();
  closeSidebar();
}

// Page Management Functions
function showLoginPage() {
  loginPage.classList.add('active');
  app.classList.add('hidden');
}

function showMainApp() {
  loginPage.classList.remove('active');
  app.classList.remove('hidden');
  navigateToPage('home');
}

function navigateToPage(page) {
  // Hide all content pages
  document.querySelectorAll('.content-page').forEach(p => {
    p.classList.remove('active');
  });
  
  // Show requested page
  const targetPage = document.getElementById(page + '-page');
  if (targetPage) {
    targetPage.classList.add('active');
    currentPage = page;
  }
  
  // Close sidebar on mobile
  if (window.innerWidth <= 768) {
    closeSidebar();
  }
}

// Sidebar Functions
function toggleSidebar() {
  if (sidebarOpen) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('active');
  sidebarOpen = true;
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
  sidebarOpen = false;
}

// Search Functions
function handleSearch(event) {
  event.preventDefault();
  
  const dogId = document.getElementById('dog-id').value.trim().toUpperCase();
  const resultsContainer = document.getElementById('search-results');
  
  if (!dogId) {
    showAlert('Please enter a dog ID', 'error');
    return;
  }
  
  // Search for dog in sample data
  const dog = sampleData.dogs.find(d => d.id === dogId);
  
  if (dog) {
    displayDogInfo(dog, resultsContainer);
    resultsContainer.classList.remove('hidden');
    showAlert('Dog found!', 'success');
  } else {
    resultsContainer.innerHTML = `
      <div class="alert alert--error">
        <strong>Dog not found:</strong> No dog with ID "${dogId}" was found in our database.
        Please check the ID format (DISTRICT-AREA-DOGID) and try again.
      </div>
    `;
    resultsContainer.classList.remove('hidden');
  }
}

function displayDogInfo(dog, container) {
  const vaccinationStatus = dog.vaccinated ? 'Vaccinated' : 'Not Vaccinated';
  const sterilizationStatus = dog.sterilized ? 'Sterilized' : 'Not Sterilized';
  
  const vaccinationBadge = dog.vaccinated ? 'status-badge--success' : 'status-badge--danger';
  const sterilizationBadge = dog.sterilized ? 'status-badge--success' : 'status-badge--warning';
  
  container.innerHTML = `
    <div class="dog-info-card">
      <div class="dog-info-header">
        <div class="dog-id">${dog.id}</div>
        <div class="status-badges">
          <span class="status-badge ${vaccinationBadge}">${vaccinationStatus}</span>
          <span class="status-badge ${sterilizationBadge}">${sterilizationStatus}</span>
        </div>
      </div>
      
      <div class="dog-info-grid">
        <div class="info-section">
          <h4>Location Information</h4>
          <div class="info-item">
            <span class="info-label">District:</span>
            <span class="info-value">${dog.district}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Area:</span>
            <span class="info-value">${dog.area}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Location:</span>
            <span class="info-value">${dog.location}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Last Seen:</span>
            <span class="info-value">${formatDate(dog.last_seen)}</span>
          </div>
        </div>
        
        <div class="info-section">
          <h4>Medical Information</h4>
          <div class="info-item">
            <span class="info-label">Vaccination Date:</span>
            <span class="info-value">${dog.vaccination_date ? formatDate(dog.vaccination_date) : 'Not vaccinated'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Booster Due:</span>
            <span class="info-value">${dog.booster_due ? formatDate(dog.booster_due) : 'N/A'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Sterilization Date:</span>
            <span class="info-value">${dog.sterilization_date ? formatDate(dog.sterilization_date) : 'Not sterilized'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Health Status:</span>
            <span class="info-value">${dog.health_status}</span>
          </div>
        </div>
        
        <div class="info-section">
          <h4>General Information</h4>
          <div class="info-item">
            <span class="info-label">Gender:</span>
            <span class="info-value">${dog.gender}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Age Estimate:</span>
            <span class="info-value">${dog.age_estimate}</span>
          </div>
        </div>
      </div>
      
      ${dog.notes ? `
        <div class="info-section" style="margin-top: 1.5rem;">
          <h4>Notes</h4>
          <p>${dog.notes}</p>
        </div>
      ` : ''}
    </div>
  `;
}

// Report Functions
function handleReportSubmission(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const reportType = formData.get('report-type');
  const location = formData.get('location');
  const notes = formData.get('notes');
  
  if (!reportType || !location) {
    showAlert('Please fill in all required fields', 'error');
    return;
  }
  
  // Simulate report submission
  showAlert('Report submitted successfully! Our team will investigate this issue.', 'success');
  
  // Reset form
  event.target.reset();
  
  // Log the report (in a real app, this would be sent to a server)
  console.log('Report submitted:', {
    type: reportType,
    location: location,
    notes: notes,
    timestamp: new Date().toISOString()
  });
}

// Feedback Functions
function handleFeedbackSubmission(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const feedbackType = formData.get('feedback-type');
  const message = formData.get('feedback-message');
  const email = formData.get('contact-email');
  
  if (!feedbackType || !message) {
    showAlert('Please fill in all required fields', 'error');
    return;
  }
  
  // Simulate feedback submission
  showAlert('Thank you for your feedback! We appreciate your input.', 'success');
  
  // Reset form
  event.target.reset();
  
  // Log the feedback (in a real app, this would be sent to a server)
  console.log('Feedback submitted:', {
    type: feedbackType,
    message: message,
    email: email,
    timestamp: new Date().toISOString()
  });
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
}

function showAlert(message, type = 'info') {
  // Create alert element
  const alert = document.createElement('div');
  alert.className = `alert alert--${type}`;
  alert.textContent = message;
  
  // Find a suitable container (current page or login page)
  let container;
  if (currentUser) {
    const currentPageElement = document.querySelector('.content-page.active');
    container = currentPageElement || document.querySelector('.main-content');
  } else {
    container = document.querySelector('.login-card');
  }
  
  // Insert alert at the beginning of the container
  container.insertBefore(alert, container.firstChild);
  
  // Remove alert after 5 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.parentNode.removeChild(alert);
    }
  }, 5000);
}

// Handle window resize
window.addEventListener('resize', function() {
  if (window.innerWidth > 768 && sidebarOpen) {
    closeSidebar();
  }
});

// Prevent sidebar from staying open on page refresh
window.addEventListener('beforeunload', function() {
  closeSidebar();
});