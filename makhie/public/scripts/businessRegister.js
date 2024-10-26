// Select the form element
const businessForm = document.getElementById('businessForm');

// Add an event listener for form submission
businessForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission
  
  // Extract data from form fields
  const businessName = document.getElementById('businessName').value;
  const industry = document.getElementById('industry').value;
  const fundingGoal = document.getElementById('fundingGoal').value;
  const benefit = document.getElementById('benefit').value;
  const timeSpan = document.getElementById('timeSpan').value;
  const description = document.getElementById('description').value;
  const image = document.getElementById('image').files[0]; // For file upload

  // Simple client-side validation
  if (!businessName || !industry || !fundingGoal || !benefit || !timeSpan) {
    alert('Please fill in all required fields.');
    return;
  }

  // Prepare data to send to the server
  const formData = new FormData();
  formData.append('business_name', businessName);
  formData.append('industry', industry);
  formData.append('funding_goal', fundingGoal);
  formData.append('benefit', benefit);
  formData.append('time_span', timeSpan);
  formData.append('description', description);
  if (image) formData.append('image', image);

  try {
    // Send a POST request to register the business
    const response = await fetch('/api/business/register', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      alert('Business registered successfully!');
      window.location.href = '/business/dashboard'; // Redirect after success
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
    }
  } catch (err) {
    console.error('Error registering business:', err);
    alert('An error occurred. Please try again.');
  }
});

// Optional: Preview the uploaded image before submitting
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('imagePreview');

imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});
