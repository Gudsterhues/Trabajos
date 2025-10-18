// Datos de ejemplo de alumnos
const alumnos = [
    {
        id: 1,
        nombre: "María González López",
        documento: "8-123-456",
        telefono: "+507 6123-4567",
        correo: "maria.gonzalez@email.com",
        estadoPago: "pagado"
    },
    {
        id: 2,
        nombre: "Carlos Rodríguez Pérez",
        documento: "8-789-012",
        telefono: "+507 6890-1234",
        correo: "carlos.rodriguez@email.com",
        estadoPago: "pendiente"
    },
    {
        id: 3,
        nombre: "Ana Martínez Silva",
        documento: "8-345-678",
        telefono: "+507 6345-7890",
        correo: "ana.martinez@email.com",
        estadoPago: "pagado"
    },
    {
        id: 4,
        nombre: "José Hernández Díaz",
        documento: "8-901-234",
        telefono: "+507 6901-2345",
        correo: "jose.hernandez@email.com",
        estadoPago: "pendiente"
    },
    {
        id: 5,
        nombre: "Laura Vargas Mora",
        documento: "8-567-890",
        telefono: "+507 6567-8901",
        correo: "laura.vargas@email.com",
        estadoPago: "pagado"
    },
    {
        id: 6,
        nombre: "Pedro Jiménez Rojas",
        documento: "8-432-109",
        telefono: "+507 6432-1098",
        correo: "pedro.jimenez@email.com",
        estadoPago: "pendiente"
    }
];

// Función para renderizar las tarjetas de alumnos
function renderizarAlumnos(alumnosArray) {
    const grid = document.getElementById('alumnosGrid');
    if (!grid) {
        console.error('No se encontró el elemento con ID "alumnosGrid"');
        return;
    }
    
    grid.innerHTML = alumnosArray.map(alumno => `
        <div class="alumno-card" data-id="${alumno.id}">
            <div class="alumno-info">
                <div class="info-row">
                    <span class="label">Nombre:</span>
                    <span class="value">${alumno.nombre}</span>
                </div>
                <div class="info-row">
                    <span class="label">Documento:</span>
                    <span class="value">${alumno.documento}</span>
                </div>
                <div class="info-row">
                    <span class="label">Teléfono:</span>
                    <span class="value">${alumno.telefono}</span>
                </div>
                <div class="info-row">
                    <span class="label">Correo:</span>
                    <span class="value">${alumno.correo}</span>
                </div>
                <div class="info-row">
                    <span class="label">Estado pago:</span>
                    <select class="estado-pago ${alumno.estadoPago === 'pagado' ? 'estado-pagado' : 'estado-pendiente'}" data-alumno-id="${alumno.id}">
                        <option value="pagado" ${alumno.estadoPago === 'pagado' ? 'selected' : ''}>Pagado</option>
                        <option value="pendiente" ${alumno.estadoPago === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                    </select>
                </div>
            </div>
        </div>
    `).join('');
}

// Función para inicializar los event listeners
function inicializarEventListeners() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    
    if (!searchButton || !searchInput) {
        console.error('No se encontraron los elementos de búsqueda');
        return;
    }

    // Event listener para búsqueda
    searchButton.addEventListener('click', buscarAlumnos);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscarAlumnos();
        }
    });

    // Event listener para cambios en estado de pago
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('estado-pago')) {
            const alumnoId = e.target.getAttribute('data-alumno-id');
            const nuevoEstado = e.target.value;
            
            // Actualizar clase CSS
            if (nuevoEstado === 'pagado') {
                e.target.classList.remove('estado-pendiente');
                e.target.classList.add('estado-pagado');
            } else {
                e.target.classList.remove('estado-pagado');
                e.target.classList.add('estado-pendiente');
            }
            
            // Actualizar datos
            const alumno = alumnos.find(a => a.id == alumnoId);
            if (alumno) {
                alumno.estadoPago = nuevoEstado;
            }
        }
    });
}

// Función para buscar alumnos
function buscarAlumnos() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const alumnosFiltrados = alumnos.filter(alumno => 
        alumno.nombre.toLowerCase().includes(searchTerm) ||
        alumno.documento.toLowerCase().includes(searchTerm) ||
        alumno.correo.toLowerCase().includes(searchTerm)
    );
    
    renderizarAlumnos(alumnosFiltrados);
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando aplicación...');
    renderizarAlumnos(alumnos);
    inicializarEventListeners();
});

// También inicializar si el DOM ya está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        renderizarAlumnos(alumnos);
        inicializarEventListeners();
    });
} else {
    renderizarAlumnos(alumnos);
    inicializarEventListeners();
}