

const donationItems = {
    hygiene: [
        { name: '🧼 Sabonete', goal: 50, current: 5 },
        { name: '🪥 Pasta de dente', goal: 50, current: 3 },
        { name: '👶 Fraldas infantis/geriátricas', goal: 50, current: 0 },
        { name: '🧍‍♀️ Absorventes', goal: 50, current: 0 },
        { name: '🧻 Papel higiênico', goal: 100, current: 0 }
    ],
    cleaning: [
        { name: '🧽 Detergente', goal: 50, current: 1 },
        { name: '🫧 Sabão em pó/barra', goal: 50, current: 1 },
        { name: '🧴 Desinfetante', goal: 50, current: 1 },
        { name: '💧 Água sanitária', goal: 50, current: 0 },
        {name: '🧽 Esponja', goal: 50, current: 2}
    ]
};

const donors = ["Guilherme Blanco", "Gustavo Antonio", "Edilson Júnior"];
const galleryPhotos = [{
    src :  "fotos/lucas.jpg", 
    caption : "Foto da Instituição",
    date : "2025-05-04T16:43:29.356Z"
}
];
const moneyDonations = {
    total: 85,
    donations: []
};


document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        showPage(targetId);
    });
});

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    document.getElementById(pageId).classList.add('active');
    document.querySelector(`[href="#${pageId}"]`).classList.add('active');
}


function initializeLists() {
    const personalList = document.getElementById('personalHygieneList');
    const cleaningList = document.getElementById('cleaningList');
    const selectElement = document.querySelector('select[name="item"]');

    donationItems.hygiene.forEach(item => {
        personalList.innerHTML += `<li>${item.name}</li>`;
        selectElement.innerHTML += `<option value="${item.name}">${item.name}</option>`;
    });

    donationItems.cleaning.forEach(item => {
        cleaningList.innerHTML += `<li>${item.name}</li>`;
        selectElement.innerHTML += `<option value="${item.name}">${item.name}</option>`;
    });
}

