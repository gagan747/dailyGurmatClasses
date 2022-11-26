const Ashtpadi = require('../models/ashtpdi');

module.exports.getPathDuties = async (req, res, next) => {
	try {
		const duties = await Ashtpadi.find({})
			.populate('booked.bookedBy', 'fullname city username')
			.sort({ ashtpadi: 1 });
		res.json({ duties });
	} catch (err) {
		res.status(400).json({ message: '' + err });
	}
};
module.exports.postPathDuty = async (req, res, next) => {
	try {
		const { ashtpadi } = req.body;
		const user_id = req.user_id;
		if (!ashtpadi || ashtpadi < 1 || ashtpadi > 24)
			return res
				.status(400)
				.json({ message: 'a valid ashtpadi number is required ' });
		const userAlreadyBooked = await Ashtpadi.find({ 'booked.bookedBy': user_id });
		if (userAlreadyBooked.length >= 2)
			return res
				.status(403)
				.json({ message: 'ਤੁਸੀਂ ਵੱਧ ਤੋਂ ਵੱਧ 2 ਅਸ਼ਟਪਦੀਆਂ ਹੀ ਬੁੱਕ ਕਰ ਸਕਦੇ ਹੋ' });
		else if (
			userAlreadyBooked.length > 0 &&
			Math.abs(userAlreadyBooked[0].ashtpadi - ashtpadi) > 1
		) {
			if (
				userAlreadyBooked[0].ashtpadi === 24 ||
				userAlreadyBooked[0].ashtpadi === 1
			)
				return res
					.status(403)
					.json({
						message: `ਆਪ ਜੀ ਨੇ ਪਹਿਲਾਂ '${
							userAlreadyBooked[0].ashtpadi
						}' ਅਸ਼ਟਪਦੀ ਬੁਕ ਕੀਤੀ ਸੀ, ਹੁਣ ਆਪ ਜੀ '${
							userAlreadyBooked[0].ashtpadi === 24 ? '23' : '2'
						}' ਅਸ਼ਟਪਦੀ ਹੀ ਬੁਕ ਕਰ ਸਕਦੇ ਹੋ`,
					});
			return res
				.status(403)
				.json({
					message: `ਆਪ ਜੀ ਨੇ ਪਹਿਲਾਂ '${
						userAlreadyBooked[0].ashtpadi
					}' ਅਸ਼ਟਪਦੀ ਬੁਕ ਕੀਤੀ ਸੀ, ਹੁਣ ਆਪ ਜੀ '${
						userAlreadyBooked[0].ashtpadi - 1
					}' ਜਾਂ '${userAlreadyBooked[0].ashtpadi + 1}' ਅਸ਼ਟਪਦੀ ਹੀ ਬੁਕ ਕਰ ਸਕਦੇ ਹੋ`,
				});
		} else {
			const newPathDuty = await Ashtpadi.findOne({ ashtpadi });
			if (newPathDuty.booked.isBooked)
				return res
					.status(403)
					.json({ message: 'ਇਸ ਅਸ਼ਟਪਦੀ  ਦੀ ਸੇਵਾ ਪਹਿਲਾਂ ਹੀ ਲੈ ਲੀਤੀ ਗਈ ਹੈ ਜੀ ' });
			newPathDuty.booked.isBooked = true;
			newPathDuty.booked.bookedBy = req.user_id;
			await newPathDuty.save();
			res.status(201).json({ message: 'booked' });
		}
	} catch (err) {
		res.status(400).json({ message: '' + err });
	}
};

module.exports.deletePathDuty = async (req,res,next) => {
	try{
	const response = await Ashtpadi.updateOne({ashtpadi:req.body.ashtpadi},{$set:{"booked.isBooked":false},$unset:{"booked.bookedBy":""}});
	if(response.modifiedCount === 1)
	return res.status(200).json({message:'sewa cancelled'});
	res.status(400).json({message:'error occurred while cancelling'})
	}catch(err){
		res.status(400).json({message:''+err})
	}
}