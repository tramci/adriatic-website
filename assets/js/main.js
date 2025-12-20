/**
 * The Adriatic - Main JavaScript
 * Handles theme toggling, side panel menu, and search functionality
 */

(function() {
  'use strict';
  
  // =================================================================
  // THEME TOGGLE - Segmented control for theme switching
  // =================================================================
  
  const themeToggleSegmented = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Get saved theme or default to 'dark'
  const currentTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', currentTheme);
  
  // Initialize theme toggle if it exists
  if (themeToggleSegmented) {
    // Set initial active state for all theme options
    themeToggleSegmented.querySelectorAll('.theme-option').forEach(option => {
      option.classList.toggle('active', option.dataset.theme === currentTheme);
    });
    
    // Handle theme option clicks
    themeToggleSegmented.addEventListener('click', function(e) {
      const clickedOption = e.target.closest('.theme-option');
      
      if (clickedOption) {
        const newTheme = clickedOption.dataset.theme;
        
        // Update active states
        themeToggleSegmented.querySelectorAll('.theme-option').forEach(option => {
          option.classList.remove('active');
        });
        clickedOption.classList.add('active');
        
        // Apply theme
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      }
    });
  }

  // =================================================================
  // SIDE PANEL MENU - Mobile/responsive navigation
  // =================================================================
  
  const menuToggle = document.getElementById('menu-toggle');
  const sidePanel = document.getElementById('side-panel');
  const overlay = document.getElementById('overlay');
  const backArrow = document.getElementById('back-arrow');
  const body = document.body;

  /**
   * Opens the side panel menu
   */
  function openMenu() {
    if (!sidePanel || !overlay) return;
    
    sidePanel.classList.add('open');
    overlay.classList.add('show');
    body.classList.add('menu-open');
  }

  /**
   * Closes the side panel menu and clears search
   */
  function closeMenu() {
    if (!sidePanel || !overlay) return;
    
    sidePanel.classList.remove('open');
    overlay.classList.remove('show');
    body.classList.remove('menu-open');
    
    // Clear search input when closing
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = '';
    }
  }

  // Toggle menu on button click
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      if (sidePanel && sidePanel.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  // Close menu when clicking overlay
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close menu when clicking back arrow
  if (backArrow) {
    backArrow.addEventListener('click', closeMenu);
  }

  // Close menu on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidePanel && sidePanel.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close menu when clicking navigation links
  const panelNavLinks = document.querySelectorAll('.panel-nav a');
  panelNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // =================================================================
  // SEARCH FUNCTIONALITY - Overlay search with live results
  // =================================================================

  const searchToggle = document.getElementById('search-toggle');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = document.getElementById('search-input');
  const searchClose = document.getElementById('search-close');
  const searchResults = document.getElementById('search-results');

  let searchData = null;

  // Load search data
  async function loadSearchData() {
    if (searchData) return searchData;

    try {
      const baseUrl = document.querySelector('meta[name="base-url"]')?.content || '';
      const response = await fetch(`${baseUrl}/search.json`);
      searchData = await response.json();
      return searchData;
    } catch (error) {
      console.error('Failed to load search data:', error);
      return [];
    }
  }

  // Perform search
  function performSearch(query) {
    if (!searchData || !query.trim()) {
      searchResults.innerHTML = '';
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = searchData.filter(post => {
      return post.title.toLowerCase().includes(lowerQuery) ||
             post.excerpt.toLowerCase().includes(lowerQuery) ||
             (post.author && post.author.toLowerCase().includes(lowerQuery)) ||
             (post.category && post.category.toLowerCase().includes(lowerQuery));
    });

    if (results.length === 0) {
      searchResults.innerHTML = '<p class="search-no-results">No results found.</p>';
      return;
    }

    searchResults.innerHTML = results.map(post => `
      <div class="search-result-item">
        <a href="${post.url}">
          <div class="search-result-title">${post.title}</div>
          <div class="search-result-excerpt">${post.excerpt}</div>
        </a>
      </div>
    `).join('');
  }

  // Open search overlay
  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    loadSearchData();
    setTimeout(() => searchInput?.focus(), 100);
  }

  // Close search overlay
  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.innerHTML = '';
  }

  // Event listeners for both search buttons (masthead and sticky nav)
  if (searchToggle) {
    searchToggle.addEventListener('click', openSearch);
  }

  const stickySearchToggle = document.getElementById('sticky-search-toggle');
  if (stickySearchToggle) {
    stickySearchToggle.addEventListener('click', openSearch);
  }

  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }

  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      performSearch(e.target.value);
    });

    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeSearch();
      }
    });
  }

  // Close on overlay background click
  if (searchOverlay) {
    searchOverlay.addEventListener('click', function(e) {
      if (e.target === searchOverlay) {
        closeSearch();
      }
    });
  }

  // Close on Escape key (global)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && searchOverlay?.classList.contains('active')) {
      closeSearch();
    }
  });

})();
