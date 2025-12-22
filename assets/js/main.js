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
  // MASTHEAD SCROLL ANIMATION - Hero slides up to cover masthead
  // =================================================================

  const masthead = document.querySelector('.masthead');
  const topNav = document.querySelector('.top-nav');
  const mainContent = document.querySelector('.main-content');
  const navBranding = document.querySelector('.nav-issue-scrolling');

  // Article nav elements
  const articleNav = document.getElementById('article-nav');
  const articleProgressFill = document.getElementById('article-progress-fill');
  const postContent = document.querySelector('.post-content');
  const postContainer = document.querySelector('.post-container');

  if (masthead && topNav && mainContent) {
    // Only apply on homepage
    const isHomepage = window.location.pathname === '/' ||
                       window.location.pathname === '/azt/' ||
                       window.location.pathname.endsWith('/azt/');

    // Check if this is an article page (has post content)
    const isArticlePage = !!postContent;

    if (!isHomepage) {
      // Hide masthead on all inner pages
      masthead.style.display = 'none';
      mainContent.classList.add('has-shadow');

      if (isArticlePage && articleNav) {
        // Article pages: start with default nav (scrolled), switch to article nav on scroll
        let articleNavShown = false;
        let navSwitchCooldown = false;
        const NAV_SWITCH_DELAY = 800; // ms delay between switches

        topNav.classList.add('scrolled');
        topNav.classList.add('article-mode');
        body.classList.add('article-page');

        // Setup share button and progress bar
        setupShareButton();
        setupProgressBar();

        function showArticleNav() {
          if (articleNavShown || navSwitchCooldown) return;
          articleNavShown = true;
          navSwitchCooldown = true;

          // Slide default nav up, slide article nav down
          topNav.classList.add('slide-up');
          articleNav.classList.add('visible');

          setTimeout(() => { navSwitchCooldown = false; }, NAV_SWITCH_DELAY);
        }

        function hideArticleNav() {
          if (!articleNavShown || navSwitchCooldown) return;
          articleNavShown = false;
          navSwitchCooldown = true;

          // Slide article nav up, slide default nav back down
          articleNav.classList.remove('visible');
          topNav.classList.remove('slide-up');

          setTimeout(() => { navSwitchCooldown = false; }, NAV_SWITCH_DELAY);
        }

        function handleArticleWheel(e) {
          // Scroll down: show article nav
          if (e.deltaY > 0 && !articleNavShown) {
            showArticleNav();
          }
          // Scroll up anywhere: show default nav
          if (e.deltaY < 0 && articleNavShown) {
            hideArticleNav();
          }
        }

        window.addEventListener('wheel', handleArticleWheel, { passive: true });
      } else {
        // Other inner pages: show scrolled nav with branding
        topNav.classList.add('scrolled');
        if (navBranding) {
          navBranding.style.opacity = '1';
        }
      }
    }

    if (isHomepage) {
      let isCollapsed = false;
      let isAnimating = false;
      const mastheadHeight = masthead.offsetHeight;

      // Branding reveal progress (0 = hidden, 1 = fully visible)
      let brandingProgress = 0;
      const BRANDING_STEP = 0.5; // Each scroll moves 50%

      function updateBrandingPosition() {
        if (!navBranding) return;
        // translateY goes from 100% (hidden below) to -50% (centered)
        // So total distance is 150% and we interpolate based on progress
        const translateY = 100 - (brandingProgress * 150);
        navBranding.style.transform = `translateX(-50%) translateY(${translateY}%)`;
        navBranding.style.opacity = brandingProgress;
      }

      function handleWheel(e) {
        if (isAnimating) {
          e.preventDefault();
          return;
        }

        // Scroll DOWN: hero slides up to cover masthead
        if (e.deltaY > 0 && !isCollapsed) {
          e.preventDefault();
          isAnimating = true;
          isCollapsed = true;

          // Delay nav transition until hero has mostly covered masthead
          setTimeout(() => {
            topNav.classList.add('scrolled');
            mainContent.classList.add('has-shadow');
          }, 300);

          if (typeof gsap !== 'undefined') {
            gsap.to(mainContent, {
              marginTop: -mastheadHeight,
              duration: 0.5,
              ease: 'power2.out',
              onComplete: () => { isAnimating = false; }
            });
          } else {
            mainContent.style.transition = 'margin-top 0.5s ease';
            mainContent.style.marginTop = -mastheadHeight + 'px';
            setTimeout(() => { isAnimating = false; }, 500);
          }
          return;
        }

        // Scroll UP: hero slides back down to reveal masthead
        if (e.deltaY < 0 && isCollapsed && window.scrollY === 0) {
          e.preventDefault();
          isAnimating = true;
          isCollapsed = false;

          // Reset branding progress
          brandingProgress = 0;
          updateBrandingPosition();

          topNav.classList.remove('scrolled');
          mainContent.classList.remove('has-shadow');

          if (typeof gsap !== 'undefined') {
            gsap.to(mainContent, {
              marginTop: 0,
              duration: 0.5,
              ease: 'power2.out',
              onComplete: () => { isAnimating = false; }
            });
          } else {
            mainContent.style.transition = 'margin-top 0.5s ease';
            mainContent.style.marginTop = '0';
            setTimeout(() => { isAnimating = false; }, 500);
          }
          return;
        }
      }

      // Handle gradual branding reveal after collapse
      function handleBrandingScroll(e) {
        if (!isCollapsed || !navBranding) return;

        // Scroll down: reveal more
        if (e.deltaY > 0 && brandingProgress < 1) {
          brandingProgress = Math.min(1, brandingProgress + BRANDING_STEP);
          updateBrandingPosition();
        }
        // Scroll up: hide more (but only if at top)
        if (e.deltaY < 0 && brandingProgress > 0 && window.scrollY === 0) {
          brandingProgress = Math.max(0, brandingProgress - BRANDING_STEP);
          updateBrandingPosition();
        }
      }

      window.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('wheel', handleBrandingScroll, { passive: true });

      // Hero text padding that fades on scroll
      const heroText = document.querySelector('.hero-text');
      if (heroText) {
        const MAX_EXTRA_PADDING = 80; // pixels
        const SCROLL_DISTANCE = 300; // pixels to fully reduce padding

        function updateHeroPadding() {
          const scrollY = window.scrollY;
          const progress = Math.min(1, scrollY / SCROLL_DISTANCE);
          const extraPadding = MAX_EXTRA_PADDING * (1 - progress);
          heroText.style.setProperty('--hero-extra-padding', extraPadding + 'px');
        }

        window.addEventListener('scroll', updateHeroPadding, { passive: true });
        updateHeroPadding(); // Initial call
      }
    }
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

})();
