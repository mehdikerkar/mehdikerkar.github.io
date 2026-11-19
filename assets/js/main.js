/* ==========================================================================
   Mehdi Nacer Kerkar — International Advisory Web System
   Client-Side Interactive System & Multilingual Utilities
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveNavLink();
  initFilters();
  initSearch();
  initCopyEmail();
  initLanguageSwitcher();
  initCurrencyToggle();
  initCaseStudyToggles();
  initArticleSection();
  initPresentationFilters();
  initYouTubeFacades();
  initVideoSearch();
  initAboutCertifications();
  initAboutReferences();
  initServicesJump();
});

/* Mobile Navigation Drawer Toggle */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close on link click
    document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* Active Nav Link Highlight based on current path and language directory */
function initActiveNavLink() {
  const pathParts = window.location.pathname.split('/');
  const currentFileName = pathParts.pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    const hrefFileName = href.split('/').pop() || 'index.html';
    const isMatch = hrefFileName === currentFileName ||
                    hrefFileName === currentFileName + '.html' ||
                    (currentFileName === '' && hrefFileName === 'index.html');

    if (isMatch) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* Generic Filter Tabs (Services, Projects, Training, Community) */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('[data-category]');

  if (filterBtns.length === 0 || filterItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const filterValue = btn.getAttribute('data-filter');
      if (!filterValue) return; // Allow normal anchor links (like #engagement-models)

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      filterItems.forEach(item => {
        const itemCategories = (item.getAttribute('data-category') || '').split(' ');
        if (filterValue === 'all' || itemCategories.includes(filterValue)) {
          item.style.display = '';
          item.style.opacity = '1';
        } else {
          item.style.display = 'none';
          item.style.opacity = '0';
        }
      });

      // If clicked on services page, scroll smoothly to the container
      const servicesAnchor = document.getElementById('services-container');
      if (servicesAnchor && window.location.pathname.includes('services')) {
        const yOffset = -120;
        const y = servicesAnchor.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // Check URL hash on load (e.g. #ot-security or #scada)
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const matchingBtn = document.querySelector(`.filter-btn[data-filter="${hash}"]`);
    if (matchingBtn) {
      matchingBtn.click();
    } else {
      const targetElement = document.getElementById(hash);
      if (targetElement) {
        const detailsEl = targetElement.querySelector('details');
        if (detailsEl) detailsEl.open = true;
        setTimeout(() => {
          const yOffset = -100;
          const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }, 100);
      }
    }
  }
}

/* Live Instant Search (Articles, Courses, Projects) */
function initSearch() {
  const isCommunityPage = !!document.getElementById('article-expand-wrap');
  const searchInput = document.getElementById('search-input') || (isCommunityPage ? null : document.getElementById('article-search-input'));
  const searchableCards = document.querySelectorAll(isCommunityPage ? '.course-card, .project-card' : '.article-card, .course-card, .project-card');

  if (!searchInput || searchableCards.length === 0) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    searchableCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(query)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

/* Copy Email to Clipboard */
function initCopyEmail() {
  const copyButtons = document.querySelectorAll('.copy-email-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email') || 'mehdikerkarsec@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '✔ Copied to Clipboard!';
        btn.classList.add('btn-copied');

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('btn-copied');
        }, 2500);
      }).catch(err => {
        console.error('Copy failed: ', err);
      });
    });
  });
}

/* Symmetrical Language Switcher */
function initLanguageSwitcher() {
  const currentPath = window.location.pathname;
  const pathParts = currentPath.split('/').filter(Boolean);
  
  // Detect current language
  let currentLang = 'en';
  let cleanSlug = pathParts[pathParts.length - 1] || 'index.html';

  if (pathParts[0] === 'fr') {
    currentLang = 'fr';
    cleanSlug = pathParts[1] || 'index.html';
  } else if (pathParts[0] === 'ar') {
    currentLang = 'ar';
    cleanSlug = pathParts[1] || 'index.html';
  }

  // Set active class on language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const lang = btn.getAttribute('data-lang');
    if (lang === currentLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/* Interactive Currency Toggle (DZD / EUR) for Training Packages & OT Programs */
function initCurrencyToggle() {
  const btns = document.querySelectorAll('.currency-btn');
  const dzdElements = document.querySelectorAll('.price-dzd');
  const eurElements = document.querySelectorAll('.price-eur');

  if (btns.length === 0) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currency = btn.getAttribute('data-currency');
      btns.forEach(b => {
        if (b.getAttribute('data-currency') === currency) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });

      if (currency === 'eur') {
        dzdElements.forEach(el => el.style.display = 'none');
        eurElements.forEach(el => el.style.display = 'inline');
      } else {
        dzdElements.forEach(el => el.style.display = 'inline');
        eurElements.forEach(el => el.style.display = 'none');
      }
    });
  });
}

