const Ashtpadi = require('../models/ashtpdi')

module.exports = async(req,res,next)=>{
          try{
                    console.log('started')
const duties = await Ashtpadi.find({});
console.log(duties)
duties.map(async(duty)=>{
duty.booked.isBooked=false;
duty.booked.bookedBy=undefined;
await duty.save()
});

console.log('duties resetted')
          }catch(err){
                    console.log(err)
          }
}
