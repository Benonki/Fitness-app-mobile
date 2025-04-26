const authService = require('../services/authService');

exports.getUserInfo = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const userLogin = req.query.login;
    const user = await authService.getUserInfo(userLogin, token);
    res.json(user);
  } catch (error) {
    if (error.message === 'Token wygasł' || error.message === 'Nieprawidłowy token' || error.message === 'Brak tokena autoryzacyjnego') {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;
    const result = await authService.login(login, password);
    res.json(result);
  } catch (error) {
    console.error('Błąd logowania:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił błąd podczas logowania'
    });
  }
};

exports.checkLoginAvailability = async (req, res) => {
  try {
    const { login } = req.query;
    const result = await authService.checkLoginAvailability(login);
    res.json(result);
  } catch (error) {
    console.error('Błąd sprawdzania loginu:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił błąd podczas sprawdzania dostępności loginu',
      available: false
    });
  }
};