// Atualização das barras de progresso
// Atualiza as barras de progresso com os dados atuais
function updateProgress() {
    const container = document.querySelector('.progress-container');
    container.innerHTML = '';

    [...donationItems.hygiene, ...donationItems.cleaning].forEach(item => {
        const percentage = (item.current / item.goal) * 100;
        container.innerHTML += `
            <div class="glass-card">
                <h4>${item.name}</h4>
                <p>${item.current}/${item.goal} unidades</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    });
}



function updateMoneyProgress() {
    const moneyContainer = document.querySelector('.money-progress');
    if (!moneyContainer) return;

    const formattedTotal = moneyDonations.total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    // Lista individual de doações (opcional, você pode remover essa parte se quiser só o total)
    const donationsList = moneyDonations.donations.map(d => {
        const formattedValue = d.value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        return `<li>${d.name} — ${formattedValue}${d.message ? ` (${d.message})` : ''}</li>`;
    }).join('');

    moneyContainer.innerHTML = `
        <div class="glass-card money-card">
            <h3>💰 Total Arrecadado em Dinheiro</h3>
            <p class="money-amount">${formattedTotal}</p>
        </div>
    `;
}


// Login functionality

document.getElementById('adminLogin')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('donationRegistration').style.display = 'block';
        document.getElementById('photoUploadForm').reset();
        document.getElementById('uploadPreview').innerHTML = '';
        e.target.reset();
    } else {
        alert('Credenciais inválidas', username, password);
    }
});


// Logout functionality
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('donationRegistration').style.display = 'none';
});

// Move form to registration page and hide initially
const donationForm = document.getElementById('donationRegistration');
if (donationForm) {
    donationForm.style.display = 'none';
}



// Carrega dados das planilhas do servidor
async function loadData() {
    try {
        // ✅ 1. Busca os dados combinados do servidor
        const response = await fetch('data.json');
        const data = await response.json();

        if (data.donationItems) {
            donationItems.hygiene = data.donationItems.hygiene || [];
            donationItems.cleaning = data.donationItems.cleaning || [];
        }

        // Para 'donors':
        if (data.donors) {
            donors = data.donors; // Assume que o array 'donors' no JSON é o que você quer
        }

        // Para 'moneyDonations':
        if (data.moneyDonations) {
            moneyDonations.total = data.moneyDonations.total || 0;
            moneyDonations.donations = data.moneyDonations.donations || [];
        }
        if (data.donationItems) {
            donationItems = data.donationItems; 
        }

        // 2. Carrega a lista de doadores
        if (data.donors) {
            donors = data.donors;
        }

        // 3. Carrega o estado das doações em dinheiro
        if (data.moneyDonations) {
            moneyDonations = data.moneyDonations;
        }

        // Opcional: Carregar fotos da galeria se você quiser usar
        if (data.galleryPhotos) {

        }
        else{

        }


        // ✅ 4. Atualiza a interface
        updateProgress(); // Isso deve usar a variável global 'donationItems'
        updateDonorsWall(); // Isso deve usar a variável global 'donors'
        updateMoneyProgress(); // Isso deve usar a variável global 'moneyDonations'
        updateGallery(); // Isso deve usar a variável global 'galleryPhotos' se você a carregar

    } catch (error) {
        console.error('❌ Erro ao carregar dados do data.json:', error);
    }
}


// Mural de doadores (nomes únicos)
function updateDonorsWall() {
    const donorsWall = document.getElementById('donorsWall');
    if (!donorsWall) return;

    donorsWall.innerHTML = '';
    const uniqueDonors = [...new Set(donors)];

    uniqueDonors.forEach(donor => {
        if (donor && donor.trim()) {
            const donorCard = document.createElement('div');
            donorCard.className = 'donor-card';
            donorCard.innerHTML = `<p>❤️ ${donor}</p>`;
            donorsWall.appendChild(donorCard);
        }
    });

    if (uniqueDonors.length === 0) {
        donorsWall.innerHTML = '<div class="donor-card"><p>Seja o primeiro a doar!</p></div>';
    }
}

// Modal de agradecimento
function showThankYouModal() {
    const modal = document.getElementById('thankYouModal');
    modal.style.display = 'block';
    
    const totalProgress = calculateTotalProgress();
    modal.querySelector('.total-progress').innerHTML = `
        <h3>Meta Total Atingida: ${totalProgress}%</h3>
    `;

    setTimeout(() => {
        modal.style.display = 'none';
    }, 1);
}

function calculateTotalProgress() {
    const allItems = [...donationItems.hygiene, ...donationItems.cleaning];
    const total = allItems.reduce((acc, item) => acc + (item.current / item.goal), 0);
    return Math.round((total / allItems.length) * 100);
}

function showPreview(photo) {
    const preview = document.getElementById('uploadPreview');
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item';
    previewItem.innerHTML = `
        <img src="${photo.src}" alt="${photo.caption}">
        <div class="caption">${photo.caption}</div>
    `;
    preview.insertBefore(previewItem, preview.firstChild);
}

function updateGallery() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = galleryPhotos.map(photo => `
        <div class="gallery-item">
            <img src="${photo.src}" alt="${photo.caption}">
            <div class="caption">${photo.caption}</div>
        </div>
    `).join('');
}

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    // Load saved data first
    await loadData();
    
    // Show home page by default
    showPage('home');
    
    initializeLists();
    updateProgress();
    updateDonorsWall();
    updateMoneyProgress();
    updateGallery();
    
    document.querySelectorAll('.subpage-button').forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.target;
            
            // Hide all subpage content
            document.querySelectorAll('.subpage-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show selected content
            if (target === 'donors') {
                document.getElementById('donors-content').classList.add('active');
            } else if (target === 'photos') {
                document.getElementById('photos-content').classList.add('active');
            }
            
            // Highlight active button
            document.querySelectorAll('.subpage-button').forEach(btn => {
                btn.style.background = 'var(--glass-bg)';
            });
            button.style.background = 'rgba(255, 255, 255, 0.2)';
        });
    });

    // Show donors content by default
    document.querySelector('[data-target="donors"]').click();
});