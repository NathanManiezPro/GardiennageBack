// src/test/usersController.test.js

// 1) Mocks avant import
jest.mock('@prisma/client', () => {
  const mUser = {
    findUnique: jest.fn(),
    create:     jest.fn(),
    findMany:   jest.fn(),
    update:     jest.fn(),
    delete:     jest.fn(),
  };
  const mCar = { findMany: jest.fn() };
  return {
    PrismaClient: jest.fn(() => ({
      user: mUser,
      car:  mCar,
    })),
  };
});
jest.mock('bcrypt', () => ({
  hash:    jest.fn(),
  compare: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));
jest.mock('../middlewares/passwordRegex', () => ({
  test: pw => pw.length >= 8 && /\d/.test(pw) && /[!@#$%^&*]/.test(pw),
}));

// 2) Import APRÈS les mocks
const controller       = require('../controllers/usersController');
const { PrismaClient } = require('@prisma/client');
const bcrypt           = require('bcrypt');
const jwt              = require('jsonwebtoken');

describe('usersController (toutes méthodes)', () => {
  let prisma, req, res;
  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
    req = { body: {}, params: {}, user: { id: 7 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json:   jest.fn().mockReturnThis(),
    };
  });

  describe('register', () => {
    it('400 si mot de passe invalide', async () => {
      req.body = { nom:'X', email:'a@b.c', telephone:'123', password:'weak' };
      await controller.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message:
          'Le mot de passe doit comporter au moins 8 caractères, dont 1 chiffre et 1 caractère spécial.',
      });
    });

    it('400 si email existe déjà', async () => {
      req.body = { nom:'X', email:'dup@c.d', telephone:'123', password:'Abc1!def' };
      prisma.user.findUnique.mockResolvedValue({ id: 1 });
      await controller.register(req, res);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email:'dup@c.d' } });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message:'Cet email est déjà utilisé.' });
    });

    it('201 et création user sans abonnement', async () => {
      req.body = {
        nom: 'Cli',
        email: 'cli@d.e',
        telephone: '000',
        password: 'Abc1!def',
        role: 'client'
      };
      prisma.user.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedpw');
      const fakeUser = { id:3, nom:'Cli', email:'cli@d.e', telephone:'000', password:'hashedpw', role:'client' };
      prisma.user.create.mockResolvedValue(fakeUser);

      await controller.register(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('Abc1!def', 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          nom: 'Cli',
          email: 'cli@d.e',
          telephone: '000',
          password: 'hashedpw',
          role: 'client'
        }
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Inscription réussie.',
        user: fakeUser
      });
    });

    it('500 en cas d’erreur serveur', async () => {
      req.body = { nom:'X', email:'x@y.z', telephone:'0', password:'Abc1!abc' };
      prisma.user.findUnique.mockRejectedValue(new Error('db fail'));
      await controller.register(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message:'db fail' });
    });
  });

  describe('login', () => {
    it('401 si utilisateur introuvable', async () => {
      req.body = { email:'no@one.x', password:'whatever' };
      prisma.user.findUnique.mockResolvedValue(null);
      await controller.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message:'Utilisateur introuvable.' });
    });

    it('401 si mot de passe incorrect', async () => {
      req.body = { email:'u@ex.com', password:'badpw' };
      prisma.user.findUnique.mockResolvedValue({ password:'hash' });
      bcrypt.compare.mockResolvedValue(false);
      await controller.login(req, res);
      expect(bcrypt.compare).toHaveBeenCalledWith('badpw','hash');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message:'Mot de passe incorrect.' });
    });

    it('réussit à connecter et génère un token', async () => {
      req.body = { email:'ok@ex.com', password:'Good1!pw' };
      const user = { id:8, role:'client', password:'hash' };
      prisma.user.findUnique.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('jwt-token');

      await controller.login(req, res);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id:8, role:'client' },
        process.env.JWT_SECRET,
        { expiresIn:'2h' }
      );
      expect(res.json).toHaveBeenCalledWith({
        message:'Connexion réussie.',
        token:'jwt-token',
        user
      });
    });

    it('500 en cas d’erreur serveur', async () => {
      req.body = { email:'x', password:'x' };
      prisma.user.findUnique.mockRejectedValue(new Error('oops'));
      await controller.login(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message:'oops' });
    });
  });

  describe('getAll', () => {
    it('renvoie la liste des users', async () => {
      const fake = [{id:1},{id:2}];
      prisma.user.findMany.mockResolvedValue(fake);
      await controller.getAll(req, res);
      expect(res.json).toHaveBeenCalledWith(fake);
    });
    it('500 en cas d’erreur', async () => {
      prisma.user.findMany.mockRejectedValue(new Error('err'));
      await controller.getAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message:'err' });
    });
  });

  describe('update', () => {
    it('400 si ID invalide', async () => {
      req.params.id = 'x';
      await controller.update(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message:'ID invalide.' });
    });

    it('met à jour user sans password', async () => {
      req.params.id = '5';
      req.body = { nom:'N', email:'e@d.e', telephone:'1', role:'client' };
      const fake = { id:5 };
      prisma.user.update.mockResolvedValue(fake);

      await controller.update(req, res);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where:{ id:5 },
        data:{ nom:'N', email:'e@d.e', telephone:'1', role:'client' }
      });
      expect(res.json).toHaveBeenCalledWith({ message:'Utilisateur mis à jour.', user: fake });
    });
  });

  describe('delete', () => {
    it('supprime user', async () => {
      req.params.id = '3';
      prisma.user.delete.mockResolvedValue({});
      await controller.delete(req, res);
      expect(res.json).toHaveBeenCalledWith({ message:'Utilisateur supprimé.' });
    });
    it('500 si erreur', async () => {
      prisma.user.delete.mockRejectedValue(new Error('e'));
      await controller.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message:'e' });
    });
  });

  describe('changePassword', () => {
    it('400 si champs manquants', async () => {
      req.body = {};
      await controller.changePassword(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message:'Ancien et nouveau mot de passe requis.' });
    });
    it('400 si nouveau mot de passe invalide', async () => {
      req.body = { currentPassword:'A', newPassword:'weak' };
      await controller.changePassword(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message:
          'Le nouveau mot de passe doit comporter au moins 8 caractères, dont 1 chiffre et 1 caractère spécial.',
      });
    });
    it('404 si user non trouvé', async () => {
      req.body = { currentPassword:'Xx1!', newPassword:'Abc1!def' };
      bcrypt.compare.mockResolvedValue(true);
      prisma.user.findUnique.mockResolvedValue(null);
      await controller.changePassword(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message:'Utilisateur non trouvé.' });
    });
    it('401 si ancien mot de passe incorrect', async () => {
      req.body = { currentPassword:'bad', newPassword:'Abc1!def' };
      prisma.user.findUnique.mockResolvedValue({ password:'hash' });
      bcrypt.compare.mockResolvedValue(false);
      await controller.changePassword(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message:'Ancien mot de passe incorrect.' });
    });
    it('réussit à changer le mot de passe', async () => {
      req.body = { currentPassword:'Good1!pw', newPassword:'Better2@pw' };
      const user = { id:7, password:'hash' };
      prisma.user.findUnique.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('newhash');
      await controller.changePassword(req, res);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where:{ id:7 },
        data:{ password:'newhash' }
      });
      expect(res.json).toHaveBeenCalledWith({ message:'Mot de passe mis à jour avec succès.' });
    });
  });

  describe('getUserCars', () => {
    it('400 si ID invalide', async () => {
      req.params.id = 'x';
      await controller.getUserCars(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message:'ID invalide.' });
    });
    it('renvoie les voitures', async () => {
      req.params.id = '4';
      prisma.car.findMany.mockResolvedValue([{ id:10 }]);
      await controller.getUserCars(req, res);
      expect(res.json).toHaveBeenCalledWith([{ id:10 }]);
    });
    it('500 en cas d’erreur', async () => {
      req.params.id = '4';
      prisma.car.findMany.mockRejectedValue(new Error('fail'));
      await controller.getUserCars(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message:'Erreur serveur.' });
    });
  });
});
