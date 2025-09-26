// importar dependencias
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Firecrawl } = require('@mendable/firecrawl-js');
const { GoogleGenAI } = require('@google/genai');
crawledPages = {};


// crear una instancia de express
const app = express();
// middleware para parsear JSON
app.use(express.json());
app.use(cors());

// instancias de firecrawl y google generative AI
const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

// definir un puerto
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send('Hola, mundo!');
});

// recibir datos en una ruta POST
app.post('/api/chat', async (req, res) => {
    try {
        let context = '';
        const { userMessage, url, history } = req.body;
        console.log('Cuerpo de la solicitud:', req.body);
        // validar que userMessage y url estén presentes
        if(!userMessage) {
            return res.status(400).json({ error: 'Debes dejar un mensaje, es obligatorio.' });
        }
        // scraper url

        if (url && url.trim() !== '') {
            if (crawledPages[url]) {
                console.log('Usando contenido en caché para la URL:', url);
                context = crawledPages[url];
            } else {
                console.log('No se encontró contenido en caché para la URL:', url);
                const crawlResponse = await firecrawl.crawl(url, {
                    limit: 100,
                    scrapeOptions: { formats: ['markdown', 'html'], onlyMainContent: true },
                });
                console.log('Scraping completado!!!!');
                console.log('Respuesta del crawl:', JSON.stringify(crawlResponse, null, 2));
                
                // obtenemos el contenido scrapeado
                if (crawlResponse.data && crawlResponse.data.length > 0) {
                    context = crawlResponse.data.map(page => 
                        `URL: ${page.url}\nContenido: ${page.content || page.markdown}\n---\n`
                    ).join('');
                    console.log('Contenido scrapeado:', context);
                    // almacenamos en caché
                    crawledPages[url] = context;
                } else {
                    res.json({ message: 'No se pudo scrapear contenido de la URL proporcionada.' });
                }
    }
            }

        // generar respuesta con Gemini
        const prompt = `Basándote en el siguiente contexto, responde la pregunta del usuario.
    
            CONTEXTO:
            ---
            ${context}, DEBES SER COMPLETO AL RESPONDER, no des respuestas concisas o cortas, debes ser explicativo y detallado. Debes ser sumamente amigable y paciente!
            ---
            HISTORIAL DE CONVERSACIÓN:
            ---
            Usuario: ${history.user.join('\nUsuario: ')}
            Bot: ${history.bot.join('\nBot: ')}
            ---
            PREGUNTA: ${userMessage}`;

        let response = await genAI.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `${userMessage}`,
            config: {
              systemInstruction: `${prompt}`,
            },
        });
        console.log(response.text);
        if (url && url.trim() !== '') {
            response.text = `Aquí tienes la información que encontré en la página ${url}:\n\n${response.text}`;
        }
        res.json({ aiResponse: response.text });
        
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
});



// iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
