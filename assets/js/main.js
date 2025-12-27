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
  // HAMBURGER MENU - Full-screen overlay navigation
  // =================================================================

  const hamburgerToggle = document.getElementById('hamburger-toggle');
  const menuOverlay = document.getElementById('menu-overlay');
  const menuClose = document.getElementById('menu-close');
  const body = document.body;

  /**
   * Opens the hamburger menu overlay
   */
  function openHamburgerMenu() {
    if (!menuOverlay) return;

    menuOverlay.classList.add('active');
    body.classList.add('menu-open');
  }

  /**
   * Closes the hamburger menu overlay
   */
  function closeHamburgerMenu() {
    if (!menuOverlay) return;

    menuOverlay.classList.remove('active');
    body.classList.remove('menu-open');
  }

  // Open menu on hamburger click
  if (hamburgerToggle) {
    hamburgerToggle.addEventListener('click', openHamburgerMenu);
  }

  // Close menu on X click
  if (menuClose) {
    menuClose.addEventListener('click', closeHamburgerMenu);
  }

  // Close menu on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menuOverlay && menuOverlay.classList.contains('active')) {
      closeHamburgerMenu();
    }
  });

  // Close menu when clicking navigation links
  const menuLinks = document.querySelectorAll('.menu-link, .menu-featured-article');
  menuLinks.forEach(link => {
    link.addEventListener('click', closeHamburgerMenu);
  });

  // =================================================================
  // ABOVE-FOLD HEIGHT - Dynamic calculation based on masthead
  // =================================================================

  const masthead = document.querySelector('.masthead');
  const aboveFold = document.querySelector('.above-fold');

  // Only run on homepage where above-fold exists
  if (masthead && aboveFold) {
    function updateAboveFoldHeight() {
      const mastheadHeight = masthead.offsetHeight;
      aboveFold.style.minHeight = `calc(100vh - ${mastheadHeight}px)`;
    }

    // Recalculate height after SVG loads (it may affect layout)
    const siteTitleSvg = masthead.querySelector('.site-title-svg');
    if (siteTitleSvg) {
      if (siteTitleSvg.complete) {
        updateAboveFoldHeight();
      } else {
        siteTitleSvg.addEventListener('load', updateAboveFoldHeight);
      }
    }

    // Also update on resize
    window.addEventListener('resize', updateAboveFoldHeight);

    // Initial call
    updateAboveFoldHeight();
  }

  // =================================================================
  // ARTICLE PAGE SETUP
  // =================================================================

  const articleNav = document.getElementById('article-nav');
  const articleProgressFill = document.getElementById('article-progress-fill');
  const postContent = document.querySelector('.post-content');
  const postContainer = document.querySelector('.post-container');

  // Check if this is an article page (has post content)
  const isArticlePage = !!postContent;

  if (isArticlePage && articleNav) {
    body.classList.add('article-page');

    // Hide masthead on article pages
    if (masthead) {
      masthead.style.display = 'none';
    }

    // Setup share button and progress bar
    setupShareButton();
    setupProgressBar();
  }

  // =================================================================
  // ARTICLE NAV - Share button and progress bar
  // =================================================================

  function setupShareButton() {
    // Setup share links
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    const twitterLink = document.getElementById('share-twitter');
    const facebookLink = document.getElementById('share-facebook');
    const linkedinLink = document.getElementById('share-linkedin');
    const emailLink = document.getElementById('share-email');

    if (twitterLink) {
      twitterLink.href = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
      twitterLink.target = '_blank';
      twitterLink.rel = 'noopener noreferrer';
    }

    if (facebookLink) {
      facebookLink.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
      facebookLink.target = '_blank';
      facebookLink.rel = 'noopener noreferrer';
    }

    if (linkedinLink) {
      linkedinLink.href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
      linkedinLink.target = '_blank';
      linkedinLink.rel = 'noopener noreferrer';
    }

    if (emailLink) {
      emailLink.href = `mailto:?subject=${pageTitle}&body=Check out this article: ${decodeURIComponent(pageUrl)}`;
    }
  }

  function setupProgressBar() {
    if (!articleProgressFill || !postContainer) return;

    function updateProgress() {
      // Get the bounding rect relative to viewport (use full article container)
      const rect = postContainer.getBoundingClientRect();
      const articleHeight = postContainer.offsetHeight;
      const windowHeight = window.innerHeight;

      // Progress = 0 when top of article is at top of viewport
      // Progress = 100 when bottom of article reaches bottom of viewport
      // scrollDistance = how far we need to scroll through the article
      const scrollDistance = articleHeight - windowHeight;

      if (scrollDistance <= 0) {
        // Article fits in viewport, show full progress
        articleProgressFill.style.width = '100%';
        return;
      }

      // rect.top is negative when we've scrolled past the top of article
      // When rect.top = 0, we're at the start (0%)
      // When rect.top = -scrollDistance, we're at the end (100%)
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollDistance));
      articleProgressFill.style.width = (progress * 100) + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress(); // Initial call
  }

  // =================================================================
  // STICKY NAVBAR - Appears when scrolling past masthead on homepage
  // =================================================================

  const stickyNavbar = document.getElementById('sticky-navbar');
  const mastheadEl = document.querySelector('.masthead');
  const homeBottomNav = document.querySelector('.home-bottom-nav');

  if (stickyNavbar && mastheadEl) {
    // Use IntersectionObserver to detect when masthead leaves viewport
    const mastheadObserver = new IntersectionObserver(
      ([entry]) => {
        // Show navbar when masthead is NOT intersecting (scrolled past)
        if (!entry.isIntersecting) {
          stickyNavbar.classList.add('is-visible');
        } else {
          stickyNavbar.classList.remove('is-visible');
          // Also undock bottom nav when masthead is visible
          if (homeBottomNav) {
            homeBottomNav.classList.remove('is-docked');
          }
        }
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '0px'
      }
    );

    mastheadObserver.observe(mastheadEl);

    // Dock bottom nav when it reaches the sticky navbar
    if (homeBottomNav) {
      const stickyNavbarHeight = 48; // Height of sticky navbar in pixels

      const bottomNavObserver = new IntersectionObserver(
        ([entry]) => {
          // Only dock if sticky navbar is visible
          if (!stickyNavbar.classList.contains('is-visible')) return;

          // Dock when top of bottom nav reaches the bottom of sticky navbar
          if (!entry.isIntersecting) {
            homeBottomNav.classList.add('is-docked');
          } else {
            homeBottomNav.classList.remove('is-docked');
          }
        },
        {
          root: null,
          threshold: 0,
          rootMargin: `-${stickyNavbarHeight}px 0px 0px 0px`
        }
      );

      bottomNavObserver.observe(homeBottomNav);
    }
  }

})();
