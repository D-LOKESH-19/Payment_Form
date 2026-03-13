
import React, { useState } from 'react';
import { WEB3FORMS_KEY } from '../src/config';

const Texter = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    utrNumber: '' // Added UTR number field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // State for confirmation dialog

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    // Show confirmation dialog with JSON data
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formDataToSend = {
      access_key: WEB3FORMS_KEY,
      name: formData.name,
      email: formData.email,
      message: formData.message,
      thought: formData.thought,
      experience: formData.experience,
      utr_number: formData.utrNumber, // Added UTR to submission
      subject: `Test Form Submission from ${formData.name}`,
      from_name: formData.name
    };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formDataToSend)
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        setFormData({ 
          name: '', 
          email: '', 
          message: '', 
          utrNumber: '' // Reset UTR field
        });
      } else {
        setSubmitStatus('error');
        console.error('Web3Forms error:', data);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmDialog(false);
  };

  // Function to download QR code
  const handleDownloadQR = () => {
    // Create a link element
    const link = document.createElement('a');
    
    // You can use the actual image path or a data URL
    // Option 1: If using actual image file
    link.href = '../public/qqqr_code.jpeg'; // Replace with your actual QR code image path
    
    // Option 2: If you want to use the displayed image
    // const imgElement = document.querySelector('.qr-image');
    // link.href = imgElement.src;
    
    link.download = 'payment-qr-code.jpeg'; // Name for downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Optional: Show feedback
    alert('QR Code download started!');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📝 Web3Forms Test</h2>
        <p style={styles.subtitle}>Simple test form to verify your setup</p>

        {/* QR Code Section with Download Button */}
        <div style={styles.qrSection}>
          <h3 style={styles.qrTitle}>Scan QR Code for Payment</h3>
          <div style={styles.qrContainer}>
            <img 
              src="../public/qqqr_code.jpeg" // Replace with your actual QR code image path
              alt="Payment QR Code"
              style={styles.qrImage}
              className="qr-image" // Added class for potential JavaScript access
              onError={(e) => {
                e.target.style.display = 'none';
                // You can show an error message or placeholder
              }}
            />
            <p style={styles.qrNote}>Scan to make payment</p>
            
            {/* Download QR Code Button */}
            <button 
              onClick={handleDownloadQR}
              style={styles.downloadButton}
              title="Download QR Code"
            >
              ⬇️ Download QR Code
            </button>
            
            {/* Optional: Alternative if image not visible */}
            <p style={styles.qrHelpText}>
              If QR code is not visible, click download button to save it
            </p>
          </div>
        </div>

        {submitStatus === 'success' && (
          <div style={styles.successMessage}>
            ✅ Form submitted successfully! Check your email.
          </div>
        )}

        {submitStatus === 'error' && (
          <div style={styles.errorMessage}>
            ❌ Submission failed. Check console for details.
          </div>
        )}

        <form onSubmit={handleSubmitClick} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Message:</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              style={{...styles.input, minHeight: '80px'}}
              placeholder="Enter your test message"
            />
          </div>


          {/* New UTR Number Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>UTR Number:</label>
            <input
              type="text"
              name="utrNumber"
              value={formData.utrNumber}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter UTR number after payment"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{
              ...styles.button,
              ...(isSubmitting ? styles.buttonDisabled : {})
            }}
          >
            {isSubmitting ? 'Sending...' : 'Review & Send'}
          </button>
        </form>

        <div style={styles.info}>
          <p style={styles.infoText}>
            🔑 Using key: {WEB3FORMS_KEY ? WEB3FORMS_KEY.substring(0, 8) + '...' : 'Not found!'}
          </p>
          <p style={styles.infoText}>
            🌐 Current domain: {window.location.hostname}
          </p>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div style={styles.dialogOverlay}>
          <div style={styles.dialogContent}>
            <h3 style={styles.dialogTitle}>Confirm Submission</h3>
            <p style={styles.dialogSubtitle}>Please review your data before submitting:</p>
            
            <div style={styles.jsonContainer}>
              <pre style={styles.jsonPre}>
                {JSON.stringify({
                  name: formData.name,
                  email: formData.email,
                  message: formData.message,
                  utrNumber: formData.utrNumber
                }, null, 2)}
              </pre>
            </div>

            <div style={styles.dialogButtons}>
              <button 
                onClick={handleConfirmSubmit}
                style={{...styles.dialogButton, ...styles.confirmButton}}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Confirm & Send'}
              </button>
              <button 
                onClick={handleCancelSubmit}
                style={{...styles.dialogButton, ...styles.cancelButton}}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Updated styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    position: 'relative'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    width: '100%'
  },
  title: {
    margin: '0 0 8px 0',
    color: '#333',
    fontSize: '24px'
  },
  subtitle: {
    margin: '0 0 24px 0',
    color: '#666',
    fontSize: '14px'
  },
  // QR Code styles
  qrSection: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  qrTitle: {
    margin: '0 0 15px 0',
    color: '#333',
    fontSize: '16px',
    fontWeight: '600'
  },
  qrContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
  },
  qrImage: {
    width: '250px',
    height: '350px',
    objectFit: 'contain',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    backgroundColor: 'white'
  },
  qrNote: {
    margin: '0',
    color: '#666',
    fontSize: '12px',
    fontStyle: 'italic'
  },
  // New download button style
  downloadButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px'
  },
  // Help text for QR code visibility
  qrHelpText: {
    margin: '5px 0 0 0',
    color: '#dc3545',
    fontSize: '11px',
    fontStyle: 'italic'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontWeight: '500',
    color: '#555',
    fontSize: '14px'
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    fontFamily: 'inherit'
  },
  button: {
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '12px'
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed'
  },
  successMessage: {
    padding: '12px',
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
    borderRadius: '6px',
    marginBottom: '20px'
  },
  errorMessage: {
    padding: '12px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
    borderRadius: '6px',
    marginBottom: '20px'
  },
  info: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    border: '1px solid #e9ecef'
  },
  infoText: {
    margin: '5px 0',
    color: '#666',
    fontSize: '13px',
    fontFamily: 'monospace'
  },
  // Dialog styles
  dialogOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  dialogContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto'
  },
  dialogTitle: {
    margin: '0 0 8px 0',
    color: '#333',
    fontSize: '20px'
  },
  dialogSubtitle: {
    margin: '0 0 20px 0',
    color: '#666',
    fontSize: '14px'
  },
  jsonContainer: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #e9ecef'
  },
  jsonPre: {
    margin: 0,
    color: '#333',
    fontSize: '12px',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word'
  },
  dialogButtons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end'
  },
  dialogButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    color: 'white'
  },
  cancelButton: {
    backgroundColor: '#f44336',
    color: 'white'
  }
};

export default Texter;