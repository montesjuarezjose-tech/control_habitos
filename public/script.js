// ==========================================
// 1. CONFIGURACIÓN DE SUPABASE
// ==========================================
const supabaseUrl = 'https://lbpgjngptaliadsbzwkw.supabase.co'; // REEMPLAZA ESTO
const supabaseKey = 'sb_publishable_Q74oalzTl4iSQReg6xEgpg_25Ff-kcu'; // REEMPLAZA ESTO
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ==========================================
// 2. REFERENCIAS A LA PANTALLA DE AUTENTICACIÓN
// ==========================================
const authScreen = document.getElementById('auth-screen');
const mainScreen = document.getElementById('main-screen');
const detailScreen = document.getElementById('detail-screen');

const btnRegistrar = document.getElementById('btn-registrar'); 
const btnIngresar = document.getElementById('btn-ingresar');   
const inputCorreo = document.getElementById('input-correo');    
const inputPassword = document.getElementById('input-password'); 

// ==========================================
// 3. LÓGICA DE INICIO DE SESIÓN Y REGISTRO
// ==========================================

// Registrar nuevo usuario
btnRegistrar.addEventListener('click', async (e) => {
    e.preventDefault();
    const emailValue = inputCorreo.value.trim();
    const passwordValue = inputPassword.value.trim();

    if(!emailValue || !passwordValue) return alert("Llena ambos campos");

    const { data, error } = await supabase.auth.signUp({
        email: emailValue,
        password: passwordValue,
    });

    if (error) {
        alert("Hubo un error al registrar: " + error.message);
    } else {
        alert("¡Registro exitoso! Ya puedes iniciar sesión.");
    }
});

// Ingresar con usuario existente
btnIngresar.addEventListener('click', async (e) => {
    e.preventDefault();
    const emailValue = inputCorreo.value.trim();
    const passwordValue = inputPassword.value.trim();

    if(!emailValue || !passwordValue) return alert("Llena ambos campos");

    const { data, error } = await supabase.auth.signInWithPassword({
        email: emailValue,
        password: passwordValue,
    });

    if (error) {
        alert("Error al ingresar: Verifica tu correo y contraseña.");
    } else {
        iniciarApp(); // Cambiamos de pantalla
    }
});

// Función para ocultar el login y mostrar la app
function iniciarApp() {
    authScreen.style.display = 'none';
    mainScreen.style.display = 'block';
    renderList(); // Cargamos la lista de hábitos
}

// Opcional: Revisar si el usuario ya había iniciado sesión antes al recargar la página
async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        iniciarApp();
    }
}
checkSession();


// ==========================================
// 4. LÓGICA DE LA APLICACIÓN (TU CÓDIGO ORIGINAL MEJORADO)
// ==========================================

// Referencias Pantalla Principal
const selectElement = document.getElementById('habit-select');
const customHabitContainer = document.getElementById('custom-habit-container');
const otherInput = document.getElementById('other-input');
const newEmojiBtn = document.getElementById('new-emoji-btn');
const newEmojiPickerBox = document.getElementById('new-emoji-picker-box');
const addBtn = document.getElementById('add-btn');
const habitList = document.getElementById('habit-list');
const backBtn = document.getElementById('back-btn');

// Referencias Pantalla Detalle
const detailTitle = document.getElementById('detail-title');
const detailDate = document.getElementById('detail-date');
const detailCount = document.getElementById('detail-count');
const detailQuote = document.getElementById('detail-quote');
const detailEmoji = document.getElementById('detail-emoji'); 
const detailHistoryList = document.getElementById('detail-history-list');
const deleteBtn = document.getElementById('delete-btn');
const detailPlusBtn = document.getElementById('detail-plus-btn');

// Referencias para la edición
const editBtn = document.getElementById('edit-btn');
const viewMode = document.getElementById('view-mode');
const editMode = document.getElementById('edit-mode');
const editName = document.getElementById('edit-name');
const saveEditBtn = document.getElementById('save-edit-btn');
const editEmojiBtn = document.getElementById('edit-emoji-btn');
const emojiPickerBox = document.getElementById('emoji-picker-box');

let currentHabitIndex = -1;
let myChart = null;

// Datos JSON (Por ahora los mantenemos en LocalStorage para no romper tu app, 
// pero enviaremos los registros a Supabase cuando presiones +1)
let habitsData = JSON.parse(localStorage.getItem('habitsJSON')) || [];

const quotes = [
    "Cada pequeño paso te acerca a tu meta. ¡Sigue así!",
    "El control está en tus manos, hoy eres más fuerte que ayer.",
    "Caer es parte del proceso, levantarse es tu decisión.",
    "Tu futuro te agradecerá el esfuerzo que haces hoy.",
    "No se trata de ser perfecto, se trata de progresar.",
    "Un día a la vez. Tú tienes el poder de cambiar."
];

const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const availableEmojis = ['🚬', '🍺', '🍔', '📱', '🛍️', '🎮', '🍬', '☕', '💊', '🔞', '🎲', '📺', '🍰', '🤬', '🔹', '🌱'];

