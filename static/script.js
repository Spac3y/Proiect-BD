const API = '';

// ── SHOP PAGE ────────────────────────────────────────────────────────────────
async function loadProducts() {
  const spinner = document.getElementById('spinner');
  const grid    = document.getElementById('grid');
  if (!grid) return;

  spinner.className = 'spinner show';
  spinner.textContent = 'Loading...';

  try {
    const res  = await fetch(`${API}/api/produse`);
    const data = await res.json();
    spinner.className = 'spinner';

    if (!data.length) {
      grid.innerHTML = '<p style="color:#888;padding:2rem">No products found.</p>';
      return;
    }

    grid.innerHTML = data.map(p => `
      <div class="card" onclick="openModal(${p.id_produs})">
        <img src="${p.imagine_url || ''}" alt="${p.nume}" onerror="this.style.display='none'">
        <div class="card-body">
          <div class="card-cat">${p.nume_categorie || ''}</div>
          <div class="card-name">${p.nume}</div>
          <div class="card-price">${parseFloat(p.pret).toFixed(2)} RON</div>
          <div style="font-size:0.78rem;color:${p.stoc > 0 ? '#888' : '#c0392b'}">
            ${p.stoc > 0 ? p.stoc + ' in stock' : 'Sold out'}
          </div>
        </div>
      </div>
    `).join('');

  } catch (e) {
    spinner.className = 'spinner';
    grid.innerHTML = '<p style="color:#c0392b;padding:2rem">Cannot connect to server. Make sure Flask is running.</p>';
  }
}

async function openModal(id) {
  document.getElementById('overlay').style.display = 'flex';
  document.getElementById('order-form').style.display = 'block';
  document.getElementById('order-confirm').style.display = 'none';
  document.getElementById('order-msg').className = 'msg';

  const res = await fetch(`${API}/api/produs/${id}`);
  const p   = await res.json();

  document.getElementById('m-img').src          = p.imagine_url || '';
  document.getElementById('m-name').textContent = p.nume;
  document.getElementById('m-cat').textContent  = p.nume_categorie || '';
  document.getElementById('m-pret').textContent = parseFloat(p.pret).toFixed(2) + ' RON';
  document.getElementById('m-desc').textContent = p.descriere || '';
  document.getElementById('m-marime').textContent = 'Sizes: ' + (p.marime || '');
  document.getElementById('o-cantitate').max    = p.stoc;
  document.getElementById('o-id').value         = p.id_produs;

  if (p.stoc < 1) {
    document.getElementById('order-form').innerHTML = '<p style="color:#c0392b">Sold out.</p>';
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
      loadProducts();
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
  spinner.className = 'spinner show'; spinner.textContent = 'Loading...';

  try {
    const res    = await fetch(`${API}/api/admin/comenzi`, { credentials: 'include' });
    const orders = await res.json();
    spinner.className = 'spinner';

    document.getElementById('s-total').textContent   = orders.length;
    document.getElementById('s-pending').textContent = orders.filter(o => o.status === 'in asteptare').length;
    document.getElementById('s-revenue').textContent = orders.reduce((s,o) => s + parseFloat(o.total), 0).toFixed(2) + ' RON';

    if (!orders.length) {
      document.getElementById('orders-body').innerHTML = '<tr><td colspan="8" style="text-align:center;color:#888;padding:2rem">No orders yet.</td></tr>';
    } else {
      document.getElementById('orders-body').innerHTML = orders.map(o => `
        <tr>
          <td>#${o.id_comanda}</td>
          <td>${o.data_comanda}</td>
          <td>${o.client_nume}</td>
          <td>${o.telefon}</td>
          <td>${o.produs_nume}</td>
          <td>${o.cantitate}</td>
          <td>${parseFloat(o.pret_unitar).toFixed(2)}</td>
          <td><strong>${parseFloat(o.total).toFixed(2)} RON</strong></td>
        </tr>
      `).join('');
    }
    document.getElementById('orders-table').style.display = 'table';

  } catch (e) {
    spinner.textContent = 'Failed to load orders.';
  }
}
