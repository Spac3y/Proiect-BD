const API = '';
let allProducts = []; 

// Keep track of what is currently selected
let currentFilters = {
    category: 'All',
    color: 'All'
};

// ── SHOP PAGE ────────────────────────────────────────────────────────────────
async function loadProducts() {
  const spinner = document.getElementById('spinner');
  const grid    = document.getElementById('grid');
  if (!grid) return;

  spinner.className = 'spinner show';
  spinner.textContent = 'Loading...';

  try {
    const res  = await fetch(`${API}/api/produse`);
    allProducts = await res.json(); 
    spinner.className = 'spinner';

    displayProducts(allProducts); 

  } catch (e) {
    spinner.className = 'spinner';
    grid.innerHTML = '<p style="color:#c0392b;padding:2rem">Cannot connect to server. Make sure Flask is running.</p>';
  }
}

// Draw the grid based on a provided list
function displayProducts(products) {
    const grid = document.getElementById('grid');
    if (!grid) return;
    grid.innerHTML = ''; 

    if (products.length === 0) {
        grid.innerHTML = '<p style="color:#888;padding:2rem;text-align:center;width:100%">No products match these filters.</p>';
        return;
    }

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => openModal(p.id_produs);
        card.innerHTML = `
            <img src="${p.imagine_url}" alt="${p.nume}" crossorigin="anonymous" onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'">
            <div class="card-body">
                <div class="card-cat">${p.nume_categorie || 'General'} | ${p.culoare || 'N/A'}</div>
                <div class="card-name">${p.nume}</div>
                <div class="card-price">${parseFloat(p.pret).toFixed(2)} RON</div>
                <div style="font-size: 0.8rem; color: ${p.stoc > 0 ? '#888' : '#c0392b'};">
                    ${p.stoc > 0 ? p.stoc + ' in stock' : 'Sold out'}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ── FILTER LOGIC ────────────────────────────────────────────────────────────

function filterCategory(category, btn) {
    // UI Update
    document.querySelectorAll('.filter-btn').forEach(b => b.style.fontWeight = 'normal');
    if (btn) btn.style.fontWeight = 'bold';

    currentFilters.category = category;
    applyAllFilters();
}

function filterByColor(color, btn) {
    // UI Update
    document.querySelectorAll('.color-btn').forEach(b => b.style.fontWeight = 'normal');
    if (btn) btn.style.fontWeight = 'bold';

    currentFilters.color = color;
    applyAllFilters();
}

function applyAllFilters() {
    let filtered = allProducts;

    // Filter by Category
    if (currentFilters.category !== 'All') {
        filtered = filtered.filter(p => p.nume_categorie === currentFilters.category);
    }

    // Filter by Color
    if (currentFilters.color !== 'All') {
        filtered = filtered.filter(p => p.culoare === currentFilters.color);
    }

    displayProducts(filtered);
}

// ── MODAL & ORDERS (Keep as is, just ensured float parsing) ──────────────────

async function openModal(id) {
  document.getElementById('overlay').style.display = 'flex';
  document.getElementById('order-form').style.display = 'block';
  document.getElementById('order-confirm').style.display = 'none';
  document.getElementById('order-msg').className = 'msg';

  const res = await fetch(`${API}/api/produs/${id}`);
  const p   = await res.json();

  document.getElementById('m-img').src          = p.imagine_url || '';
  document.getElementById('m-name').textContent = p.nume;
  document.getElementById('m-cat').textContent  = (p.nume_categorie || '') + ' | ' + (p.culoare || '');
  document.getElementById('m-pret').textContent = parseFloat(p.pret).toFixed(2) + ' RON';
  document.getElementById('m-desc').textContent = p.descriere || '';
  document.getElementById('m-marime').textContent = 'Sizes: ' + (p.marime || '');
  document.getElementById('o-cantitate').max    = p.stoc;
  document.getElementById('o-id').value         = p.id_produs;

  if (p.stoc < 1) {
    document.getElementById('order-form').innerHTML = '<p style="color:#c0392b;text-align:center;padding:1rem;">Sold out.</p>';
  }
}

function closeModal() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('o-nume').value      = '';
  document.getElementById('o-telefon').value   = '';
  document.getElementById('o-adresa').value    = '';
  document.getElementById('o-cantitate').value = '1';
}

async function placeOrder() {
  const btn = document.getElementById('o-btn');
  const msg = document.getElementById('order-msg');
  const body = {
    id_produs: parseInt(document.getElementById('o-id').value),
    nume:      document.getElementById('o-nume').value.trim(),
    telefon:   document.getElementById('o-telefon').value.trim(),
    adresa:    document.getElementById('o-adresa').value.trim(),
    cantitate: parseInt(document.getElementById('o-cantitate').value),
  };

  if (!body.nume || !body.telefon || !body.adresa) {
    msg.textContent = 'Please fill in all fields.';
    msg.className = 'msg error show';
    return;
  }

  btn.disabled = true; btn.textContent = 'Placing...';

  try {
    const res  = await fetch(`${API}/api/comanda`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();

    if (data.success) {
      document.getElementById('order-form').style.display    = 'none';
      document.getElementById('order-confirm').style.display = 'block';
      document.getElementById('confirm-text').textContent =
        `Order #${data.id_comanda} placed! Total: ${parseFloat(data.total).toFixed(2)} RON`;
      loadProducts(); // Refresh stock in background
    } else {
      msg.textContent = data.error || 'Something went wrong.';
      msg.className = 'msg error show';
    }
  } catch (e) {
    msg.textContent = 'Cannot connect to server.';
    msg.className = 'msg error show';
  }

  btn.disabled = false; btn.textContent = 'Place Order';
}

