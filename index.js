const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint GET /api/invitation/:hash
app.get('/api/invitation/:hash', (req, res) => {
  try {
    const hash = req.params.hash;

    // Validate hash is exactly 32 hex characters (MD5 standard)
    if (!/^[a-f0-9]{32}$/i.test(hash)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de clave (hash) inválido. Debe ser un MD5 válido.'
      });
    }

    // Load the JSON database
    const dataPath = path.join(__dirname, 'data.json');

    // Check if db exists
    if (!fs.existsSync(dataPath)) {
      return res.status(500).json({
        success: false,
        error: 'Base de datos no encontrada.'
      });
    }

    const fileData = fs.readFileSync(dataPath, 'utf-8');
    const db = JSON.parse(fileData);

    // Look up the hash in our JSON object
    if (db[hash]) {
      return res.status(200).json({
        success: true,
        data: db[hash]
      });
    } else {
      return res.status(404).json({
        success: false,
        error: 'Invitación no encontrada.'
      });
    }
  } catch (error) {
    console.error('Error procesando la solicitud:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});
