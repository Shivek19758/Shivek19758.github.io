/* ===================================================
   CTF CHEATSHEET // 0xh1tm4n — Scripts
   =================================================== */

// ===== COPY BUTTON =====
function copyCode(btn) {
  const pre = btn.parentElement;
  const code = pre.querySelector('code');
  const text = code.innerText;
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'DONE';
    btn.style.color = 'var(--accent)';
    setTimeout(() => { btn.textContent = 'COPY'; btn.style.color = ''; }, 1500);
  }).catch(() => {
    // Fallback for older browsers / insecure contexts
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      btn.textContent = 'DONE';
      btn.style.color = 'var(--accent)';
      setTimeout(() => { btn.textContent = 'COPY'; btn.style.color = ''; }, 1500);
    } catch (e) {
      btn.textContent = 'FAIL';
      btn.style.color = 'var(--red)';
      setTimeout(() => { btn.textContent = 'COPY'; btn.style.color = ''; }, 1500);
    }
    document.body.removeChild(textarea);
  });
}

// ===== SEARCH =====
let searchTimeout = null;

function search(query) {
  // Debounce rapid typing
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => performSearch(query), 150);
}

function performSearch(query) {
  const searchCount = document.getElementById('searchCount');

  // Reset if empty
  if (!query) {
    document.querySelectorAll('.card').forEach(c => c.style.display = '');
    document.querySelectorAll('mark').forEach(m => {
      m.outerHTML = m.innerHTML;
    });
    document.querySelectorAll('.section').forEach(s => s.style.display = '');
    if (searchCount) searchCount.textContent = '';
    return;
  }

  query = query.toLowerCase();
  let matchCount = 0;

  document.querySelectorAll('.section').forEach(section => {
    let sectionVisible = false;
    section.querySelectorAll('.card').forEach(card => {
      const text = card.innerText.toLowerCase();
      if (text.includes(query)) {
        card.style.display = '';
        sectionVisible = true;
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });
    section.style.display = sectionVisible ? '' : 'none';
  });

  // Show result count
  if (searchCount) {
    searchCount.textContent = matchCount > 0
      ? `${matchCount} card${matchCount !== 1 ? 's' : ''} found`
      : 'no results found';
  }
}

// ===== SIDEBAR ACTIVE HIGHLIGHT ON SCROLL =====
const sections = document.querySelectorAll('.section');
const sidebarLinks = document.querySelectorAll('.sidebar a');

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      sidebarLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, {
  rootMargin: '-20% 0px -60% 0px',
  threshold: 0
});

sections.forEach(section => scrollObserver.observe(section));

// ===== BACK TO TOP BUTTON =====
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K  or  /  → focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const input = document.getElementById('searchInput');
    if (input) input.focus();
  }
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
    e.preventDefault();
    const input = document.getElementById('searchInput');
    if (input) input.focus();
  }
  // Escape → clear search + blur
  if (e.key === 'Escape') {
    const input = document.getElementById('searchInput');
    if (input && document.activeElement === input) {
      input.value = '';
      search('');
      input.blur();
    }
  }
});

// ===== CARD COUNT IN SECTION HEADERS =====
(function addCardCounts() {
  document.querySelectorAll('.section').forEach(section => {
    const count = section.querySelectorAll('.card').length;
    const tag = section.querySelector('.section-tag');
    if (tag) {
      tag.textContent += ` [${count}]`;
    }
  });
})();

// ===== SMOOTH SCROLL OFFSET FOR STICKY HEADER =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70; // header height + padding
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== NAV LINK ACTIVE STATE =====
const navLinks = document.querySelectorAll('nav a');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--accent)';
          link.style.borderColor = 'var(--accent)';
        } else {
          link.style.color = '';
          link.style.borderColor = '';
        }
      });
    }
  });
}, {
  rootMargin: '-20% 0px -60% 0px',
  threshold: 0
});

sections.forEach(section => navObserver.observe(section));
