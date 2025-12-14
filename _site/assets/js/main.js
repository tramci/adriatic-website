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
  // SEARCH FUNCTIONALITY - Basic search with Enter key
  // =================================================================
  
  const searchInput = document.getElementById('search-input');
  
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      // Trigger search on Enter key
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        
        if (query) {
          // Get base URL from meta tag or default to empty string
          const baseUrl = document.querySelector('meta[name="base-url"]')?.content || '';
          
          // Navigate to search page with query parameter
          window.location.href = `${baseUrl}/search?q=${encodeURIComponent(query)}`;
        }
      }
    });
  }

})();
