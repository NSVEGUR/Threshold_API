import { Student, Teacher, Admin } from '../model/user.model';

const user = (role: string) => {
	const roles = ['student', 'teacher', 'admin'];
	switch (role) {
		case roles[0]: return Student;
		case roles[1]: return Teacher;
		case roles[2]: return Admin;
		default: return;
	}
}

export default user;