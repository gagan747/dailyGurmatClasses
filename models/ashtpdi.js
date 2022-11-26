const mongoose = require('mongoose');

const ashtpadischema = mongoose.Schema({
          ashtpadi: {
                    type: Number,
                    required: [true, 'ashtpadi is a required field'],
                    unique: true,
          },
          booked: {
                   isBooked:{
                   type:Boolean
                   },
                   bookedBy:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Users"
                   }
          }
});
const Ashtpadi = mongoose.model('Ashtpadi', ashtpadischema);
module.exports = Ashtpadi;