// Llenar selectores de emojis
availableEmojis.forEach(emoji => {
    const spanEdit = document.createElement('span');
    spanEdit.textContent = emoji;
    spanEdit.className = 'emoji-option';
    spanEdit.addEventListener('click', () => { editEmojiBtn.textContent = emoji; emojiPickerBox.style.display = 'none'; });
    emojiPickerBox.appendChild(spanEdit);

    const spanAdd = document.createElement('span');
    spanAdd.textContent = emoji;
    spanAdd.className = 'emoji-option';
    spanAdd.addEventListener('click', () => { newEmojiBtn.textContent = emoji; newEmojiPickerBox.style.display = 'none'; });
    newEmojiPickerBox.appendChild(spanAdd);
});

editEmojiBtn.addEventListener('click', () => { emojiPickerBox.style.display = emojiPickerBox.style.display === 'none' ? 'grid' : 'none'; });
newEmojiBtn.addEventListener('click', () => { newEmojiPickerBox.style.display = newEmojiPickerBox.style.display === 'none' ? 'grid' : 'none'; });

selectElement.addEventListener('change', function() {
    if (this.value === 'Otro') {
        customHabitContainer.style.display = 'flex';
        otherInput.focus();
    } else {
        customHabitContainer.style.display = 'none';
        otherInput.value = '';
        newEmojiBtn.textContent = '🌱';
        newEmojiPickerBox.style.display = 'none';
    }
});

function saveData() {
    localStorage.setItem('habitsJSON', JSON.stringify(habitsData));
}

function updateSelectOptions() {
    const options = selectElement.options;
    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        if (option.value !== "" && option.value !== "Otro") {
            const exists = habitsData.some(habit => habit.name === option.value);
            option.hidden = exists;
            option.style.display = exists ? 'none' : '';
        }
    }
}

function renderChart(habit) {
    const ctx = document.getElementById('progress-chart').getContext('2d');
    const monthlyData = {};

    if (habit.history && habit.history.length > 0) {
        habit.history.forEach(dateString => {
            const datePart = dateString.split(' a las ')[0]; 
            const parts = datePart.split('/'); 
            if (parts.length === 3) {
                const monthIndex = parseInt(parts[1], 10) - 1; 
                const year = parts[2];
                const label = `${monthNames[monthIndex]} ${year}`;
                if (!monthlyData[label]) monthlyData[label] = 0;
                monthlyData[label]++;
            }
        });
    }

    const labels = Object.keys(monthlyData);
    const dataPoints = Object.values(monthlyData);

    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'line', 
        data: {
            labels: labels.length > 0 ? labels : ['Sin datos'],
            datasets: [{
                label: 'Recaídas / Registros',
                data: dataPoints.length > 0 ? dataPoints : [0],
                backgroundColor: 'rgba(39, 174, 96, 0.2)',
                borderColor: '#27ae60',
                borderWidth: 2,
                pointBackgroundColor: '#27ae60',
                pointRadius: 4,
                tension: 0.3, 
                fill: true 
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }, plugins: { legend: { display: false } } }
    });
}

function openDetail(habit, index) {
    currentHabitIndex = index; 
    mainScreen.style.display = 'none';
    detailScreen.style.display = 'block';
    viewMode.style.display = 'block';
    editMode.style.display = 'none';
    editBtn.style.display = 'block';
    emojiPickerBox.style.display = 'none';

    detailEmoji.textContent = habit.emoji ? habit.emoji : '🌱';
    detailTitle.textContent = habit.name;
    detailDate.textContent = habit.date;
    detailCount.textContent = habit.count;

    detailHistoryList.innerHTML = '';
    if (habit.history && habit.history.length > 0) {
        const reversedHistory = [...habit.history].reverse();
        reversedHistory.forEach((dateStr, i) => {
            const li = document.createElement('li');
            const numSpan = document.createElement('strong');
            numSpan.textContent = `#${habit.history.length - i}`;
            const dateSpan = document.createElement('span');
            dateSpan.textContent = dateStr;
            li.appendChild(numSpan);
            li.appendChild(dateSpan);
            detailHistoryList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = "Aún no hay registros.";
        li.style.color = "#6f7e76";
        li.style.justifyContent = "center";
        detailHistoryList.appendChild(li);
    }

    detailQuote.textContent = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
    renderChart(habit);
}

backBtn.addEventListener('click', () => {
    detailScreen.style.display = 'none';
    mainScreen.style.display = 'block';
    renderList(); 
});

editBtn.addEventListener('click', () => {
    viewMode.style.display = 'none';
    editMode.style.display = 'block';
    editBtn.style.display = 'none'; 
    const habit = habitsData[currentHabitIndex];
    editEmojiBtn.textContent = habit.emoji || '🌱';
    editName.value = habit.name;
    emojiPickerBox.style.display = 'none'; 
});

saveEditBtn.addEventListener('click', () => {
    const newName = editName.value.trim();
    const newEmoji = editEmojiBtn.textContent.trim(); 
    if (!newName) return alert('El nombre no puede estar vacío.');

    const isDuplicate = habitsData.some((habit, index) => index !== currentHabitIndex && habit.name.toLowerCase() === newName.toLowerCase());
    if (isDuplicate) return alert('Esta adicción ya está registrada en tu lista.');

    habitsData[currentHabitIndex].name = newName;
    habitsData[currentHabitIndex].emoji = newEmoji;
    
    saveData();
    renderList(); 

    detailEmoji.textContent = newEmoji;
    detailTitle.textContent = newName;
    
    editMode.style.display = 'none';
    viewMode.style.display = 'block';
    editBtn.style.display = 'block';
});

deleteBtn.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que deseas eliminar este registro por completo?')) {
        habitsData.splice(currentHabitIndex, 1);
        saveData();
        detailScreen.style.display = 'none';
        mainScreen.style.display = 'block';
        renderList();
    }
});

