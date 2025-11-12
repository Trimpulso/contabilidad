/**
 * CAI - Módulo de IA con Google Gemini
 * Integración con Gemini 1.5 Flash para respuestas inteligentes
 * Updated: 11/11/2025
 */

class ChatbotIA {
  constructor() {
    // ✅ API Key de Google AI Studio configurada
    // Proyecto: 1088932799783
    this.apiKey = 'AIzaSyBhNELpAFBh_jrD_R7s8OthrTp5LRzQFDg';
    
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    this.contextoProveedores = null;
    this.contextoDTEs = null;
    this.cacheRespuestas = new Map(); // Caché para optimizar requests
    this.requestCount = 0;
    this.maxRequestsPerHour = 60; // Límite conservador
  }

  /**
   * Cargar datos de contexto para RAG (Retrieval Augmented Generation)
   */
  async cargarContexto() {
    try {
      const response = await fetch('./data/contabilidad.json');
      const data = await response.json();
      
      this.contextoDTEs = data.hojas?.Hoja1 || [];
      
      // Extraer info de proveedores
      this.contextoProveedores = this.extraerProveedores(this.contextoDTEs);
      
      console.log('✅ Contexto IA cargado:', {
        proveedores: this.contextoProveedores.length,
        dtes: this.contextoDTEs.length
      });
    } catch (error) {
      console.error('❌ Error cargando contexto:', error);
    }
  }

  /**
   * Extraer información de proveedores del JSON
   */
  extraerProveedores(dtes) {
    const proveedoresMap = new Map();
    
    dtes.forEach(dte => {
      const rut = dte.RUT_Emisor;
      if (!proveedoresMap.has(rut)) {
        proveedoresMap.set(rut, {
          rut: rut,
          nombre: dte.Proveedor,
          facturas: 0,
          montoTotal: 0,
          riesgo: dte.Nivel_Riesgo,
          score: dte.Score_Riesgo,
          dtes: []
        });
      }
      
      const proveedor = proveedoresMap.get(rut);
      proveedor.facturas++;
      proveedor.montoTotal += dte.Monto_Neto || 0;
      proveedor.dtes.push({
        numero: dte.Numero_DTE,
        fecha: dte.Fecha_Emision,
        monto: dte.Monto_Neto,
        estado: dte.Estado
      });
    });
    
    return Array.from(proveedoresMap.values());
  }

  /**
   * Verificar si la API key está configurada
   */
  esAPIKeyValida() {
    return this.apiKey && this.apiKey !== 'PENDING_API_KEY';
  }

  /**
   * Verificar límite de requests
   */
  puedeHacerRequest() {
    if (this.requestCount >= this.maxRequestsPerHour) {
      return false;
    }
    return true;
  }

  /**
   * Buscar en caché
   */
  buscarEnCache(pregunta) {
    const cacheKey = pregunta.toLowerCase().trim();
    return this.cacheRespuestas.get(cacheKey);
  }

  /**
   * Guardar en caché
   */
  guardarEnCache(pregunta, respuesta) {
    const cacheKey = pregunta.toLowerCase().trim();
    this.cacheRespuestas.set(cacheKey, {
      respuesta,
      timestamp: Date.now()
    });
    
    // Limpiar caché antiguo (>1 hora)
    const unaHora = 60 * 60 * 1000;
    for (const [key, value] of this.cacheRespuestas.entries()) {
      if (Date.now() - value.timestamp > unaHora) {
        this.cacheRespuestas.delete(key);
      }
    }
  }

  /**
   * Enviar pregunta a Gemini con RAG
   */
  async enviarPregunta(pregunta) {
    // 1. Verificar API key
    if (!this.esAPIKeyValida()) {
      return {
        exito: false,
        error: '⚠️ API Key no configurada. Ve a `docs/chatbot/chatbot-ia.js` y agrega tu key de Google AI Studio.'
      };
    }

    // 2. Verificar límite de requests
    if (!this.puedeHacerRequest()) {
      return {
        exito: false,
        error: '⚠️ Límite de requests alcanzado. Intenta de nuevo en 1 hora o usa los comandos 1-6.'
      };
    }

    // 3. Buscar en caché
    const cached = this.buscarEnCache(pregunta);
    if (cached) {
      console.log('✅ Respuesta desde caché');
      return {
        exito: true,
        respuesta: cached.respuesta,
        fromCache: true
      };
    }

    // 4. Cargar contexto si no está cargado
    if (!this.contextoProveedores) {
      await this.cargarContexto();
    }

    // 5. Construir prompt con RAG
    const prompt = this.construirPrompt(pregunta);

    try {
      // 6. Llamar a Gemini API
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // 7. Extraer respuesta
      const respuesta = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!respuesta) {
        throw new Error('Respuesta vacía de Gemini');
      }

      // 8. Incrementar contador y guardar en caché
      this.requestCount++;
      this.guardarEnCache(pregunta, respuesta);

      console.log(`✅ Respuesta IA recibida (${this.requestCount}/${this.maxRequestsPerHour})`);

      return {
        exito: true,
        respuesta: respuesta,
        fromCache: false
      };

    } catch (error) {
      console.error('❌ Error llamando a Gemini:', error);
      
      return {
        exito: false,
        error: `⚠️ Error de conexión con IA: ${error.message}`
      };
    }
  }

  /**
   * Construir prompt con contexto RAG
   */
  construirPrompt(pregunta) {
    const contextoJSON = JSON.stringify({
      proveedores: this.contextoProveedores,
      totalProveedores: this.contextoProveedores.length,
      totalDTEs: this.contextoDTEs.length,
      montoTotal: this.contextoProveedores.reduce((sum, p) => sum + p.montoTotal, 0)
    }, null, 2);

    return `Eres CAI (Chatbot de Asistencia Contable Inteligente), un asistente experto en contabilidad y análisis de riesgos de proveedores.

**CONTEXTO DE DATOS:**
${contextoJSON}

**REGLAS:**
1. Responde SIEMPRE en español
2. Usa los datos del contexto para responder
3. Sé conciso y profesional (máximo 200 palabras)
4. Usa formato Markdown para listas y énfasis
5. Si no hay datos suficientes, indícalo claramente
6. Menciona RUTs cuando sea relevante
7. Destaca riesgos críticos con emojis (⚠️, 🚨)

**PREGUNTA DEL USUARIO:**
${pregunta}

**TU RESPUESTA:**`;
  }

  /**
   * Obtener estadísticas de uso
   */
  getEstadisticas() {
    return {
      requestsRealizados: this.requestCount,
      requestsRestantes: this.maxRequestsPerHour - this.requestCount,
      cacheSize: this.cacheRespuestas.size,
      apiKeyConfigurada: this.esAPIKeyValida()
    };
  }
}