/* Interactive One-Click Case Study Details Toggle (Multilingual Aware) */
function initCaseStudyToggles() {
  const isFr = document.documentElement.lang === 'fr';
  const isAr = document.documentElement.lang === 'ar';
  
  const defaultExpand = isFr ? "Afficher les Détails de l'Étude ↓" : (isAr ? 'عرض تفاصيل دراسة الحالة ↓' : 'View Case Study Details ↓');
  const defaultCollapse = isFr ? 'Masquer les Détails ↑' : (isAr ? 'إخفاء التفاصيل ↑' : 'Close Technical Details ↑');

  document.querySelectorAll('.btn-case-expand').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      if (!card) return;
      const details = card.querySelector('.case-study-details');
      if (!details) return;

      const isExpanded = details.classList.contains('active');
      const expandText = btn.getAttribute('data-label-expand') || defaultExpand;
      const collapseText = btn.getAttribute('data-label-collapse') || defaultCollapse;

      if (isExpanded) {
        details.classList.remove('active');
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = expandText;
      } else {
        details.classList.add('active');
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        btn.innerHTML = collapseText;
      }
    });
  });
}

/* ==========================================================================
   Responsive 2-Line Grid Clamping & Expand/Collapse Controller
   ========================================================================== */
function createTwoLineGridController({
  gridSelector,
  wrapId,
  btnId,
  labelPlural,
  onUpdate
}) {
  const grid = document.querySelector(gridSelector);
  const wrap = document.getElementById(wrapId);
  const btn = document.getElementById(btnId);

  if (!grid || !wrap || !btn) return null;

  let isExpanded = false;

  function getTwoLineLimit() {
    const computed = window.getComputedStyle(grid);
    const cols = computed.getPropertyValue('grid-template-columns');
    let colCount = 3;
    if (cols) {
      const parts = cols.trim().split(/\s+/).filter(Boolean);
      if (parts.length > 0) colCount = parts.length;
    } else {
      if (window.innerWidth <= 680) colCount = 1;
      else if (window.innerWidth <= 1024) colCount = 2;
    }
    return Math.max(1, colCount * 2); // exactly 2 lines
  }

  function applyLimit(matchingItems, isFilteringOrSearching) {
    const limit = getTwoLineLimit();
    const total = matchingItems.length;

    // If searching or filtering, reveal all matching results without clamping
    if (isFilteringOrSearching) {
      matchingItems.forEach(item => item.classList.remove('hidden-by-limit'));
      wrap.style.display = 'none';
      return;
    }

    if (isExpanded) {
      matchingItems.forEach(item => item.classList.remove('hidden-by-limit'));
      wrap.style.display = total > limit ? 'block' : 'none';
      btn.classList.add('expanded');
      btn.setAttribute('aria-expanded', 'true');
      btn.innerHTML = `<span class="expand-btn-text">Show Less</span> <span class="expand-arrow">↑</span>`;
    } else {
      matchingItems.forEach((item, idx) => {
        if (idx < limit) {
          item.classList.remove('hidden-by-limit');
        } else {
          item.classList.add('hidden-by-limit');
        }
      });

      const hiddenCount = total - limit;
      if (hiddenCount > 0) {
        wrap.style.display = 'block';
        btn.classList.remove('expanded');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = `<span class="expand-btn-text">View All ${labelPlural} (${hiddenCount} more)</span> <span class="expand-arrow">↓</span>`;
      } else {
        wrap.style.display = 'none';
      }
    }
  }

  btn.addEventListener('click', () => {
    isExpanded = !isExpanded;
    if (typeof onUpdate === 'function') {
      onUpdate();
    }
    if (!isExpanded) {
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  return {
    applyLimit,
    isExpanded: () => isExpanded,
    reset: () => { isExpanded = false; }
  };
}

/* Live Instant Search & 2-Line Cap for Technical Articles */
function initArticleSection() {
  const searchInput = document.getElementById('article-search-input');
  const clearBtn = document.getElementById('clear-article-search');
  const articleCards = document.querySelectorAll('.article-card');
  const noResultsMsg = document.getElementById('article-no-results');
  const resetBtn = document.getElementById('article-reset-search-btn');

  if (!articleCards.length) return;

  const articleController = createTwoLineGridController({
    gridSelector: '#articles-grid',
    wrapId: 'article-expand-wrap',
    btnId: 'article-expand-btn',
    labelPlural: 'Articles',
    onUpdate: () => filterArticles()
  });

  function filterArticles() {
    const term = searchInput ? searchInput.value.trim().toLowerCase() : '';
    let visibleCount = 0;
    const matchingArticles = [];

    articleCards.forEach(card => {
      const text = (card.innerText || card.textContent || '').toLowerCase();
      if (!term || text.includes(term)) {
        card.classList.remove('filter-mismatch');
        matchingArticles.push(card);
        visibleCount++;
      } else {
        card.classList.add('filter-mismatch');
        card.classList.remove('hidden-by-limit');
      }
    });

    if (clearBtn) {
      clearBtn.style.display = term ? 'block' : 'none';
    }

    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    const isSearching = term.length > 0;
    if (articleController) {
      articleController.applyLimit(matchingArticles, isSearching);
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterArticles);
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.style.display = 'none';
      if (articleController) articleController.reset();
      searchInput.focus();
      filterArticles();
    });
  }

  if (resetBtn && searchInput) {
    resetBtn.addEventListener('click', () => {
      searchInput.value = '';
      if (clearBtn) clearBtn.style.display = 'none';
      if (articleController) articleController.reset();
      filterArticles();
    });
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(filterArticles, 150);
  });

  filterArticles();
}

