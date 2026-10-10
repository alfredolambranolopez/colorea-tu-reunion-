/**
 * ColoreaLaReunión™ - Lógica de Tienda y Lienzo Interactivo
 * Características:
 *  1. Simulador de colorear interactivo con paleta y relleno SVG + Descarga
 *  2. Efectos de audio con Web Audio API (Teclado, Café, Pop al pintar)
 *  3. Modo Pánico / Hoja de Excel (Activado con tecla ESC)
 *  4. Carrito de compras completo (Formatos PDF / Físico, Cupones, Totales)
 *  5. Calculadora de Horas de Reuniones en tiempo real
 *  6. Modal de vista previa (Flipbook) de libros
 *  7. Simulación de pago y descarga instantánea
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. SISTEMA DE AUDIO (Web Audio API - Sin archivos externos)
  // =========================================================================
  const AudioEngine = {
    ctx: null,
    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
    },
    // Sonido "Pop" suave y satisfactorio al colorear
    playPop() {
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(840, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
      } catch (e) { /* Audio silenciado si el navegador bloquea */ }
    },
    // Sonido de clic de teclado mecánico (Camuflaje en llamadas)
    playKeyClick() {
      try {
        this.init();
        if (!this.ctx) return;
        for (let i = 0; i < 4; i++) {
          setTimeout(() => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300 + Math.random() * 200, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.04);
          }, i * 70);
        }
      } catch (e) {}
    },
    // Sonido de sorbo reflexivo de café
    playCoffeeSlurp() {
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(260, this.ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
      } catch (e) {}
    },
    // Sonido de falsa tos para mutear
    playCough() {
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
      } catch (e) {}
    }
  };

  // Sonidos de la mini barra de herramientas
  document.querySelectorAll('.btn-sound-fx').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-sound');
      if (type === 'clack') AudioEngine.playKeyClick();
      else if (type === 'cough') AudioEngine.playCough();
      else if (type === 'slurp') AudioEngine.playCoffeeSlurp();
      showToast('🔊 Sonido de camuflaje activado');
    });
  });

  // =========================================================================
  // 2. MODO PÁNICO: JEFE A LA VISTA (PANTALLA DE EXCEL FALSA)
  // =========================================================================
  const excelScreen = document.getElementById('excelPanicScreen');
  const btnTriggerPanicNav = document.getElementById('btnTriggerPanicNav');
  const btnExitPanic = document.getElementById('btnExitPanic');
  const btnOpenPanicFooter = document.getElementById('btnOpenPanicFooter');

  function togglePanicMode(forceState) {
    const isNowActive = forceState !== undefined 
      ? forceState 
      : !excelScreen.classList.contains('active');
    
    if (isNowActive) {
      excelScreen.classList.add('active');
      excelScreen.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      showToast('🚨 ¡MODO JEFE ACTIVADO! Mostrando hoja de cálculo.');
    } else {
      excelScreen.classList.remove('active');
      excelScreen.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      showToast('🎉 Jefe fuera de peligro. ¡A seguir coloreando!');
    }
  }

  if (btnTriggerPanicNav) btnTriggerPanicNav.addEventListener('click', () => togglePanicMode(true));
  if (btnExitPanic) btnExitPanic.addEventListener('click', () => togglePanicMode(false));
  if (btnOpenPanicFooter) {
    btnOpenPanicFooter.addEventListener('click', (e) => {
      e.preventDefault();
      togglePanicMode(true);
    });
  }

  // Tecla ESC para alternar inmediatamente el Modo Pánico
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Si un modal está abierto, primero cerrar el modal si no estamos en pánico
      const openModal = document.querySelector('.modal-backdrop.open');
      const cartOpen = document.getElementById('cartDrawer').classList.contains('open');

      if (excelScreen.classList.contains('active')) {
        togglePanicMode(false);
      } else if (openModal || cartOpen) {
        closeAllModals();
        closeCart();
      } else {
        togglePanicMode(true);
      }
    }
  });

  // =========================================================================
  // 3. SIMULADOR DE COLOREAR INTERACTIVO
  // =========================================================================
  let currentColor = '#FFE600';
  let currentColorName = 'Resaltador Amarillo Tóxico';
  let historyStack = []; // [{ element, prevFill }]

  const swatchesContainer = document.getElementById('swatchesContainer');
  const activeColorIndicator = document.getElementById('activeColorIndicator');
  const activeColorName = document.getElementById('activeColorName');
  const drawingSelect = document.getElementById('drawingSelect');
  const btnUndoColor = document.getElementById('btnUndoColor');
  const btnClearCanvas = document.getElementById('btnClearCanvas');
  const btnDownloadArt = document.getElementById('btnDownloadArt');

  // Selección de Color
  if (swatchesContainer) {
    swatchesContainer.querySelectorAll('.swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        swatchesContainer.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentColor = btn.getAttribute('data-color');
        currentColorName = btn.getAttribute('data-name');

        if (activeColorIndicator) activeColorIndicator.style.backgroundColor = currentColor;
        if (activeColorName) activeColorName.textContent = currentColorName;
        AudioEngine.playPop();
      });
    });
  }

  // Evento de colorear elementos con clase .colorable en el SVG
  function attachColoringListeners() {
    const activeSvg = document.querySelector('.interactive-svg.active');
    if (!activeSvg) return;

    activeSvg.querySelectorAll('.colorable').forEach(el => {
      // Evitar registrar múltiples listeners
      el.onclick = (e) => {
        e.stopPropagation();
        const prevFill = el.getAttribute('fill') || '#FFFFFF';
        if (prevFill === currentColor) return; // Ya tiene ese color

        historyStack.push({ element: el, prevFill: prevFill });
        el.setAttribute('fill', currentColor);
        AudioEngine.playPop();
      };
    });
  }
  attachColoringListeners();

  // Cambiar lámina activa
  if (drawingSelect) {
    drawingSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      document.querySelectorAll('.interactive-svg').forEach(svg => svg.classList.remove('active'));

      if (selected === 'correo') {
        document.getElementById('svgDrawingCorreo').classList.add('active');
      } else if (selected === 'gatito') {
        document.getElementById('svgDrawingGatito').classList.add('active');
      } else if (selected === 'sinergia') {
        document.getElementById('svgDrawingSinergia').classList.add('active');
      }

      historyStack = [];
      attachColoringListeners();
      showToast('🎨 Lámina cambiada con éxito');
    });
  }

  // Deshacer trazo
  if (btnUndoColor) {
    btnUndoColor.addEventListener('click', () => {
      if (historyStack.length === 0) {
        showToast('ℹ️ No hay más acciones para deshacer');
        return;
      }
      const lastAction = historyStack.pop();
      lastAction.element.setAttribute('fill', lastAction.prevFill);
      AudioEngine.playPop();
      showToast('↩️ Último color deshecho');
    });
  }

  // Limpiar lámina completa
  if (btnClearCanvas) {
    btnClearCanvas.addEventListener('click', () => {
      const activeSvg = document.querySelector('.interactive-svg.active');
      if (!activeSvg) return;
      activeSvg.querySelectorAll('.colorable').forEach(el => {
        const id = el.getAttribute('data-id');
        if (id === 'bg') el.setAttribute('fill', '#FAFAFA');
        else el.setAttribute('fill', '#FFFFFF');
      });
      historyStack = [];
      showToast('✨ Lámina restaurada a blanco');
    });
  }

  // Descargar dibujo como SVG
  if (btnDownloadArt) {
    btnDownloadArt.addEventListener('click', () => {
      const activeSvg = document.querySelector('.interactive-svg.active');
      if (!activeSvg) return;

      const serializer = new XMLSerializer();
      const svgSource = serializer.serializeToString(activeSvg);
      const blob = new Blob([svgSource], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mi-obra-anti-reuniones-${Date.now()}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('🎉 ¡Tu obra se ha descargado correctamente!');
    });
  }

  // =========================================================================
  // 4. CARRITO DE COMPRAS Y CUPONES
  // =========================================================================
  let cart = [
    {
      id: 'prod-1-pdf',
      title: 'Pudo Haber Sido un Correo (Vol. 1)',
      format: 'PDF Imprimible',
      price: 12.99,
      qty: 1,
      icon: '☕'
    }
  ];
  let discountPercentage = 0;
  const VALID_COUPONS = {
    'PUDOSERUNCORREO': 0.20,
    'REUNIONINUTIL': 0.20,
    'RECURSOSHUMANOS': 0.15,
    'SINDICATO': 0.25
  };

  const btnCartToggle = document.getElementById('btnCartToggle');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const btnCloseCart = document.getElementById('btnCloseCart');
  const cartCountBadge = document.getElementById('cartCountBadge');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartDiscountEl = document.getElementById('cartDiscount');
  const discountLineRow = document.getElementById('discountLineRow');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartItemsSubtitle = document.getElementById('cartItemsSubtitle');
  const couponInput = document.getElementById('couponInput');
  const btnApplyCoupon = document.getElementById('btnApplyCoupon');
  const couponMessage = document.getElementById('couponMessage');
  const btnCheckout = document.getElementById('btnCheckout');
  const btnCopyCoupon = document.getElementById('btnCopyCoupon');

  function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (btnCartToggle) btnCartToggle.addEventListener('click', openCart);
  if (btnCloseCart) btnCloseCart.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Copiar código del anuncio
  if (btnCopyCoupon) {
    btnCopyCoupon.addEventListener('click', () => {
      navigator.clipboard.writeText('PUDOSERUNCORREO').then(() => {
        showToast('📋 ¡Código PUDOSERUNCORREO copiado al portapapeles!');
        if (couponInput) couponInput.value = 'PUDOSERUNCORREO';
      });
    });
  }

  // Renderizar Carrito
  function renderCart() {
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    if (cartCountBadge) cartCountBadge.textContent = totalItems;
    if (cartItemsSubtitle) {
      cartItemsSubtitle.textContent = `${totalItems} ${totalItems === 1 ? 'artículo seleccionado' : 'artículos seleccionados'}`;
    }

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart-state">
          <div class="empty-icon">🛒</div>
          <h4>Tu carrito está tan vacío como la agenda de esa reunión</h4>
          <p>Elige un libro del catálogo o prueba una dosis recomendada para comenzar.</p>
          <a href="#catalogo" class="btn btn-secondary btn-sm" id="btnBrowseFromEmpty">Ver Catálogo</a>
        </div>
      `;
      const btnBrowse = document.getElementById('btnBrowseFromEmpty');
      if (btnBrowse) btnBrowse.addEventListener('click', closeCart);
      
      updateCartTotals(0);
      return;
    }

    let html = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
      const itemSubtotal = item.price * item.qty;
      subtotal += itemSubtotal;
      html += `
        <div class="cart-item-card" data-index="${index}">
          <div class="cart-item-thumb">${item.icon || '📖'}</div>
          <div class="cart-item-details">
            <div>
              <h5 class="cart-item-title">${item.title}</h5>
              <span class="tag-pill" style="font-size: 0.68rem; margin-top: 3px; display:inline-block;">${item.format}</span>
            </div>
            <div class="cart-item-actions">
              <span class="cart-item-price">$${item.price.toFixed(2)}</span>
              <div class="qty-control">
                <button class="btn-qty btn-minus" data-index="${index}">-</button>
                <span class="qty-count">${item.qty}</span>
                <button class="btn-qty btn-plus" data-index="${index}">+</button>
              </div>
              <button class="btn-remove-item" data-index="${index}" title="Eliminar">🗑️</button>
            </div>
          </div>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = html;

    // Listeners para cantidad y eliminar
    cartItemsContainer.querySelectorAll('.btn-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        cart[idx].qty += 1;
        renderCart();
      });
    });

    cartItemsContainer.querySelectorAll('.btn-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        if (cart[idx].qty > 1) {
          cart[idx].qty -= 1;
        } else {
          cart.splice(idx, 1);
        }
        renderCart();
      });
    });

    cartItemsContainer.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        const removed = cart.splice(idx, 1);
        renderCart();
        showToast(`🗑️ ${removed[0].title} eliminado del carrito`);
      });
    });

    updateCartTotals(subtotal);
  }

  function updateCartTotals(subtotal) {
    const discountAmount = subtotal * discountPercentage;
    const finalTotal = Math.max(0, subtotal - discountAmount);

    if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    
    if (discountPercentage > 0 && subtotal > 0) {
      if (discountLineRow) discountLineRow.style.display = 'flex';
      if (cartDiscountEl) cartDiscountEl.textContent = `-$${discountAmount.toFixed(2)} (${discountPercentage * 100}%)`;
    } else {
      if (discountLineRow) discountLineRow.style.display = 'none';
    }

    if (cartTotalEl) cartTotalEl.textContent = `$${finalTotal.toFixed(2)}`;
  }

  // Aplicar Cupón
  if (btnApplyCoupon) {
    btnApplyCoupon.addEventListener('click', () => {
      const code = (couponInput.value || '').trim().toUpperCase();
      if (VALID_COUPONS[code]) {
        discountPercentage = VALID_COUPONS[code];
        couponMessage.className = 'coupon-msg success';
        couponMessage.textContent = `¡Cupón ${code} aplicado! Ahorras un ${discountPercentage * 100}%.`;
        renderCart();
        showToast(`🎉 ¡Cupón aplicado! ${discountPercentage * 100}% de descuento.`);
      } else {
        discountPercentage = 0;
        couponMessage.className = 'coupon-msg error';
        couponMessage.textContent = 'Cupón no válido. Prueba con PUDOSERUNCORREO';
        renderCart();
      }
    });
  }

  // Toggles de Formato en las Tarjetas de Producto (PDF vs Físico)
  document.querySelectorAll('.product-card').forEach(card => {
    const radios = card.querySelectorAll('input[type="radio"]');
    const priceDisplay = card.querySelector('.price-current');
    const addBtn = card.querySelector('.btn-add-cart');

    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        const format = radio.value;
        const parentBox = radio.closest('.format-option');
        const priceTxt = parentBox.querySelector('.fmt-price').textContent;
        const priceNum = parseFloat(priceTxt.replace('$', ''));

        if (priceDisplay) priceDisplay.textContent = priceTxt;
        if (addBtn) addBtn.setAttribute('data-price', priceNum);
      });
    });

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const prodId = addBtn.getAttribute('data-id');
        const title = addBtn.getAttribute('data-title');
        const price = parseFloat(addBtn.getAttribute('data-price') || '12.99');
        
        let chosenFormat = 'PDF Imprimible';
        const checkedRadio = card.querySelector('input[type="radio"]:checked');
        if (checkedRadio && checkedRadio.value === 'fisico') {
          chosenFormat = 'Libro Físico (160g)';
        } else if (prodId === 'prod-pack') {
          chosenFormat = 'Pack Completo (Físico + PDF)';
        }

        const cartItemId = `${prodId}-${chosenFormat}`;
        const existing = cart.find(item => item.id === cartItemId);
        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({
            id: cartItemId,
            title: title,
            format: chosenFormat,
            price: price,
            qty: 1,
            icon: prodId === 'prod-pack' ? '🎁' : '📖'
          });
        }

        // Feedback en botón
        const originalText = addBtn.innerHTML;
        addBtn.innerHTML = `<span>¡Añadido! ✓</span>`;
        addBtn.style.background = '#2ED573';
        addBtn.style.color = '#FFF';
        setTimeout(() => {
          addBtn.innerHTML = originalText;
          addBtn.style.background = '';
          addBtn.style.color = '';
        }, 1200);

        renderCart();
        openCart();
        AudioEngine.playPop();
        showToast(`🛒 "${title}" (${chosenFormat}) añadido.`);
      });
    }
  });

  // Filtros de categoría en catálogo
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');

      productCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Render inicial del carrito
  renderCart();

  // =========================================================================
  // 5. CALCULADORA DE DESPERDICIO DE TIEMPO (ROI DE ABURRIMIENTO)
  // =========================================================================
  const rangeHours = document.getElementById('rangeHours');
  const rangeBuzzwords = document.getElementById('rangeBuzzwords');
  const valHours = document.getElementById('valHours');
  const valBuzzwords = document.getElementById('valBuzzwords');
  const calcYearHours = document.getElementById('calcYearHours');
  const calcColorPages = document.getElementById('calcColorPages');
  const diagnosisPill = document.getElementById('diagnosisPill');
  const calcRecommendation = document.getElementById('calcRecommendation');
  const btnPrescriptionAddToCart = document.getElementById('btnPrescriptionAddToCart');

  function updateCalculator() {
    const hours = parseInt(rangeHours.value, 10);
    const buzzwords = parseInt(rangeBuzzwords.value, 10);

    if (valHours) valHours.textContent = `${hours} hrs`;
    if (valBuzzwords) valBuzzwords.textContent = `${buzzwords} veces`;

    const yearHours = hours * 52;
    const colorBooks = Math.floor(yearHours / 3.5); // ~3.5 horas por libro de colorear

    if (calcYearHours) calcYearHours.textContent = yearHours.toLocaleString();
    if (calcColorPages) calcColorPages.textContent = colorBooks.toLocaleString();

    // Diagnóstico según carga
    if (hours < 6) {
      diagnosisPill.innerHTML = `🟢 Nivel de Peligro: <strong>Bajo (Aún conservas esperanza)</strong>`;
      diagnosisPill.style.borderColor = '#2ED573';
      diagnosisPill.style.color = '#2ED573';
      diagnosisPill.style.background = '#E8F8F0';
      calcRecommendation.innerHTML = `"Estás en una posición privilegiada. 1 libro cada 3 meses te protegerá de cualquier brote repentino de juntas improvisadas."`;
    } else if (hours < 18) {
      diagnosisPill.innerHTML = `⚠️ Nivel de Peligro: <strong>Sobredosis Crítica de Sinergia</strong>`;
      diagnosisPill.style.borderColor = '#FF4757';
      diagnosisPill.style.color = '#FF4757';
      diagnosisPill.style.background = '#FFE5E5';
      calcRecommendation.innerHTML = `"Tu cerebro está al 85% de fatiga por 'sincronizaciones'. Necesitas tener <em>Pudo Haber Sido un Correo</em> permanentemente camuflado en tu bloc de notas."`;
    } else {
      diagnosisPill.innerHTML = `🔥 Nivel de Peligro: <strong>Emergencia Máxima: Rehen de Calendario</strong>`;
      diagnosisPill.style.borderColor = '#5B5FDE';
      diagnosisPill.style.color = '#5B5FDE';
      diagnosisPill.style.background = '#EDEFFF';
      calcRecommendation.innerHTML = `"¡Auxilio! Pasas más tiempo fingiendo asentir en Teams que viviendo. La prescripción oficial urgente es el <strong>Mega Pack Oficina Blindada</strong> con todos los tomos."`;
    }
  }

  if (rangeHours) rangeHours.addEventListener('input', updateCalculator);
  if (rangeBuzzwords) rangeBuzzwords.addEventListener('input', updateCalculator);
  updateCalculator();

  // Prescripción al carrito
  if (btnPrescriptionAddToCart) {
    btnPrescriptionAddToCart.addEventListener('click', () => {
      cart.push({
        id: 'prescripcion-recetada',
        title: 'Prescripción Médica: Pudo Haber Sido un Correo',
        format: 'PDF Imprimible',
        price: 12.99,
        qty: 1,
        icon: '💊'
      });
      renderCart();
      openCart();
      AudioEngine.playPop();
      showToast('🩺 Prescripción anti-reuniones añadida al carrito.');
    });
  }

  // =========================================================================
  // 6. MODAL: OJEAR PÁGINAS POR DENTRO (FLIPBOOK PREVIEW)
  // =========================================================================
  const previewModal = document.getElementById('previewModal');
  const btnClosePreview = document.getElementById('btnClosePreview');
  const previewBookTitle = document.getElementById('previewBookTitle');
  const sheetIllustrationArea = document.getElementById('sheetIllustrationArea');
  const sheetCaptionText = document.getElementById('sheetCaptionText');
  const btnPrevPage = document.getElementById('btnPrevPage');
  const btnNextPage = document.getElementById('btnNextPage');
  const previewDots = document.getElementById('previewDots');
  const btnBuyFromPreview = document.getElementById('btnBuyFromPreview');

  const BOOK_PREVIEWS = {
    correo: {
      title: 'Pudo Haber Sido un Correo (Vol. 1)',
      price: 12.99,
      pages: [
        {
          caption: 'Página 5: "Mandala de la Taza Fría y el Correo sin Responder"',
          svg: `
            <svg viewBox="0 0 300 200" width="100%" height="100%">
              <circle cx="150" cy="100" r="70" fill="none" stroke="#222" stroke-width="3" stroke-dasharray="6,4"/>
              <circle cx="150" cy="100" r="45" fill="none" stroke="#222" stroke-width="2.5"/>
              <text x="150" y="95" text-anchor="middle" font-family="'Caveat', cursive" font-size="16" font-weight="bold">"Conforme a mi"</text>
              <text x="150" y="115" text-anchor="middle" font-family="'Caveat', cursive" font-size="16" font-weight="bold">"correo anterior..."</text>
            </svg>
          `
        },
        {
          caption: 'Página 12: "Laberinto de la Búsqueda del Enlace de Teams"',
          svg: `
            <svg viewBox="0 0 300 200" width="100%" height="100%">
              <rect x="50" y="30" width="200" height="140" fill="none" stroke="#222" stroke-width="3"/>
              <path d="M70 50 H 230 V 150 H 90 V 70 H 210 V 130 H 110" fill="none" stroke="#222" stroke-width="2.5"/>
              <text x="150" y="105" text-anchor="middle" font-family="'Outfit', sans-serif" font-size="13" font-weight="bold">¿DÓNDE ESTÁ EL LINK?</text>
            </svg>
          `
        },
        {
          caption: 'Página 24: "Patrón Floral de 'Saludos Cordiales' (Pasivo-Agresivo)"',
          svg: `
            <svg viewBox="0 0 300 200" width="100%" height="100%">
              <circle cx="150" cy="100" r="30" fill="none" stroke="#222" stroke-width="3"/>
              <circle cx="100" cy="100" r="20" fill="none" stroke="#222" stroke-width="2"/>
              <circle cx="200" cy="100" r="20" fill="none" stroke="#222" stroke-width="2"/>
              <circle cx="150" cy="50" r="20" fill="none" stroke="#222" stroke-width="2"/>
              <circle cx="150" cy="150" r="20" fill="none" stroke="#222" stroke-width="2"/>
              <text x="150" y="105" text-anchor="middle" font-family="'Caveat', cursive" font-size="15" font-weight="bold">Saludos.</text>
            </svg>
          `
        }
      ]
    },
    mute: {
      title: 'Mudo y con Cámara Apagada: El Manual Secreto',
      price: 11.99,
      pages: [
        {
          caption: 'Página 8: "El Sagrado Ícono del Micrófono Tachado en 3D"',
          svg: `
            <svg viewBox="0 0 300 200" width="100%" height="100%">
              <circle cx="150" cy="100" r="60" fill="none" stroke="#222" stroke-width="3"/>
              <rect x="135" y="70" width="30" height="45" rx="15" fill="none" stroke="#222" stroke-width="3"/>
              <line x1="100" y1="60" x2="200" y2="140" stroke="#FF4757" stroke-width="5" stroke-linecap="round"/>
              <text x="150" y="180" text-anchor="middle" font-family="'Caveat', cursive" font-size="15" font-weight="bold">Paz Absoluta</text>
            </svg>
          `
        },
        {
          caption: 'Página 19: "Fondo Virtual Falso de Estantería de Libros Intelectuales"',
          svg: `
            <svg viewBox="0 0 300 200" width="100%" height="100%">
              <rect x="40" y="30" width="220" height="140" fill="none" stroke="#222" stroke-width="3"/>
              <line x1="40" y1="100" x2="260" y2="100" stroke="#222" stroke-width="3"/>
              <rect x="60" y="45" width="20" height="55" fill="none" stroke="#222" stroke-width="2"/>
              <rect x="85" y="55" width="25" height="45" fill="none" stroke="#222" stroke-width="2"/>
              <rect x="115" y="40" width="18" height="60" fill="none" stroke="#222" stroke-width="2"/>
              <text x="150" y="140" text-anchor="middle" font-family="'Outfit', sans-serif" font-size="12" font-weight="bold">PAREZCO MUY CULTO</text>
            </svg>
          `
        }
      ]
    },
    bestiario: {
      title: 'Sinergias & Disrupciones: Bestiario de Oficina',
      price: 13.50,
      pages: [
        {
          caption: 'Página 11: "La Criatura que Pregunta Dudas a las 5:58 PM"',
          svg: `
            <svg viewBox="0 0 300 200" width="100%" height="100%">
              <circle cx="150" cy="90" r="45" fill="none" stroke="#222" stroke-width="3"/>
              <polygon points="120,40 135,15 145,35" fill="none" stroke="#222" stroke-width="2.5"/>
              <polygon points="180,40 165,15 155,35" fill="none" stroke="#222" stroke-width="2.5"/>
              <circle cx="135" cy="85" r="8" fill="#222"/>
              <circle cx="165" cy="85" r="8" fill="#222"/>
              <text x="150" y="160" text-anchor="middle" font-family="'Caveat', cursive" font-size="16" font-weight="bold">"¡Tengo una última dudita rápida!"</text>
            </svg>
          `
        }
      ]
    },
    pack: {
      title: 'Mega Pack Oficina Blindada (Todos los Libros)',
      price: 44.90,
      pages: [
        {
          caption: 'Contenido: 3 Tomos Físicos de Papel 160g + Stickers + PDF Instantáneo',
          svg: `
            <svg viewBox="0 0 300 200" width="100%" height="100%">
              <rect x="60" y="40" width="80" height="120" rx="6" fill="#FFF" stroke="#222" stroke-width="3"/>
              <rect x="110" y="30" width="80" height="120" rx="6" fill="#FFF" stroke="#222" stroke-width="3"/>
              <rect x="160" y="45" width="80" height="120" rx="6" fill="#FFF" stroke="#222" stroke-width="3"/>
              <text x="150" y="185" text-anchor="middle" font-family="'Outfit', sans-serif" font-size="13" font-weight="900">EL PACK SUPREMO</text>
            </svg>
          `
        }
      ]
    }
  };

  let currentPreviewBookKey = 'correo';
  let currentPreviewPageIndex = 0;

  function renderPreviewPage() {
    const bookData = BOOK_PREVIEWS[currentPreviewBookKey] || BOOK_PREVIEWS.correo;
    const pageData = bookData.pages[currentPreviewPageIndex];

    if (previewBookTitle) previewBookTitle.textContent = bookData.title;
    if (sheetIllustrationArea) sheetIllustrationArea.innerHTML = pageData.svg;
    if (sheetCaptionText) sheetCaptionText.textContent = pageData.caption;

    // Actualizar puntos de paginación
    if (previewDots) {
      let dotsHtml = '';
      bookData.pages.forEach((_, idx) => {
        dotsHtml += `<span class="dot ${idx === currentPreviewPageIndex ? 'active' : ''}"></span>`;
      });
      previewDots.innerHTML = dotsHtml;
    }
  }

  document.querySelectorAll('.btn-quick-preview').forEach(btn => {
    btn.addEventListener('click', () => {
      const bookKey = btn.getAttribute('data-book') || 'correo';
      currentPreviewBookKey = bookKey;
      currentPreviewPageIndex = 0;
      renderPreviewPage();
      previewModal.classList.add('open');
      previewModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  if (btnPrevPage) {
    btnPrevPage.addEventListener('click', () => {
      const bookData = BOOK_PREVIEWS[currentPreviewBookKey];
      if (currentPreviewPageIndex > 0) {
        currentPreviewPageIndex--;
      } else {
        currentPreviewPageIndex = bookData.pages.length - 1;
      }
      renderPreviewPage();
    });
  }

  if (btnNextPage) {
    btnNextPage.addEventListener('click', () => {
      const bookData = BOOK_PREVIEWS[currentPreviewBookKey];
      if (currentPreviewPageIndex < bookData.pages.length - 1) {
        currentPreviewPageIndex++;
      } else {
        currentPreviewPageIndex = 0;
      }
      renderPreviewPage();
    });
  }

  if (btnBuyFromPreview) {
    btnBuyFromPreview.addEventListener('click', () => {
      const bookData = BOOK_PREVIEWS[currentPreviewBookKey];
      cart.push({
        id: `preview-${currentPreviewBookKey}`,
        title: bookData.title,
        format: 'PDF Imprimible',
        price: bookData.price,
        qty: 1,
        icon: '📖'
      });
      closeAllModals();
      renderCart();
      openCart();
      showToast(`🛒 "${bookData.title}" añadido al carrito`);
    });
  }

  // =========================================================================
  // 7. CHECKOUT Y SIMULACIÓN DE COMPRA
  // =========================================================================
  const checkoutModal = document.getElementById('checkoutModal');
  const btnCloseCheckout = document.getElementById('btnCloseCheckout');
  const checkoutTotalAmount = document.getElementById('checkoutTotalAmount');
  const fakeCheckoutForm = document.getElementById('fakeCheckoutForm');
  const checkoutFormContent = document.getElementById('checkoutFormContent');
  const checkoutSuccessView = document.getElementById('checkoutSuccessView');
  const btnFinishSuccess = document.getElementById('btnFinishSuccess');
  const btnMockDownloadPdf = document.getElementById('btnMockDownloadPdf');

  if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('⚠️ Tu carrito está vacío');
        return;
      }
      closeCart();

      const subtotal = cart.reduce((acc, it) => acc + (it.price * it.qty), 0);
      const discount = subtotal * discountPercentage;
      const total = Math.max(0, subtotal - discount);

      if (checkoutTotalAmount) checkoutTotalAmount.textContent = `$${total.toFixed(2)}`;

      // Reset de vistas
      if (checkoutFormContent) checkoutFormContent.style.display = 'block';
      if (checkoutSuccessView) checkoutSuccessView.style.display = 'none';

      checkoutModal.classList.add('open');
      checkoutModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }

  if (fakeCheckoutForm) {
    fakeCheckoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simular procesamiento
      const submitBtn = fakeCheckoutForm.querySelector('.btn-pay-now');
      submitBtn.textContent = '⏳ Procesando pago seguro...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = '✨ Completar Orden y Descargar Mis Libros';
        submitBtn.disabled = false;
        if (checkoutFormContent) checkoutFormContent.style.display = 'none';
        if (checkoutSuccessView) checkoutSuccessView.style.display = 'flex';
        
        // Vaciar carrito
        cart = [];
        renderCart();
        AudioEngine.playPop();
        showToast('🎉 ¡Pago aprobado con éxito!');
      }, 1200);
    });
  }

  if (btnFinishSuccess) {
    btnFinishSuccess.addEventListener('click', () => {
      closeAllModals();
    });
  }

  if (btnMockDownloadPdf) {
    btnMockDownloadPdf.addEventListener('click', () => {
      // Simular descarga de archivo PDF
      const dummyContent = "%PDF-1.4\n% ColoreaLaReunión Oficial - Edición de Supervivencia\n1 0 obj << /Title (Pudo Haber Sido Un Correo) >> endobj\ntrailer << /Root 1 0 R >> %%EOF";
      const blob = new Blob([dummyContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "Libro_Anti_Reuniones_PudoSerUnCorreo.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('📥 Descargando archivo PDF de alta resolución...');
    });
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
  }

  if (btnClosePreview) btnClosePreview.addEventListener('click', closeAllModals);
  if (btnCloseCheckout) btnCloseCheckout.addEventListener('click', closeAllModals);

  // Cerrar al hacer clic en el backdrop de los modales
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAllModals();
    });
  });

  // Newsletter Form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterForm.innerHTML = `
        <div style="background: #2ED573; color: #FFF; padding: 1rem; border-radius: 8px; font-weight: bold; width: 100%;">
          🎉 ¡Suscrito con éxito! Te enviamos tu primera lámina anti-juntas este lunes a las 8:59 AM.
        </div>
      `;
      showToast('💌 ¡Bienvenido al club de supervivientes de reuniones!');
    });
  }

  // =========================================================================
  // 8. TOAST NOTIFICATIONS HELPER
  // =========================================================================
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

});
