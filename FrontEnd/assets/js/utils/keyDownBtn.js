/**
 * Initializes keyboard accessibility for the file input label.
 * 
 * This function enables keyboard users to activate the hidden file input
 * by pressing the 'Enter' or 'Space' key when the focus is on the label
 * with the class 'bouton-ajouter'. It simulates a click on the associated
 * file input element to open the file selection dialog.
 * 
 * @function
 * @example
 * // To activate the functionality, call this function after the DOM is loaded.
 * setupAccessibleUploadLabel();
 */
export function setupAccessibleUploadLabel() {
    const uploadLabel = document.querySelector('.bouton-ajouter');
  
    if (uploadLabel) {
      uploadLabel.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); // Prevents the default action (e.g., scrolling for spacebar)
          document.getElementById('file-input').click(); // Simulates a click on the hidden file input
        }
      });
    }
  }
  