/* Interactive Search & Service Category Topics Filter for Community Presentations */
function initPresentationFilters() {
  const searchInput = document.getElementById('presentation-search-input');
  const clearBtn = document.getElementById('clear-presentation-search');
  const filterBtns = document.querySelectorAll('.pres-filter-btn');
  const cards = document.querySelectorAll('.presentation-card');
  const countSpan = document.getElementById('pres-count-num');
  const noResultsMsg = document.getElementById('pres-no-results');
  const resetBtn = document.getElementById('pres-reset-filters-btn');

  if (!cards.length) return;

  let activeCategory = 'all';
  let searchTerm = '';

  const presController = createTwoLineGridController({
    gridSelector: '#presentations-grid',
    wrapId: 'pres-expand-wrap',
    btnId: 'pres-expand-btn',
    labelPlural: 'Conferences',
    onUpdate: () => applyFilters()
  });

  function applyFilters() {
    let visibleCount = 0;
    const matchingCards = [];

    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-pres-category') || '';
      const cardText = (card.innerText || card.textContent || '').toLowerCase();

      const matchesCategory = (activeCategory === 'all') || (cardCategory === activeCategory);
      const matchesSearch = !searchTerm || cardText.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        card.classList.remove('filter-mismatch');
        matchingCards.push(card);
        visibleCount++;
      } else {
        card.classList.add('filter-mismatch');
        card.classList.remove('hidden-by-limit');
      }
    });

    if (countSpan) countSpan.textContent = visibleCount;
    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    const isFilteringOrSearching = (activeCategory !== 'all') || (searchTerm.length > 0);
    if (presController) {
      presController.applyLimit(matchingCards, isFilteringOrSearching);
    }
  }

  // Topic Filter Pills
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-pres-filter') || 'all';
      applyFilters();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      if (clearBtn) {
        clearBtn.style.display = searchTerm ? 'block' : 'none';
      }
      applyFilters();
    });
  }

  // Clear Search Button
  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchTerm = '';
      clearBtn.style.display = 'none';
      searchInput.focus();
      applyFilters();
    });
  }

  // Reset Filters Button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (clearBtn) clearBtn.style.display = 'none';
      searchTerm = '';
      activeCategory = 'all';
      if (presController) presController.reset();
      filterBtns.forEach(b => {
        if (b.getAttribute('data-pres-filter') === 'all') {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      applyFilters();
    });
  }

  // Window resize debounced update
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyFilters, 150);
  });

  applyFilters();
}

