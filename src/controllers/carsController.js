let cars = [];

module.exports = {
  getAll: (_req, res) => res.json(cars),

  getById: (req, res) => {
    const car = cars.find(c => c.id == req.params.id);
    if (!car) return res.status(404).json({ message: 'Voiture non trouvée' });
    res.json(car);
  },

  create: (req, res) => {
    const { modele, plaqueImmatriculation, dateEntree, statut, clientId } = req.body;
    const newCar = { id: cars.length + 1, modele, plaqueImmatriculation, dateEntree, statut, clientId };
    cars.push(newCar);
    res.status(201).json(newCar);
  },

  update: (req, res) => {
    const index = cars.findIndex(c => c.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Voiture non trouvée' });
    cars[index] = { ...cars[index], ...req.body };
    res.json(cars[index]);
  },

  remove: (req, res) => {
    const index = cars.findIndex(c => c.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Voiture non trouvée' });
    const removed = cars.splice(index, 1);
    res.json({ message: 'Voiture supprimée', removed });
  }
};
