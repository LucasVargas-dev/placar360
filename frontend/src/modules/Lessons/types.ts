export type UserRole = 'teacher' | 'student';

export interface Lesson {
	id: string;
	startTime: string;
	endTime: string;
	date: string;
	clubId: string;
	clubName: string;
	courtId: string;
	courtName: string;
	sportType: string;
	teacherId: string;
	teacherName: string;
	students: LessonStudent[];
	maxStudents: number;
	price: number;
	specialty: string;
}

export interface LessonStudent {
	id: string;
	name: string;
	email: string;
	registeredAt: string;
	status: 'confirmed' | 'pending' | 'cancelled';
}

export interface Teacher {
	id: string;
	name: string;
	email: string;
	specialty: string;
	bio?: string;
	rating?: number;
	locations: TeacherLocation[];
}

export interface TeacherLocation {
	clubId: string;
	clubName: string;
	courtId: string;
	courtName: string;
	sportType: string;
	price: number;
	availableDays: string[];
	availableTimeSlots: {
		startTime: string;
		endTime: string;
	}[];
}

export interface LessonScheduleDay {
	date: string;
	lessons: Lesson[];
}

export interface LessonFilters {
	startDate: string;
	endDate: string;
	clubId?: string;
	courtName?: string;
	sportType?: string;
}

