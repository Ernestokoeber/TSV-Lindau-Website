// Einfaches Accordion-Verhalten für die Datenschutzerklärung
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.accordion-button');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const content = button.nextElementSibling;

      // Bereits offenen Abschnitt schließen (optional)
      document.querySelectorAll('.accordion-content').forEach((c) => {
        if (c !== content) {
          c.style.display = 'none';
        }
      });
      document.querySelectorAll('.accordion-button').forEach((b) => {
        if (b !== button) {
          b.classList.remove('active');
        }
      });

      // Aktuellen Abschnitt ein-/ausblenden
      const isOpen = content.style.display === 'block';
      if (isOpen) {
        content.style.display = 'none';
        button.classList.remove('active');
      } else {
        content.style.display = 'block';
        button.classList.add('active');
      }
    });
  });
});
