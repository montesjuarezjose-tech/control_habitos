// Inicialización del cliente de Supabase
const supabaseUrl = 'https://lbpgjngptaliadsbzwkw.supabase.co'; 
const supabaseKey = 'sb_publishable_Q74oalzTl4iSQReg6xEgpg_25Ff-kcu'; 
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Función para guardar el registro diario en Supabase
async function guardarRegistro(fecha, adiccion, recaidas) {
  const { data, error } = await supabase
    .from('registros')
    .insert([
      { 
        fecha: fecha, 
        nombre_adiccion: adiccion, 
        cantidad_recaidas: recaidas 
      }
    ]);

  // Comprobamos si hubo un error o si fue exitoso
  if (error) {
    console.error("Error al guardar:", error);
    alert("Hubo un error al intentar guardar.");
  } else {
    console.log("Guardado exitoso:", data);
    alert("¡Registro guardado correctamente en la nube!");
  }
}

// Prueba rápida para confirmar que el objeto se generó correctamente
console.log("Cliente de Supabase inicializado:", supabase);


// Seleccionamos tu formulario usando su ID real
const formulario = document.getElementById('tracker-form');

// Escuchamos el evento 'submit' (cuando se envía el formulario)
formulario.addEventListener('submit', function(evento) {
  // Evitamos que la página se recargue al enviar el formulario
  evento.preventDefault(); 

  // 1. Generamos la fecha de hoy automáticamente (formato YYYY-MM-DD)
  const valorFecha = new Date().toISOString().split('T')[0];
  
  // 2. Capturamos los valores que el usuario escribió usando tus IDs
  const valorAdiccion = document.getElementById('habit-name').value;
  const valorRecaidas = document.getElementById('habit-level').value;

  // 3. Llamamos a la función pasándole estos datos
  guardarRegistro(valorFecha, valorAdiccion, valorRecaidas);
});



// Elementos del DOM
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const authForm = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const authMessage = document.getElementById('auth-message');
const logoutBtn = document.getElementById('logout-btn');
const trackerForm = document.getElementById('tracker-form');
const habitNameInput = document.getElementById('habit-name');
const habitLevelInput = document.getElementById('habit-level');
const historyList = document.getElementById('history-list');

// Estado de la aplicación
let currentUser = null;

// Funciones de Autenticación
async function registerUser(e) {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    
    try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        authMessage.textContent = 'Registro exitoso. Verifica tu correo.';
        authMessage.style.color = '#2ecc71';
    } catch (error) {
        authMessage.textContent = error.message;
        authMessage.style.color = '#e74c3c';
    }
}

async function loginUser(e) {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        currentUser = data.user;
        showApp();
        loadHistory();
    } catch (error) {
        authMessage.textContent = 'Error al iniciar sesión. Verifica tus datos.';
        authMessage.style.color = '#e74c3c';
    }
}

async function logoutUser() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        currentUser = null;
        showAuth();
    }
}

// Funciones de la Interfaz
function showApp() {
    authContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');
    emailInput.value = '';
    passwordInput.value = '';
    authMessage.textContent = '';
}

function showAuth() {
    appContainer.classList.add('hidden');
    authContainer.classList.remove('hidden');
    historyList.innerHTML = '';
}

// Funciones de Base de Datos (CRUD)
async function saveRecord(e) {
    e.preventDefault();
    if (!currentUser) return;

    const habit = habitNameInput.value;
    const level = habitLevelInput.value;

    try {
        const { error } = await supabase
            .from('registros_adicciones')
            .insert([{ user_id: currentUser.id, habito: habit, nivel: level }]);
            
        if (error) throw error;
        
        habitNameInput.value = '';
        habitLevelInput.value = '';
        loadHistory(); 
    } catch (error) {
        console.error('Error al guardar:', error.message);
    }
}

async function loadHistory() {
    if (!currentUser) return;
    
    try {
        const { data, error } = await supabase
            .from('registros_adicciones')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        renderHistory(data);
    } catch (error) {
        console.error('Error al cargar historial:', error.message);
    }
}

function renderHistory(records) {
    historyList.innerHTML = '';
    records.forEach(record => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${record.habito}</strong></span>
            <span>Nivel: ${record.nivel}/10</span>
        `;
        historyList.appendChild(li);
    });
}

// Control de Sesión Activa
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        currentUser = session.user;
        showApp();
        loadHistory();
    } else {
        showAuth();
    }
});

// Listeners
registerBtn.addEventListener('click', registerUser);
authForm.addEventListener('submit', loginUser);
logoutBtn.addEventListener('click', logoutUser);
trackerForm.addEventListener('submit', saveRecord);