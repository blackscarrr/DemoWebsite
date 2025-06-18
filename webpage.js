(() => {
  'use strict';

  // Utility: debounce function
  function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  }

  // Dummy Data
  const dummyData = {
    projects: [
      {
        id: 'p1',
        title: 'Clean Water Initiative',
        description: 'Providing safe and clean drinking water to rural communities.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/8fe579ee-920c-4d37-a7ec-58053b6dc16f.png',
        tags: ['Water', 'Health', 'Rural'],
        category: 'Community Development',
      },
      {
        id: 'p2',
        title: 'Youth Employment Program',
        description: 'Empowering youth with job skills and career opportunities.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2ca28350-83b9-4c15-a023-52b61fc90108.png',
        tags: ['Youth', 'Employment', 'Skills'],
        category: 'Community Development',
      },
      {
        id: 'p3',
        title: 'Environmental Awareness Campaign',
        description: 'Raising awareness on environmental protection and sustainability.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/dc9923c6-15a6-4899-af86-57c553f5b513.png',
        tags: ['Environment', 'Awareness', 'Sustainability'],
        category: 'Community Development',
      },
      {
        id: 'p4',
        title: 'Civic Leadership Workshops',
        description: 'Training citizens on leadership and civic responsibilities.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2b94d786-fc99-4c10-9cff-cbd6091b12a0.png',
        tags: ['Civic', 'Leadership', 'Education'],
        category: 'Civic Education',
      },
      {
        id: 'p5',
        title: 'Partner Network Growth',
        description: 'Expanding our network of reputable partner organizations.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f2b18704-71ed-4cff-9827-0a7aa1538b82.png',
        tags: ['Partners', 'Network', 'Collaboration'],
        category: 'Partners',
      }
    ],

    partners: [
      {
        id: 'partner1',
        name: 'Global Aid Foundation',
        description: 'Leading international NGO focused on disaster relief and community rebuilding.',
        logo: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c6cd2e6d-7d5a-4251-87a9-19bb71214f16.png',
        website: 'https://globalaid.org'
      },
      {
        id: 'partner2',
        name: 'Sustainable Future',
        description: 'Promoting sustainable development projects worldwide.',
        logo: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c2117f03-2cc0-4fbf-8ab7-fa2a729ef35d.png',
        website: 'https://sustainablefuture.org'
      },
      {
        id: 'partner3',
        name: 'Education For All',
        description: 'Championing equal access to education across communities.',
        logo: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e09693fb-562e-41cf-9f68-ac6a24570ed7.png',
        website: 'https://educationforall.net'
      }
    ]
  };

  // App State
  let state = {
    currentPage: 'home',
    darkMode: false,
    projectsFilter: '',
    formErrors: {},
  };

  // Elements
  const appMain = document.getElementById('app-main');
  const navLinks = document.querySelectorAll('nav a[data-page]');
  const sidebarLinks = document.querySelectorAll('aside nav a[data-page]');
  const navToggleBtn = document.getElementById('navToggleBtn');
  const appSidebar = document.getElementById('app-sidebar');
  const body = document.body;

  // Handle Navigation
  function setActiveNav(page) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
      if (link.dataset.page === page) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    sidebarLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
      if (link.dataset.page === page) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function closeSidebar() {
    appSidebar.classList.remove('open');
    navToggleBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleSidebar() {
    const expanded = navToggleBtn.getAttribute('aria-expanded') === 'true';
    if (expanded) closeSidebar();
    else {
      appSidebar.classList.add('open');
      navToggleBtn.setAttribute('aria-expanded', 'true');
    }
  }

  navToggleBtn.addEventListener('click', toggleSidebar);

  [...navLinks, ...sidebarLinks].forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = e.currentTarget.dataset.page;
      if (page !== state.currentPage) {
        navigateTo(page);
        if (window.innerWidth <= 1023) {
          closeSidebar();
        }
      }
    });
  });

  // Toast Notifications
  const toastContainer = document.getElementById('toast-container');
  function showToast(message, type = 'info', duration = 3500) {
    const icons = {
      info: 'info',
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
    };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('tabindex', '0');
    toast.innerHTML = `
      <span class="material-icons" aria-hidden="true">${icons[type] || 'info'}</span>
      <div class="toast-msg">${message}</div>
      <button class="toast-close" aria-label="Dismiss notification"><span class="material-icons">close</span></button>
    `;
    toastContainer.appendChild(toast);

    // Close on button
    toast.querySelector('.toast-close').addEventListener('click', () => {
      toastContainer.removeChild(toast);
    });

    // Auto-remove after duration
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, duration);

    // Focus for screen readers
    toast.focus();
  }

  // Theme toggle
  function toggleTheme() {
    state.darkMode = !state.darkMode;
    body.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
    showToast(`Switched to ${state.darkMode ? 'dark' : 'light'} theme`, 'success');
  }

  // Create theme toggle button in header
  const themeToggleBtn = document.createElement('button');
  themeToggleBtn.type = 'button';
  themeToggleBtn.className = 'icon-button';
  themeToggleBtn.setAttribute('aria-label', 'Toggle dark and light mode');
  themeToggleBtn.innerHTML = '<span class="material-icons" aria-hidden="true">dark_mode</span>';
  themeToggleBtn.addEventListener('click', toggleTheme);
  document.getElementById('app-header').appendChild(themeToggleBtn);

  // Restore theme from local storage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    state.darkMode = (savedTheme === 'dark');
    body.setAttribute('data-theme', savedTheme);
  }

  // Helper: sanitize text for safe HTML insertion
  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  // Helper: render tag pills
  function renderTags(tags) {
    return tags.map(tag => `<span class="tag-pill">${escapeHTML(tag)}</span>`).join('');
  }

  // Render Pages
  function renderHome() {
    return `
      <section aria-label="Hero section" tabindex="0" class="card" style="text-align:center;">
        <h1>Welcome to NGO Connect</h1>
        <p>Your partner in community empowerment and sustainable development.</p>
        <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ad2e9cdf-c40c-477d-9f8e-13a6e511498d.png" alt="Illustration showing diverse community members collaborating in a meeting" style="width:100%;max-width:1200px;border-radius:16px; margin-top: 24px;"/>
      </section>
      <section aria-label="About section" tabindex="0" class="card" style="max-width: 900px; margin: 40px auto;">
        <h2>About Us</h2>
        <p>NGO Connect is dedicated to fostering positive social change through grassroots community involvement, advocacy, and innovation.</p>
        <p>Our mission is to build sustainable solutions that empower individuals and organizations to create lasting impacts.</p>
      </section>
    `;
  }

  // Community Development page with filtering and multiple project panels
  function renderCommunityDevelopment() {
    // Filter input and projects grid
    const projects = dummyData.projects.filter(p => p.category === 'Community Development').filter(p => p.title.toLowerCase().includes(state.projectsFilter.toLowerCase()) || p.description.toLowerCase().includes(state.projectsFilter.toLowerCase()) || p.tags.join(' ').toLowerCase().includes(state.projectsFilter.toLowerCase()));

    // Panels by tags for demonstration, e.g. grouped by first tag
    const groups = {};
    projects.forEach(p => {
      const key = p.tags[0] || 'Others';
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });


    const panelsHTML = Object.entries(groups).map(([groupName, projects]) => {
      const projectsHtml = projects.map(p => `
        <article tabindex="0" class="project-card" aria-label="Project ${escapeHTML(p.title)}">
          <img loading="lazy" src="${p.image}" alt="Project image for ${escapeHTML(p.title)}" class="project-image" />
          <div class="project-content">
            <h3 class="project-title">${escapeHTML(p.title)}</h3>
            <p class="project-desc">${escapeHTML(p.description)}</p>
            <div class="project-tags">${renderTags(p.tags)}</div>
          </div>
        </article>
      `).join('');
      return `
        <section class="card" aria-label="Panel ${escapeHTML(groupName)}" tabindex="0">
          <h2>${escapeHTML(groupName)} Projects</h2>
          <div class="projects-grid">${projectsHtml}</div>
        </section>
      `;
    }).join('');

    return `
      <section aria-label="Community Development">
        <h1>Community Development Projects</h1>
        <input type="search" id="search-community" aria-label="Search community projects" placeholder="Search projects..." value="${escapeHTML(state.projectsFilter)}" />
        ${panelsHTML || '<p>No projects match your search.</p>'}
      </section>
    `;
  }

  // Civic Education page with info cards
  function renderCivicEducation() {
    const civicProjects = dummyData.projects.filter(p => p.category === 'Civic Education');

    const cardsHtml = civicProjects.map(p => `
      <article tabindex="0" class="card" aria-label="Civic Education Project ${escapeHTML(p.title)}">
        <h2>${escapeHTML(p.title)}</h2>
        <img loading="lazy" src="${p.image}" alt="Image for ${escapeHTML(p.title)}" style="width:100%; max-width:600px; border-radius: 12px; margin-bottom: 12px;"/>
        <p>${escapeHTML(p.description)}</p>
      </article>
    `).join('');

    return `
      <section aria-label="Civic Education">
        <h1>Civic Education Initiatives</h1>
        ${cardsHtml}
      </section>
    `;
  }

  // Partners page listing partners
  function renderPartners() {
    const partnersHtml = dummyData.partners.map(p => `
      <article tabindex="0" class="card" aria-label="Partner ${escapeHTML(p.name)}">
        <h2>${escapeHTML(p.name)}</h2>
        <img loading="lazy" src="${p.logo}" alt="Logo of partner ${escapeHTML(p.name)}" width="120" height="120" style="border-radius: 50%; margin-bottom: 12px;" />
        <p>${escapeHTML(p.description)}</p>
        <a href="${p.website}" target="_blank" rel="noopener" class="btn secondary">Visit Website</a>
      </article>
    `).join('');

    return `
      <section aria-label="Partners">
        <h1>Our Trusted Partners</h1>
        ${partnersHtml}
      </section>
    `;
  }

  // Contact and Contribute page
  function renderContact() {
    return `
      <section aria-label="Contact and Contribution" tabindex="0" class="card" style="max-width: 600px; margin: 0 auto;">
        <h1>Contact &amp; Contribute</h1>

        <form id="contact-form" novalidate aria-describedby="form-errors" aria-live="polite">
          <p id="form-errors" class="field-error" aria-live="assertive"></p>

          <label for="input-name">Name <span aria-hidden="true">*</span></label>
          <input id="input-name" name="name" type="text" autocomplete="name" required aria-required="true" />
          <div class="field-error" id="error-name"></div>

          <label for="input-email">Email <span aria-hidden="true">*</span></label>
          <input id="input-email" name="email" type="email" autocomplete="email" required aria-required="true" />
          <div class="field-error" id="error-email"></div>

          <label for="input-subject">Subject</label>
          <input id="input-subject" name="subject" type="text" autocomplete="off" />
          <div class="field-error" id="error-subject"></div>

          <label for="input-message">Message <span aria-hidden="true">*</span></label>
          <textarea id="input-message" name="message" rows="5" required aria-required="true"></textarea>
          <div class="field-error" id="error-message"></div>

          <button type="submit" class="btn" aria-live="assertive" aria-atomic="true">Send Message</button>
        </form>
      </section>
    `;
  }

  // Render current page content
  function renderPage(page) {
    switch(page) {
      case 'home': return renderHome();
      case 'community': return renderCommunityDevelopment();
      case 'civic': return renderCivicEducation();
      case 'partners': return renderPartners();
      case 'contact': return renderContact();
      default: return `<section><h1>Page not found</h1></section>`;
    }
  }

  // Render main content area with focus management
  function updateMainContent(page) {
    appMain.innerHTML = renderPage(page);
    appMain.focus();

    if (page === 'community') {
      const searchInput = document.getElementById('search-community');
      if (searchInput) {
        searchInput.addEventListener('input', debounce(e => {
          state.projectsFilter = e.target.value.trim();
          updateMainContent('community');
        }, 300));
      }
    } else if (page === 'contact') {
      const form = document.getElementById('contact-form');
      if (form) {
        form.addEventListener('submit', handleContactFormSubmit);
      }
    }
  }

  // Navigation function (update URL hash, state, UI)
  function navigateTo(page) {
    if (!page) page = 'home';
    state.currentPage = page;
    setActiveNav(page);
    updateMainContent(page);
    history.pushState({page}, '', '#' + page);
  }

  // On initial load, check hash, fallback to home
  function initialLoad() {
    const hashPage = window.location.hash.substr(1);
    if (['home', 'community', 'civic', 'partners', 'contact'].includes(hashPage)) {
      navigateTo(hashPage);
    } else {
      navigateTo('home');
    }
  }

  // Handle browser navigation (back/forward)
  window.addEventListener('popstate', (event) => {
    const page = (event.state && event.state.page) || 'home';
    navigateTo(page);
  });

  // Validate form
  function validateForm(formData) {
    const errors = {};

    // Name required, min 2 chars
    if (!formData.get('name') || formData.get('name').trim().length < 2) {
      errors.name = 'Please provide at least 2 characters for your name.';
    }
    // Email required, basic format
    const email = formData.get('email');
    if (!email) {
      errors.email = 'Email is required.';
    } else {
      // simple regex email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = 'Invalid email format.';
      }
    }
    // Message required, min 10 chars
    if (!formData.get('message') || formData.get('message').trim().length < 10) {
      errors.message = 'Message must be at least 10 characters.';
    }
    return errors;
  }

  // Handle contact form submit
  async function handleContactFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const errors = validateForm(formData);

    // Clear previous errors
    form.querySelectorAll('.field-error').forEach(e => e.textContent = '');
    const errSummary = form.querySelector('#form-errors');
    errSummary.textContent = '';

    if (Object.keys(errors).length > 0) {
      // Display errors next to fields
      for (const [field, msg] of Object.entries(errors)) {
        const errorEl = form.querySelector('#error-' + field);
        if (errorEl) errorEl.textContent = msg;
        // Mark invalid fields visually
        const inputEl = form.querySelector('[name=' + field + ']');
        if (inputEl) inputEl.classList.add('invalid');
      }
      errSummary.textContent = 'Please fix the errors below.';
      showToast('Please correct the errors in the form.', 'error');
      return;
    }

    // Remove invalid marks
    form.querySelectorAll('.invalid').forEach(e => e.classList.remove('invalid'));

    // Simulate async submission with loading state
    try {
      form.querySelector('button[type=submit]').disabled = true;
      showToast('Sending message...', 'info', 2000);

      await new Promise(resolve => setTimeout(resolve, 1800)); // simulate network

      // Success, clear form
      form.reset();
      showToast('Message sent successfully', 'success');
    } catch (e) {
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      form.querySelector('button[type=submit]').disabled = false;
    }
  }

  // Keyboard shortcut: Ctrl + Alt + T switches theme
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 't') {
      e.preventDefault();
      toggleTheme();
    }
  });

  // Accessibility: close sidebar on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && appSidebar.classList.contains('open')) {
      closeSidebar();
      navToggleBtn.focus();
    }
  });

  // Close sidebar on clicking outside on mobile
  document.body.addEventListener('click', (e) => {
    if (appSidebar.classList.contains('open') && !appSidebar.contains(e.target) && e.target !== navToggleBtn) {
      closeSidebar();
    }
  });

  // Initial app load
  initialLoad();

  // Focus content on page changes for accessibility
  window.addEventListener('hashchange', () => {
    const page = window.location.hash.slice(1);
    navigateTo(page);
  });

})();