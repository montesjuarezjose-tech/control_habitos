// Referencias Pantalla Principal
const selectElement = document.getElementById('habit-select');
const customHabitContainer = document.getElementById('custom-habit-container');
const otherInput = document.getElementById('other-input');
const newEmojiBtn = document.getElementById('new-emoji-btn');
const newEmojiPickerBox = document.getElementById('new-emoji-picker-box');
const addBtn = document.getElementById('add-btn');
const habitList = document.getElementById('habit-list');

// Referencias para cambio de pantallas
const mainScreen = document.getElementById('main-screen');
const detailScreen = document.getElementById('detail-screen');
const backBtn = document.getElementById('back-btn');

// Referencias Pantalla Detalle
const detailTitle = document.getElementById('detail-title');
const detailDate = document.getElementById('detail-date');
const detailCount = document.getElementById('detail-count');
const detailQuote = document.getElementById('detail-quote');
const detailEmoji = document.getElementById('detail-emoji'); 
const detailHistoryList = document.getElementById('detail-history-list');

// Referencia al botón de eliminar y de +1
const deleteBtn = document.getElementById('delete-btn');
const detailPlusBtn = document.getElementById('detail-plus-btn');

// Referencias para la edición
const editBtn = document.getElementById('edit-btn');
const viewMode = document.getElementById('view-mode');
const editMode = document.getElementById('edit-mode');
const editName = document.getElementById('edit-name');
const saveEditBtn = document.getElementById('save-edit-btn');

// Referencias para el selector de emojis (edición)
const editEmojiBtn = document.getElementById('edit-emoji-btn');
const emojiPickerBox = document.getElementById('emoji-picker-box');

// Variable para saber qué hábito estamos viendo/editando
let currentHabitIndex = -1;

// Variable global para guardar la instancia de la gráfica
let myChart = null;

// Datos JSON
let habitsData = JSON.parse(localStorage.getItem('habitsJSON')) || [];

// Frases motivacionales
const quotes = [
    "Cada pequeño paso te acerca a tu meta. ¡Sigue así!",
    "El control está en tus manos, hoy eres más fuerte que ayer.",
    "Caer es parte del proceso, levantarse es tu decisión.",
    "Tu futuro te agradecerá el esfuerzo que haces hoy.",
    "No se trata de ser perfecto, se trata de progresar.",
    "Un día a la vez. Tú tienes el poder de cambiar."
];

// Nombres de los meses para la gráfica
const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const availableEmojis = ['🚬', '🍺', '🍔', '📱', '🛍️', '🎮', '🍬', '☕', '💊', '🔞', '🎲', '📺', '🍰', '🤬', '🔹', '🌱'];

// Llenar ambos selectores de emojis (creación y edición)
availableEmojis.forEach(emoji => {
    // Para edición
    const spanEdit = document.createElement('span');
    spanEdit.textContent = emoji;
    spanEdit.className = 'emoji-option';
    spanEdit.addEventListener('click', () => {
        editEmojiBtn.textContent = emoji; 
        emojiPickerBox.style.display = 'none'; 
    });
    emojiPickerBox.appendChild(spanEdit);

    // Para creación (nuevo)
    const spanAdd = document.createElement('span');
    spanAdd.textContent = emoji;
    spanAdd.className = 'emoji-option';
    spanAdd.addEventListener('click', () => {
        newEmojiBtn.textContent = emoji; 
        newEmojiPickerBox.style.display = 'none'; 
    });
    newEmojiPickerBox.appendChild(spanAdd);
});

// Mostrar/ocultar selector de emojis en edición
editEmojiBtn.addEventListener('click', () => {
    if (emojiPickerBox.style.display === 'none') {
        emojiPickerBox.style.display = 'grid'; 
    } else {
        emojiPickerBox.style.display = 'none';
    }
});

// Mostrar/ocultar selector de emojis en creación
newEmojiBtn.addEventListener('click', () => {
    if (newEmojiPickerBox.style.display === 'none') {
        newEmojiPickerBox.style.display = 'grid'; 
    } else {
        newEmojiPickerBox.style.display = 'none';
    }
});

// Cambiar visibilidad del input personalizado
selectElement.addEventListener('change', function() {
    if (this.value === 'Otro') {
        customHabitContainer.style.display = 'flex';
        otherInput.focus();
    } else {
        customHabitContainer.style.display = 'none';
        otherInput.value = '';
        newEmojiBtn.textContent = '🌱'; // Restaurar emoji por defecto
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
            if (exists) {
                option.hidden = true;
                option.style.display = 'none';
            } else {
                option.hidden = false;
                option.style.display = '';
            }
        }
    }
}

