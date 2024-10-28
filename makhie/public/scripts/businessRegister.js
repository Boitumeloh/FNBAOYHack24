// // Select the form element
// const businessForm = document.getElementById('businessForm');

// // Add an event listener for form submission
// businessForm.addEventListener('submit', async (event) => {
//   event.preventDefault();
  
//   // Get the submit button and disable it
//   const submitButton = businessForm.querySelector('button[type="submit"]');
//   submitButton.disabled = true;
//   submitButton.textContent = 'Registering...';
  
//   // Extract form data - matching schema field names exactly
//   const business_name = document.getElementById('business_name').value;
//   const industry = document.getElementById('industry').value;
//   const funding_goal = document.getElementById('funding_goal').value;
//   const benefit = document.getElementById('benefit').value;
//   const time_span = document.getElementById('time_span').value;
//   const location = document.getElementById('location').value;
//   const description = document.getElementById('description').value;
//   const image = document.getElementById('image').files[0];

//   // Validation matching schema requirements
//   const validationErrors = [];
  
//   if (!business_name.trim()) validationErrors.push('Business name is required');
//   if (!industry) validationErrors.push('Industry is required');
//   if (!funding_goal || funding_goal <= 0) validationErrors.push('Valid funding goal is required');
//   if (!benefit.trim()) validationErrors.push('Benefit is required');
//   if (!time_span.trim()) validationErrors.push('Time span is required');
//   if (!location.trim()) validationErrors.push('Location is required');

//   // Image validation (optional field in schema)
//   if (image) {
//     const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//     const maxSize = 5 * 1024 * 1024; // 5MB

//     if (!validTypes.includes(image.type)) {
//       validationErrors.push('Please upload a valid image file (JPEG, PNG)');
//     }
//     if (image.size > maxSize) {
//       validationErrors.push('Image size should be less than 5MB');
//     }
//   }

//   if (validationErrors.length > 0) {
//     showError(validationErrors.join('\n'));
//     submitButton.disabled = false;
//     submitButton.textContent = 'Register Business';
//     return;
//   }

//   // Prepare form data - matching schema field names
//   const formData = new FormData();
//   formData.append('business_name', business_name);
//   formData.append('industry', industry);
//   formData.append('funding_goal', funding_goal);
//   formData.append('benefit', benefit);
//   formData.append('time_span', time_span);
//   formData.append('location', location);
//   // Optional fields
//   if (description) formData.append('description', description);
//   if (image) formData.append('image', image);
//   // funding_received is handled by schema default
//   // user_id will be handled by server-side auth

//   try {
//     const response = await fetch('/business/register', {
//       method: 'POST',
//       body: formData
//     });

//     const data = await response.json();

//     if (response.ok) {
//       showSuccess('Business registered successfully!');
//       setTimeout(() => {
//         window.location.href = '/dashboard';
//       }, 1500);
//     } else {
//       throw new Error(data.message || 'Registration failed');
//     }
//   } catch (err) {
//     console.error('Error registering business:', err);
//     showError(err.message || 'An error occurred. Please try again.');
//   } finally {
//     submitButton.disabled = false;
//     submitButton.textContent = 'Register Business';
//   }
// });

// // Image preview functionality
// const imageInput = document.getElementById('image');
// const previewContainer = document.createElement('div');
// previewContainer.className = 'image-preview-container';
// imageInput.parentNode.insertBefore(previewContainer, imageInput.nextSibling);

// imageInput.addEventListener('change', () => {
//   const file = imageInput.files[0];
//   previewContainer.innerHTML = '';

//   if (file) {
//     const reader = new FileReader();
//     const img = document.createElement('img');
//     img.className = 'image-preview';
    
//     reader.onload = (e) => {
//       img.src = e.target.result;
//       previewContainer.appendChild(img);
      
//       const removeButton = document.createElement('button');
//       removeButton.textContent = '✕';
//       removeButton.className = 'remove-image';
//       removeButton.onclick = (e) => {
//         e.preventDefault();
//         imageInput.value = '';
//         previewContainer.innerHTML = '';
//       };
//       previewContainer.appendChild(removeButton);
//     };
    
//     reader.readAsDataURL(file);
//   }
// });

// // Utility functions for displaying messages
// function showError(message) {
//   const alertDiv = document.createElement('div');
//   alertDiv.className = 'alert alert-error';
//   alertDiv.textContent = message;
//   insertAlert(alertDiv);
// }

// function showSuccess(message) {
//   const alertDiv = document.createElement('div');
//   alertDiv.className = 'alert alert-success';
//   alertDiv.textContent = message;
//   insertAlert(alertDiv);
// }

// function insertAlert(alertDiv) {
//   const form = document.getElementById('businessForm');
//   const existingAlert = form.querySelector('.alert');
//   if (existingAlert) {
//     existingAlert.remove();
//   }
//   form.insertBefore(alertDiv, form.querySelector('button[type="submit"]'));
  
//   setTimeout(() => {
//     alertDiv.remove();
//   }, 5000);
// }