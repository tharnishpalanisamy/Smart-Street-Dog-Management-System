// Street Dog Management System JavaScript - Multi-page Version

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
let sidebarOpen = false;

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const menuToggle = document.getElementById('menu-toggle');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Check authentication for non-index pages
  if (window.location.pathname !== '/' && !window.location.pathname.includes('index.html')) {
    checkAuthentication();
  }
  
  // Set up event listeners
  setupEventListeners();
  
  // Check if this is the index page with login
  const loginPage = document.getElementById('login-page');
  if (loginPage) {
    handleIndexPage();
  }
}

function handleIndexPage() {
  // Check if user is already logged in
  const isLoggedIn = sessionStorage.getItem('loggedIn');
  if (isLoggedIn) {
    showMainApp();
  } else {
    showLoginPage();
  }
}

function checkAuthentication() {
  const isLoggedIn = sessionStorage.getItem('loggedIn');
  if (!isLoggedIn) {
    // Redirect to login page
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function setupEventListeners() {
  // Login form (only on index page)
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Search form
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', handleSearch);
  }
  
  // Report form
  const reportForm = document.getElementById('report-form');
  if (reportForm) {
    reportForm.addEventListener('submit', handleReportSubmission);
  }
  
  // Feedback form
  const feedbackForm = document.getElementById('feedback-form');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', handleFeedbackSubmission);
    
    // Contact preference change handler
    const contactPreference = document.getElementById('contact-preference');
    if (contactPreference) {
      contactPreference.addEventListener('change', handleContactPreferenceChange);
    }
  }
  
  // Volunteer form
  const volunteerForm = document.getElementById('volunteer-application');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', handleVolunteerApplication);
  }
  
  // Donation form
  const donationForm = document.getElementById('donation-details');
  if (donationForm) {
    donationForm.addEventListener('submit', handleDonationSubmission);
  }
  
  // Menu toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleSidebar);
  }
  
  // Sidebar overlay
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }
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
  window.location.href = 'index.html';
}

// Page Management Functions
function showLoginPage() {
  const loginPage = document.getElementById('login-page');
  const app = document.getElementById('app');
  if (loginPage && app) {
    loginPage.classList.add('active');
    app.classList.add('hidden');
  }
}

function showMainApp() {
  const loginPage = document.getElementById('login-page');
  const app = document.getElementById('app');
  if (loginPage && app) {
    loginPage.classList.remove('active');
    app.classList.remove('hidden');
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
  if (sidebar) {
    sidebar.classList.add('open');
  }
  if (sidebarOverlay) {
    sidebarOverlay.classList.add('active');
  }
  sidebarOpen = true;
}

function closeSidebar() {
  if (sidebar) {
    sidebar.classList.remove('open');
  }
  if (sidebarOverlay) {
    sidebarOverlay.classList.remove('active');
  }
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
  const subject = formData.get('feedback-subject');
  const message = formData.get('feedback-message');
  const rating = formData.get('rating');
  const contactPreference = formData.get('contact-preference');
  
  if (!feedbackType || !subject || !message) {
    showAlert('Please fill in all required fields', 'error');
    return;
  }
  
  // Simulate feedback submission
  showAlert('Thank you for your feedback! We appreciate your input and will review it carefully.', 'success');
  
  // Reset form
  event.target.reset();
  hideContactDetails();
  
  // Log the feedback (in a real app, this would be sent to a server)
  console.log('Feedback submitted:', {
    type: feedbackType,
    subject: subject,
    message: message,
    rating: rating,
    contactPreference: contactPreference,
    timestamp: new Date().toISOString()
  });
}

function handleContactPreferenceChange() {
  const preference = document.getElementById('contact-preference').value;
  const contactDetails = document.getElementById('contact-details');
  const emailField = document.getElementById('email-field');
  const phoneField = document.getElementById('phone-field');
  
  if (preference === 'anonymous') {
    hideContactDetails();
  } else {
    contactDetails.classList.remove('hidden');
    
    // Show/hide fields based on preference
    if (preference === 'email') {
      emailField.style.display = 'block';
      phoneField.style.display = 'none';
      document.getElementById('contact-email').required = true;
      document.getElementById('contact-phone').required = false;
    } else if (preference === 'phone') {
      emailField.style.display = 'none';
      phoneField.style.display = 'block';
      document.getElementById('contact-email').required = false;
      document.getElementById('contact-phone').required = true;
    } else if (preference === 'both') {
      emailField.style.display = 'block';
      phoneField.style.display = 'block';
      document.getElementById('contact-email').required = true;
      document.getElementById('contact-phone').required = true;
    }
  }
}

function hideContactDetails() {
  const contactDetails = document.getElementById('contact-details');
  if (contactDetails) {
    contactDetails.classList.add('hidden');
    document.getElementById('contact-email').required = false;
    document.getElementById('contact-phone').required = false;
  }
}

// Volunteer Functions
function showVolunteerForm() {
  const form = document.getElementById('volunteer-form');
  if (form) {
    form.classList.remove('hidden');
    form.scrollIntoView({ behavior: 'smooth' });
  }
}

function handleVolunteerApplication(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const name = formData.get('full-name');
  const email = formData.get('email');
  const volunteerType = formData.get('volunteer-type');
  const motivation = formData.get('motivation');
  
  if (!name || !email || !volunteerType || !motivation) {
    showAlert('Please fill in all required fields', 'error');
    return;
  }
  
  // Simulate application submission
  showAlert('Thank you for your volunteer application! We will contact you within 3-5 business days to discuss next steps.', 'success');
  
  // Reset form
  event.target.reset();
  
  // Log the application (in a real app, this would be sent to a server)
  console.log('Volunteer application submitted:', {
    name: name,
    email: email,
    type: volunteerType,
    timestamp: new Date().toISOString()
  });
}

// Donation Functions
function selectDonationAmount(amount) {
  const donationForm = document.getElementById('donation-form');
  const amountField = document.getElementById('donation-amount');
  
  if (donationForm && amountField) {
    amountField.value = amount;
    donationForm.classList.remove('hidden');
    donationForm.scrollIntoView({ behavior: 'smooth' });
  }
}

function showCustomAmount() {
  const donationForm = document.getElementById('donation-form');
  const amountField = document.getElementById('donation-amount');
  
  if (donationForm && amountField) {
    amountField.value = '';
    amountField.focus();
    donationForm.classList.remove('hidden');
    donationForm.scrollIntoView({ behavior: 'smooth' });
  }
}

function setupMonthlyDonation() {
  showAlert('Monthly donation setup is not yet available. Please contact us directly for recurring donations.', 'warning');
}

function handleDonationSubmission(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const amount = formData.get('donation-amount');
  const name = formData.get('donor-name');
  const email = formData.get('donor-email');
  
  if (!amount || !name || !email) {
    showAlert('Please fill in all required fields', 'error');
    return;
  }
  
  if (amount < 100) {
    showAlert('Minimum donation amount is ₹100', 'error');
    return;
  }
  
  // Simulate payment processing
  showAlert(`Thank you ${name}! Your donation of ₹${amount} is being processed. You will receive a confirmation email shortly.`, 'success');
  
  // Reset form
  event.target.reset();
  document.getElementById('donation-form').classList.add('hidden');
  
  // Log the donation (in a real app, this would process the payment)
  console.log('Donation processed:', {
    amount: amount,
    donor: name,
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
  
  // Find a suitable container
  let container = document.querySelector('.main-content');
  if (!container) {
    container = document.querySelector('.login-card');
  }
  if (!container) {
    container = document.body;
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