// Función para procesar los datos y dibujar la gráfica de líneas con los nuevos colores de renacimiento
function renderChart(habit) {
    const ctx = document.getElementById('progress-chart').getContext('2d');
    
    // Objeto para contar ocurrencias por mes/año
    const monthlyData = {};

    if (habit.history && habit.history.length > 0) {
        habit.history.forEach(dateString => {
            const datePart = dateString.split(' a las ')[0]; 
            const parts = datePart.split('/'); 
            
            if (parts.length === 3) {
                const monthIndex = parseInt(parts[1], 10) - 1; 
                const year = parts[2];
                const label = `${monthNames[monthIndex]} ${year}`;

                if (!monthlyData[label]) {
                    monthlyData[label] = 0;
                }
                monthlyData[label]++;
            }
        });
    }

    const labels = Object.keys(monthlyData);
    const dataPoints = Object.values(monthlyData);

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'line', 
        data: {
            labels: labels.length > 0 ? labels : ['Sin datos'],
            datasets: [{
                label: 'Recaídas / Registros',
                data: dataPoints.length > 0 ? dataPoints : [0],
                backgroundColor: 'rgba(39, 174, 96, 0.2)', // Verde transparente para el relleno de la tierra
                borderColor: '#27ae60', // Verde renacimiento
                borderWidth: 2,
                pointBackgroundColor: '#27ae60', // Puntos verdes
                pointRadius: 4,
                tension: 0.3, 
                fill: true 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1 
                    }
                }
            },
            plugins: {
                legend: {
                    display: false 
                }
            }
        }
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

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    detailQuote.textContent = `"${randomQuote}"`;

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

    if (!newName) {
        alert('El nombre no puede estar vacío.');
        return;
    }

    const isDuplicate = habitsData.some((habit, index) => {
        return index !== currentHabitIndex && habit.name.toLowerCase() === newName.toLowerCase();
    });

    if (isDuplicate) {
        alert('Esta adicción ya está registrada en tu lista.');
        return;
    }

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
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este registro por completo?');
    
    if (confirmDelete) {
        habitsData.splice(currentHabitIndex, 1);
        saveData();
        detailScreen.style.display = 'none';
        mainScreen.style.display = 'block';
        renderList();
    }
});

detailPlusBtn.addEventListener('click', (event) => {
    if (currentHabitIndex === -1) return;
    
    event.stopPropagation();
    
    const rect = detailCount.getBoundingClientRect();
    
    const floatingPlus = document.createElement('span');
    floatingPlus.textContent = '+1';
    floatingPlus.className = 'floating-plus';
    
    floatingPlus.style.left = `${rect.left + window.scrollX + (rect.width / 2) - 10}px`;
    floatingPlus.style.top = `${rect.top + window.scrollY - 15}px`;
    
    document.body.appendChild(floatingPlus);
    
    setTimeout(() => {
        floatingPlus.remove();
    }, 400);

    if (!habitsData[currentHabitIndex].history) {
        habitsData[currentHabitIndex].history = [];
    }

    const now = new Date();
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateString = `${now.toLocaleDateString('es-MX', dateOptions)} a las ${now.toLocaleTimeString('es-MX', timeOptions)}`;

    habitsData[currentHabitIndex].history.push(dateString);
    habitsData[currentHabitIndex].count++;
    
    saveData();
    
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
        
        plusBtn.addEventListener('click', (event) => {
            event.stopPropagation(); 
            
            const rect = countSpan.getBoundingClientRect();
            
            const floatingPlus = document.createElement('span');
            floatingPlus.textContent = '+1';
            floatingPlus.className = 'floating-plus';
            
            floatingPlus.style.left = `${rect.left + window.scrollX + (rect.width / 2) - 10}px`;
            floatingPlus.style.top = `${rect.top + window.scrollY - 15}px`;
            
            document.body.appendChild(floatingPlus);
            
            setTimeout(() => {
                floatingPlus.remove();
            }, 400);

            if (!habitsData[index].history) {
                habitsData[index].history = [];
            }

            const now = new Date();
            const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const timeOptions = { hour: '2-digit', minute: '2-digit' };
            
            const dateString = `${now.toLocaleDateString('es-MX', dateOptions)} a las ${now.toLocaleTimeString('es-MX', timeOptions)}`;

            habitsData[index].history.push(dateString);
            habitsData[index].count++;
            
            saveData();
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
        const selectedText = selectElement.options[selectElement.selectedIndex].text;
        habitEmoji = selectedText.split(' ')[0];
    }

    if (!habitName || habitName === '') {
        return;
    }

    const isDuplicate = habitsData.some(habit => habit.name.toLowerCase() === habitName.toLowerCase());
    
    if (isDuplicate) {
        alert('Esta adicción ya está registrada en tu lista.');
        return; 
    }

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = new Date().toLocaleDateString('es-MX', options);

    habitsData.unshift({
        name: habitName,
        emoji: habitEmoji, 
        count: 0,
        date: currentDate,
        history: [] 
    });

    saveData();
    renderList();

    selectElement.selectedIndex = 0; 
    customHabitContainer.style.display = 'none';
    otherInput.value = '';
    newEmojiBtn.textContent = '🌱';
});

// Iniciar
renderList();