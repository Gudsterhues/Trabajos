class NavegacionRegistro {
  constructor() {
    this.secciones = document.querySelectorAll('.seccion');
    this.seccionActual = 0;

    this.inicializarEventos();
  }

  inicializarEventos() {
    // Botón siguiente de infoAlumno
    const btnSigAlum = document.getElementById('siguienteInfoAlumno');
    btnSigAlum?.addEventListener('click', () => {
      if (this.validarInfoAlumno()) this.mostrarSeccion(1);
    });

    // Botón atrás de infoPaquete
    const btnAtrPaq = document.getElementById('atrasInfoPaquete');
    btnAtrPaq?.addEventListener('click', () => this.mostrarSeccion(0));

    // Botón siguiente de infoPaquete
    const btnSigPaq = document.getElementById('siguienteInfoPaquete');
    btnSigPaq?.addEventListener('click', () => {
      if (this.validarInfoPaquete()) this.mostrarSeccion(2);
    });

    // Botón atrás de infoClase
    const btnAtrClase = document.getElementById('atrasInfoClase');
    btnAtrClase?.addEventListener('click', () => this.mostrarSeccion(1));

    // Botón agregar estudiante
    const btnAgregar = document.getElementById('agregarEstudiante');
    btnAgregar?.addEventListener('click', () => this.agregarEstudiante());
  }

  mostrarSeccion(indice) {
    this.secciones.forEach(s => s.classList.remove('activa'));
    if (this.secciones[indice]) {
      this.secciones[indice].classList.add('activa');
      this.seccionActual = indice;
    }
    window.scrollTo(0, 0);
  }

  validarInfoAlumno() {
    const nombre = (document.getElementById('nombreC')?.value || '').trim();
    const documento = (document.getElementById('idUser')?.value || '').trim();
    const telefono = (document.getElementById('celular')?.value || '').trim();
    const correo = (document.getElementById('correo')?.value || '').trim();

    if (!nombre) { alert('Por favor ingresa el nombre completo'); return false; }
    if (!documento) { alert('Por favor ingresa el documento de identidad'); return false; }
    if (!telefono) { alert('Por favor ingresa el teléfono de contacto'); return false; }
    if (!correo) { alert('Por favor ingresa el correo electrónico'); return false; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) { alert('Por favor ingresa un correo electrónico válido'); return false; }

    return true;
  }

  validarInfoPaquete() {
    const tipoClase = document.getElementById('tipoClase')?.value;
    if (tipoClase === 'elegir') { alert('Por favor selecciona el tipo de paquete'); return false; }

    if (tipoClase === 'Grupal') {
      const cantidadGrupal = document.getElementById('cantidadClaseGrupal')?.value;
      if (cantidadGrupal === 'elegir') { alert('Por favor selecciona la cantidad de clases grupales'); return false; }
    } else {
      const cantidadParticular = document.getElementById('cantidadClaseParti')?.value;
      if (cantidadParticular === 'elegir') { alert('Por favor selecciona la cantidad de clases particulares'); return false; }
    }
    return true;
  }

  async postJSON(url, data) {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    let payload = null;
    try { payload = await r.json(); } catch {}
    if (!r.ok) {
      const msg = (payload && payload.error) ? payload.error : `Error ${r.status} en ${url}`;
      throw new Error(msg);
    }
    return payload;
  }
  num(texto) { return (texto || '').toString().replace(/\D/g, ''); }

  async agregarEstudiante() {
    const btn = document.getElementById('agregarEstudiante');
    btn && (btn.disabled = true);

    try {
      const nombre = (document.getElementById('nombreC')?.value || '').trim();
      const correo = (document.getElementById('correo')?.value || '').trim();

      if (!nombre || !correo) throw new Error('Faltan nombre/correo');

      const user = await this.postJSON('/api/usuarios', {
        nombre_completo: nombre,
        correo
      }); 

      const numero = (document.getElementById('celular')?.value || '').trim();
      const tipoCel = document.getElementById('tipoCel')?.value;
      if (numero && tipoCel && tipoCel !== 'elegir') {
        await this.postJSON('/api/celulares', {
          id_usuario: user.id,
          numero,
          tipo: tipoCel
        });
      }

      const tipoPaquete = document.getElementById('tipoClase')?.value; 
      if (tipoPaquete && tipoPaquete !== 'elegir') {
        const cg = document.getElementById('cantidadClaseGrupal')?.value || '';
        const cp = document.getElementById('cantidadClaseParti')?.value || '';
        const cantidad = this.num(tipoPaquete === 'Grupal' ? cg : cp); 
        if (!cantidad) throw new Error('Selecciona la cantidad de clases');

        await this.postJSON('/api/paquetes', {
          id_usuario: user.id,
          tipo: tipoPaquete,
          cantidad_clases: cantidad,   
          precio_actual: 0
        });
      }

      alert(`¡Alumno registrado! ID: ${user.id}`);
      this.reiniciarFormulario();
      this.mostrarSeccion(0);

    } catch (e) {
      alert(e.message || 'Error en el registro');
    } finally {
      btn && (btn.disabled = false);
    }
  }

  reiniciarFormulario() {
    const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
    setVal('nombreC', '');
    setVal('idUser', '');
    setVal('celular', '');
    setVal('tipoCel', 'elegir');
    setVal('correo', '');
    setVal('tipoClase', 'elegir');
    setVal('cantidadClaseGrupal', 'elegir');
    setVal('cantidadClaseParti', 'elegir');
    setVal('tipoBaile', 'elegir');
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  new NavegacionRegistro();
});