// Función centralizada para sumar recaídas (Guarda localmente y envía a Supabase)
async function sumarRecaida(index, eventContenedor) {
    if (index === -1) return;
    
    // Animación visual del +1
    const rect = eventContenedor.getBoundingClientRect();
    const floatingPlus = document.createElement('span');
    floatingPlus.textContent = '+1';
    floatingPlus.className = 'floating-plus';
    floatingPlus.style.left = `${rect.left + window.scrollX + (rect.width / 2) - 10}px`;
    floatingPlus.style.top = `${rect.top + window.scrollY - 15}px`;
    document.body.appendChild(floatingPlus);
    setTimeout(() => floatingPlus.remove(), 400);

    // Guardado local
    if (!habitsData[index].history) habitsData[index].history = [];
    const now = new Date();
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateString = `${now.toLocaleDateString('es-MX', dateOptions)} a las ${now.toLocaleTimeString('es-MX', timeOptions)}`;

    habitsData[index].history.push(dateString);
    habitsData[index].count++;
    saveData();

    // Guardado en Supabase (en la tabla 'registros' que creaste)
    const fechaActual = now.toISOString().split('T')[0]; // Formato AAAA-MM-DD
    const { error } = await supabase
        .from('registros')
        .insert([
            { 
                nombre_adiccion: habitsData[index].name, 
                cantidad_recaidas: habitsData[index].count,
                fecha: fechaActual
            }
        ]);
        
    if(error) {
        console.error("Error al guardar en la nube: ", error.message);
    }
}

detailPlusBtn.addEventListener('click', async (event) => {
    event.stopPropagation();
    await sumarRecaida(currentHabitIndex, detailCount);
    openDetail(habitsData[currentHabitIndex], currentHabitIndex);
    renderList();
});

function renderList() {
    habitList.innerHTML = ''; 
    habitsData.forEach((habit, index) => {
        const li = document.createElement('li');
        li.addEventListener('click', () => openDetail(habit, index));
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'habit-info';

        const emojiSpan = document.createElement('span');
        emojiSpan.className = 'habit-emoji';
        emojiSpan.textContent = habit.emoji ? habit.emoji : '🌱';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'habit-name';
        nameSpan.textContent = habit.name;

        infoDiv.appendChild(emojiSpan);
        infoDiv.appendChild(nameSpan);

        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'habit-controls';

        const countSpan = document.createElement('span');
        countSpan.className = 'habit-count';
        countSpan.textContent = habit.count;

        const plusBtn = document.createElement('button');
        plusBtn.className = 'plus-btn';
        plusBtn.textContent = '+1';
        
        plusBtn.addEventListener('click', async (event) => {
            event.stopPropagation(); 
            await sumarRecaida(index, countSpan);
            renderList();
        });

        controlsDiv.appendChild(countSpan);
        controlsDiv.appendChild(plusBtn);
        li.appendChild(infoDiv); 
        li.appendChild(controlsDiv);
        habitList.appendChild(li);
    });
    updateSelectOptions();
}

addBtn.addEventListener('click', () => {
    let habitName = selectElement.value;
    let habitEmoji = '';

    if (habitName === 'Otro') {
        habitName = otherInput.value.trim();
        habitEmoji = newEmojiBtn.textContent.trim(); 
    } else if (habitName) {
        habitEmoji = selectElement.options[selectElement.selectedIndex].text.split(' ')[0];
    }

    if (!habitName) return;
    if (habitsData.some(habit => habit.name.toLowerCase() === habitName.toLowerCase())) return alert('Esta adicción ya está registrada.');

    habitsData.unshift({
        name: habitName,
        emoji: habitEmoji, 
        count: 0,
        date: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }),
        history: [] 
    });

    saveData();
    renderList();

    selectElement.selectedIndex = 0; 
    customHabitContainer.style.display = 'none';
    otherInput.value = '';
    newEmojiBtn.textContent = '🌱';
});