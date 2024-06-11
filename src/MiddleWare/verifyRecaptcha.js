const axios = require('axios');

// Middleware para verificar el token de reCAPTCHA
async function verifyRecaptcha(req, res, next) {
  const { recaptchaToken } = req.body;

  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: '6Lch0vUpAAAAAFI1QpugdfMqjm7VXGLVm69seq-l', // Tu clave secreta de reCAPTCHA
          response: recaptchaToken,
        },
      }
    );

    if (response.data.success) {
      // reCAPTCHA válido, pasa al siguiente middleware
      next();
    } else {
      // reCAPTCHA inválido, envía un error
      res.status(400).json({ success: false, message: 'reCAPTCHA inválido' });
    }
  } catch (error) {
    // Si hay un error en la solicitud, envía un error
    console.error('Error al verificar reCAPTCHA:', error);
    res.status(500).json({ success: false, message: 'Error al verificar reCAPTCHA' });
  }
}

module.exports = verifyRecaptcha;