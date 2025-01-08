const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	//계정 활성화 여부
	//학생- 학교 계정 인증시 활성
	//점주- 인증키 입력시 활성
	isActive: {
		type: Boolean,
		default: false,
	},
	username: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 20,
	},
	id: {
		type: String,
		required: true,
		unique: true,
		minlength: 3,
		maxlength: 20
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ['student', 'business','admin'],
		default: 'student',
	},
	business: {
		type: Schema.Types.ObjectId,
		ref: 'market',
	},
	//학생의 경우
	stamps: [{
		type: Schema.Types.ObjectId,
		ref: 'stamp',
	}],
	studentId: {
		type: String,
		minLength: 5,
		maxLength: 5
	},
	name: {
		type: String,
		minLength: 2,
		maxLength: 10,
	},
	//구글 계정 연동
	googleId: {
		type: String,
		unique: true,
	},
	email: {
		type: String,
		unique: true,
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

userSchema.pre('save', function (next) {
	this.updatedAt = Date.now();
	next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('user', userSchema);