/* YouTube Video Facade: Play on Click */
function initYouTubeFacades() {
  document.querySelectorAll('.video-wrapper[data-video-id]').forEach(wrapper => {
    wrapper.addEventListener('click', function() {
      if (this.querySelector('iframe')) return; // already loaded
      const videoId = this.getAttribute('data-video-id');
      const title = this.getAttribute('data-video-title') || 'YouTube Video';
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
      iframe.setAttribute('title', title);
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', 'true');
      this.innerHTML = '';
      this.appendChild(iframe);
    });
  });
}

/* Live Instant Search & 2-Line Cap for Video Keynotes */
function initVideoSearch() {
  const searchInput = document.getElementById('video-search-input');
  const clearBtn = document.getElementById('clear-video-search');
  const videoCards = document.querySelectorAll('.video-card');
  const noResultsMsg = document.getElementById('video-no-results');
  const resetBtn = document.getElementById('video-reset-search-btn');

  if (!videoCards.length) return;

  const videoController = createTwoLineGridController({
    gridSelector: '#videos-grid',
    wrapId: 'video-expand-wrap',
    btnId: 'video-expand-btn',
    labelPlural: 'Recorded Lectures',
    onUpdate: () => filterVideos()
  });

  function filterVideos() {
    const term = searchInput ? searchInput.value.trim().toLowerCase() : '';
    let visibleCount = 0;
    const matchingVideos = [];

    videoCards.forEach(card => {
      const text = (card.innerText || card.textContent || '').toLowerCase();
      if (!term || text.includes(term)) {
        card.classList.remove('filter-mismatch');
        matchingVideos.push(card);
        visibleCount++;
      } else {
        card.classList.add('filter-mismatch');
        card.classList.remove('hidden-by-limit');
      }
    });

    if (clearBtn) {
      clearBtn.style.display = term ? 'block' : 'none';
    }

    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    const isSearching = term.length > 0;
    if (videoController) {
      videoController.applyLimit(matchingVideos, isSearching);
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterVideos);
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.style.display = 'none';
      if (videoController) videoController.reset();
      searchInput.focus();
      filterVideos();
    });
  }

  if (resetBtn && searchInput) {
    resetBtn.addEventListener('click', () => {
      searchInput.value = '';
      if (clearBtn) clearBtn.style.display = 'none';
      if (videoController) videoController.reset();
      filterVideos();
    });
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(filterVideos, 150);
  });

  filterVideos();
}

/* 2-Line Cap for About Page Certifications */
function initAboutCertifications() {
  const grid = document.getElementById('credentials-grid');
  const wrap = document.getElementById('cert-expand-wrap');
  const btn = document.getElementById('cert-expand-btn');

  if (!grid || !wrap || !btn) return;

  const certBoxes = grid.querySelectorAll('.credential-box');
  if (!certBoxes.length) return;

  const certController = createTwoLineGridController({
    gridSelector: '#credentials-grid',
    wrapId: 'cert-expand-wrap',
    btnId: 'cert-expand-btn',
    labelPlural: 'Certifications',
    onUpdate: () => updateCerts()
  });

  function updateCerts() {
    if (certController) {
      certController.applyLimit(Array.from(certBoxes), false);
    }
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateCerts, 150);
  });

  updateCerts();
}

/* 2-Line Cap for About Page References */
function initAboutReferences() {
  const grid = document.getElementById('references-grid');
  const wrap = document.getElementById('ref-expand-wrap');
  const btn = document.getElementById('ref-expand-btn');

  if (!grid || !wrap || !btn) return;

  const refCards = grid.querySelectorAll('.testimonial-card');
  if (!refCards.length) return;

  const refController = createTwoLineGridController({
    gridSelector: '#references-grid',
    wrapId: 'ref-expand-wrap',
    btnId: 'ref-expand-btn',
    labelPlural: 'References',
    onUpdate: () => updateRefs()
  });

  function updateRefs() {
    if (refController) {
      refController.applyLimit(Array.from(refCards), false);
    }
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateRefs, 150);
  });

  updateRefs();
}

/* Auto-expand details and smooth scroll for service jump links */
function initServicesJump() {
  const jumpLinks = document.querySelectorAll('a[href^="#ot-security"], a[href^="#grc-compliance"], a[href^="#technical"], a[href^="#strategy-vciso"]');
  jumpLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href').replace('#', '');
      const targetEl = document.getElementById(hash);
      if (targetEl) {
        if (targetEl.tagName.toLowerCase() === 'details') {
          targetEl.open = true;
        }
        setTimeout(() => {
          const yOffset = -90;
          const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }, 50);
      }
    });
  });
}