// ── ADMIN PAGE ───────────────────────────────────────────────────────────────
// (adminLogin, adminLogout, and loadOrders remain the same as your provided code)
async function adminLogin() {
  const username = document.getElementById('l-user').value.trim();
  const parola   = document.getElementById('l-pass').value.trim();
  const msg      = document.getElementById('login-msg');

  if (!username || !parola) {
    msg.textContent = 'Enter username and password.';
    msg.className = 'msg error show'; return;
  }

  try {
    const res  = await fetch(`${API}/api/admin/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      credentials: 'include', body: JSON.stringify({ username, parola })
    });
    const data = await res.json();

    if (data.success) {
      document.getElementById('login-section').style.display = 'none';
      document.getElementById('dash-section').style.display  = 'block';
      document.getElementById('dash-user').textContent = data.username;
      loadOrders();
      loadAdminStats();
    } else {
      msg.textContent = data.error;
      msg.className = 'msg error show';
    }
  } catch (e) {
    msg.textContent = 'Cannot connect to server.';
    msg.className = 'msg error show';
  }
}

async function adminLogout() {
  await fetch(`${API}/api/admin/logout`, { method: 'POST', credentials: 'include' });
  location.reload();
}

async function loadOrders() {
  const spinner = document.getElementById('dash-spinner');
  if (!spinner) return;
  spinner.className = 'spinner show';

  try {
    const res = await fetch(`${API}/api/admin/comenzi`, { credentials: 'include' });
    const orders = await res.json();
    spinner.className = 'spinner';

    // Actualizare statistici
    document.getElementById('s-total').textContent = orders.length;
    document.getElementById('s-pending').textContent = orders.filter(o => o.status === 'in asteptare').length;
    document.getElementById('s-revenue').textContent = orders.reduce((s, o) => s + parseFloat(o.total), 0).toFixed(2) + ' RON';

    const body = document.getElementById('orders-body');
    if (!orders.length) {
      body.innerHTML = '<tr><td colspan="11" style="text-align:center;padding:2rem">No orders yet.</td></tr>';
    } else {
      body.innerHTML = orders.map(o => `
        <tr>
          <td>#${o.id_comanda}</td>
          <td>${o.data_comanda}</td>
          <td>${o.client_nume}</td>
          <td>${o.telefon}</td> <td>${o.adresa}</td>  <td>${o.produs_nume}</td>
          <td>${o.cantitate}</td>
          <td>${parseFloat(o.pret_unitar).toFixed(2)}</td>
          <td><strong>${parseFloat(o.total).toFixed(2)} RON</strong></td>
          <td>
            <select onchange="updateStatus(${o.id_comanda}, this.value)" style="font-size:0.8rem;">
                <option value="in asteptare" ${o.status === 'in asteptare' ? 'selected' : ''}>În așteptare</option>
                <option value="expediat" ${o.status === 'expediat' ? 'selected' : ''}>Expediat</option>
                <option value="livrat" ${o.status === 'livrat' ? 'selected' : ''}>Livrat</option>
            </select>
          </td>
          <td>
            <button onclick="deleteOrder(${o.id_comanda})" class="btn" style="padding:4px 8px; background:#c0392b; font-size:0.7rem;">Delete</button>
          </td>
        </tr>
      `).join('');
    }
    document.getElementById('orders-table').style.display = 'table';

    const stocRes = await fetch(`${API}/api/admin/stoc-mic`, { credentials: 'include' });
    const stocMic = await stocRes.json();
    document.getElementById('stoc-mic-list').innerHTML =
      stocMic.length ? stocMic.map(p => `<li>${p.nume} — ${p.stoc} left</li>`).join('') : '<li style="color:#888">All products have sufficient stock.</li>';
  } catch (e) { console.error('Load orders failed'); }
}

// ── ADMIN ACTIONS (UPDATE & DELETE) ─────────────────────────────────────────

async function updateStatus(id, newStatus) {
    await fetch(`${API}/api/admin/comanda/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
    });
    loadOrders();
}

async function deleteOrder(id) {
    if(!confirm('Delete this order?')) return;
    await fetch(`${API}/api/admin/comanda/${id}`, { method: 'DELETE', credentials: 'include' });
    loadOrders();
}

async function loadAdminStats() {
    try {
        const res = await fetch(`${API}/api/admin/stats`, { credentials: 'include' });
        const data = await res.json();

        // 1. Actualizăm lista de produse Premium
        const premiumList = document.getElementById('premium-list');
        if (premiumList && data.premium) {
            premiumList.innerHTML = data.premium.map(p => `
                <li>${p.nume} — <strong>${parseFloat(p.pret).toFixed(2)} RON</strong></li>
            `).join('');
        }

        // 2. Opțional: Putem actualiza cifrele de sus (Total & Revenue) direct din baza de date
        if (data.agregat) {
            document.getElementById('s-total').textContent = data.agregat.total_comenzi;
            document.getElementById('s-revenue').textContent = parseFloat(data.agregat.venituri).toFixed(2) + ' RON';
        }
    } catch (e) {
        console.error('Eroare la încărcarea statisticilor premium:', e);
    }
}
