const Ashtpadi = require('../models/ashtpdi')

async function authorizeToDelete(req, res, next) {
          try {
                    if (!req.body.user_id || !req.body.ashtpadi) {
                              res.status(400).json({ message: 'provide a valid payload' });
                              return;
                    }
                    if (req.body.user_id.toString() === req.user_id.toString()) {
                              const duties = await Ashtpadi.find({ 'booked.bookedBy': req.body.user_id.toString() });
                              if (duties.length && duties.find((userDuty) => userDuty.ashtpadi == req.body.ashtpadi))
                                        return next();

                    }
                    res.status(403).json({ message: 'you are authorized to delete only your booked ashtpadi' })
          } catch (err) {
                    res.status(500).json({ message: '' + err });
          }
}
module.exports = authorizeToDelete;