/* ==========================================================================
   Mehdi Nacer Kerkar — Interactive Web System
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveNavLink();
  initFilters();
  initArticleSearch();
  initContactForm();
});

/* Mobile Menu Drawer Toggle */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

/* Active Nav Link Highlight based on current path */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* Generic Filter Tabs (Projects, Engagements, Articles) */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('[data-category]');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      filterItems.forEach(item => {
        const itemCategories = item.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || itemCategories.includes(filterValue)) {
          item.style.display = '';
          item.style.opacity = '1';
        } else {
          item.style.display = 'none';
          item.style.opacity = '0';
        }
      });
    });
  });
}

/* Live Article Search */
function initArticleSearch() {
  const searchInput = document.getElementById('article-search-input');
  const articleCards = document.querySelectorAll('.article-card');

  if (!searchInput || articleCards.length === 0) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    articleCards.forEach(card => {
      const title = card.querySelector('.article-title-link')?.textContent.toLowerCase() || '';
      const excerpt = card.querySelector('.article-excerpt')?.textContent.toLowerCase() || '';
      const category = card.querySelector('.article-category')?.textContent.toLowerCase() || '';

      if (title.includes(query) || excerpt.includes(query) || category.includes(query)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

/* Client-side Contact Form Validation & Confirmation Modal */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const modalOverlay = document.getElementById('contact-modal');
  const modalClose = document.getElementById('modal-close-btn');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name')?.value.trim();
    const email = document.getElementById('form-email')?.value.trim();
    const subject = document.getElementById('form-subject')?.value;
    const message = document.getElementById('form-message')?.value.trim();

    if (!name || !email || !message) {
      alert('Please complete all required fields.');
      return;
    }

    // Show custom success modal
    if (modalOverlay) {
      modalOverlay.classList.add('active');
    } else {
      alert(`Thank you, ${name}. Your message has been received!`);
    }

    contactForm.reset();
  });

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }
}
