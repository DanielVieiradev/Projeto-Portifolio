document.addEventListener('DOMContentLoaded', function() {
  // Elementos DOM
  const neoToggle = document.getElementById('neo-toggle');
  const neoLabel = document.querySelector('.neo-toggle');
  const dotsContainer = document.getElementById('cyber-dots');
  
  // Configurações
  const config = {
    dotCount: 30,
    animationDuration: 600,
    dragDebounce: 100
  };

  // Aplica tema e efeitos visuais
  const applyTheme = (isLightMode) => {
    try {
      document.body.classList.toggle('light-mode', isLightMode);
      localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
      
      neoToggle.checked = isLightMode;
      
      // Ativa/desativa dots cibernéticos
      if (dotsContainer) {
        dotsContainer.style.display = isLightMode ? 'none' : 'block';
      }
      
      // Efeito visual
      neoLabel.classList.add('neo-activated');
      setTimeout(() => {
        neoLabel.classList.remove('neo-activated');
      }, config.animationDuration);
      
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  };

  // Cria dots cibernéticos (apenas uma vez)
  const createCyberDots = () => {
    if (dotsContainer && !dotsContainer.hasChildNodes()) {
      const fragment = document.createDocumentFragment();
      
      for (let i = 0; i < config.dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'cyber-dot';
        dot.style.cssText = `
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          animation-delay: ${Math.random() * 3}s;
        `;
        fragment.appendChild(dot);
      }
      
      dotsContainer.appendChild(fragment);
    }
  };

  // Verifica preferências de tema
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'light';
    return window.matchMedia('(prefers-color-scheme: light)').matches;
  };

  // Debounce para redesenho
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!document.body.classList.contains('light-mode')) {
        dotsContainer.innerHTML = '';
        createCyberDots();
      }
    }, config.dragDebounce);
  });

  // Inicialização
  const init = () => {
    const isLightMode = getPreferredTheme();
    applyTheme(isLightMode);
    
    if (!isLightMode) {
      createCyberDots();
    }

    // Event listeners
    neoToggle.addEventListener('change', function() {
      applyTheme(this.checked);
      
      neoLabel.classList.add('neo-progress');
      setTimeout(() => {
        neoLabel.classList.remove('neo-progress');
      }, 1000);
    });

    // Drag effect
    let isDragging = false;
    const handleMouseUp = () => {
      if (isDragging) {
        neoLabel.classList.remove('neo-dragging');
        isDragging = false;
      }
    };

    neoLabel.addEventListener('mousedown', () => {
      isDragging = true;
      neoLabel.classList.add('neo-dragging');
    });

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseUp);

    // Sistema de preferências
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches);
      }
    });
  };

  init();
});