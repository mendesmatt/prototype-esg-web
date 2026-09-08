function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

const baseScores = { E: 45, S: 60, G: 60 };
const tasks = [
    { id: 1, title: 'Política de neutralização de carbono', type: 'Ambiental', points: 15, checked: false, desc: 'Implementar diretrizes para medição e compensação de emissões.' },
    { id: 2, title: 'Eficiência energética predial', type: 'Ambiental', points: 10, checked: false, desc: 'Substituição de matriz energética na sede.' },
    { id: 3, title: 'Programa de diversidade na liderança', type: 'Social', points: 15, checked: false, desc: 'Metas claras para contratação e promoção plural.' },
    { id: 4, title: 'Saúde e bem estar dos colaboradores', type: 'Social', points: 10, checked: true, desc: 'Convênios e programas de assistência preventiva.' },
    { id: 5, title: 'Código de conduta para fornecedores', type: 'Governança', points: 20, checked: false, desc: 'Exigência de auditorias anuais da cadeia de suprimentos.' },
    { id: 6, title: 'Conselho administrativo independente', type: 'Governança', points: 15, checked: false, desc: 'Garantir pluralidade e isenção nas decisões.' }
];

function renderTasks(filter = 'Todas') {
    const container = document.getElementById('task-list');
    container.innerHTML = '';

    tasks.forEach(task => {
        if(filter !== 'Todas' && task.type !== filter) return;

        const tagColor = task.type === 'Ambiental' ? 'text-forest bg-emerald-50 border-emerald-200' :
                         task.type === 'Social' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                         'text-gold bg-amber-50 border-amber-200';

        const html = `
            <label class="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:border-emerald-200 transition-colors">
                <div class="pt-1">
                    <input type="checkbox" onchange="toggleTask(${task.id})" ${task.checked ? 'checked' : ''}>
                </div>
                <div class="flex-1">
                    <h4 class="text-sm font-bold text-navy leading-tight mb-1 ${task.checked ? 'line-through text-slate-400' : ''}">${task.title}</h4>
                    <p class="text-[10px] text-slate-500 mb-2">${task.desc}</p>
                    <span class="text-[9px] font-bold px-2 py-0.5 rounded border ${tagColor}">${task.type}</span>
                </div>
                <div class="text-[10px] font-bold text-forest whitespace-nowrap bg-emerald-50 px-2 py-1 rounded">
                    +${task.points} pts
                </div>
            </label>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
    updateScores();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if(task) {
        task.checked = !task.checked;
        const filterActive = document.querySelector('.filter-btn.active').innerText;
        renderTasks(filterActive === 'Todas as Ações' ? 'Todas' : filterActive);

        if(task.checked) {
            showToast(`Indicador ${task.type} atualizado!`);
        }
    }
}

function filterTasks(type) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        if((type === 'Todas' && btn.innerText === 'Todas as Ações') || btn.innerText === type) {
            btn.classList.add('active', 'bg-forest', 'text-white', 'border-transparent');
            btn.classList.remove('bg-white', 'text-slate-500', 'border-slate-200');
        } else {
            btn.classList.remove('active', 'bg-forest', 'text-white', 'border-transparent');
            btn.classList.add('bg-white', 'text-slate-500', 'border-slate-200');
        }
    });
    renderTasks(type);
}

function updateScores() {
    let currentE = baseScores.E;
    let currentS = baseScores.S;
    let currentG = baseScores.G;

    tasks.forEach(t => {
        if(t.checked) {
            if(t.type === 'Ambiental') currentE += t.points;
            if(t.type === 'Social') currentS += t.points;
            if(t.type === 'Governança') currentG += t.points;
        }
    });

    currentE = Math.min(currentE, 100);
    currentS = Math.min(currentS, 100);
    currentG = Math.min(currentG, 100);

    document.getElementById('score-e').innerText = currentE;
    document.getElementById('score-s').innerText = currentS;
    document.getElementById('score-g').innerText = currentG;

    const globalMedia = Math.round((currentE + currentS + currentG) / 3);
    document.getElementById('global-progress').style.width = `${globalMedia}%`;
}

function switchTab(tabId) {

    ['radar', 'jornada', 'terceiro', 'relatorios'].forEach(id => {
        document.getElementById(`tab-${id}`).classList.add('hidden');
        document.getElementById(`tab-${id}`).classList.remove('block');
    });

    document.getElementById(`tab-${tabId}`).classList.remove('hidden');
    document.getElementById(`tab-${tabId}`).classList.add('block');

    const btns = document.querySelectorAll('.nav-btn');
    btns.forEach(btn => {
        btn.classList.remove('text-forest');
        btn.classList.add('text-slate-400');
    });

    const activeBtn = Array.from(btns).find(btn => btn.getAttribute('onclick').includes(tabId));
    if(activeBtn) {
        activeBtn.classList.add('text-forest');
        activeBtn.classList.remove('text-slate-400');
    }

    document.getElementById('main-content').scrollTop = 0;
}

const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');

function openModal(title, desc) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-desc').innerText = desc;
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
    }, 10);
}

function closeModal() {
    modal.classList.add('opacity-0');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
}

function confirmModalAction() {
    closeModal();
    setTimeout(() => {
        showToast('Interesse registrado pela governança.');
    }, 300);
}

let toastTimeout;
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.remove('opacity-0');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.add('opacity-0');
    }, 3000);
}

function simulateReport() {
    showToast('Documento PDF compilado e salvo no dispositivo.');
}

renderTasks();
